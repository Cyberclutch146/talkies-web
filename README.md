<p align="center">
  <strong style="font-size: 2em;">RCC TALKIES</strong>
</p>

<p align="center">
  <em>The Voice of RCCIIT</em>
</p>

<p align="center">
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#project-structure">Project Structure</a> ·
  <a href="#content-management">Content Management</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## About

**RCC Talkies** is the official journalism club of [RCC Institute of Information Technology (RCCIIT)](https://rcciit.org), Kolkata — established in 1999, affiliated with MAKAUT. This repository contains the club's official website: a bold, editorial-style, content-driven platform built with modern web technologies.

The site covers six core pillars of the club's work:

| Pillar | Focus |
|---|---|
| 📰 Campus News | Exam schedules, placements, faculty announcements |
| 🎤 Interviews & Reports | Student, faculty, and industry interviews |
| 📷 Photography & Media | Fest and seminar coverage |
| 📖 Magazine & Posters | Quarterly magazine + event posters |
| 📱 Social Engagement | Active presence across social platforms |
| 🏆 Awards & Recognition | One of Kolkata's most active journalism clubs |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [Framer Motion 11](https://www.framer.com/motion/) |
| Fonts | [Anton](https://fonts.google.com/specimen/Anton) (display) · [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (body) |
| Content | Static JSON data files (no CMS required) |
| Deployment | Vercel / Static Export compatible |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/talkies-web.git
cd talkies-web

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at **http://localhost:3000**.

### Build for Production

```bash
npm run build
npm run start
```

### Static Export (optional)

To generate a fully static site (no Node.js server needed):

1. Add `output: 'export'` to `next.config.ts`
2. Run `npm run build`
3. Deploy the `out/` directory to any static host

---

## Project Structure

```
talkies-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (fonts, header, footer, SEO)
│   │   ├── page.tsx            # Home page
│   │   ├── events/
│   │   │   ├── layout.tsx      # Events SEO metadata
│   │   │   └── page.tsx        # Events page (tabbed archive)
│   │   ├── magazine/
│   │   │   ├── layout.tsx      # Magazine SEO metadata
│   │   │   └── page.tsx        # Magazine archive page
│   │   ├── reports/
│   │   │   ├── layout.tsx      # Reports SEO metadata
│   │   │   └── page.tsx        # Event reports page
│   │   ├── members/
│   │   │   ├── layout.tsx      # Members SEO metadata
│   │   │   └── page.tsx        # Team members page
│   │   ├── contact/
│   │   │   ├── layout.tsx      # Contact SEO metadata
│   │   │   └── page.tsx        # Contact info + form
│   │   └── globals.css         # Design system + Tailwind config
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Header.tsx          # Sticky nav + mobile hamburger menu
│   │   ├── Footer.tsx          # 3-column footer with social links
│   │   ├── DeskStrip.tsx       # Vertical rotated-text desk spine
│   │   ├── SectionHeading.tsx  # Tag + heading + hairline rule
│   │   ├── NewsCard.tsx        # Featured news mini-card
│   │   ├── MemberCard.tsx      # Team member avatar card
│   │   ├── EventCard.tsx       # Flagship event + year tabs
│   │   └── ScrollReveal.tsx    # Framer Motion scroll animation
│   │
│   └── data/                   # ✏️ Content data files (edit these!)
│       ├── site.json           # Global metadata, focus areas, nav, social
│       ├── events.json         # Flagship + external events
│       ├── team.json           # Core, website, faculty members
│       └── publications.json   # Magazines + event reports
│
├── public/                     # Static assets (images, favicons)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## Design System

The website follows a **bold, condensed editorial** aesthetic — inspired by graphic-design-led newspaper portfolios.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `cream` | `#ECE7D8` | Page background |
| `ink` | `#16140F` | Primary text, dark sections |
| `red` | `#B23B22` | Accent — tags, CTAs, active states |
| `muted` | `#8A8478` | Secondary text, datelines |
| `rule` | `#C5BFB0` | Hairline borders and dividers |

### Typography

| Purpose | Font | Style |
|---|---|---|
| Headlines / Masthead | **Anton** | Ultra-bold condensed, ALL CAPS |
| Body / UI | **Space Grotesk** | Clean grotesk sans-serif |

### Design Principles

- **Square corners** everywhere — no `border-radius`
- **Hairline rules** instead of card shadows
- **Sparingly used red accent** — tags, one CTA block, dividers
- **Vertical desk strip** on left edge (desktop) like a magazine spine
- **Parallax masthead** with scroll-fade effect

---

## Content Management

> **No CMS, no database, no admin panel.** All content lives in JSON files under `src/data/`. Future club members only need to edit these files to update the site.

### Adding a New Team Member

Edit `src/data/team.json`:

```json
{
  "core": [
    { "name": "New Member Name", "role": "Their Role" },
    // ... existing members
  ]
}
```

### Adding a New Event Year

Edit `src/data/events.json` — add a new year entry to the relevant flagship event:

```json
{
  "year": 2026,
  "highlights": [
    { "title": "Event Highlight", "blurb": "Brief description." },
    { "title": "Another Highlight", "blurb": "Brief description." },
    { "title": "Third Highlight", "blurb": "Brief description." }
  ]
}
```

### Adding a New Magazine Issue

Edit `src/data/publications.json`:

```json
{
  "title": "Issue Theme",
  "volume": "Vol. III",
  "year": 2026,
  "description": "Description of this issue.",
  "link": "https://drive.google.com/...",
  "cover": null
}
```

### Adding a New External Event

Edit `src/data/events.json` → `external` array:

```json
{
  "name": "Event Name",
  "description": "Brief description of the event."
}
```

---

## Pages Overview

| Page | Route | Description |
|---|---|---|
| **Home** | `/` | Masthead hero, breaking news, focus areas, college stats, editions, team preview, CTA |
| **Events** | `/events` | Tabbed archive (GOT, TechTrix, Regalia, External) with year selectors |
| **Magazine** | `/magazine` | Magazine issue cards with cover placeholders |
| **Reports** | `/reports` | Event report PDF list with download links |
| **Members** | `/members` | Core team, website builders, faculty advisors grids |
| **Contact** | `/contact` | Contact info, social links, sister clubs, contact form |

---

## Accessibility

- ♿ **Skip-to-content** link (visible on keyboard focus)
- 🔴 **Focus-visible** red outline on all interactive elements
- 🏷️ **Semantic HTML** — `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- 🎞️ **Reduced motion** — all Framer Motion animations disabled when `prefers-reduced-motion` is active
- 📱 **Mobile-first** responsive design (tested at 375px, 768px, 1440px)
- 🏠 **Proper ARIA** — `aria-label`, `aria-expanded` on mobile menu toggle

---

## Roadmap

### 🎯 Phase 1 — Polish & Content (v1.1)

> *Low effort, high impact improvements on the current static site.*

#### UI Enhancements
- [ ] **Real event/team photos** — replace initials-based avatars and placeholder covers with actual images
- [ ] **Hero background image/video** — add an ambient campus or club photograph behind the masthead
- [ ] **Page transition animations** — smooth cross-fade between route changes using Framer Motion `AnimatePresence`
- [ ] **Loading skeleton screens** — add shimmer placeholders for image-heavy pages
- [ ] **404 page** — custom "story not found" editorial-themed error page
- [ ] **Marquee ticker** — scrolling news ticker strip below the header (latest headlines)
- [ ] **Image gallery lightbox** — for event photography sections
- [ ] **Dark mode toggle** — cream-on-ink ↔ ink-on-cream switch with smooth transition
- [ ] **Animated counters** — college stats (25+, 5000+, 10+) count up on scroll-into-view
- [ ] **Scroll progress indicator** — thin red bar at top of viewport showing page scroll position

#### Content Additions
- [ ] **Individual event detail pages** (`/events/got/2025`) — full write-ups, photo galleries, results tables
- [ ] **Blog/articles section** — MDX-powered article pages for campus news pieces
- [ ] **Photo gallery page** — masonry grid of club photography work
- [ ] **Achievements timeline** — interactive vertical timeline of club milestones and awards

#### SEO & Performance
- [ ] **Open Graph images** — auto-generated OG images per page using `next/og`
- [ ] **Sitemap generation** — `sitemap.xml` and `robots.txt`
- [ ] **Image optimization** — use `next/image` with proper sizing, lazy loading, and blur placeholders
- [ ] **Web font subsetting** — reduce Anton/Space Grotesk payload to used characters only

---

### 🚀 Phase 2 — Interactive Features (v2.0)

> *Introduce interactivity, forms, and dynamic content without a full backend.*

#### Registration & Forms
- [ ] **Event registration form** — built-in form for club events (GOT, TechTrix, Regalia) with fields: name, email, department, year, events interested in
- [ ] **Club membership application** — "Join RCC Talkies" form with desk preference (Editorial, Reporting, Research, Photo & Art, PR & Social), portfolio/sample links, and a short motivation statement
- [ ] **Form backend integration** — connect forms to [Formspree](https://formspree.io/), [Formspark](https://formspark.io/), or Google Forms as a zero-backend solution
- [ ] **Form validation** — client-side validation with proper error messages, email format checks, required field indicators
- [ ] **Success/confirmation pages** — custom post-submission confirmation with next-steps info

#### Magazine Reader
- [ ] **In-page PDF viewer** — embed magazine issues using `react-pdf` or `@react-pdf-viewer/core` instead of external links
- [ ] **Page-flip animation** — magazine-style page turning effect for a premium reading experience
- [ ] **Table of contents** — sidebar navigation within magazine issues

#### Interactive Elements
- [ ] **Event countdown timers** — live countdown to upcoming events on the home page
- [ ] **Newsletter signup** — email capture widget in footer/hero for campus news digest
- [ ] **Search** — client-side search across events, articles, and team members using [Fuse.js](https://fusejs.io/)
- [ ] **Share buttons** — social share for individual events and articles

---

### 🏗️ Phase 3 — Backend & CMS (v3.0)

> *Add a backend to enable dynamic content management, authentication, and file uploads.*

#### Content Management System
- [ ] **Headless CMS integration** — migrate JSON data to [Sanity](https://sanity.io/), [Strapi](https://strapi.io/), or [Payload CMS](https://payloadcms.com/) for a visual editor experience
- [ ] **Admin dashboard** — protected `/admin` panel for authorized club members to:
  - Add/edit/delete events, team members, and publications
  - Upload event photos and magazine PDFs
  - Manage form submissions and registrations
  - Preview content changes before publishing
- [ ] **Rich text editor** — WYSIWYG or Markdown editor for writing articles and event descriptions
- [ ] **Media library** — centralized image/PDF upload, storage (Cloudinary / S3 / Supabase Storage), and management

#### Authentication & Authorization
- [ ] **Login system** — Google OAuth or RCCIIT email-based login for club members
- [ ] **Role-based access control** — roles: Super Admin (faculty), Admin (core team leads), Editor (desk members), Viewer (general members)
- [ ] **Protected routes** — admin dashboard and content editing behind authentication
- [ ] **Session management** — JWT or session-based auth with proper expiry and refresh

#### Backend Features
- [ ] **API routes** — Next.js API routes or separate Express/Fastify backend for:
  - CRUD operations on events, team, publications
  - Form submission handling and storage
  - File upload endpoints
  - Analytics data collection
- [ ] **Database** — PostgreSQL (via [Supabase](https://supabase.com/) or [Neon](https://neon.tech/)) or MongoDB Atlas for storing:
  - Event data, articles, team info
  - Form submissions and registrations
  - User accounts and roles
  - Analytics and visit tracking
- [ ] **Email service** — transactional emails for:
  - Registration confirmations
  - Event reminders
  - Newsletter distribution
  - Contact form auto-replies
- [ ] **File storage** — cloud storage for:
  - Event photographs (organized by event/year)
  - Magazine PDFs
  - Team member photos
  - Poster and graphic assets

#### Event Registration System
- [ ] **Event creation workflow** — admins create events with: name, date, venue, description, registration deadline, max participants, required fields
- [ ] **Registration dashboard** — view/export registered participants per event (CSV/Excel export)
- [ ] **QR code check-in** — generate unique QR codes per registration for event-day attendance
- [ ] **Automated reminders** — email reminders before registration deadline and before event date
- [ ] **Waitlist management** — auto-waitlist when max capacity is reached, notify on cancellations

---

### 🌟 Phase 4 — Advanced Features (v4.0)

> *Long-term vision for the platform.*

#### Analytics & Insights
- [ ] **Visitor analytics dashboard** — page views, unique visitors, popular content (using [Plausible](https://plausible.io/) or [Umami](https://umami.is/))
- [ ] **Event registration analytics** — registration trends, department-wise participation, year-over-year comparisons
- [ ] **Content performance** — most-read articles, most-viewed events, engagement metrics

#### Community Features
- [ ] **Alumni portal** — dedicated section for alumni to share experiences and mentorship
- [ ] **Discussion forum** — campus discussion board for journalism-related topics
- [ ] **Peer reviews** — internal article review workflow before publication
- [ ] **Contributor profiles** — public profiles for active contributors with their published work

#### Technical Improvements
- [ ] **PWA support** — Progressive Web App with offline reading for published magazines
- [ ] **RSS feed** — for campus news articles
- [ ] **i18n** — Bengali language support alongside English
- [ ] **A/B testing** — experiment with different layouts and CTAs
- [ ] **CI/CD pipeline** — automated testing, linting, and deployment via GitHub Actions
- [ ] **Automated backups** — scheduled database and media backups
- [ ] **Performance monitoring** — Core Web Vitals tracking and alerting

#### Integration
- [ ] **Google Calendar sync** — auto-add events to attendees' calendars
- [ ] **Social media auto-posting** — auto-share new articles/events to Instagram, Facebook
- [ ] **RCCIIT ERP integration** — pull student data for registration pre-fill (if API available)
- [ ] **WhatsApp notifications** — event alerts via WhatsApp Business API

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run `npm run build` to ensure no errors
5. Commit with a descriptive message: `git commit -m "feat: add photo gallery page"`
6. Push and open a Pull Request

### Commit Convention

| Prefix | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `content:` | Content update (JSON data files) |
| `style:` | Visual/CSS changes |
| `refactor:` | Code restructure without behavior change |
| `docs:` | Documentation updates |

---

## Team

### Website Builders

| Name | Role |
|---|---|
| **Pritam Mondal** | Lead Web Designer |
| **Shreya Chakraborty** | Co-Lead Web Designer |
| **Baidantik Das** | Web Designer |
| **Swapnil Mukherjee** | Web Designer |
| **Samadrita Saha** | Web Designer |

### Faculty Advisors

| Name | Role |
|---|---|
| **Anwesha Basu** | Faculty Advisor |
| **Dr. Anirban Mukherjee** | Faculty Advisor |
| **Sohini Sen** | Faculty Coordinator |
| **Tasmina Yasmin** | Faculty Coordinator |

---

## License

This project is maintained by RCC Talkies, RCCIIT. All rights reserved.

---

<p align="center">
  <strong>RCC Talkies</strong> · The Voice of RCCIIT · Est. 1999
</p>
