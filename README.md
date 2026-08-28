# The RCC Talkies — Official Website

> **The Voice of RCCIIT** · Kolkata-based independent student journalism & media society.

The official web presence of RCC Talkies, the journalism and media club of RCC Institute of Information Technology (RCCIIT), Kolkata. Covers campus news, fest coverage, event reports, the quarterly magazine, and team recruitment.

---

## Tech Stack

| Layer        | Technology                                                |
| ------------ | --------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org/) (App Router)           |
| Language     | TypeScript 5                                              |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com/)               |
| Animation    | [Framer Motion](https://www.framer.com/motion/)           |
| Database     | [Prisma ORM](https://www.prisma.io/) + SQLite (dev)      |
| Validation   | [Zod v4](https://zod.dev/)                                |
| PDF Reader   | react-pdf + react-pageflip                                |
| Visual FX    | GSAP (MaskedHeading text reveal)                          |
| Fonts        | Google Fonts (Anton, Newsreader, Space Grotesk, and more) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# → Edit .env and set ADMIN_PASSWORD to a secure value

# 3. Initialize the database
npx prisma db push

# 4. Start the dev server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable         | Required | Description                                       |
| ---------------- | -------- | ------------------------------------------------- |
| `DATABASE_URL`   | Yes      | Database connection string (SQLite for dev)        |
| `ADMIN_PASSWORD` | Yes      | Password for the `/admin/magazines` upload panel   |

See [`.env.example`](.env.example) for a template.

---

## Project Structure

```
src/
├── app/                     # Next.js App Router pages & API
│   ├── page.tsx             # Homepage (hero, about, magazine promo)
│   ├── events/              # Event archive (GOT, TechTrix, Regalia)
│   ├── magazine/            # Magazine listing + [id] flipbook reader
│   ├── reports/             # PDF event reports
│   ├── members/             # Team profiles by academic year
│   ├── join/                # Recruitment landing, leads & team forms
│   │   ├── leads/           # Lead application form
│   │   └── team/            # Team member application form
│   ├── contact/             # Contact form & social links
│   ├── admin/               # Admin panel (magazine upload/delete)
│   └── api/
│       ├── apply/           # POST — team/lead application submission
│       └── magazines/       # GET/POST magazines, DELETE [id]
├── components/              # Reusable UI components
│   ├── Header.tsx           # Sticky header with full-screen nav overlay
│   ├── Footer.tsx           # Site footer
│   ├── AccordionGallery.*   # Interactive image accordion
│   ├── DecryptedText.tsx    # Character-by-character text reveal
│   ├── FlipbookReader.tsx   # PDF-to-flipbook magazine viewer
│   ├── HalftoneReveal.*     # WebGL halftone image effect
│   ├── IntroOverlay.tsx     # Cinematic intro splash screen
│   ├── MaskedHeading.*      # GSAP-powered masked text reveal
│   └── SpotlightCard.*     # Mouse-following spotlight card effect
├── data/                    # Static data & shared constants
│   ├── events.json          # Flagship & external event data
│   ├── positions.ts         # Shared lead/team desk constants
│   ├── publications.json    # Report PDFs
│   ├── site.json            # Site config, nav links, contact info
│   └── team.json            # Team member profiles by year
└── lib/
    ├── prisma.ts            # Prisma client singleton
    └── validations/
        └── application.ts   # Zod schemas for lead/team applications
```

---

## API Routes

### `POST /api/apply`

Submit a lead or team application.

**Body** (JSON):

```json
{
  "type": "LEAD" | "TEAM",
  "name": "string",
  "collegeEmail": "string",
  "rollNumber": "string",
  "yearOfStudy": "1" | "2" | "3",
  "phoneNumber": "string",
  "positionAppliedFor": "string",
  "portfolioLink": "string?",
  "whyJoin": "string?"
}
```

### `GET /api/magazines`

List all magazines (public, no auth).

### `POST /api/magazines`

Upload a new magazine issue (requires `ADMIN_PASSWORD` in form data).

### `DELETE /api/magazines/[id]`

Delete a magazine issue (requires `password` in JSON body).

---

## Database

Prisma with SQLite for development. The schema defines two models:

- **Application** — Recruitment form submissions (leads & team members)
- **Magazine** — Uploaded magazine issues with PDF URLs and cover images

To update the schema:

```bash
# Edit prisma/schema.prisma, then:
npx prisma db push
```

> **Production note**: For deployment, switch to PostgreSQL by updating `DATABASE_URL` in `.env` and the `provider` in `prisma/schema.prisma`.

---

## Deployment

```bash
npm run build   # Production build
npm start       # Start production server
```

Ensure `ADMIN_PASSWORD` is set in the production environment. Uploaded PDFs and cover images are stored in `public/uploads/magazines/` — for production, consider using an object storage service (e.g., Cloudflare R2, AWS S3).

---

## License

This project is maintained by the RCC Talkies editorial board at RCCIIT, Kolkata.
