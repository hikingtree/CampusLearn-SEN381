# CampusLearn™ Design Guidelines

## Design Approach: System-Based (Material Design 3 + Custom Educational UX)

**Rationale:** CampusLearn™ is a utility-focused educational platform where clarity, accessibility, and efficient information architecture are paramount. Material Design 3 provides the robust component library needed for complex features (forums, messaging, file management) while maintaining consistency across the student learning experience.

---

## Core Design Principles

1. **Information Clarity First:** Content hierarchy ensures students quickly find tutors, topics, and resources
2. **Trust & Safety:** Clear visual indicators for verified tutors, moderated content, and secure messaging
3. **Mobile-First Education:** Optimized for studying on-the-go with touch-friendly interfaces
4. **Cognitive Load Reduction:** Clean layouts that don't overwhelm students already managing coursework

---

## Color Palette

### Light Mode
- **Primary (Brand):** 220 70% 50% (Academic Blue - trust and knowledge)
- **Primary Variant:** 220 65% 40% (Darker shade for active states)
- **Secondary:** 140 45% 45% (Success Green - for achievements, verified tutors)
- **Surface:** 0 0% 98% (Clean white background)
- **Surface Variant:** 220 20% 95% (Subtle cards and containers)
- **On Surface:** 220 15% 20% (Primary text)
- **On Surface Variant:** 220 10% 45% (Secondary text)
- **Error:** 0 70% 50% (Alert red for critical actions)
- **Warning:** 35 90% 55% (Notification orange)

### Dark Mode
- **Primary:** 220 75% 65% (Brighter for contrast)
- **Primary Variant:** 220 70% 55%
- **Secondary:** 140 50% 55%
- **Surface:** 220 15% 12% (Deep navy base)
- **Surface Variant:** 220 12% 18% (Elevated cards)
- **On Surface:** 220 10% 95% (High contrast text)
- **On Surface Variant:** 220 8% 70%
- **Error:** 0 65% 60%
- **Warning:** 35 85% 65%

---

## Typography

**Font Families (Google Fonts):**
- **Primary:** 'Inter' - Clean, readable for educational content
- **Display:** 'Poppins' - Friendly, approachable for headings and CTAs

**Type Scale:**
- **Hero/H1:** Poppins 600 (text-4xl md:text-5xl)
- **H2 Sections:** Poppins 600 (text-2xl md:text-3xl)
- **H3 Cards:** Poppins 500 (text-xl md:text-2xl)
- **Body Large:** Inter 400 (text-base md:text-lg)
- **Body:** Inter 400 (text-sm md:text-base)
- **Caption/Meta:** Inter 400 (text-xs md:text-sm) with reduced opacity

---

## Layout System

**Spacing Primitives:** Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: `p-4` to `p-6`
- Section spacing: `py-12` to `py-16`
- Card gaps: `gap-4` to `gap-6`
- Container max-widths: `max-w-7xl` for main content, `max-w-4xl` for reading content

**Grid Patterns:**
- Topic cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Dashboard widgets: `grid-cols-1 lg:grid-cols-2`
- Forum threads: Single column `max-w-4xl` for optimal readability

---

## Component Library

### Navigation
- **Top Bar:** Fixed header with logo, search bar, notification bell, profile avatar (h-16)
- **Side Navigation (Desktop):** Collapsible sidebar with icon + label navigation (w-64 collapsed to w-16)
- **Mobile:** Bottom tab bar with 5 primary actions (Topics, Forum, Messages, Profile)

### Cards & Content
- **Topic Cards:** Elevated cards (shadow-md) with tutor avatar, title, module tag, subscriber count
- **Forum Posts:** Flat cards with upvote counter (left), content (center), timestamp/author (meta)
- **File Resources:** List items with file type icon, name, size, download action
- **Tutor Profiles:** Large avatar, verification badge, expertise tags, rating stars

### Forms & Inputs
- **Text Fields:** Outlined style with floating labels, consistent `rounded-lg` with `ring-2` focus states
- **File Upload:** Drag-drop zone with dashed border, file preview thumbnails
- **Search:** Prominent search bar with autocomplete dropdown, recent searches
- **Filters:** Chip-based multi-select with clear-all option

### Messaging
- **Chat Bubbles:** Sender (right-aligned, primary bg) vs Receiver (left-aligned, surface variant)
- **Attachment Previews:** Inline thumbnails for images, file cards for documents
- **Typing Indicators:** Animated dots in surface variant

### Data Display
- **Tables (Admin):** Striped rows, sortable headers, sticky header on scroll
- **Stats Dashboard:** Large numbers with icons, trend indicators (up/down arrows)
- **Tags/Badges:** Small rounded pills for modules (`badge-sm` with module color coding)

### Modals & Overlays
- **Dialogs:** Centered modal (max-w-lg) with backdrop blur
- **Bottom Sheets (Mobile):** Slide-up panels for actions and filters
- **Toasts:** Top-right notifications with auto-dismiss, action buttons

### Buttons & CTAs
- **Primary Actions:** Solid bg-primary with white text (`rounded-lg px-6 py-3`)
- **Secondary:** Outlined with border-primary (`ring-2 ring-primary`)
- **Tertiary:** Text-only with hover underline
- **Icon Buttons:** Circular (rounded-full) for single actions

---

## Images

**Hero Section (Landing/Homepage):**
- Large hero image (h-[500px]) showing diverse students collaborating with laptops
- Overlay gradient (from transparent to surface/20) for text readability
- Buttons with blurred backgrounds (backdrop-blur-sm bg-surface/10)

**Throughout Platform:**
- **Profile Avatars:** Circular, consistent sizes (w-10 h-10 for lists, w-20 h-20 for profiles)
- **Tutor Verification:** Badge icon overlay on avatar (verified checkmark)
- **Empty States:** Friendly illustrations when no topics/messages exist
- **File Thumbnails:** Document icons or image previews in 16:9 ratio

---

## Animation Strategy

**Minimal, Purposeful Motion:**
- **Page Transitions:** Simple fade (200ms) between routes
- **Hover States:** Subtle scale (scale-105) on cards, no duration class needed
- **Loading:** Skeleton screens (pulse animation) for content loading
- **Notifications:** Slide-in from top-right (300ms ease-out)
- **Avoid:** Complex scroll animations, parallax effects, unnecessary micro-interactions

---

## Accessibility & Responsive Design

- **Focus States:** Clear `ring-2 ring-offset-2` on all interactive elements
- **Color Contrast:** WCAG AA compliant text/background ratios
- **Touch Targets:** Minimum 44x44px for mobile interactions
- **Breakpoints:** Mobile-first with `md:` (768px) and `lg:` (1024px) adjustments
- **Dark Mode:** Consistent implementation across all inputs, modals, and overlays

---

**Design Philosophy:** Clean, accessible, and student-focused. Every design decision prioritizes learning efficiency over visual flair, creating a platform students trust and tutors enjoy using.