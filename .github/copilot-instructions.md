## Design Context

### Users
Developers and recruiters evaluating a portfolio project. They're scanning for technical competence, attention to detail, and polish. The interface should immediately signal "this person builds high-quality software" and invite exploration of the algorithms underneath.

### Brand Personality
**Confident, Bold, Energetic.** The app should feel like a premium esports broadcast tool -- something you'd see on stage at a tournament. Technical precision meets visual drama. Every interaction should feel intentional and snappy.

### Emotional Goals
- "This person is technically sharp" -- complexity surfaced clearly, not hidden
- "This is impressive" -- the UI itself is a portfolio piece, not just a wrapper
- "I want to click around" -- energetic motion and visual feedback reward exploration

### Aesthetic Direction
- **Reference**: [playvalorant.com](https://playvalorant.com/en-us/) -- aggressive red accent on dark backgrounds, cream/off-white text, uppercase architectural headers, smooth entrance animations, full-width hero drama
- **Visual tone**: Dark, high-contrast, competitive. Esports broadcast meets data visualization dashboard
- **Theme mode**: Dark only (intentional)
- **Color palette direction**:
  - Deep navy/near-black backgrounds
  - Primary accent: Valorant-style red (#FF4655) for energy and CTAs
  - Secondary accent: Cyan/sky blue (#38bdf8) for data, info, Team 1
  - Red doubles as Team 2 color and primary brand accent
  - Cream/off-white (#ECE8E1) for body text instead of pure white -- warmer, easier on eyes
  - Amber/gold for warnings and "guaranteed best" algorithm
- **Typography direction**:
  - Geometric sans-serif for headings (Chakra Petch or explore DIN-style alternatives)
  - Clean sans-serif body (Outfit)
  - Monospace for labels, data, code (JetBrains Mono)
  - Uppercase headers with deliberate letter-spacing
- **Motion & Animation**:
  - Valorant-inspired entrance animations: elements sliding/fading in on page load (0.3-0.5s ease)
  - Scroll-triggered reveals for sections
  - Subtle hover micro-interactions (translateY lifts, glow effects, color transitions)
  - SVG graph animations: nodes and edges drawing in, team color transitions
  - Playback controls should feel responsive with immediate visual feedback
  - Consider particle/glow effects on the hero section for visual drama
- **Layout patterns**:
  - Full-width hero sections with dramatic backgrounds
  - Glassmorphic panels with subtle borders and gradient overlays
  - Large rounded corners (24-30px) on cards
  - Generous spacing -- let elements breathe
  - Max-width container (7xl) for content

### Anti-References
- Generic Bootstrap/Material UI -- nothing should look like a default template
- Overly minimal/sterile SaaS dashboards -- this should have personality
- Cluttered gaming sites with too many competing elements -- bold but clean

### Design Principles
1. **Drama with discipline** -- Bold visual choices (color, scale, motion) but every element earns its place. No decoration without purpose.
2. **Motion as meaning** -- Animations communicate state changes and guide attention, not just decorate. Entrances reveal hierarchy; transitions show cause and effect.
3. **Technical confidence** -- Show complexity clearly. Monospace data, visible algorithms, graph structures front and center. The UI says "I understand what's under the hood."
4. **Portfolio-grade polish** -- Every pixel is a statement about craft. Consistent spacing, aligned elements, smooth transitions. The UI itself is the portfolio piece.
5. **Reward exploration** -- Each page should have moments of delight that make recruiters want to keep clicking. Interactive elements should feel alive.
