# Design QA

Measured comparison between the Claude Design export (`../../Website Design/`) and the built site. Used by the agents `design-fidelity-checker`, `pixel-perfect-checker`, `style-token-auditor`, and `brand-color-auditor`.

```bash
npm install                      # once; uses the installed Google Chrome
npm run selftest                 # design vs itself: must PASS with 0 diff
node pixel-diff.mjs  --page home --vp all --lang en --build http://localhost:3000
node states.mjs      --page home
node style-diff.mjs  --page all --vp desktop
node palette-audit.mjs
```

| Tool                | Checks                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `pixel-diff.mjs`    | Full-page screenshots, pixel diff (colour shifts as small as #D85A30 → #E0602F), page size, diff regions named by section |
| `states.mjs`        | Scripted hovers and clicks from `pages.json` (dropdown, tabs, FAQ, reveal, demo replies), viewport pixel diff             |
| `style-diff.mjs`    | Computed typography, colours, borders, radii, padding, sizes, layout drift, missing or extra copy, hover states           |
| `palette-audit.mjs` | Off-palette and near-miss colours against the design and brand palette, text contrast against brand pairings              |

Capture conditions are identical on both sides: DPR 1, reduced motion, animations and transitions frozen, fonts loaded, fixed clock (2026-09-24 10:00 Brussels), and the page settled (no DOM or size change for 1s).

- `pages.json`: page keys, design file, build route, scripted states.
- `design-fixes.json`: the only approved corrections to design export bugs, applied to the design side. Keep it minimal. Each entry needs a reason and approval.
- `--self` compares the design with itself; `--inject '<css>'` applies deliberate changes to the build side, which proves the tools detect them.
- Results go to `out/` (git-ignored).
