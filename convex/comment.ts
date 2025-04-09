import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./user";

export const fetchComments = query({
  args: {
    suggestionId: v.id("suggestions"),
  },
  handler: async (ctx, { suggestionId }) => {
    const { db } = ctx;
    const comments = await db
      .query("comments")
      .withIndex("by_suggestion", (q) => q.eq("suggestionId", suggestionId))
      .order("desc")
      .collect();
    return comments;
  },
});

export const addComment = mutation({
  args: {
    suggestionId: v.id("suggestions"),
    content: v.string(),
  },
  handler: async (ctx, { suggestionId, content }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    // Ensure the suggestion exists.
    const suggestion = await db.get(suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    // Insert the new comment.
    const commentId = await db.insert("comments", {
      userId: currentUser._id,
      suggestionId,
      content,
    });

    await db.patch(suggestionId, {
      commentsCount: suggestion.commentsCount + 1,
    });

    return commentId;
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, { commentId }) => {
    const { db } = ctx;
    const currentUser = await getAuthenticatedUser(ctx);

    const comment = await db.get(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Only the comment owner can delete it.
    if (comment.userId !== currentUser._id) {
      throw new Error("Unauthorized: only comment owner can delete comment");
    }

    const suggestion = await db.get(comment.suggestionId);

    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    await db.delete(commentId);

    await db.patch(comment.suggestionId, {
      commentsCount: Math.max(0, (suggestion.commentsCount || 1) - 1),
    });

    return true;
  },
});
