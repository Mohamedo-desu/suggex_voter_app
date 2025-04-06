import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Define collections and indexes here
  users: defineTable({
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    image: v.string(),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),
});
