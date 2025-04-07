import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    image: v.string(),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    //   CHECK IF USER ALREADY EXISTS
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    // CREATE USER
    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      image: args.image,
      email: args.email,
      clerkId: args.clerkId,
      commentsCount: 0,
      suggestionsCount: 0,
    });
  },
});

export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("unauthorized");

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!currentUser) throw new Error("User not found");

  return currentUser;
};

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    return user;
  },
});
