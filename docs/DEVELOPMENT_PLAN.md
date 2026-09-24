# VangAI website: development plan

How the site is built from the Claude Design export, in small parts. Each part is tested and checked pixel for pixel against the design before the next one starts.

## 1. The bar

- **Reference = the design + approved corrections.** `Website Design/*.dc.html` with `tools/design-qa/design-fixes.json` applied. That is the only thing the build is compared to.
- **Pixel perfect means measured, not eyeballed.** The design QA tools report 0 differing regions and identical page size for every page, at every width, in every state.
- **Nothing moves forward red.** A part is finished only when every gate in section 3 passes. Failures are fixed in the same part, not later.

## 2. How every part is built (the loop)

Every part (a component, a page section, a page) goes through the same loop:

1. **Read**: open the design file for that part and take the exact values from its inline styles (sizes, spacing, colours, radii, fonts, breakpoints, timings). No guessing.
2. **Build**: write the component. Copy goes into `messages/{en,nl,fr}.json` straight away, placeholders into `src/config/site.ts`, colours and fonts from the tokens.
3. **Test the logic**: Vitest unit tests for anything with behaviour (demo scripts, timeline maths, form validation, accordion state).
4. **Measure against the design**: run the design QA tools for that page. Pixel and style run on the section just built and everything above it (progressive mode, see 4.2), plus states if it is interactive.
5. **Fix and repeat** until every gate is green.
6. **Review**: `code-reviewer` on the diff, then `quality-gate`.
7. **Commit**, one commit per finished part, with the QA summary in the message.

## 3. Gates

| Gate                      | Tool or agent                               | When                                    | Pass                                                                   |
| ------------------------- | ------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| Lint, format, types       | `quality-gate`                              | every part                              | 0 errors, 0 warnings                                                   |
| Unit tests                | Vitest                                      | every part with logic                   | all pass                                                               |
| Pixel                     | `pixel-diff.mjs` / `pixel-perfect-checker`  | every visual part                       | 0 diff regions, same height and width at 390 / 820 / 1440              |
| States                    | `states.mjs`                                | every interactive part                  | 0 diff regions per state                                               |
| Style                     | `style-diff.mjs` / `style-token-auditor`    | every visual part                       | 0 style, size, drift, missing-copy and hover differences               |
| Colour                    | `palette-audit.mjs` / `brand-color-auditor` | every visual part                       | 0 near misses, 0 off-palette, no new contrast issues                   |
| No sideways scroll        | `overflow.mjs` (to add)                     | every page                              | page width = screen width at 360, 375, 390, 414, 768, 1024, 1280, 1440 |
| Translations              | `brand-i18n-checker`                        | every part with copy                    | same keys in 3 languages, text equals the design dictionaries          |
| End to end                | Playwright / `test-engineer`                | every page and flow                     | all pass on phone, tablet, desktop                                     |
| Code review               | `code-reviewer`                             | before every commit                     | no open findings                                                       |
| Full design QA            | `design-fidelity-checker`                   | end of every page and before deploy     | `DESIGN QA: PASS`                                                      |
| Security                  | `security-auditor`                          | contact form, API routes, before launch | no High or Critical                                                    |
| SEO, accessibility, speed | `seo-a11y-auditor`                          | end of phase 8 and before launch        | Lighthouse mobile Performance 90+, Accessibility 100, SEO 100          |

## 4. Tooling additions before building

### 4.1 Toolkit extensions (`tools/design-qa/`)

- `overflow.mjs`: sideways-scroll check at 8 widths, for design and build.
- **Progressive mode** (`--upto "<section heading>"`): compare only from the top of the page down to a given section, so a half-built page can pass what already exists.
- **Component mode** (`--design-sel`, `--build-sel`): compare one element on both sides, for the nav, footer, buttons, and cards.
- `run-all.mjs`: one command runs every check for a page and prints one table, used by the gates and CI.
- 404 and any new page without a design: screenshot review by the user instead of a pixel diff.

### 4.2 CI (GitHub Actions)

On every push and pull request: lint, types, unit tests, build, Playwright, and the full design QA against the built app. Both design and build render in the same CI browser, so pixel parity holds there too. Vercel preview deploys on each pull request.

## 5. Phases

### Phase 0: Project setup

- Next.js (App Router, TypeScript strict), Tailwind, next-intl, Framer Motion, ESLint and Prettier, Vitest and Testing Library, Playwright, git repo, `.env.example`.
- Folder layout: `src/app/[locale]/…`, `src/components/{layout,ui,sections,demos,animations}`, `src/lib/{assistant,animation,i18n}`, `src/config/site.ts`, `messages/`.
- **Gate:** the app builds, CI is green, and the QA toolkit reaches the running app.

### Phase 1: Foundations

