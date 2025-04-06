import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
    });
  },
});
