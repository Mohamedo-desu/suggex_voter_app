import { v } from "convex/values";
import { nanoid } from "nanoid";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./user";

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

    const generateRandomString = nanoid(5);
    const generateRandomString2 = nanoid(5);

    const invitationCode = `grp${generateRandomString}${userId}${generateRandomString2}G0g`;

    const groupId = await db.insert("groups", {
      userId,
      invitationCode,
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

    const generateRandomString = nanoid(5);
    const generateRandomString2 = nanoid(5);

    const invitationCode = `sug${generateRandomString}${args.groupId}${generateRandomString2}S0s`;

    await db.insert("suggestions", {
      groupId: args.groupId,
      invitationCode,
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
    await db.patch(currentUser._id, {
      suggestionsCount: currentUser.suggestionsCount + 1,
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

export const updateSuggestion = mutation({
  args: {
    suggestionId: v.id("suggestions"),
    suggestionTitle: v.optional(v.string()),
    suggestionDescription: v.optional(v.string()),
    endGoal: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { suggestionId, suggestionTitle, suggestionDescription, endGoal, status }
  ) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const suggestion = await db.get(suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    // Only the suggestion owner can update the suggestion.
    if (suggestion.userId !== currentUser._id) {
      throw new Error("Only the suggestion owner can update this suggestion.");
    }

    const updateFields: Record<string, unknown> = {};
    if (suggestionTitle !== undefined) updateFields.title = suggestionTitle;
    if (suggestionDescription !== undefined)
      updateFields.description = suggestionDescription;
    if (endGoal !== undefined) updateFields.endGoal = endGoal;
    if (status !== undefined) updateFields.status = status;

    await db.patch(suggestionId, updateFields);
    return true;
  },
});

export const deleteSuggestion = mutation({
  args: {
    suggestionId: v.id("suggestions"),
  },
  handler: async (ctx, { suggestionId }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const suggestion = await db.get(suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    // Only the suggestion owner can delete the suggestion.
    if (suggestion.userId !== currentUser._id) {
      throw new Error("Only the suggestion owner can delete this suggestion.");
    }

    // Cascade deletion for related records.

    // Delete all comments related to this suggestion.
    const comments = await db
      .query("comments")
      .withIndex("by_suggestion", (q) => q.eq("suggestionId", suggestionId))
      .collect();
    for (const comment of comments) {
      await db.delete(comment._id);
    }

    // Delete any suggestion invitations.
    const suggestionInvitations = await db
      .query("suggestionInvitations")
      .withIndex("by_suggestion", (q) => q.eq("suggestionId", suggestionId))
      .collect();
    for (const invitation of suggestionInvitations) {
      await db.delete(invitation._id);
    }

    // Delete bookmarks associated with this suggestion.
    const bookmarks = await db
      .query("bookmarks")
      .withIndex("by_suggestion", (q) => q.eq("suggestionId", suggestionId))
      .collect();
    for (const bookmark of bookmarks) {
      await db.delete(bookmark._id);
    }

    // Delete likes associated with this suggestion.
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

    // Finally, delete the suggestion itself.
    await db.delete(suggestionId);

    // decrement user suggestion and group suggestion
    await db.patch(currentUser._id, {
      suggestionsCount: Math.max(0, (currentUser.suggestionsCount || 1) - 1),
    });
    const group = await db.get(suggestion.groupId);
    if (!group) throw new Error("Group not found");

    await db.patch(suggestion.groupId, {
      suggestionsCount: Math.max(0, (group.suggestionsCount || 1) - 1),
    });

    return true;
  },
});

export const fetchSuggestionDetails = query({
  args: {
    suggestionId: v.id("suggestions"),
  },
  handler: async (ctx, { suggestionId }) => {
    const { db } = ctx;
    const suggestion = await db.get(suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }
    return suggestion;
  },
});

export const searchGroupsByInvitationCode = mutation({
  args: { invitationCode: v.string() },
  handler: async (ctx, { invitationCode }) => {
    const { db } = ctx;

    const currentUser = await getAuthenticatedUser(ctx);

    const group = await db
      .query("groups")
      .withIndex("search_invitation", (q) =>
        q.eq("invitationCode", invitationCode)
      )
      .first();

    if (!group) throw new Error("Group not found");

    const isOwner = group.userId === currentUser._id;

    if (group.status === "closed" && !isOwner) {
      throw new Error("Group was closed");
    }

    let foundGroup;

    if (isOwner) {
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

      foundGroup = {
        ...group,
        approvedCount,
        rejectedCount,
        role: "owner",
      };

      return foundGroup;
    }

    foundGroup = {
      ...group,
      groupName: "Private",
      suggestionsCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      role: "invited",
      status: "private",
    };

    return foundGroup;
  },
});

export const searchSuggestionsByInvitationCode = mutation({
  args: { invitationCode: v.string() },
  handler: async (ctx, { invitationCode }) => {
    const { db } = ctx;

    const currentUser = await getAuthenticatedUser(ctx);

    const suggestion = await db
      .query("suggestions")
      .withIndex("search_invitation", (q) =>
        q.eq("invitationCode", invitationCode)
      )
      .first();

    const isOwner = suggestion?.userId === currentUser._id;

    let foundSuggestion;

    if (isOwner) {
      return suggestion;
    }

    foundSuggestion = {
      ...suggestion,
      title: "Private",
      description: "private",
      commentsCount: 0,
      endGoal: 0,
      likesCount: 0,
      status: "private",
    };

    return foundSuggestion;
  },
});