1. **Token extraction**: a script reads every page of the corrected design and lists every distinct colour (with alpha), font size, weight, letter spacing, line height, radius, shadow, and breakpoint. These become the Tailwind tokens, so nothing is typed by hand. The palette audit must show the build uses exactly this set.
2. **Fonts**: Archivo (400–800) and IBM Plex Mono (400, 500) through `next/font`, which self-hosts the same Google font files the design uses (same rendering, no Google request, better for GDPR).
3. **i18n**: next-intl with `/nl`, `/fr`, `/en`. A script generates `messages/*.json` from the design's English copy and `i18n-nl.js` / `i18n-fr.js`, so the translations are the design's own, word for word. Structured keys per page and section.
4. **Config**: `src/config/site.ts` with every placeholder (booking link and provider, email, demo number, company number, contact recipient).
5. **Global styles**: body background, selection colour, link colours, reduced-motion base, `data-paused` pause rule.

- **Gate:** token list matches the design exactly; translation files have the same keys in all 3 languages; an empty page with the right background passes a pixel diff against an empty design page.

### Phase 2: Shared components (checked in component mode)

Mark (logo), buttons (primary, outline, text link with arrow), eyebrow label (`/ …` mono), section headings, language switch, nav with product dropdown, footer (product cards, links, language switch, giant wordmark), FAQ accordion with "show more", closing CTA band (dark and coral), step cards, check-list rows, price display.

- The mark uses the design's PNGs at exact sizes (`unoptimized`, so no re-encoding shifts pixels) until a vector is supplied.
- **Gate per component:** component-mode pixel diff = 0 at 3 widths, hover and focus states match, keyboard works.

### Phase 3: Home, section by section

Each step passes progressive pixel, style, and states checks before the next:

1. Nav (from phase 2)
2. Hero: text, CTAs, trust line, demo tabs with 5s auto-rotate (stops on interaction or off screen)
3. The three demos (see phase 3a)
4. The problem: copy plus the garage animation (see phase 3b)
5. "The good news?" block
6. How it works: 4 step cards with hover/tap reveal and 4s auto-reveal
7. One memory: channel cards, flowing arrows, hub, hover bursts
8. What is included: magnifier reveal, "x of 9 found", Reveal all / Hide
9. Extra service card ("No website yet?")
10. Pricing teaser with the monthly summary card
11. Why VangAI
12. FAQ (10 questions, show more)
13. Closing CTA and footer

**3a. Demos**: VangVoice (mic waveform through Web Audio, scripted fallback when there is no mic), VangMessage and VangChat (3 scripted questions, typing indicator, fallback reply for free text, closing card). All replies go through one interface, `src/lib/assistant/` (`AssistantAdapter`), with a `scriptedAdapter` now and a clearly marked `// CONNECT REAL AI HERE` spot plus a disabled `/api/assistant` stub for later. Tests cover every scripted path in 3 languages.

**3b. Garage animation**: the SVG scene is moved into JSX exactly. `lost-engine.js` becomes a typed `useTimeline` hook: one requestAnimationFrame loop writing transforms to refs (no React re-render per frame), the same keyframe tracks and smoothstep easing, paused when off screen or in a background tab, and a static frame at t=47.6s under reduced motion. Unit tests check the interpolation against the original engine at 50 time points.

- **Gate:** full Home pixel, states and style checks at 3 widths in EN; mobile and desktop in NL and FR; animation timing values match the design source.

### Phase 4: Product page

Channel overview carousel, the three product sections (voice with the final `voice-demo.wav` player and speaking indicator, WhatsApp, web chat), "done for you" block, FAQ per channel, CTA. Scroll-linked active channel.

- **Gate:** as for Home.

### Phase 5: Pricing and About

Pricing: plans (4 cards, bundle highlighted), add-on, setup options, extra service, FAQ. About: mission and vision, values, steps, contact block.

- **Gate:** as for Home.

### Phase 6: Contact

- Booking panel: Cal.com or Calendly embed from config, themed like the design, loaded only after the page. The design's own calendar placeholder shows while no booking link is set.
- Message form: client validation, `POST /api/contact` with zod validation, honeypot, per-IP rate limit, Resend email to the address in config, the thank-you state from the design.
- **Gate:** design checks, e2e (valid, invalid, spam, server error), `security-auditor`.

### Phase 7: Legal pages and 404

Privacy, Cookies, Terms, Data & privacy from one shared template. 404 in the same visual language (no design exists, so approved by screenshot review).

- **Gate:** design checks for the 4 legal pages; 404 returns status 404 in all 3 languages.

### Phase 8: SEO

