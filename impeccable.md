# HackerRank-Inspired Redesign Plan

## Context

The current Valorant-inspired theme has several AI anti-patterns: red-on-red identity crisis (brand accent = Team 2 = error), uniform fadeInUp animations everywhere, oversized border-radius, glassmorphic panels, and a content-dump landing page. The user wants to pivot to a **HackerRank-style** design — clean, professional, developer-focused — with **Team 1 = light blue** and **Team 2 = blood red**, and fix all identified anti-patterns.

---

## Color System (the key change)

| Token | Value | Role |
|-------|-------|------|
| Brand accent | `#1ae05f` (green) | Primary buttons, active nav, section titles, loading bars |
| Team 1 | `#38bdf8` (light blue) | Team 1 nodes, text, legend |
| Team 2 | `#ef4444`  | Team 2 nodes, text, legend |
| Error | `#CC0000` | Error messages  |
| Background | `#030914` | Page base (HackerRank dark) |
| Surface | `#0a1628` | Panel/card backgrounds |
| Elevated | `#111d2e` | Nav, elevated surfaces |
| Text primary | `#ECE8E1` | Headings, body |
| Text secondary | `#8fa0b4` | Labels, secondary |
| Text muted | `#586d82` | Hints, placeholders |

**This solves the red-on-red crisis**: green is the brand, red is only Team 2, a different red as stated above is only errors.

---

## Files to Modify (in order)

### 1. NEW: `src/constants/colors.ts`
- Create shared color constants for SVG rendering (team1, team2, strokes, highlight, etc.)
- Imported by Landing.tsx and Visualise.tsx — single source of truth for inline SVG colors

### 2. `src/index.css` — Full theme rebuild
- **CSS custom properties**: Add `--color-*` variables in `.broadcast-theme` for all colors above
- **Background**: Flat `#030914` — remove radial gradients
- **Nav**: Solid `#111d2e` bg, remove backdrop-filter blur, green active state instead of red
- **Typography**: Replace Chakra Petch with Outfit (cleaner, HackerRank-like). Remove uppercase from `.theme-title`. Keep uppercase only on small labels
- **Panels**: Solid backgrounds, no gradients, no glassmorphism, minimal shadows
- **Buttons**: Green primary (dark text on green), 4px radius, no translateY hover lift
- **Border radius**: 4px everywhere (from current 8-16px)
- **Chips**: 4px radius (from pill/999px)
- **Focus states**: Green ring instead of red
- **Table hover**: Neutral instead of red tint, green for active row
- **Loading bar**: Green instead of red
- **Remove**: `glowPulse` keyframe (unused, references old red)
- **Animations**: Reduce duration from 0.5s to 0.35s

### 3. `src/App.tsx` — Minor
- No structural changes needed — nav styling is CSS-driven
- Brand accent slash color handled by CSS

### 4. `src/pages/Landing.tsx` — Simplify structure
- **Remove** entire "Algorithms + System" bottom section (`algorithmCards`, `systemNotes`, and their rendering) — this info lives on Dashboard/Compare pages
- **Update** spotlight node colors: Team 2 nodes use `#ef4444` instead of `#FF4655`
- **Update** SVG edge strokes to use imported color constants
- **Update** brand title slash: `text-[#FF4655]` → `text-[var(--color-accent)]` (green)
- **Shape**: All `rounded-2xl`/`rounded-xl` → `rounded` (4px)
- **Animations**: Vary them — not all fadeInUp. Use fadeIn for text, scaleIn for panels, slideInLeft for buttons
- **Remove** decorative `theme-accent-line` div

### 5. `src/pages/Visualise.tsx` — SVG color overhaul
- Import color constants from `constants/colors.ts`
- Team 1 fill: `#38bdf8`, stroke: `#67e8f9` (keep)
- Team 2 fill: `#ef4444`, stroke: `#ff6b6b` (was `#FF4655`/`#ff6b77`)
- Cross-team edges: `#ef4444` instead of `#FF4655`
- Replace all `text-[#ECE8E1]` with `theme-text-primary` class
- Replace `text-[#38bdf8]`/`text-[#FF4655]` with CSS variable references
- Legend: update bg colors for Team 2
- Shape: `rounded-xl` → `rounded`

### 6. `src/pages/Dashboard.tsx`
- Replace all hardcoded `text-[#ECE8E1]`, `text-[#38bdf8]`, `text-[#FF4655]` with theme classes
- Algorithm cards in HelpAccordion: use team-1 blue for local search, amber for exhaustive (not red)
- Shape: `rounded-xl` → `rounded`
- Vary animations (not all fadeInUp)

### 7. `src/pages/Compare.tsx`
- Replace hardcoded team colors with theme classes
- Team 2 text: blood red via CSS variable
- Shape: `rounded-xl` → `rounded`

### 8. `src/pages/GraphBuilder.tsx`
- Replace hardcoded colors with theme classes
- Performance estimate colors: keep green/yellow/orange/red scale but use `var(--color-error)` for slow
- Shape: `rounded-xl` → `rounded`

### 9. `src/components/GraphStatus.tsx`
- `text-sky-400` → theme link color
- `rounded-lg` → `rounded`
- Keep `text-amber-400` and `text-green-400` (semantic status colors, fine as-is)

### 10. `src/components/HelpAccordion.tsx`
- `rounded-xl` → `rounded`

### 11. `.impeccable.md` — Update design context
- Reference: HackerRank instead of Valorant
- Document new green accent, blood red Team 2, clean aesthetic
- Update typography, shape language, animation principles

---

## Anti-Patterns Being Fixed

| Anti-Pattern | Fix |
|---|---|
| Red-on-red (brand = team 2 = error) | Green brand accent, `#ef4444` for Team 2 only, `#CC0000` for errors |
| Content dump landing page | Remove bottom 1/3 (algorithms + system sections) |
| Every page looks the same template | Vary animations per page, remove uniform kicker→title→subtitle pattern where unneeded |
| Uniform fadeInUp on everything | Mix fadeIn, scaleIn, slideInLeft; not every element animated |
| Oversized border-radius | 4px consistently (HackerRank standard) |
| Glassmorphism panels | Solid backgrounds, no backdrop-filter, minimal shadows |
| Button hover lift | Remove translateY(-1px), use subtle glow instead |
| Unused CSS (glowPulse, shimmer, drawLine, nodePop) | Remove glowPulse; keep others for potential SVG use |

---

## Verification

1. Run `npx tsc --noEmit` to check TypeScript compilation
2. Run `npm run build` to verify production build
3. Visual check in browser: nav, landing, graph builder, dashboard, compare, visualise
4. Confirm Team 1 is light blue and Team 2 is blood red in all SVG visualizations
5. Confirm green brand accent appears on buttons, active nav, section titles, loading bars
6. Confirm Team 2 uses `#ef4444` and errors use `#CC0000` — no red-on-red confusion anywhere
