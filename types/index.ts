import { Id } from '@/convex/_generated/dataModel';

/** Users table: stores user details and basic statistics. */
export interface UserProps {
  _id: Id<'users'>;
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
  _id: Id<'groups'>;
  userId: Id<'users'>;
  invitationCode: string;
  groupName: string;
  suggestionsCount: number;
  status: string;
  _creationTime: number | Date;
  role: string;
  approvedCount: number;
  rejectedCount: number;
  storageId: string;
  imageUrl: string;
}

/** Group Invitations table: many-to-many relationship between groups and users. */
export interface GroupInvitationProps {
  _id: Id<'groupInvitations'>;
  groupId: Id<'groups'>;
  userId: Id<'users'>;
  invitedBy: Id<'users'>;
  invitedAt: string;
  _creationTime: number | Date;
}

/** Suggestions table: stores suggestion details and related metadata. */
export interface SuggestionProps {
  _id: Id<'suggestions'>;
  userId: Id<'users'>;
  invitationCode: string;
  groupId: Id<'groups'>;
  title: string;
  description: string;
  commentsCount: number;
  likesCount: number;
  endGoal: number;
  status: string;
  hasLiked?: boolean;
  storageId: string;
  imageUrl: string;
  _creationTime: number | Date;
}

/** Suggestion Invitations table: manages which users are invited to interact with a suggestion. */
export interface SuggestionInvitationProps {
  _id: Id<'suggestionInvitations'>;
  suggestionId: Id<'suggestions'>;
  userId: Id<'users'>;
  invitedBy: Id<'users'>;
  invitedAt: string;
  _creationTime: number | Date;
}

/** Comments table: stores comments on suggestions. */
export interface CommentProps {
  _id: Id<'comments'>;
  userId: Id<'users'>;
  suggestionId: Id<'suggestions'>;
  content: string;
  _creationTime: number | Date;
}

/** Likes table: records likes on suggestions. */
export interface LikeProps {
  _id: Id<'likes'>;
  userId: Id<'users'>;
  suggestionId: Id<'suggestions'>;
  _creationTime: number | Date;
}
