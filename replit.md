# CampusLearn™

## Overview

CampusLearn™ is a peer-to-peer educational platform designed for Belgium Campus students. The platform enables tutors to create learning topics, students to subscribe to these topics, engage in forum discussions, and communicate directly through messaging. The application follows a mobile-first design philosophy with Material Design 3 principles, prioritizing information clarity and accessibility for students managing academic workloads.

## Implementation Status

**Current Status**: Core platform fully functional with end-to-end integration of authentication, profile management, and topic subscriptions.

### Completed Features
- ✅ User authentication with Belgium Campus email validation (belgiumcampus.ac.za)
- ✅ Session-based authentication with secure password hashing (bcrypt) and explicit session persistence
- ✅ Database schema with all core tables (users, topics, forum posts, messages, files)
- ✅ Complete REST API for topics, forum, messaging, and file uploads
- ✅ Frontend authentication flow with protected routes
- ✅ Profile management: view and edit user profile (fullName, bio) with React Query integration
- ✅ Topics system: browse topics, create topics (tutors), subscribe/unsubscribe with persistence
- ✅ Notification service infrastructure (requires SendGrid/Twilio API keys)

### Recent Fixes (October 13, 2025)
- Fixed session persistence in registration and login routes (explicit req.session.save() calls)
- Connected Profile page to backend API with proper edit mode state management
- Connected Topics page to backend API with subscription mutation support
- Fixed TopicCard component to handle undefined tutorName/creatorName gracefully
- **Forum Integration**: Connected Forum page to backend API with full CRUD functionality
  - POST /api/forum/posts for creating forum posts with title, content, and anonymous flag
  - GET /api/forum/posts for fetching all forum posts
  - Proper error handling and loading states
  - Query invalidation after mutations for real-time updates
- **Messages Integration**: Connected Messages page to backend API
  - GET /api/conversations for fetching user conversations
  - GET /api/conversations/:id/messages for fetching conversation messages
  - POST /api/conversations/:id/messages for sending new messages
  - Conditional rendering based on selected conversation
  - Proper handling of empty states (no conversations, no messages)
- **Session Cookie Fix for External Browser Access**: Resolved critical issues preventing app from working in external browsers
  - Configured session cookies to use `secure: true` when on Replit (HTTPS environment)
  - Set `sameSite: 'lax'` for proper same-site navigation
  - Enabled Express proxy trust when REPLIT_DOMAINS environment variable is present
  - Fixed Profile data not displaying (was showing "User" instead of actual name)
  - Fixed Topics not loading (was showing empty state)
  - Fixed authentication persistence across page navigation
- **End-to-End Testing**: Verified Forum post creation, Messages display, Topics listing, and Profile data display
- **Data Integrity**: Confirmed Drizzle ORM correctly maps database snake_case columns (full_name) to camelCase TypeScript properties (fullName)

### Email Validation Rules
- All registration and login attempts must use email addresses ending with "belgiumcampus.ac.za"
- Supports both student (@student.belgiumcampus.ac.za) and staff (@staff.belgiumcampus.ac.za) emails
- Case-insensitive validation enforced on both frontend and backend
- Student ID automatically extracted from email prefix

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- React Context API for authentication state
- Local component state for UI interactions

**UI Component System**:
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library with custom theming (New York style variant)
- Tailwind CSS for styling with custom design system tokens
- Class Variance Authority (CVA) for component variant management

**Design System**:
- Custom Material Design 3-inspired color palette with light/dark mode support
- Typography using Inter (body) and Poppins (headings) from Google Fonts
- Systematic elevation and hover states using CSS custom properties
- HSL-based color system with alpha channel support for flexible theming

### Backend Architecture

**Runtime**: Node.js with Express.js server

**Language**: TypeScript with ES modules

**Authentication & Sessions**:
- Express sessions with PostgreSQL session store (connect-pg-simple)
- bcryptjs for password hashing
- Custom middleware for authentication (`requireAuth`) and role-based authorization (`requireTutor`)
- Session-based authentication with HttpOnly cookies

**File Handling**:
- Multer middleware for multipart/form-data file uploads
- File storage in local `uploads` directory with configurable size limits (50MB)
- Unique filename generation using timestamp and random suffixes

**API Structure**:
- RESTful API endpoints prefixed with `/api`
- Request/response logging middleware for development
- Centralized error handling middleware
- Credential-based requests for session management

### Data Storage

**Database**: PostgreSQL (via Neon serverless)

**ORM**: Drizzle ORM with Neon serverless driver

**Schema Design**:
- **users**: Core user accounts with email authentication, full name, bio, and tutor role flag
- **topics**: Learning topics created by tutors with title, description, module, and creator relationship
- **topicSubscriptions**: Many-to-many relationship between users and topics
- **forumPosts**: Discussion posts with title, content, author, anonymous posting support, and tagging
- **forumReplies**: Threaded replies to forum posts with anonymous support
- **forumUpvotes**: User voting system for forum posts
- **conversations**: Direct messaging conversations between students and tutors, optionally linked to topics
- **messages**: Individual messages within conversations with sender tracking
- **files**: File metadata for attachments with conversation/message relationships

**Database Features**:
- UUID primary keys using `gen_random_uuid()`
- Timestamp tracking with `defaultNow()`
- Foreign key relationships for data integrity
- Array columns for tags (PostgreSQL-specific)
- Migration management through Drizzle Kit

### External Dependencies

**Database Service**: Neon (serverless PostgreSQL)
- WebSocket support for real-time database connections
- Connection pooling via @neondatabase/serverless

**Notification Services** (configured but with fallback):
- SendGrid API for email notifications
- Twilio API for SMS notifications
- Mock service fallback when credentials not configured

**Development Tools**:
- Replit-specific plugins for development banner, error overlay, and cartographer
- Vite HMR (Hot Module Replacement) for development experience

**UI Libraries**:
- @radix-ui/* components for accessible primitives (accordion, dialog, dropdown, popover, etc.)
- cmdk for command palette functionality
- date-fns for date formatting and manipulation
- lucide-react for icon system

**Form Management**:
- react-hook-form for form state management
- @hookform/resolvers for form validation
- zod for schema validation (via drizzle-zod)

**Build & Development**:
- esbuild for server-side bundling
- tsx for TypeScript execution in development
- PostCSS with Tailwind CSS and Autoprefixer