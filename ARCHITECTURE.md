# Appellate Tea Architecture

## 1. Product brief
### Project name
Appellate Tea

### Overview
Appellate Tea is a premium digital publication focused on legal storytelling rather than traditional legal reporting. It transforms Supreme Court cases, parliamentary bills, constitutional debates, African development, and social philosophy into engaging long-form narratives. The experience should feel like an elegant old-school newspaper while remaining modern, fast, and accessible.

### Audience
- Law students
- Advocates
- Judges
- Journalists
- Legal researchers
- Academics
- Public policy professionals

### Brand personality
- Authoritative
- Thoughtful
- Calm
- Intellectual
- Minimalist
- Timeless

### Design language
Inspired by financial journalism and long-form magazine publishing, with the restraint of the Financial Times, the clarity of the New York Times, the intellectual tone of The Economist, and the narrative depth of Aeon and The Atlantic.

Avoid:
- Flashy gradients
- Oversized cards
- Social-media styling
- Startup aesthetics

### Visual direction
- Color palette: crimson, white, and black
- Typography: elegant serif for headings and a readable serif/sans pairing for body copy
- Whitespace: generous and deliberate
- Editorial principle: content is the hero

### Core product scope
#### Public experience
- Homepage
- Article pages
- Categories
- Search
- Tags
- Author pages
- About and contact pages
- Reader submission form
- Newsletter signup
- Related articles
- Reading time
- Social sharing
- SEO-optimized pages

#### Admin experience
- Firebase authentication
- Dashboard
- Article management
- Category and tag management
- Author management
- Featured article management
- Homepage section management
- Reader submissions management
- Rich text editor with Markdown support
- Drafts and publishing workflow
- Optional comments and moderation
- Analytics for popular posts, recent posts, and search trends

## 2. Architecture principles
- Ship public content quickly with a polished editorial experience.
- Keep content editing and publishing workflow simple for editors and admins.
- Prefer server-rendered pages for public content and client components only where interactivity is required.
- Keep the data model explicit and typed with shared TypeScript interfaces.
- Enforce least-privilege access in Firebase.
- Optimize for Lighthouse, accessibility, and SEO performance from the start.

## 3. Recommended folder structure
```text
app/
  (marketing)/
    about/page.tsx
    contact/page.tsx
  (public)/
    page.tsx
    articles/[slug]/page.tsx
    cases/[slug]/page.tsx
    authors/[slug]/page.tsx
    search/page.tsx
  (auth)/
    login/page.tsx
    register/page.tsx
    forgot-password/page.tsx
  (admin)/
    admin/page.tsx
    admin/articles/page.tsx
    admin/articles/new/page.tsx
    admin/articles/[id]/page.tsx
    admin/cases/page.tsx
    admin/authors/page.tsx
    admin/settings/page.tsx
  api/
    cloudinary/sign-upload/route.ts
    auth/verify-email/route.ts
components/
  ui/
    Button.tsx
    Input.tsx
    Card.tsx
    Modal.tsx
    Badge.tsx
    Skeleton.tsx
  layout/
    Header.tsx
    Footer.tsx
    Shell.tsx
    Sidebar.tsx
  home/
    Hero.tsx
    EditorialGrid.tsx
    EditorialNavbar.tsx
    EditorsPick.tsx
    Categories.tsx
  forms/
    ArticleForm.tsx
    CaseForm.tsx
    AuthorForm.tsx
    SettingsForm.tsx
  features/
    ArticleCard.tsx
    CaseCard.tsx
    AuthorProfile.tsx
    ContentComposer.tsx
    RichTextEditor.tsx
  providers/
    AuthProvider.tsx
    QueryProvider.tsx
  seo/
    Metadata.tsx
    JsonLd.tsx
lib/
  firebase/
    config.ts
    auth.ts
    firestore.ts
  services/
    articles.ts
    cases.ts
    authors.ts
    uploads.ts
  validators/
    article.ts
    case.ts
    author.ts
    user.ts
  hooks/
    useAuth.ts
    useDebounce.ts
    usePaginatedContent.ts
  types/
    article.ts
    case.ts
    author.ts
    user.ts
  constants/
    routes.ts
    content.ts
  utils/
    cn.ts
    dates.ts
    format.ts
    slugify.ts
public/
  media/
  logo/
  favico/
```

## 4. Firestore schema
The app should use Firestore as the source of truth for editorial content, user identity, and publishing state.

