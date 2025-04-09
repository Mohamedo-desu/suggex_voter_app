import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table: stores user details and basic statistics.
  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Groups table: stores group info.
  groups: defineTable({
    userId: v.id("users"), // creator or owner
    invitationCode: v.string(),
    groupName: v.string(),
    suggestionsCount: v.number(),
    status: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_groupName", ["groupName"])
    .index("search_invitation", ["invitationCode"]),

  // Group Invitations table: establishes a many-to-many relation between groups and users.
  groupInvitations: defineTable({
    groupId: v.id("groups"),
    userId: v.id("users"),
    allSuggestions: v.boolean(),
  })
    .index("by_group", ["groupId"])
    .index("by_user", ["userId"])
    .index("by_both", ["groupId", "userId"]),

  // Suggestions table: stores suggestion details and related metadata.
  suggestions: defineTable({
    userId: v.id("users"),
    invitationCode: v.string(),
    groupId: v.id("groups"),
    title: v.string(),
    description: v.string(),
    commentsCount: v.number(),
    likesCount: v.number(),
    endGoal: v.optional(v.number()),
    status: v.optional(v.string()),
  })
    .index("by_group", ["groupId"])
    .index("status", ["status"])
    .index("by_both", ["groupId", "status"])
    .index("search_invitation", ["invitationCode"])
    .searchIndex("search_title", {
      searchField: "title",
    })
    .searchIndex("search_description", {
      searchField: "description",
    }),

  // Suggestion Invitations table: manages which users are invited to interact with a suggestion.
  suggestionInvitations: defineTable({
    suggestionId: v.id("suggestions"),
    userId: v.id("users"),
  })
    .index("by_suggestion", ["suggestionId"])
    .index("by_user", ["userId"])
    .index("by_both", ["suggestionId", "userId"]),

  // Comments table: stores comments on suggestions.
  comments: defineTable({
    userId: v.id("users"),
    suggestionId: v.id("suggestions"),
    content: v.string(),
  })
    .index("by_suggestion", ["suggestionId"])
    .index("by_user", ["userId"]),
  likes: defineTable({
    userId: v.id("users"),
    suggestionId: v.id("suggestions"),
  })
    .index("by_post", ["suggestionId"])
    .index("by_user_and_suggestion", ["userId", "suggestionId"]),
});
