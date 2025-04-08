import { v } from "convex/values";
import { query } from "./_generated/server";

export const fetchComments = query({
  args: {
    suggestionId: v.id("suggestions"),
  },
  handler: async (ctx, { suggestionId }) => {
    const { db } = ctx;
    const comments = await db
      .query("comments")
      .withIndex("by_suggestion", (q) => q.eq("suggestionId", suggestionId))
      .collect();
    return comments;
  },
});
