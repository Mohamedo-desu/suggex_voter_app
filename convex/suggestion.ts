import { v } from 'convex/values';
import { nanoid } from 'nanoid';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './user';

export const fetchUserGroups = query({
  handler: async ctx => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);
    const userId = currentUser._id;

    // Fetch groups the user owns.
    const ownedGroups = await db
      .query('groups')
      .withIndex('by_user', q => q.eq('userId', userId))
      .order('desc')
      .collect();
    const ownedWithRole = ownedGroups.map(group => ({
      ...group,
      role: 'owner' as const,
    }));

    // Fetch invitation records for this user.
    const invitations = await db
      .query('groupInvitations')
      .withIndex('by_user', q => q.eq('userId', userId))
      .order('desc')
      .collect();
    const invitedGroupIds = invitations.map(inv => inv.groupId);

    // Fetch groups that the user is invited to.
    const invitedGroups = await Promise.all(
      invitedGroupIds.map(async groupId => await db.get(groupId))
    );
    const validInvitedGroups = invitedGroups
      .filter((group): group is Doc<'groups'> => group !== null)
      .map(group => ({
        ...group,
        role: 'invited' as const,
      }));

    // Merge and deduplicate.
    const allGroupsWithRole = [...ownedWithRole, ...validInvitedGroups];
    const uniqueGroups = Array.from(
      new Map(allGroupsWithRole.map(group => [group._id, group])).values()
    );

    // For each group, fetch approved and rejected suggestions.
    const groupsWithSuggestions = await Promise.all(
      uniqueGroups.map(async group => {
        const approvedCount = (
          await db
            .query('suggestions')
            .withIndex('by_both', q => q.eq('groupId', group._id).eq('status', 'approved'))
            .collect()
        ).length;
        const rejectedCount = (
          await db
            .query('suggestions')
            .withIndex('by_both', q => q.eq('groupId', group._id).eq('status', 'rejected'))
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
    status: v.union(v.literal('open'), v.literal('closed')),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);
    const userId = currentUser._id;

    const generateRandomString = nanoid(5);
    const generateRandomString2 = nanoid(5);

    const invitationCode = `grp${generateRandomString}${userId}${generateRandomString2}G0g`;

    const groupId = await db.insert('groups', {
      userId,
      invitationCode,
      groupName: args.groupName,
      suggestionsCount: 0,
      status: args.status,
    });

    return groupId;
  },
});

export const addSuggestion = mutation({
  args: {
    groupId: v.id('groups'),
    suggestionTitle: v.string(),
    suggestionDescription: v.string(),
    endGoal: v.number(),
    status: v.union(
      v.literal('open'),
      v.literal('rejected'),
      v.literal('approved'),
      v.literal('closed')
    ),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    // Check that the group exists.
    const group = await db.get(args.groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    const generateRandomString = nanoid(5);
    const generateRandomString2 = nanoid(5);

    const invitationCode = `sug${generateRandomString}${args.groupId}${generateRandomString2}S0s`;

    await db.insert('suggestions', {
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
  },
});

export const fetchGroupDetails = query({
  args: {
    groupId: v.id('groups'),
  },
  handler: async (ctx, { groupId }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const group = await db.get(groupId);
    if (!group) return null;

    const approvedCount = (
      await db
        .query('suggestions')
        .withIndex('by_both', q => q.eq('groupId', groupId).eq('status', 'approved'))
        .collect()
    ).length;
    const rejectedCount = (
      await db
        .query('suggestions')
        .withIndex('by_both', q => q.eq('groupId', groupId).eq('status', 'rejected'))
        .collect()
    ).length;

    return {
      ...group,
      approvedCount,
      rejectedCount,
      role: group.userId === currentUser._id ? 'owner' : 'invited',
    };
  },
});

export const fetchSuggestions = query({
  args: {
    groupId: v.id('groups'),
  },
  handler: async (ctx, { groupId }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const group = await db.get(groupId);
    if (!group) return [];

    let suggestions;

    if (group.userId === currentUser._id) {
      suggestions = await db
        .query('suggestions')
        .withIndex('by_group', q => q.eq('groupId', groupId))
        .order('desc')
        .collect();
      return suggestions;
    }

    const existingRequest = await db
      .query('groupInvitations')
      .withIndex('by_both', q => q.eq('groupId', group._id).eq('userId', currentUser._id))
      .first();

    if (!existingRequest) throw new Error('You have no group invitations');

    if (existingRequest.allSuggestions) {
      suggestions = await db
        .query('suggestions')
        .withIndex('by_group', q => q.eq('groupId', groupId))
        .order('desc')
        .collect();
    } else {
      const suggestionInvitations = await db
        .query('suggestionInvitations')
        .withIndex('by_user', q => q.eq('userId', currentUser._id))
        .order('desc')
        .collect();
      const invitedSuggestionIds = suggestionInvitations.map(inv => inv.suggestionId);
      suggestions = await Promise.all(
        invitedSuggestionIds.map(async suggestionId => {
          const suggestion = await db.get(suggestionId);
          if (suggestion && suggestion.groupId === groupId) {
            return suggestion;
          }
          return null;
        })
      );
    }
    return suggestions.filter(suggestion => suggestion !== null);
  },
});

export const deleteGroup = mutation({
  args: {
    groupId: v.id('groups'),
  },
  handler: async (ctx, { groupId }) => {
    const { db, storage } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    // Fetch the group to ensure it exists.
    const group = await db.get(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    // Only the group owner is allowed to delete the group.
    if (group.userId !== currentUser._id) {
      throw new Error('Only the group owner can delete the group.');
    }

    // Delete all suggestions in the group and their related records.
    const suggestions = await db
      .query('suggestions')
      .withIndex('by_group', q => q.eq('groupId', groupId))
      .collect();

    for (const suggestion of suggestions) {
      const suggestionId = suggestion._id;

      // Delete comments for this suggestion.
      const comments = await db
        .query('comments')
        .withIndex('by_suggestion', q => q.eq('suggestionId', suggestionId))
        .collect();
      for (const comment of comments) {
        await db.delete(comment._id);
      }

      // Delete suggestion invitations.
      const suggestionInvitations = await db
        .query('suggestionInvitations')
        .withIndex('by_suggestion', q => q.eq('suggestionId', suggestionId))
        .collect();
      for (const invitation of suggestionInvitations) {
        await db.delete(invitation._id);
      }

      // Delete likes.
      const likes = await db
        .query('likes')
        .withIndex('by_post', q => q.eq('suggestionId', suggestionId))
        .collect();
      for (const like of likes) {
        await db.delete(like._id);
      }

      // Delete the suggestion itself.
      await db.delete(suggestionId);
    }

    // Delete group invitations.
    const groupInvitations = await db
      .query('groupInvitations')
      .withIndex('by_group', q => q.eq('groupId', groupId))
      .collect();
    for (const invitation of groupInvitations) {
      await db.delete(invitation._id);
    }

    // delete the storage file
    if (group.storageId) {
      await storage.delete(group.storageId);
    }

    // Delete the group.
    await db.delete(groupId);

    return true;
  },
});

export const deleteSuggestion = mutation({
  args: {
    suggestionId: v.id('suggestions'),
  },
  handler: async (ctx, { suggestionId }) => {
    const { db, storage } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const suggestion = await db.get(suggestionId);
    if (!suggestion) {
      throw new Error('Suggestion not found');
    }

    // Only the suggestion owner can delete the suggestion.
    if (suggestion.userId !== currentUser._id) {
      throw new Error('Only the suggestion owner can delete this suggestion.');
    }

    // Delete all comments related to this suggestion.
    const comments = await db
      .query('comments')
      .withIndex('by_suggestion', q => q.eq('suggestionId', suggestionId))
      .collect();
    for (const comment of comments) {
      await db.delete(comment._id);
    }

    // Delete any suggestion invitations.
    const suggestionInvitations = await db
      .query('suggestionInvitations')
      .withIndex('by_suggestion', q => q.eq('suggestionId', suggestionId))
      .collect();
    for (const invitation of suggestionInvitations) {
      await db.delete(invitation._id);
    }

    // Delete likes associated with this suggestion.
    const likes = await db
      .query('likes')
      .withIndex('by_post', q => q.eq('suggestionId', suggestionId))
      .collect();
    for (const like of likes) {
      await db.delete(like._id);
    }

    // delete the storage file
    if (suggestion.storageId) {
      await storage.delete(suggestion.storageId);
    }

    // Finally, delete the suggestion itself.
    await db.delete(suggestionId);

    const group = await db.get(suggestion.groupId);
    if (!group) throw new Error('Group not found');

    await db.patch(suggestion.groupId, {
      suggestionsCount: Math.max(0, (group.suggestionsCount || 1) - 1),
    });

    return true;
  },
});

export const fetchSuggestionDetails = query({
  args: {
    suggestionId: v.id('suggestions'),
  },
  handler: async (ctx, { suggestionId }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const suggestion = await db.get(suggestionId);
    if (!suggestion) {
      return null;
    }

    const liked = await db
      .query('likes')
      .withIndex('by_user_and_suggestion', q =>
        q.eq('userId', currentUser._id).eq('suggestionId', suggestion._id)
      )
      .first();

    return { ...suggestion, hasLiked: !!liked };
  },
});

export const searchGroupsByInvitationCode = mutation({
  args: { invitationCode: v.string() },
  handler: async (ctx, { invitationCode }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const group = await db
      .query('groups')
      .withIndex('search_invitation', q => q.eq('invitationCode', invitationCode))
      .first();

    if (!group) return null; // Return null instead of throwing an error

    const isOwner = group.userId === currentUser._id;

    if (group.status === 'closed' && !isOwner) {
      throw new Error('Group was closed');
    }

    let foundGroup;

    if (isOwner) {
      const approvedCount = (
        await db
          .query('suggestions')
          .withIndex('by_both', q => q.eq('groupId', group._id).eq('status', 'approved'))
          .collect()
      ).length;
      const rejectedCount = (
        await db
          .query('suggestions')
          .withIndex('by_both', q => q.eq('groupId', group._id).eq('status', 'rejected'))
          .collect()
      ).length;

      foundGroup = {
        ...group,
        approvedCount,
        rejectedCount,
        role: 'owner',
      };

      return foundGroup;
    }

    foundGroup = {
      ...group,
      suggestionsCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      role: 'invited',
      status: 'private',
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
      .query('suggestions')
      .withIndex('search_invitation', q => q.eq('invitationCode', invitationCode))
      .first();

    const isOwner = suggestion?.userId === currentUser._id;

    let foundSuggestion;

    if (isOwner) {
      return suggestion;
    }

    foundSuggestion = {
      ...suggestion,
      commentsCount: 0,
      endGoal: 0,
      likesCount: 0,
      status: 'private',
    };

    return foundSuggestion;
  },
});

export const requestToJoinGroup = mutation({
  args: {
    invitationCode: v.string(),
  },
  handler: async (ctx, { invitationCode }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    // Look up the group by invitationCode
    const group = await db
      .query('groups')
      .withIndex('search_invitation', q => q.eq('invitationCode', invitationCode))
      .first();
    if (!group) return null; // Return null if group not found

    if (group.userId === currentUser._id) {
      throw new Error('Owner cannot request to join their own group');
    }

    const existingRequest = await db
      .query('groupInvitations')
      .withIndex('by_both', q => q.eq('groupId', group._id).eq('userId', currentUser._id))
      .first();

    if (existingRequest) {
      await db.patch(existingRequest._id, {
        allSuggestions: true,
      });
      return;
    }

    const invitationId = await db.insert('groupInvitations', {
      groupId: group._id,
      userId: currentUser._id,
      allSuggestions: true,
    });
    return invitationId;
  },
});

export const requestToJoinSuggestion = mutation({
  args: {
    invitationCode: v.string(),
  },
  handler: async (ctx, { invitationCode }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    // Look up the suggestion by invitationCode
    const suggestion = await db
      .query('suggestions')
      .withIndex('search_invitation', q => q.eq('invitationCode', invitationCode))
      .first();
    if (!suggestion) throw new Error('Suggestion not found');

    const group = await db.get(suggestion.groupId);
    if (!group) throw new Error('Group not found');

    // Prevent owner from joining their own suggestion.
    if (suggestion.userId === currentUser._id) {
      throw new Error('Owner cannot request to join their own suggestion');
    }

    // Check if a join request already exists
    const existingRequest = await db
      .query('suggestionInvitations')
      .withIndex('by_both', q => q.eq('suggestionId', suggestion._id).eq('userId', currentUser._id))
      .first();
    if (existingRequest) throw new Error('Request has already been sent');

    // Insert a new group invitation record First.
    await db.insert('groupInvitations', {
      groupId: group._id,
      userId: currentUser._id,
      allSuggestions: false,
    });
    // Insert a new suggestion invitation record.

    const invitationId = await db.insert('suggestionInvitations', {
      suggestionId: suggestion._id,
      userId: currentUser._id,
    });
    return invitationId;
  },
});

export const toggleLike = mutation({
  args: {
    suggestionId: v.id('suggestions'),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    const currentUser = await getAuthenticatedUser(ctx);

    const existing = await db
      .query('likes')
      .withIndex('by_user_and_suggestion', q =>
        q.eq('userId', currentUser._id).eq('suggestionId', args.suggestionId)
      )
      .first();

    const suggestion = await db.get(args.suggestionId);

    if (!suggestion) {
      throw new Error('suggestion not found');
    }

    if (existing) {
      // REMOVE LIKE
      await db.delete(existing._id);
      await db.patch(args.suggestionId, {
        likesCount: Math.max(0, (suggestion.likesCount || 1) - 1),
      });
      return false; //unliked
    } else {
      // ADD LIKE
      await db.insert('likes', {
        suggestionId: args.suggestionId,
        userId: currentUser._id,
      });
      await db.patch(args.suggestionId, {
        likesCount: suggestion.likesCount + 1,
      });

      return true; //liked
    }
  },
});

export const editGroup = mutation({
  args: {
    groupId: v.id('groups'),
    groupName: v.optional(v.string()),
    invitationCode: v.optional(v.string()),
    status: v.optional(v.union(v.literal('open'), v.literal('closed'))),
    storageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, { groupId, groupName, status, invitationCode, storageId }) => {
    const { db, storage } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const group = await db.get(groupId);
    if (!group) throw new Error('Group not found');
    if (group.userId !== currentUser._id) throw new Error('Unauthorized');

    // Prepare an update object.
    const update: Record<string, any> = {};

    if (groupName !== undefined) update.groupName = groupName;
    if (status !== undefined) update.status = status;
    if (invitationCode !== undefined) update.invitationCode = invitationCode;

    // Update imageUrl if a storageId is provided.
    if (storageId) {
      const imageUrl = await storage.getUrl(storageId);
      if (!imageUrl) throw new Error('Image not found');
      update.imageUrl = imageUrl;
      update.storageId = storageId;
    }

    await db.patch(groupId, update);
  },
});

export const editSuggestion = mutation({
  args: {
    suggestionId: v.id('suggestions'),
    invitationCode: v.string(),
    status: v.union(
      v.literal('open'),
      v.literal('rejected'),
      v.literal('approved'),
      v.literal('closed')
    ),
    endGoal: v.number(),
    storageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, { suggestionId, invitationCode, status, endGoal, storageId }) => {
    const { db, storage } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const suggestion = await db.get(suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');
    if (suggestion.userId !== currentUser._id) throw new Error('Unauthorized');

    // Build update object.
    const update: Record<string, any> = {
      invitationCode,
      status,
      endGoal,
    };

    // Update imageUrl if a storageId is provided.
    if (storageId) {
      const imageUrl = await storage.getUrl(storageId);
      if (!imageUrl) throw new Error('Image not found');
      update.imageUrl = imageUrl;
      update.storageId = storageId;
    }

    await db.patch(suggestionId, update);
  },
});