### 4.1 Collections

#### users/{uid}
```json
{
  "id": "firebaseUid",
  "email": "editor@example.com",
  "displayName": "Amina Yusuf",
  "slug": "amina-yusuf",
  "photoURL": "https://...",
  "role": "admin | editor | viewer",
  "isEmailVerified": true,
  "bio": "Senior editor",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "lastLoginAt": "timestamp"
}
```

#### authors/{authorId}
```json
{
  "id": "authorId",
  "name": "Amina Yusuf",
  "slug": "amina-yusuf",
  "title": "Senior Editor",
  "bio": "Legal analyst focused on constitutional law.",
  "organization": "Appellate Tea",
  "photoURL": "https://...",
  "socialLinks": {
    "x": "https://x.com/",
    "linkedin": "https://linkedin.com/"
  },
  "featured": true,
  "status": "active",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### articles/{articleId}
```json
{
  "id": "articleId",
  "slug": "how-a-quiet-supreme-court-decision",
  "title": "How a Quiet Supreme Court Decision Could Redefine Administrative Justice",
  "excerpt": "Short summary for cards and listings.",
  "body": "Rich text or markdown body",
  "bodyJson": {},
  "heroImage": {
    "publicId": "appellate-tea/hero",
    "url": "https://res.cloudinary.com/..."
  },
  "categoryIds": ["categoryId"],
  "tagIds": ["tagId"],
  "authorIds": ["authorId"],
  "status": "draft | pending_review | published | archived",
  "featured": false,
  "readingTime": 8,
  "seo": {
    "title": "SEO title",
    "description": "SEO description"
  },
  "publishedAt": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### categories/{categoryId}
```json
{
  "id": "categoryId",
  "name": "Constitutional Law",
  "slug": "constitutional-law",
  "description": "Essays on constitutional theory and doctrine.",
  "featured": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### tags/{tagId}
```json
{
  "id": "tagId",
  "name": "Administrative Justice",
  "slug": "administrative-justice",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### submissions/{submissionId}
```json
{
  "id": "submissionId",
  "name": "Reader name",
  "email": "reader@example.com",
  "topic": "Submission topic",
  "message": "Submission content",
  "status": "new | reviewed | approved | rejected",
  "createdAt": "timestamp"
}
```

#### settings/{site}
```json
{
  "siteName": "Appellate Tea",
  "tagline": "Legal analysis for a changing public life",
  "homepageHero": {},
  "maintenanceMode": false,
  "updatedAt": "timestamp"
}
```

## 6. Firebase security rules
The following rules are the baseline for the app.

### firestore.rules
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function role(r) {
      return signedIn() && exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == r;
    }
    function isAdmin() { return role('admin'); }
    function isEditor() { return role('admin') || role('editor'); }
    function isPublished(resourceData) { return resourceData.status == 'published'; }

    match /users/{userId} {
      allow read: if signedIn() && (request.auth.uid == userId || isAdmin());
      allow create: if signedIn() && request.auth.uid == userId;
      allow update: if signedIn() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }

    match /authors/{authorId} {
      allow read: if true;
      allow create, update: if isEditor();
      allow delete: if isAdmin();
    }

    match /articles/{articleId} {
      allow read: if resource.data.status == 'published' || isEditor() || isAdmin();
      allow create: if isEditor();
      allow update: if isEditor();
      allow delete: if isAdmin();
    }

    match /cases/{caseId} {
      allow read: if resource.data.status == 'published' || isEditor() || isAdmin();
      allow create: if isEditor();
      allow update: if isEditor();
      allow delete: if isAdmin();
    }

    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /auditLogs/{logId} {
      allow read: if isAdmin();
      allow create: if isAdmin();
      allow update, delete: if isAdmin();
    }
  }
}
```

## 7. Cloudinary integration
Cloudinary is the asset pipeline for editorial imagery, feature cards, and downloadable documents.

### 6.1 Strategy
- Use signed uploads from a server route to keep API credentials private.
- Store the returned public ID and secure URL in Firestore.
- Use Cloudinary transformations for responsive images and automatic format/quality optimization.
- Keep original assets in Cloudinary while Firestore stores lightweight metadata.

### 6.2 Recommended folder layout
```text
appellate-tea/
  articles/{articleId}/hero
  authors/{authorId}/avatar
  cases/{caseId}/document
  misc/brand
