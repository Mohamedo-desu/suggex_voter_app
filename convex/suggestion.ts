import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./user";

type GroupWithRole = Doc<"groups"> & {
  role: "owner" | "invited";
};

export const fetchUserGroups = query({
  handler: async (ctx) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);
    const userId = currentUser._id;

    // Fetch groups the user owns.
    const ownedGroups = await db
      .query("groups")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    const ownedWithRole = ownedGroups.map((group) => ({
      ...group,
      role: "owner" as const,
    }));

    // Fetch invitation records for this user.
    const invitations = await db
      .query("groupInvitations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    const invitedGroupIds = invitations.map((inv) => inv.groupId);

    // Fetch groups that the user is invited to.
    const invitedGroups = await Promise.all(
      invitedGroupIds.map(async (groupId) => await db.get(groupId))
    );
    const validInvitedGroups = invitedGroups
      .filter((group): group is Doc<"groups"> => group !== null)
      .map((group) => ({
        ...group,
        role: "invited" as const,
      }));

    // Merge and deduplicate.
    const allGroupsWithRole = [...ownedWithRole, ...validInvitedGroups];
    const uniqueGroups = Array.from(
      new Map(allGroupsWithRole.map((group) => [group._id, group])).values()
    );

    // For each group, fetch approved and rejected suggestions.
    const groupsWithSuggestions = await Promise.all(
      uniqueGroups.map(async (group) => {
        const approvedCount = (
          await db
            .query("suggestions")
            .withIndex("by_both", (q) =>
              q.eq("groupId", group._id).eq("status", "approved")
            )
            .collect()
        ).length;
        const rejectedCount = (
          await db
            .query("suggestions")
            .withIndex("by_both", (q) =>
              q.eq("groupId", group._id).eq("status", "rejected")
            )
            .collect()
        ).length;
        return { ...group, approvedCount, rejectedCount };
      })
    );

    return groupsWithSuggestions;
  },
});

export const addGroup = mutation({
  args: {
    groupName: v.string(),
    status: v.union(v.literal("open"), v.literal("closed")),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);
    const userId = currentUser._id;

    const groupId = await db.insert("groups", {
      userId,
      groupName: args.groupName,
      suggestionsCount: 0,
      status: args.status,
    });

    return groupId;
  },
});

export const inviteUserToGroup = mutation({
  args: {
    groupId: v.id("groups"),
    invitedUserId: v.id("users"),
  },
  handler: async (ctx, { groupId, invitedUserId }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    // Check that the group exists.
    const group = await db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Optional: Enforce that only the group owner can invite.
    if (group.userId !== currentUser._id) {
      throw new Error("Only the group owner can invite users.");
    }

    // Insert a new invitation record into the groupInvitations table.
    const invitationId = await db.insert("groupInvitations", {
      groupId,
      userId: invitedUserId,
      invitedBy: currentUser._id,
      invitedAt: new Date().toISOString(),
    });

    return invitationId;
  },
});

export const addSuggestion = mutation({
  args: {
    groupId: v.id("groups"),
    suggestionTitle: v.string(),
    suggestionDescription: v.string(),
    endGoal: v.number(),
    status: v.union(
      v.literal("open"),
      v.literal("rejected"),
      v.literal("approved"),
      v.literal("closed")
    ),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    // Check that the group exists.
    const group = await db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    await db.insert("suggestions", {
      groupId: args.groupId,
      description: args.suggestionDescription,
      title: args.suggestionTitle,
      commentsCount: 0,
      likesCount: 0,
      userId: currentUser._id,
      endGoal: args.endGoal,
      status: args.status,
    });

    await db.patch(args.groupId, {
      suggestionsCount: group.suggestionsCount + 1,
    });
  },
});

export const fetchGroupDetails = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, { groupId }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const group = await db.get(groupId);
    if (!group) throw new Error("Group not found");

    const approvedCount = (
      await db
        .query("suggestions")
        .withIndex("by_both", (q) =>
          q.eq("groupId", groupId).eq("status", "approved")
        )
        .collect()
    ).length;
    const rejectedCount = (
      await db
        .query("suggestions")
        .withIndex("by_both", (q) =>
          q.eq("groupId", groupId).eq("status", "rejected")
        )
        .collect()
    ).length;

    return {
      ...group,
      approvedCount,
      rejectedCount,
      role: group.userId === currentUser._id ? "owner" : "invited",
    };
  },
});

export const fetchSuggestions = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, { groupId }) => {
    const { db } = ctx;
    const group = await db.get(groupId);
    if (!group) throw new Error("Group not found");

    const suggestions = await db
      .query("suggestions")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();
    return suggestions;
  },
});

// ---------------------------------------------------------------------
// Updated Delete Mutation: Cascade Deletion of Related Records
// ---------------------------------------------------------------------
export const deleteGroup = mutation({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, { groupId }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    // Fetch the group to ensure it exists.
    const group = await db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Only the group owner is allowed to delete the group.
    if (group.userId !== currentUser._id) {
      throw new Error("Only the group owner can delete the group.");
    }

    // Delete all suggestions in the group and their related records.
    const suggestions = await db
      .query("suggestions")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();

    for (const suggestion of suggestions) {
      const suggestionId = suggestion._id;

      // Delete comments for this suggestion.
      const comments = await db
        .query("comments")
        .withIndex("by_suggestion", (q) => q.eq("suggestionId", suggestionId))
        .collect();
      for (const comment of comments) {
        await db.delete(comment._id);
      }

      // Delete suggestion invitations.
      const suggestionInvitations = await db
        .query("suggestionInvitations")
        .withIndex("by_suggestion", (q) => q.eq("suggestionId", suggestionId))
        .collect();
      for (const invitation of suggestionInvitations) {
        await db.delete(invitation._id);
      }

      // Delete bookmarks.
      const bookmarks = await db
        .query("bookmarks")
        .withIndex("by_suggestion", (q) => q.eq("suggestionId", suggestionId))
        .collect();
      for (const bookmark of bookmarks) {
        await db.delete(bookmark._id);
      }

      // Delete likes.
      const likes = await db
        .query("likes")
        .withIndex("by_post", (q) => q.eq("suggestionId", suggestionId))
        .collect();
      for (const like of likes) {
        await db.delete(like._id);
      }

      // Delete notifications related to this suggestion.
      const notifications = await db
        .query("notifications")
        .withIndex("by_suggestion", (q) => q.eq("suggestionId", suggestionId))
        .collect();
      for (const notification of notifications) {
        await db.delete(notification._id);
      }

      // Delete the suggestion itself.
      await db.delete(suggestionId);
    }

    // Delete group invitations.
    const groupInvitations = await db
      .query("groupInvitations")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();
    for (const invitation of groupInvitations) {
      await db.delete(invitation._id);
    }

    // Delete the group.
    await db.delete(groupId);

    return true;
  },
});
