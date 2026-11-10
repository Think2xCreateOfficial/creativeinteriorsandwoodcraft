# Creative Interiors &amp; Woodcraft

A premium, editorial single-page website for **Creative Interiors & Woodcraft**, an interior design and woodcraft studio in Mogappair East, Chennai.

The experience is built around one cinematic interior walkthrough: a 350vh hero whose video is scrubbed by scroll on desktop and loops smoothly on mobile, an editorial philosophy statement, a full-bleed craft image, a sticky crossfading interiors gallery, a full-screen detail showcase, and an enterprise-grade project enquiry form.

---

## 1. Tech Stack

- **Framework**: Next.js 16.4.5 (App Router with Turbopack)
- **Runtime**: Node.js 20.9+
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` / `@theme`)
- **Animation**: GSAP 3.12.5 + ScrollTrigger + SplitText
- **Smooth Scroll**: Lenis 1.1.18, driven by the shared GSAP ticker
- **Icons**: Lucide React
- **Type Safety**: TypeScript 5.7+ (strict mode, zero type errors)

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run typecheck  # TypeScript check
npm run validate   # Full verification (typecheck + build)
npm start          # Production server
```

---

## 2. Content & Architecture

| What | Source File | Purpose |
| --- | --- | --- |
| Studio identity, contact, address, operating hours, ratings, maps | `lib/site.ts` | Single source of truth for business metadata |
| Editorial copy (Hero, About, Craft, Showcase, Form options) | `lib/content.ts` | Centralized page copy and film definitions |
| Enquiry validation, normalization, and types | `lib/enquiry.ts` | Shared client/server validation contracts |
| Distributed rate limiting | `lib/rate-limit.ts` | Multi-instance sliding window limiter with Upstash / memory fallback |
| Idempotency & deduplication | `lib/idempotency.ts` | Prevents double submissions across network retries |
| Sticky gallery & crossfade logic | `components/sections/InteriorsGallery.tsx` | Double-buffer crossfade without image flashes |
| Hero film scrubbing & mobile playback | `components/sections/HeroFilm.tsx` | Responsive media engine with reduced-motion support |

---

## 3. Media & Performance Engineering

### Hero Video Optimization
The original 19.6 MB hero video was engineered into two responsive variants:
- **Desktop (>=768px)**: `public/interior-tour.mp4` (~7.45 MB, 1080p, CRF 27, 0.5s keyframe interval for instantaneous scrub response).
- **Mobile (<768px)**: `public/interior-tour-mobile.mp4` (~1.58 MB, 540p, CRF 28, 92% size reduction) and `public/interior-tour-mobile.webm`.
- **Preload Strategy**: Changed from `preload="auto"` to `preload="metadata"`, preventing early megabytes from downloading before the user initiates interaction.
- **Mobile Playback**: Automatically plays a smooth, muted looping film (`autoPlay loop muted playsInline`) instead of continuous seek-scrubbing, avoiding GPU decode contention and battery drain on mobile phones.
- **Desktop Playback**: Interpolates scroll progress to timestamps with a 0.14 lerp, seeks only when `readyState >= 2`, and runs on the single shared GSAP ticker.
- **Accessibility & Reduced Motion**: Under `prefers-reduced-motion: reduce`, the video element is unmounted. The first-frame poster (`public/images/interior-poster.jpg`) is delivered as the priority LCP image without motion.

---

## 4. Enquiry API & Production Reliability

Endpoint: `POST /api/enquiry`

### A. Serverless Durability
- **Production Safety**: Local filesystem storage (`.data/enquiries.jsonl`) is strictly blocked in production (`process.env.NODE_ENV === "production"`) to eliminate silent lead loss on ephemeral serverless containers (Vercel, AWS Lambda).
- **Delivery Channels**: Enquiries are delivered to verified channels:
  1. **Webhook / CRM**: `ENQUIRY_WEBHOOK_URL` (with optional `ENQUIRY_WEBHOOK_SECRET`).
  2. **Email (Resend)**: `RESEND_API_KEY` + `ENQUIRY_NOTIFICATION_EMAIL`.
- **Partial Failure & Atomic Settlement**: Delivery runs with `Promise.allSettled`. If one channel succeeds while another fails, the submission is confirmed to the user, and an operational warning is logged to prevent duplicate customer submissions.
- **Idempotency Strategy**: Client-generated idempotency keys ensure network retries or double clicks never deliver duplicate enquiries.

### B. Distributed Rate Limiting & Anti-Spam
- **Multi-Instance Rate Limiting**: Uses atomic Redis pipeline operations when `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (or Vercel KV) is provided. Safely falls back to an in-memory token bucket if external Redis is unreachable, failing open on errors.
- **Anti-Spam & Bot Protection**:
  - Hidden honeypot field (`website`): Silently traps automated scrapers.
  - Form interaction timing (`elapsedMs`): Submissions with missing, non-numeric, or inhumanly fast (<1500ms) completion times are trapped.
  - Same-origin validation: Rejects cross-site request forgery attempts with 403.
  - Server-side field sanitization: Strips control characters, null bytes, and validates string boundaries.

---

## 5. SEO & Structured Data

- **Canonical URL**: Dynamic base URL derived from `NEXT_PUBLIC_SITE_URL`.
- **Schema.org**: Valid `HomeAndConstructionBusiness` structured data with verified studio address, opening hours specification, and Google Maps entity links (`sameAs`).
- **Google Guidelines Compliance**: Removed self-serving `aggregateRating` markup from local business JSON-LD to prevent Google Search Console rich snippet penalties, while retaining verified ratings visibly on the site with direct links to Google Maps.
- **Sitemap**: `app/sitemap.ts` uses fixed content release timestamps to prevent crawler churn across deployments.
- **Robots**: `app/robots.ts` allows indexation of all public pages and excludes `/api/`.

---

## 6. Environment Configuration

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical production origin (e.g. `https://creativeinteriorswoodcraft.com`) |
| `ENQUIRY_WEBHOOK_URL` | Prod | Webhook endpoint for leads (Zapier, Make, CRM) |
| `ENQUIRY_WEBHOOK_SECRET` | No | Shared HMAC / secret passed in `x-webhook-secret` |
| `RESEND_API_KEY` | Prod | Resend API key for instant lead email notifications |
| `ENQUIRY_NOTIFICATION_EMAIL` | Prod | Destination inbox for new project enquiries |
| `UPSTASH_REDIS_REST_URL` | Rec | Upstash / Vercel KV REST URL for distributed rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Rec | Upstash / Vercel KV REST token |

---

## 7. Production Deployment Checklist

1. [ ] Configure `NEXT_PUBLIC_SITE_URL` to the production domain.
2. [ ] Configure `RESEND_API_KEY` + `ENQUIRY_NOTIFICATION_EMAIL` or `ENQUIRY_WEBHOOK_URL`.
3. [ ] (Recommended) Connect Upstash Redis for distributed rate-limiting across lambda instances.
4. [ ] Run `npm run typecheck` to verify zero compile errors.
5. [ ] Run `npm run build` to verify clean static page generation.
6. [ ] Submit a test enquiry on the deployed URL to verify delivery.
