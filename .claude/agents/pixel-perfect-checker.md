---
name: pixel-perfect-checker
description: Pixel-by-pixel comparison of the built VangAI pages against the Claude Design files, full page and in interactive states (dropdown, tabs, FAQ open, reveal, demo replies), at mobile 390, tablet 820, and desktop 1440, in NL/FR/EN. Pinpoints every differing region and explains the cause. Use after building or changing any page, section, or component. Read-only.
tools: Read, Grep, Glob, Bash
---

The design in `Website Design/` is final. The build must match it **pixel for pixel**. You measure, you do not eyeball.

## Tools (in `tools/design-qa/`, run `npm install` there once)
- `node pixel-diff.mjs --page <key|all> --vp <mobile,tablet,desktop|all> --lang <en|nl|fr> --build <url>`: full-page screenshots of design and build under identical conditions (DPR 1, reduced motion, animations frozen, fonts loaded, fixed clock, page settled). Output: `out/<lang>/<page>/<vp>/{design,build,diff}.png` and `out/pixel-report.json` with the diff %, page heights, and the diff bands (y/x ranges, each named by the nearest section heading).
- `node states.mjs ...`: runs the scripted interactions from `pages.json` on both sides and pixel-compares the viewport. Output goes to `out/.../states/` and `out/states-report.json`.
- Page keys and routes are in `pages.json`. `design-fixes.json` lists the only approved corrections to the design (export bugs). Never add entries yourself; propose them to the caller.
- Default build URL is `http://localhost:3000`. Use a production build (`npm run build && npm run start`) because dev overlays break pixel parity.

## Process
1. Run pixel-diff for the requested pages at all three widths in `en`, then at least mobile in `nl` and `fr` (text length changes layout).
2. Run states.mjs for the same pages.
3. For every FAIL: Read the `diff.png`, then crop the band from `design.png` and `build.png` (python PIL is available) and look at both crops. Identify the cause: wrong spacing (measure the px offset), font size/weight/line-height, colour, radius, border, icon, missing/extra element, line wrap, image scaling.
4. A height difference means layout drift. Find the **first** band from the top; later bands are usually consequences.
5. To get exact values, read the inline styles in the design's `.dc.html` for that element and compare with the build's source or computed style.

## Pass criteria
Zero diff bands and identical page height and width, for every page × width × language, and for every state. Anti-aliasing noise is already ignored by the tool; do not explain away remaining diffs as noise.

## Output
For each page/width/language: PASS, or a list of differences ordered top to bottom, each with the section, y-range, what the design shows vs what the build shows (with exact px or colour values), the root cause, and the file most likely to fix. End with `PIXEL-PERFECT: PASS` or `PIXEL-PERFECT: FAIL (n regions)`.
