@AGENTS.md

# VangAI website

Production marketing site for **VangAI** (vang.ai), built by GenAITech (Hasselt, Belgium). It is an AI front desk for Belgian SMEs: phone (VangVoice), WhatsApp (VangMessage), and website chat (VangChat), in Dutch, French, and English, set up and managed for the client.

## Source of truth

- `Website Design/` is the final design exported from Claude Design. **Match it exactly. Do not change the look, copy, or layout.**
  - Site pages: `VangAI Home|Product|Pricing|About|Contact|Privacy|Cookies|Terms|Data and Privacy.dc.html`
  - Components: `VangCall` (voice demo), `VangWhatsApp`, `VangWebChat`, `VangLost C` (garage animation used on Home; `VangLost` / `VangLost B` are unused drafts), `Mark` (logo). `lost-engine.js` holds the garage animation keyframe tracks.
  - Translations: `i18n-nl.js`, `i18n-fr.js` (English string → translation, complete for every site string). `site.js` holds the old runtime i18n and the off-screen pause logic.
  - Not site pages: `Vangst *` files (logo explorations), `VangAI Brand Guide*.dc.html`, `Vangst Brand*.dc.html`, `deck-stage.js`, `doc-page.js`, `kit.js`, `image-slot.js`.
  - `assets/`: favicon, mark PNGs (twotone/cream/orange, 567×631), `og-image.png` (1200×630).
- Brand docs: `Website Design/uploads/GenAITech_Brand_Guide.docx` (strategy, voice, palette) and `Vangst_Brand_System.pptx`.

## Brand

- **Palette** (as used by the site): coral `#D85A30` (primary accent, buttons, links), amber `#854F0B` (secondary, small labels), cream `#FAEEDA` (page background), warm dark `#2B2118` (text, dark sections). Supporting tints used in the design: `#E8763F` (coral on dark), `#B8441F` (deep coral), `#F3E4CC` (sand section bg), `#FFF6E6` (light card), `#FFFFFF`. Proportion is about 70 cream, 18 dark, 12 accent; "if it feels cold, add cream, not coral".
- **Contrast**: dark on cream 13.9:1, amber on cream 6.0:1, white on coral 3.9:1 (large text only).
- **Type** (as used by the site): Archivo 400–800 for headings and body, IBM Plex Mono 400/500 for uppercase labels and metadata. (Brand docs also mention Nunito/Newsreader/Work Sans; the website design does not use them.)
- **Mark**: two open hands forming a V (Vangst = "the catch"). Coral left hand, dark/amber right hand. Never rotate, stretch, recolour outside the approved colourways, or add shadows/glows. Minimum 24px on screen; clear space is half the mark height.
- **Voice**: warm, direct, honest, confident. Human first. Lead with the outcome, not the features.
- **Writing rules**: no em/en dashes in copy (use comma or period); sentence case headings; Oxford comma; no emoji; Dutch uses informal "je" (never "u" except with government/notaries); avoid seamless, synergy, solutions, leverage, cutting-edge, revolutionize, game-changer, utilize.
- **AI disclosure** (EU AI Act): the assistant says it is an AI in its first sentence.

## Stack and conventions

- Next.js App Router + TypeScript, Tailwind with brand tokens, Framer Motion, next-intl with `/nl`, `/fr`, `/en` routes. GitHub + Vercel.
- All user-facing text lives in `messages/{en,nl,fr}.json`, never hardcoded. Product names are the only literal exceptions.
- All placeholders (booking URL, email, demo phone number, company number, etc.) live in one config file.
- Animations pause off screen and respect `prefers-reduced-motion`.
- Demos are front-end only with scripted answers, behind one clearly marked adapter where the real AI connects later.

## Project agents

Use the agents in `.claude/agents/`:

- Code: `code-reviewer`, `test-engineer`, `quality-gate` (run before commit/deploy), `security-auditor`.
- Design (pixel-perfect is the bar): `design-fidelity-checker` (the full design QA gate, one verdict), `pixel-perfect-checker`, `style-token-auditor`, `brand-color-auditor`.
- Content: `brand-i18n-checker`, `seo-a11y-auditor`.

Design QA tooling lives in `tools/design-qa/` (see its README). `design-fixes.json` is the only list of approved deviations from the design; do not add entries without the user's approval.

## Decisions (confirmed by the user)

- Brand name on the site is **VangAI** everywhere (not Vangst, not GenAITech).
- Booking link, email, demo number, company number and similar values stay placeholders for now, all in the one config file.
- `Website Design/voice-demo.wav` is the final demo call audio (Product page, VangVoice side card).
- Contact details: email `sales@vangai.be` (site and contact form), phone `+32 465 73 52 99` (the Home "call our AI" link). No company registration number yet: `companyNumber` is empty and the footer and Privacy page leave that clause out; filling it in the config restores it in all three languages.

## Approved corrections to the design (2026-09-25)

All are in `tools/design-qa/design-fixes.json` with exact values; the build must implement them and match everything else exactly.

- **Home page wrapper**: body text is Archivo and #2B2118 everywhere and the header stays pinned on every page (a stray `</div>` in the export made Home's lower text Times New Roman, its headings pure black, and its header scroll away).
- **No sideways scroll on phones (360px and up)**: long headings scale (`min(Npx, K vw)`), auto-fit grids use `minmax(min(Npx, 100%), 1fr)`, the "No website yet?" card stacks at 480px or less, and the Product demo side cards fit. Tablet and desktop are verified pixel-identical to the design.
- **Colours exactly as designed** (user decision, 2026-09-25): every text colour matches the design, including small coral labels, the active menu item and faded labels, even where they are below the WCAG 4.5:1 guideline. No contrast corrections.