Per page and language: title, description, canonical, hreflang (nl-BE, fr-BE, en, x-default), Open Graph and Twitter tags. Share images per language in the design's style (1200×630). `sitemap.xml`, `robots.txt`, JSON-LD (`Organization`, `LocalBusiness` Hasselt, `FAQPage`), favicon set (square tile, single-tone below 24px, not stretched), web manifest. Everything statically generated.

- **Gate:** `seo-a11y-auditor`, with the SEO score at 100.

### Phase 9: Motion and accessibility pass

Every animation pauses off screen and in background tabs and respects reduced motion (checked by test). Keyboard paths through the nav, tabs, demos, FAQ, magnifier, calendar, and form. Focus rings. Screen reader labels in 3 languages. Mic access only after pressing call.

- **Gate:** axe with 0 violations on every page and language; `review-animations` skill pass.

### Phase 10: Hardening

Security headers and CSP (only the needed origins; microphone allowed for self only), `npm audit`, Lighthouse on mobile and desktop, a cross-browser check (Chrome for pixel parity; Safari/WebKit and Firefox for layout and behaviour), and a real phone check (iPhone and Android).

- **Gate:** every agent green; `DESIGN QA: PASS` on all pages.

### Phase 11: GitHub, Vercel, and launch

Push to GitHub, connect Vercel, run the full QA suite against the preview URL, and hand you the preview link to check. After your approval: the vang.ai domain, production deploy, Google Search Console and Bing, and a sitemap submission.

- **Gate:** the full suite passes on the live URL.

## 6. Motion (approved 2026-09-25: all four groups)

**Rule:** every added animation starts from and ends at the exact design. Pixel checks capture the end state (reduced motion, frozen). Animations get their own checks.

| Group                 | What                                                                                                                                                                                                                                            | Where it lands                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1. Signature "catch"  | A coral dot (the customer) drops and the two hands of the mark close gently around it. Plays once on load in the hero, and in the closing CTA when scrolled into view. Needs the mark as a vector (SVG from the user, or redrawn from the PNG). | Phase 2 (component), preview for approval before use |
| 2. Entrances          | Home hero: headline lines rise in, then copy, CTAs, and demo phone in a soft stagger (~0.8s). Sections: headings and cards fade up 16px once on entering view. Soft cross-fade between pages.                                                   | With each page (phases 3–7)                          |
| 3. Interaction polish | Sliding coral pill for demo tabs and the language switch; chat bubbles pop in from their side; FAQ smooth height and + to – morph; product dropdown fade and drop; button arrow nudge and press; card lift 4px on hover.                        | Phase 2 (shared parts)                               |
| 4. Count-ups          | Monthly summary figures (34, 118, 9 hrs, €1,870) count up on entering view. Prices never animate.                                                                                                                                               | Phase 3 (Home)                                       |

**Motion system:** one file `src/lib/animation/motion.ts` holds every duration, easing, distance, and stagger (calm ease-out curves, 150–800ms, 12–24px, no overshoot). Framer Motion (`motion` package) with `LazyMotion` and `MotionConfig reducedMotion="user"`.

**Motion checks (every animated part):**

- Only `transform` and `opacity` animate; CLS stays 0 (Playwright layout-shift observer).
- End state passes the pixel, style, and states checks.
- Pauses off screen and in background tabs; reduced motion shows the end state instantly (tests).
- Timings match the motion file and, for the design's own animations, the design source.
- `review-animations` skill review; frame-rate trace on a throttled mobile profile, 60fps target.

## 7. Risks to pixel parity, and how they are handled

| Risk                                | Handling                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Font files or versions differ       | `next/font` fetches the same Google files; the style diff checks family, size, weight, and spacing on every text element |
| Images re-encoded by `next/image`   | the mark and assets are served unoptimized at design sizes                                                               |
| Rounding from `rem`/`clamp`         | use the design's px values; the only responsive sizes are the approved fixes                                             |
| Different DOM structure             | pixels and computed styles are compared, not markup, so semantic HTML (buttons instead of divs) is fine                  |
| Hover/focus added for accessibility | focus rings appear only on keyboard focus (`:focus-visible`), so mouse screenshots are unaffected                        |
| Animations                          | captured frozen and under reduced motion on both sides; timings are checked against the design source separately         |
| Language-dependent wrapping         | NL and FR are checked on mobile and desktop                                                                              |

## 8. Open decisions (defaults used until told otherwise)

1. URLs: translated slugs (`/nl/prijzen`, `/fr/tarifs`); `/` redirects by browser language, Dutch as the fallback.
2. Contact email service: Resend, with a placeholder recipient.
3. Legal pages keep the "Draft, to be reviewed" label until reviewed.
4. Analytics: Vercel Web Analytics (no cookies).
5. Logo: design PNGs until an SVG is supplied.
6. GitHub account, repo name, and Vercel access: needed at phase 11.
