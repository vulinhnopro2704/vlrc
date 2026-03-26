# E-Learning Platform Routing Architecture

## Overview
This document outlines the structured routing architecture for the VLRC e-learning platform, designed for scalability, usability, and seamless user experience.

## Route Structure

### 1. Public Routes

#### `/` - Landing Page
- **Component**: `LandingPage`
- **Layout**: AppLayout (Header + Footer)
- **Purpose**: Main entry point, platform overview
- **Navigation**: Links to sign up, login, and dashboard preview

#### `/login` - Login Page
- **Component**: `LoginPage`
- **Layout**: AppLayout
- **Purpose**: User authentication
- **Post-login redirect**: `/dashboard`

#### `/register` - Registration Page
- **Component**: `RegisterPage`
- **Layout**: AppLayout
- **Purpose**: New user account creation
- **Post-register redirect**: `/dashboard`

### 2. Dashboard Routes

#### `/dashboard` - Main Learning Dashboard
- **Component**: `DashboardPage`
- **Layout**: AppLayout (Header + Footer)
- **Features**:
  - Course selection and progress tracking
  - Gamification elements (stats, leaderboard)
  - Quick lesson access
  - Performance metrics
- **Navigation Links**: Browse Courses, Course Details
- **Access**: Dashboard-specific components (Stats, Leaderboard, etc.)

### 3. Course Management Routes

#### `/courses` - Courses List Page
- **Component**: `CoursesPage`
- **Layout**: AppLayout + AppSidebar
- **Features**:
  - Display all available courses
  - Course progress indicators
  - Grid layout with course cards
  - GSAP animations for cards
- **Sidebar**: Navigation to Dashboard, other courses
- **Interactions**: Click course card to view details

#### `/courses/:courseId` - Course Detail Page
- **Component**: `CourseDetailPage`
- **Layout**: AppLayout + AppSidebar
- **Features**:
  - Course overview and description
  - List of all lessons in course
  - Lesson completion status
  - Overall course progress
- **Sidebar**: Back button, navigation to Dashboard
- **Interactions**: Click lesson to start studying

### 4. Learning Routes

#### `/lessons/:lessonId` - Lesson Study Page
- **Component**: `LessonPage`
- **Layout**: AppLayout + AppSidebar (Lesson Mode)
- **Features**:
  - Interactive FlipCard component for vocabulary
  - Word-by-word progression
  - Pronunciation and meaning display
  - CEFR level indicator
  - Progress bar showing completion
  - NO dashboard components (stats, leaderboard)
- **Sidebar**: 
  - Lesson context display
  - Back to course button
  - Collapse functionality
- **Navigation**: 
  - Previous/Next word buttons
  - Manual navigation between words

#### `/lessons/:lessonId/exercises` - Exercises Page (Future)
- **Component**: `ExercisePage`
- **Layout**: AppLayout + AppSidebar
- **Purpose**: Interactive exercises without dashboard components
- **Focus**: Learning-specific content only

## Component Architecture

### Shared Components

#### `AppLayout`
- Wraps all pages with Header and Footer
- Provides consistent navigation and branding
- Located: `src/components/shared/AppLayout.tsx`

#### `AppSidebar`
- Reusable navigation sidebar with collapse functionality
- Props:
  - `links`: Navigation link configuration
  - `isLessonMode`: Boolean to enable lesson-specific UI
  - `courseName`: Display current course
  - `lessonName`: Display current lesson
  - `onBackToCourse`: Callback for back navigation
- Features:
  - Smooth collapse animation
  - Responsive design
  - Glassmorphism styling
- Located: `src/components/shared/AppSidebar.tsx`

#### `Header`
- Global header with theme toggle and language selection
- Navigation to main pages
- Located: `src/components/shared/Header.tsx`

#### `Footer`
- Global footer with links and information
- Located: `src/components/shared/Footer.tsx`

### Page-Specific Components

#### Dashboard Page
- `Sidebar.tsx` - Course list sidebar
- `CourseGrid.tsx` - Lesson grid display
- `FlashcardViewer.tsx` - Flashcard component using FlipCard
- `StatsCard.tsx` - Individual stat card
- `Leaderboard.tsx` - Weekly rankings

#### Lesson Page
- Uses shared `FlipCard` component
- Minimal dashboard elements
- Focus on learning experience

## Navigation Flow

```
Landing Page (/)
    ↓
Login/Register
    ↓
Dashboard (/dashboard)
    ├→ Browse Courses (/courses)
    │   ├→ Course Detail (/courses/:courseId)
    │   │   └→ Lesson Study (/lessons/:lessonId)
    │   │       └→ (Exercises) (/lessons/:lessonId/exercises)
    │   └→ Direct from card → Lesson Study
    │
    └→ Quick Access to Lessons
```

## Sidebar Behavior

- **Dashboard Page**: Uses custom `Sidebar` component showing courses
- **Courses Page**: Uses `AppSidebar` with navigation links
- **Course Detail**: Uses `AppSidebar` with back button
- **Lesson Page**: Uses `AppSidebar` in lesson mode with:
  - Course and lesson context display
  - Back to course navigation
  - Collapse toggle

## Design Patterns

### Shared Layout Pattern
All pages inherit Header and Footer through `AppLayout` wrapper:
```tsx
<AppLayout>
  <PageContent />
</AppLayout>
```

### Navigation Pattern
All navigation uses TanStack Router:
```tsx
const navigate = useNavigate();
navigate({ to: '/path' });
```

### Animation Pattern
GSAP animations for page transitions and element reveals using `useGSAP` hook with `ScrollTrigger` plugin.

## Styling Standards

- **Glassmorphism**: `glass-card` class for card backgrounds
- **Color Scheme**: Teal primary, orange accent
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Dark Mode**: Full support via CSS variables

## Future Enhancements

1. **Lesson Exercises** (`/lessons/:lessonId/exercises`)
   - Separate page for practice exercises
   - No dashboard components
   - Interactive quizzes and tasks

2. **Progress Tracking**
   - Per-lesson progress persistence
   - Spaced repetition algorithms
   - Word mastery levels

3. **Advanced Navigation**
   - Search functionality
   - Filter by difficulty level
   - Recommended lessons based on progress

## Implementation Notes

- Routes are auto-generated by TanStack Router file-based routing
- Each page file in `src/routes/` creates a corresponding route
- Dynamic routes use `$paramName` syntax
- All pages utilize GSAP for smooth animations
- i18n support via react-i18next for multi-language
