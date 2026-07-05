# Appellate Tea Product Reference

## Firestore collections

- users
- authors
- articles
- categories
- tags
- articleTags
- submissions
- newsletter
- settings
- homepage
- featuredArticles

## Article document shape

Each article should include:

- title
- slug
- excerpt
- content
- coverImage
- authorId
- categoryId
- tags
- published
- featured
- readingTime
- publishedAt
- updatedAt
- seoTitle
- seoDescription
- canonical

## Cloudinary structure

- appellate-tea/
  - covers/
  - authors/
  - inline/
  - social/

## Product roadmap and feature notes

- Rich text editor with TipTap or Lexical, plus Markdown import/export.
- Full-text search using Firestore-compatible indexing or an external search service if the content grows.
- Article version history for edit tracking and restore.
- Editorial workflow with Draft → In Review → Published states.
- Reading progress indicator, estimated reading time, footnotes, and citations for long-form legal analysis.
- Author profiles with bios and archives.
- RSS feed for subscribers.
- Dark mode while preserving the newspaper aesthetic.
- Progressive Web App support for offline reading.
- Comprehensive analytics for readership trends and popular topics.
- Role-based access control with Admin, Editor, and Author roles enforced by Firebase Authentication and Firestore Security Rules.
- Automated testing for unit, integration, and end-to-end coverage before deployment.
- CI/CD with GitHub Actions and automatic deployment to Vercel.
