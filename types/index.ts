import { Id } from "@/convex/_generated/dataModel";

/** Users table: stores user details and basic statistics. */
export interface UserProps {
  _id: Id<"users">;
  username: string;
  fullname: string;
  email: string;
  image: string;
  clerkId: string;
  suggestionsCount: number;
  commentsCount: number;
  _creationTime: number | Date;
}

/** Groups table: stores group info. */
export interface GroupProps {
  _id: Id<"groups">;
  userId: Id<"users">;
  invitationCode: string;
  groupName: string;
  suggestionsCount: number;
  status?: string;
  _creationTime: number | Date;
}

/** Group Invitations table: many-to-many relationship between groups and users. */
export interface GroupInvitationProps {
  _id: Id<"groupInvitations">;
  groupId: Id<"groups">;
  userId: Id<"users">;
  invitedBy: Id<"users">;
  invitedAt: string;
  _creationTime: number | Date;
}

/** Suggestions table: stores suggestion details and related metadata. */
export interface SuggestionProps {
  _id: Id<"suggestions">;
  userId: Id<"users">;
  invitationCode: string;
  groupId: Id<"groups">;
  title: string;
  description: string;
  commentsCount: number;
  likesCount: number;
  endGoal?: number;
  status?: string;
  _creationTime: number | Date;
}

/** Suggestion Invitations table: manages which users are invited to interact with a suggestion. */
export interface SuggestionInvitationProps {
  _id: Id<"suggestionInvitations">;
  suggestionId: Id<"suggestions">;
  userId: Id<"users">;
  invitedBy: Id<"users">;
  invitedAt: string;
  _creationTime: number | Date;
}

/** Comments table: stores comments on suggestions. */
export interface CommentProps {
  _id: Id<"comments">;
  userId: Id<"users">;
  suggestionId: Id<"suggestions">;
  content: string;
  _creationTime: number | Date;
}

/** Likes table: records likes on suggestions. */
export interface LikeProps {
  _id: Id<"likes">;
  userId: Id<"users">;
  suggestionId: Id<"suggestions">;
  _creationTime: number | Date;
}

/** Bookmarks table: records bookmarked suggestions by users. */
export interface BookmarkProps {
  _id: Id<"bookmarks">;
  userId: Id<"users">;
  suggestionId: Id<"suggestions">;
  _creationTime: number | Date;
}

/** Notification type literal union for notifications. */
export type NotificationType = "like" | "comment" | "closed";

/** Notifications table: stores notifications sent between users. */
export interface NotificationProps {
  _id: Id<"notifications">;
  receiverId: Id<"users">;
  senderId: Id<"users">;
  type: NotificationType;
  suggestionId?: Id<"suggestions">;
  commentId?: Id<"comments">;
  _creationTime: number | Date;
}

/** UI-specific props for rendering suggestion list items. */
export interface SuggestionItemProps {
  _id: Id<"suggestions">;
  title: string;
  description: string;
  _creationTime: number | Date;
  likesCount: number;
  commentsCount: number;
  userId: string;
  status: "approved" | "rejected" | "closed" | string;
  endGoal: number;
}

/** UI-specific props for rendering group list items. */
export interface GroupItemProps {
  _id: string;
  userId: string;
  groupName: string;
  role: string;
  status: "open" | "closed" | string;
  _creationTime: number | Date;
  suggestionsCount: number;
  approvedCount: number;
  rejectedCount: number;
}
