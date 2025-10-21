import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  users,
  topics,
  topicSubscriptions,
  forumPosts,
  forumReplies,
  forumUpvotes,
  conversations,
  messages,
  files,
  type User,
  type InsertUser,
  type Topic,
  type InsertTopic,
  type TopicSubscription,
  type InsertTopicSubscription,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type ForumUpvote,
  type InsertForumUpvote,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type File,
  type InsertFile,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Topics
  createTopic(topic: InsertTopic): Promise<Topic>;
  getTopic(id: string): Promise<Topic | undefined>;
  getAllTopics(): Promise<Topic[]>;
  getTopicsByCreator(creatorId: string): Promise<Topic[]>;
  
  // Topic Subscriptions
  subscribeTopic(subscription: InsertTopicSubscription): Promise<TopicSubscription>;
  unsubscribeTopic(topicId: string, userId: string): Promise<void>;
  getTopicSubscribers(topicId: string): Promise<TopicSubscription[]>;
  getUserSubscriptions(userId: string): Promise<TopicSubscription[]>;
  isUserSubscribed(topicId: string, userId: string): Promise<boolean>;

  // Forum Posts
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  getAllForumPosts(): Promise<ForumPost[]>;
  
  // Forum Replies
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  getForumReplies(postId: string): Promise<ForumReply[]>;
  
  // Forum Upvotes
  upvotePost(upvote: InsertForumUpvote): Promise<ForumUpvote>;
  removeUpvote(postId: string, userId: string): Promise<void>;
  getPostUpvotes(postId: string): Promise<ForumUpvote[]>;
  hasUserUpvoted(postId: string, userId: string): Promise<boolean>;

  // Conversations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getUserConversations(userId: string): Promise<Conversation[]>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getConversationMessages(conversationId: string): Promise<Message[]>;

  // Files
  createFile(file: InsertFile): Promise<File>;
  getFile(id: string): Promise<File | undefined>;
  getTopicFiles(topicId: string): Promise<File[]>;
  getConversationFiles(conversationId: string): Promise<File[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Topics
  async createTopic(topic: InsertTopic): Promise<Topic> {
    const result = await db.insert(topics).values(topic).returning();
    return result[0];
  }

  async getTopic(id: string): Promise<Topic | undefined> {
    const result = await db.select().from(topics).where(eq(topics.id, id));
    return result[0];
  }

  async getAllTopics(): Promise<Topic[]> {
    return await db.select().from(topics).orderBy(desc(topics.createdAt));
  }

  async getTopicsByCreator(creatorId: string): Promise<Topic[]> {
    return await db
      .select()
      .from(topics)
      .where(eq(topics.creatorId, creatorId))
      .orderBy(desc(topics.createdAt));
  }

  // Topic Subscriptions
  async subscribeTopic(subscription: InsertTopicSubscription): Promise<TopicSubscription> {
    const result = await db.insert(topicSubscriptions).values(subscription).returning();
    return result[0];
  }

  async unsubscribeTopic(topicId: string, userId: string): Promise<void> {
    await db
      .delete(topicSubscriptions)
      .where(
        and(
          eq(topicSubscriptions.topicId, topicId),
          eq(topicSubscriptions.userId, userId)
        )
      );
  }

  async getTopicSubscribers(topicId: string): Promise<TopicSubscription[]> {
    return await db
      .select()
      .from(topicSubscriptions)
      .where(eq(topicSubscriptions.topicId, topicId));
  }

  async getUserSubscriptions(userId: string): Promise<TopicSubscription[]> {
    return await db
      .select()
      .from(topicSubscriptions)
      .where(eq(topicSubscriptions.userId, userId));
  }

  async isUserSubscribed(topicId: string, userId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(topicSubscriptions)
      .where(
        and(
          eq(topicSubscriptions.topicId, topicId),
          eq(topicSubscriptions.userId, userId)
        )
      );
    return result.length > 0;
  }

  // Forum Posts
  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const result = await db.insert(forumPosts).values(post).returning();
    return result[0];
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    const result = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return result[0];
  }

  async getAllForumPosts(): Promise<ForumPost[]> {
    return await db.select().from(forumPosts).orderBy(desc(forumPosts.createdAt));
  }

  // Forum Replies
  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const result = await db.insert(forumReplies).values(reply).returning();
    return result[0];
  }

  async getForumReplies(postId: string): Promise<ForumReply[]> {
    return await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.postId, postId))
      .orderBy(forumReplies.createdAt);
  }

  // Forum Upvotes
  async upvotePost(upvote: InsertForumUpvote): Promise<ForumUpvote> {
    const result = await db.insert(forumUpvotes).values(upvote).returning();
    return result[0];
  }

  async removeUpvote(postId: string, userId: string): Promise<void> {
    await db
      .delete(forumUpvotes)
      .where(
        and(
          eq(forumUpvotes.postId, postId),
          eq(forumUpvotes.userId, userId)
        )
      );
  }

  async getPostUpvotes(postId: string): Promise<ForumUpvote[]> {
    return await db
      .select()
      .from(forumUpvotes)
      .where(eq(forumUpvotes.postId, postId));
  }

  async hasUserUpvoted(postId: string, userId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(forumUpvotes)
      .where(
        and(
          eq(forumUpvotes.postId, postId),
          eq(forumUpvotes.userId, userId)
        )
      );
    return result.length > 0;
  }

  // Conversations
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const result = await db.insert(conversations).values(conversation).returning();
    return result[0];
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations).where(eq(conversations.id, id));
    return result[0];
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(
        sql`${conversations.studentId} = ${userId} OR ${conversations.tutorId} = ${userId}`
      )
      .orderBy(desc(conversations.createdAt));
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  // Files
  async createFile(file: InsertFile): Promise<File> {
    const result = await db.insert(files).values(file).returning();
    return result[0];
  }

  async getFile(id: string): Promise<File | undefined> {
    const result = await db.select().from(files).where(eq(files.id, id));
    return result[0];
  }

  async getTopicFiles(topicId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.topicId, topicId))
      .orderBy(desc(files.createdAt));
  }

  async getConversationFiles(conversationId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.conversationId, conversationId))
      .orderBy(desc(files.createdAt));
  }
}

export const storage = new DatabaseStorage();
