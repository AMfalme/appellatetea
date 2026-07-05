# Appellate Tea - Architecture & Implementation Plan

## Project Overview
A production-ready legal publication platform for publishing, managing, and consuming legal opinions and case law.

## Current State Analysis
- **Framework**: Next.js 16.2.10 (App Router)
- **Status**: Fresh `create-next-app` setup with minimal customization
- **Dependencies**: Only core Next.js, React, Tailwind CSS, TypeScript installed
- **Missing**: Firebase, Cloudinary, Framer Motion, Lucide Icons, Zod, React Hook Form, React Query

---

## Phase 1: Foundation & Infrastructure
**Milestone 1 - Project Setup & Core Architecture**

### 1.1 Dependency Installation
```json
{
  "dependencies": {
    "firebase": "^11.0.0",
    "@cloudinary/url-gen": "^1.20.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "@tanstack/react-query": "^5.17.0",
    "next-auth": "^4.24.0"
  }
}
```

**Rationale**: Install all production dependencies upfront to avoid fragmentation. Firebase v11 modular SDK preferred for tree-shaking.

### 1.2 Folder Structure
```
app/
├── (auth)/                    # Auth routes (login, register, forgot-password)
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (admin)/                   # Admin dashboard routes
│   ├── dashboard/
│   ├── cases/
│   ├── authors/
│   └── settings/
├── (public)/                  # Public-facing routes
│   ├── cases/
│   ├── authors/
│   ├── about/
│   └── search/
├── api/                       # API routes (if needed for webhooks)
├── layout.tsx                 # Root layout
├── page.tsx                   # Homepage
└── globals.css
components/
├── ui/                        # Reusable UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Navigation.tsx
│   └── Footer.tsx
├── layout/                    # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Container.tsx
├── forms/                     # Form components
│   ├── CaseForm.tsx
│   ├── AuthorForm.tsx
│   └── SearchForm.tsx
├── features/                  # Feature-specific components
│   ├── CaseCard.tsx
│   ├── AuthorCard.tsx
│   ├── CaseViewer.tsx
│   └── Citation.tsx
├── providers/                 # Context providers
│   ├── AuthProvider.tsx
│   ├── QueryProvider.tsx
│   └── ThemeProvider.tsx
└── seo/                       # SEO components
    ├── JsonLd.tsx
    └── OpenGraph.tsx
lib/
├── firebase/                  # Firebase configuration
│   ├── config.ts
│   ├── auth.ts
│   ├── firestore.ts
│   └── storage.ts
├── validations/               # Zod schemas
│   ├── case.ts
│   ├── author.ts
│   └── user.ts
├── utils/                     # Utility functions
│   ├── format.ts
│   ├── dates.ts
│   └── slugify.ts
├── hooks/                     # Custom hooks
│   ├── useAuth.ts
│   ├── useCases.ts
│   └── useDebounce.ts
├── types/                     # TypeScript types
│   ├── case.ts
│   ├── author.ts
│   └── user.ts
└── constants/                 # App constants
    ├── routes.ts
    └── config.ts
public/
├── images/                    # Static images
├── fonts/                     # Custom fonts (if needed)
└── icons/                     # Favicon variations
styles/
├── globals.css                # Global styles
└── tailwind.css               # Tailwind imports
```

**Rationale**:
- **Route Groups**: `(auth)`, `(admin)`, `(public)` use Next.js route groups for shared layouts without affecting URL structure
- **Component Organization**: Separation between UI primitives, layout, forms, features, and providers follows Atomic Design principles
- **Feature-Based**: `features/` folder keeps related components together for easier maintenance
- **Pure Functions**: `lib/` contains all business logic, validation, and utilities

### 1.3 Type Definitions (`lib/types/`)

**Core Entities**:
```typescript
// lib/types/case.ts
export interface Case {
  id: string;
  citation: string;           // "123 F.3d 456"
  title: string;
  court: Court;
  dateDecided: Date;
  docketNumber: string;
  judges: Judge[];
  parties: {
    plaintiff: string;
    defendant: string;
  };
  summary: string;
  fullText: string;           // Markdown or HTML
  topics: string[];
  tags: string[];
  status: CaseStatus;
  sourceUrl?: string;         // Official court URL
  pdfUrl?: string;            // Cloudinary URL
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: string;
}

export interface Court {
  id: string;
  name: string;
  abbreviation: string;
  jurisdiction: Jurisdiction;
  level: CourtLevel;
}

export type CaseStatus = 'draft' | 'pending_review' | 'published' | 'archived';
export type CourtLevel = 'trial' | 'appellate' | 'supreme';
export type Jurisdiction = 'federal' | 'state' | 'territorial';
```

**Rationale**: Strong typing ensures data integrity and provides excellent IDE autocomplete. Domain-driven design with clear entity relationships.

### 1.4 Firebase Configuration

**Firestore Collections**:
```
cases/           # Legal case documents
authors/         # Author profiles (users who publish)
users/           # Authentication metadata
settings/        # App configuration
audit-log/       # Change tracking
```