```

### 6.3 Delivery pattern
```ts
https://res.cloudinary.com/<cloudName>/image/upload/w_1600,c_fill,q_auto,f_auto/<publicId>
```

## 8. Authentication flow
1. User lands on a public page or admin route.
2. Firebase Authentication handles login with email/password or Google.
3. On successful sign-in, the app reads or creates a matching user document in Firestore.
4. The app resolves the user role from the Firestore profile.
5. Protected routes check that role before rendering admin or editor-only interfaces.
6. Email verification is required before publishing actions.

### Auth state model
- `AuthProvider` owns the current Firebase user and profile.
- `useAuth()` exposes the current user and role to the app.
- Middleware or route guards enforce admin/editor access.

## 9. Routing strategy
The app uses the Next.js App Router with route groups for clear separation.

### Public routes
- `/` homepage
- `/articles/[slug]`
- `/cases/[slug]`
- `/authors/[slug]`
- `/search`

### Auth routes
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`

### Admin routes
- `/admin`
- `/admin/articles`
- `/admin/articles/new`
- `/admin/cases`
- `/admin/authors`
- `/admin/settings`

### Route guard rules
- Public routes render for everyone.
- Auth routes redirect signed-in users away.
- Admin routes require `admin` role.
- Editor routes require `editor` or `admin`.

## 10. Component hierarchy
```text
app/layout.tsx
  Providers
    AuthProvider
    QueryProvider
  Shell
    Header
    MainContent
      HomePage
        Hero
        EditorialGrid
        EditorsPick
        Categories
      ArticlePage
        ArticleHero
        ArticleBody
        RelatedArticles
      AdminLayout
        Sidebar
        DashboardPage
          StatsCards
          ContentTable
          AuditFeed
```

### Component responsibility split
- UI primitives: layout, spacing, buttons, inputs, modal, cards.
- Layout components: shell, header, footer, sidebar.
- Feature components: article cards, article composer, case viewer.
- Page-level components: home, article detail, admin dashboards.

## 11. Reusable UI system
The UI layer should stay consistent across editorial and admin surfaces.

### Core primitives
- `Button` with variants: primary, secondary, ghost, destructive.
- `Input` with label, hint, validation state.
- `Card` for content summaries.
- `Modal` for confirmations and forms.
- `Badge` for status labels.
- `Skeleton` for loading states.

### UI conventions
- Use Tailwind utility classes and shared tokens.
- Prefer composition over prop-heavy components.
- Keep business logic out of UI components.
- Support dark and light variants where relevant.

## 12. Design system
The editorial design language should feel sober, modern, and print-inspired.

### Visual language
- Typography: serif for headlines, sans for body copy.
- Color palette: warm off-white background, deep charcoal text, and a consistent red accent for links and interactive states.
- Spacing: a 4px base scale for calm rhythm and editorial clarity.
- Motion: subtle enter/exit transitions for cards and panels.
- Layout: generous whitespace, strong content hierarchy, and large editorial headlines.

### Tokens
```css
--background: #ffffff;
--foreground: #111827;
--muted: #f3f4f6;
--accent: #8B1E1E;
--border: #e5e7eb;
--radius: 0.5rem;
```

## 13. Admin architecture
The admin system should support editorial operations without exposing every database detail to staff.

### Roles
- `viewer`: read-only access.
- `editor`: create and update published content.
- `admin`: full access, including user management and settings.

### Admin workflow
1. Editor drafts content in the admin UI.
2. Content is saved as `draft` or `pending_review`.
3. An admin approves the content and publishes it.
4. Publishing writes the document to Firestore and updates the public-facing pages.
5. Every publish/edit action is logged in `auditLogs`.

### Admin surfaces
- Dashboard: quick stats and recent activity.
- Articles manager: list, filter, edit, publish, archive.
- Cases manager: manage legal case materials and documents.
- Authors manager: maintain contributor profiles.
- Settings: homepage configuration and site metadata.

## 14. Recommended implementation phases
1. Core routing and auth guard setup.
2. Firestore collections and rules.
3. Replace placeholder content with Firestore-backed article pages and article listing data.
4. Cloudinary upload pipeline for editorial images.
5. Admin dashboard and publishing workflow.
6. SEO metadata and performance polish.


## Next Steps

1. Review this architecture
2. Approve or request changes
3. Begin Milestone 1 implementation
4. Review each milestone before proceeding