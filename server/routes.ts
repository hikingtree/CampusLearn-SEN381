import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";
import { requireAuth, requireTutor, type AuthRequest } from "./auth";
import "./types";
import bcrypt from "bcryptjs";
import { insertUserSchema, insertTopicSchema, insertForumPostSchema, insertMessageSchema, insertTopicSubscriptionSchema, insertForumUpvoteSchema, insertForumReplySchema, insertConversationSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { mkdirSync } from "fs";

const PgSession = ConnectPgSimple(session);

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Trust proxy when on Replit (behind reverse proxy)
  if (process.env.REPLIT_DOMAINS) {
    app.set('trust proxy', 1);
  }

  // Session configuration
  // On Replit, external URLs use HTTPS, so we need secure cookies even in development
  const isReplit = !!process.env.REPLIT_DOMAINS;
  const isProduction = process.env.NODE_ENV === "production";
  
  app.use(
    session({
      store: new PgSession({
        pool,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "campuslearn-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: isReplit || isProduction, // Secure cookies on Replit (HTTPS) and production
        sameSite: 'lax', // Allow cookies on same-site navigation
      },
    })
  );

  // Serve uploaded files
  app.use("/api/files", requireAuth, (req, res, next) => {
    const express = require("express");
    express.static(uploadDir)(req, res, next);
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Set session and save explicitly
      req.session.userId = user.id;
      
      // Explicitly save session before responding
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to create session" });
        }
        
        res.json({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          isTutor: user.isTutor,
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Validate Belgium Campus email domain
      if (!email.toLowerCase().endsWith("belgiumcampus.ac.za")) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;

      // Explicitly save session before responding
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to create session" });
        }
        
        res.json({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          isTutor: user.isTutor,
        });
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    res.json(authReq.user);
  });

  // Profile Routes
  app.get("/api/profile", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    const user = await storage.getUser(authReq.user!.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.patch("/api/profile", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const updates = req.body;
      delete updates.email; // Email cannot be changed
      delete updates.password; // Password update handled separately
      delete updates.isTutor; // Tutor status cannot be changed

      const updatedUser = await storage.updateUser(authReq.user!.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Update failed" });
    }
  });

  // Topic Routes
  app.post("/api/topics", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const topicData = insertTopicSchema.parse({
        ...req.body,
        creatorId: authReq.user!.id,
      });

      const topic = await storage.createTopic(topicData);
      res.json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create topic" });
    }
  });

  app.get("/api/topics", requireAuth, async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      
      // Enrich topics with subscriber count and subscription status
      const enrichedTopics = await Promise.all(
        topics.map(async (topic) => {
          const subscribers = await storage.getTopicSubscribers(topic.id);
          const isSubscribed = await storage.isUserSubscribed(
            topic.id,
            (req as AuthRequest).user!.id
          );
          
          // Get creator info
          const creator = await storage.getUser(topic.creatorId);
          
          return {
            ...topic,
            subscriberCount: subscribers.length,
            isSubscribed,
            creatorName: creator?.fullName || "Unknown",
          };
        })
      );

      res.json(enrichedTopics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  app.get("/api/topics/:id", requireAuth, async (req, res) => {
    try {
      const topic = await storage.getTopic(req.params.id);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      const subscribers = await storage.getTopicSubscribers(topic.id);
      const isSubscribed = await storage.isUserSubscribed(
        topic.id,
        (req as AuthRequest).user!.id
      );
      const creator = await storage.getUser(topic.creatorId);

      res.json({
        ...topic,
        subscriberCount: subscribers.length,
        isSubscribed,
        creatorName: creator?.fullName || "Unknown",
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

  app.post("/api/topics/:id/subscribe", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const topicId = req.params.id;
      
      const topic = await storage.getTopic(topicId);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      const isSubscribed = await storage.isUserSubscribed(topicId, authReq.user!.id);
      
      if (isSubscribed) {
        await storage.unsubscribeTopic(topicId, authReq.user!.id);
        res.json({ subscribed: false });
      } else {
        await storage.subscribeTopic({
          topicId,
          userId: authReq.user!.id,
        });
        res.json({ subscribed: true });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle subscription" });
    }
  });

  // Forum Routes
  app.post("/api/forum/posts", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const postData = insertForumPostSchema.parse({
        ...req.body,
        authorId: authReq.user!.id,
      });

      const post = await storage.createForumPost(postData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get("/api/forum/posts", requireAuth, async (req, res) => {
    try {
      const posts = await storage.getAllForumPosts();
      
      // Enrich posts with author info, upvote count, and reply count
      const enrichedPosts = await Promise.all(
        posts.map(async (post) => {
          const author = await storage.getUser(post.authorId);
          const upvotes = await storage.getPostUpvotes(post.id);
          const replies = await storage.getForumReplies(post.id);
          const hasUpvoted = await storage.hasUserUpvoted(
            post.id,
            (req as AuthRequest).user!.id
          );

          return {
            ...post,
            authorName: post.isAnonymous ? "Anonymous" : (author?.fullName || "Unknown"),
            upvoteCount: upvotes.length,
            replyCount: replies.length,
            hasUpvoted,
          };
        })
      );

      res.json(enrichedPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/forum/posts/:id/upvote", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const postId = req.params.id;
      
      const post = await storage.getForumPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const hasUpvoted = await storage.hasUserUpvoted(postId, authReq.user!.id);
      
      if (hasUpvoted) {
        await storage.removeUpvote(postId, authReq.user!.id);
        res.json({ upvoted: false });
      } else {
        await storage.upvotePost({
          postId,
          userId: authReq.user!.id,
        });
        res.json({ upvoted: true });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle upvote" });
    }
  });

  app.post("/api/forum/posts/:id/replies", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const replyData = insertForumReplySchema.parse({
        ...req.body,
        postId: req.params.id,
        authorId: authReq.user!.id,
      });

      const reply = await storage.createForumReply(replyData);
      res.json(reply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create reply" });
    }
  });

  app.get("/api/forum/posts/:id/replies", requireAuth, async (req, res) => {
    try {
      const replies = await storage.getForumReplies(req.params.id);
      
      const enrichedReplies = await Promise.all(
        replies.map(async (reply) => {
          const author = await storage.getUser(reply.authorId);
          return {
            ...reply,
            authorName: reply.isAnonymous ? "Anonymous" : (author?.fullName || "Unknown"),
          };
        })
      );

      res.json(enrichedReplies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch replies" });
    }
  });

  // Messaging Routes
  app.get("/api/conversations", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const conversations = await storage.getUserConversations(authReq.user!.id);
      
      const enrichedConversations = await Promise.all(
        conversations.map(async (conv) => {
          const student = await storage.getUser(conv.studentId);
          const tutor = await storage.getUser(conv.tutorId);
          const messages = await storage.getConversationMessages(conv.id);
          const topic = conv.topicId ? await storage.getTopic(conv.topicId) : null;

          const otherUser = authReq.user!.id === conv.studentId ? tutor : student;
          const lastMessage = messages[messages.length - 1];

          return {
            ...conv,
            otherUserName: otherUser?.fullName || "Unknown",
            topicTitle: topic?.title,
            lastMessage: lastMessage?.content,
            lastMessageTime: lastMessage?.createdAt,
            messageCount: messages.length,
          };
        })
      );

      res.json(enrichedConversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const conversationData = insertConversationSchema.parse(req.body);
      
      // Validate that one party is the current user
      if (conversationData.studentId !== authReq.user!.id && 
          conversationData.tutorId !== authReq.user!.id) {
        return res.status(403).json({ message: "Cannot create conversation for other users" });
      }

      const conversation = await storage.createConversation(conversationData);
      res.json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/:id/messages", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Verify user is part of this conversation
      if (conversation.studentId !== authReq.user!.id && 
          conversation.tutorId !== authReq.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const messages = await storage.getConversationMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/conversations/:id/messages", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Verify user is part of this conversation
      if (conversation.studentId !== authReq.user!.id && 
          conversation.tutorId !== authReq.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const messageData = insertMessageSchema.parse({
        ...req.body,
        conversationId: req.params.id,
        senderId: authReq.user!.id,
      });

      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // File Upload Routes
  app.post("/api/upload", requireAuth, upload.single("file"), async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = await storage.createFile({
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        fileUrl: `/api/files/${req.file.filename}`,
        uploaderId: authReq.user!.id,
        topicId: req.body.topicId || null,
        conversationId: req.body.conversationId || null,
      });

      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.get("/api/topics/:id/files", requireAuth, async (req, res) => {
    try {
      const files = await storage.getTopicFiles(req.params.id);
      
      const enrichedFiles = await Promise.all(
        files.map(async (file) => {
          const uploader = await storage.getUser(file.uploaderId);
          return {
            ...file,
            uploaderName: uploader?.fullName || "Unknown",
          };
        })
      );

      res.json(enrichedFiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Get all files with uploader information
  app.get("/api/files", requireAuth, async (req, res) => {
    try {
      const files = await storage.getAllFiles();
      
      const enrichedFiles = await Promise.all(
        files.map(async (file) => {
          const uploader = await storage.getUser(file.uploaderId);
          return {
            ...file,
            uploaderName: uploader?.fullName || "Unknown",
          };
        })
      );

      res.json(enrichedFiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Get user's uploaded files
  app.get("/api/files/user", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const allFiles = await storage.getAllFiles();
      const userFiles = allFiles.filter(f => f.uploaderId === authReq.user!.id);
      
      const enrichedFiles = await Promise.all(
        userFiles.map(async (file) => {
          let context = "";
          if (file.topicId) {
            const topic = await storage.getTopic(file.topicId);
            context = `Topic: ${topic?.title || "Unknown"}`;
          } else if (file.conversationId) {
            context = "Conversation";
          }
          return {
            ...file,
            context,
          };
        })
      );

      res.json(enrichedFiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user files" });
    }
  });

  // Get all tutors
  app.get("/api/tutors", requireAuth, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const tutors = allUsers.filter(u => u.isTutor);
      const tutorsWithoutPassword = tutors.map(({ password, ...rest }) => rest);
      res.json(tutorsWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutors" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