**Storage Structure**:
```
/cases/{caseId}/
  ├── original.pdf
  ├── thumbnail.jpg
  └── metadata.json

/authors/{authorId}/
  └── avatar.jpg
```

**Rationale**: Flat collection structure for Firestore (no subcollections) for query simplicity. Cloudinary for image transformations and CDN delivery.

### 1.5 Environment Variables (.env.local)
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME="Appellate Tea"
```

---

## Phase 2: Authentication & Authorization
**Milestone 2**

### 2.1 Firebase Authentication
- Email/Password
- Google OAuth
- Role-based access (Admin, Editor, Viewer)

### 2.2 Middleware Protection
- Protect `/admin/*` routes
- Redirect authenticated users away from `/login`

### 2.3 Auth Context & Hooks
- `useAuth()` - Current user state
- `useUser()` - User profile from Firestore
- `usePermissions()` - Role checks

---

## Phase 3: Core Features - Case Management
**Milestone 3**

### 3.1 Case CRUD Operations
- Create case with rich text editor (React Hook Form + Zod)
- Upload PDF to Cloudinary
- Auto-generate citation format
- Tagging and topic classification

### 3.2 Case Listings
- Server-side pagination
- Filter by court, date, topic
- Search with debouncing
- Sort by relevance/date

### 3.3 Case Detail View
- Read-optimized layout
- PDF viewer integration
- Citation copy functionality
- Related cases
- Schema.org structured data

---

## Phase 4: Public-Facing Features
**Milestone 4**

### 4.1 Homepage
- Hero section with search
- Featured cases carousel
- Recent publications
- Statistics dashboard

### 4.2 Search
- Full-text search (Firebase Extensions or Algolia)
- Faceted filtering
- Search suggestions
- Search result highlighting

### 4.3 SEO & Performance
- Dynamic metadata per case
- Open Graph tags
- JSON-LD structured data
- Sitemap generation
- Image optimization with Cloudinary

---

## Phase 5: Admin Dashboard
**Milestone 5**

### 5.1 Dashboard Overview
- Statistics cards (total cases, recent activity)
- Charts (publications over time)
- Quick actions

### 5.2 Case Management
- List view with bulk actions
- Status workflow (draft → published)
- Review queue for editors

### 5.3 Author Management
- Author profiles
- Publication history
- Permission management

---

## Phase 6: Polish & Production Readiness
**Milestone 6**

### 6.1 Testing
- Unit tests (Vitest)
- Integration tests (Playwright)
- E2E critical paths

### 6.2 Performance
- Lighthouse CI
- Bundle analysis
- Image lazy loading
- Route prefetching

### 6.3 Accessibility
- WCAG AA compliance
- Keyboard navigation
- Screen reader testing
- Color contrast validation

### 6.4 Deployment
- Vercel configuration
- Environment variable validation
- Database security rules
- Monitoring & logging

---

## Key Architectural Decisions

### 1. **React Server Components (RSC) First**
- Use Server Components for all data-fetching components
- Client Components only when interactivity is required
- Reduces JavaScript bundle size

### 2. **Server Actions for Mutations**
- All writes through Server Actions
- Type-safe with Zod validation
- Automatic revalidation

### 3. **React Query for Client State**
- Cache frequently accessed data
- Optimistic updates
- Background refetching

### 4. **Minimal Context API**
- Only global state (auth, theme) in Context
- Feature state in React Query or URL

### 5. **Zod for Runtime Validation**
- Shared schemas between client/server
- Type inference from schemas
- Form validation with React Hook Form

### 6. **Tailwind CSS for Styling**
- Utility-first for consistency
- Custom design tokens in CSS variables
- Responsive by default

---

## Risk Assessment

### High Risk
1. **Firebase Security Rules**: Misconfigured rules could expose data
   - Mitigation: Comprehensive rule testing, least-privilege principle

2. **PDF Processing**: Legal documents require precise formatting
   - Mitigation: Use proven libraries (pdf.js), extensive testing

### Medium Risk
1. **Scale**: Firestore costs at high read volumes
   - Mitigation: Aggressive caching, CDN for static assets

2. **SEO Accuracy**: Legal citations must be precise
   - Mitigation: Schema.org validation, manual review process

### Low Risk
1. **Image Optimization**: Cloudinary handles this well
2. **Authentication**: Firebase is production-proven

---

## Timeline Estimate

| Milestone | Complexity | Estimated Time |
|-----------|-----------|----------------|
| 1. Foundation | Low | 1-2 days |
| 2. Authentication | Medium | 2-3 days |
| 3. Case Management | High | 4-5 days |
| 4. Public Features | Medium | 3-4 days |
| 5. Admin Dashboard | Medium | 3-4 days |
| 6. Polish & Production | High | 3-4 days |

**Total**: ~2.5 - 3 weeks of focused development

---

## Next Steps

1. Review this architecture
2. Approve or request changes
3. Begin Milestone 1 implementation
4. Review each milestone before proceeding