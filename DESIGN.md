# REID XTREME 5.0 — Web Design System
### Cross the Chasm. Bridge the Horizons.

> **Purpose:** Single source of truth for maintaining visual, interaction, motion, and content consistency across the REID XTREME 5.0 hackathon website and related digital surfaces.

---

## 1. Brand Overview

**Event:** REID XTREME 5.0  
**Theme:** Building paths / crossing a chasm / bridging horizons  
**Visual metaphor:** A futuristic suspension bridge constructed from technology, code, and luminous energy across a dark mountainous chasm.

### Core brand idea

> **Imagine it. Construct it.**

The visual language should communicate:

- **Construction** — progress, assembly, engineering, iteration
- **Connection** — bridging people, ideas, technologies, and communities
- **Exploration** — crossing an unknown gap toward a destination
- **Technology** — digital wireframes, circuitry, holographic interfaces
- **Progress** — a bridge becoming more complete stage by stage
- **Futurism** — restrained cyber/tech aesthetics rather than generic cyberpunk

### Brand personality

| Attribute | Direction |
|---|---|
| Futuristic | High |
| Technical | High |
| Cinematic | High |
| Minimal | Medium–High |
| Premium | High |
| Playful | Low |
| Corporate | Medium |
| Cyberpunk | Low–Medium |
| Nature-inspired | Medium |

**Important:** This is **clean futuristic technology**, not a saturated cyberpunk interface. Avoid excessive neon, rainbow gradients, glowing particles everywhere, or visually noisy HUD elements.

---

# 2. Visual Identity

## 2.1 Primary visual concept

The website should feel like a **digital construction site suspended above a massive natural chasm**.

The primary visual stack is:

1. Dark atmospheric mountain environment
2. Deep blue-green/charcoal tonal base
3. Luminous mint-green technology
4. Fine wireframe/circuit details
5. Glass/holographic panels
6. Strong white typography for hierarchy
7. Controlled glow around important interactive/brand elements

### Visual rule

**Dark environment → luminous structure → restrained interface → strong typography.**

---

# 3. Color System

## 3.1 Core palette

| Token | Hex | Usage |
|---|---|---|
| `--mint` | `#8CF5BD` | Primary accent, active states, major glow |
| `--emerald` | `#3FB57F` | Secondary accent, borders, structural elements |
| `--body` | `#D6E4DC` | Main body text |
| `--muted` | `#A9C2B5` | Secondary text, metadata |
| `--bg` | `#03080A` | Primary background |
| `--white` | `#F5FAF7` | High-priority headings and UI |
| `--black` | `#000000` | Deep contrast |
| `--panel` | `rgba(3, 15, 13, 0.72)` | Glass/dark panels |
| `--line` | `rgba(140, 245, 189, 0.35)` | Borders and separators |

### Extended atmospheric colors

```css
:root {
  --mint: #8CF5BD;
  --emerald: #3FB57F;
  --body: #D6E4DC;
  --muted: #A9C2B5;
  --bg: #03080A;
  --white: #F5FAF7;

  --mint-10: rgba(140, 245, 189, 0.10);
  --mint-20: rgba(140, 245, 189, 0.20);
  --mint-35: rgba(140, 245, 189, 0.35);
  --mint-50: rgba(140, 245, 189, 0.50);
  --emerald-60: rgba(63, 181, 127, 0.60);

  --panel: rgba(3, 15, 13, 0.72);
  --panel-solid: #07120F;
  --line: rgba(140, 245, 189, 0.35);
}
```

---

# 4. Color Usage Rules

### Primary

Use **mint `#8CF5BD`** for:

- CTA buttons
- active navigation
- important numerical values
- countdown digits
- bridge wireframe
- key icons
- highlighted words
- hover/focus states
- important borders

### Secondary

Use **emerald `#3FB57F`** for:

- structural lines
- secondary glow
- decorative circuitry
- subtle gradients
- supporting UI states

### Typography

Use:

- `#F5FAF7` / near-white for major headings
- `#D6E4DC` for normal body text
- `#A9C2B5` for secondary/muted text

### Background

The page should predominantly remain around:

`#03080A`

Do **not** use pure black for every surface. Atmospheric dark teal/green variation is encouraged.

---

# 5. Typography

## 5.1 Font families

### Display / Main

**Barlow Condensed**

Use for:

- Hero headings
- Large section headings
- Event name
- Countdown numbers
- Major labels
- Navigation branding
- Large numerical information

Recommended weights:

- 400 — outline / futuristic secondary text
- 500 — standard display
- 600 — section headings
- 700 — major emphasis

### Body / UI

**Inter**

Use for:

- Paragraphs
- Forms
- Navigation utility text
- Buttons
- Metadata
- Descriptions
- Small labels

---

## 5.2 Type scale

```css
--text-xs: 0.70rem;
--text-sm: 0.80rem;
--text-md: 0.95rem;
--text-lg: 1.15rem;

--heading-sm: 1.5rem;
--heading-md: 2rem;
--heading-lg: 3rem;
--heading-xl: 4.5rem;
--display: clamp(4rem, 11vw, 10rem);
```

Use `clamp()` for responsive display typography.

### Recommended hierarchy

```text
Hero eyebrow       → Inter / uppercase / tracked
Hero title         → Barlow Condensed / bold
Hero subtitle      → Inter / medium
Section title      → Barlow Condensed / semibold
Body               → Inter / regular
Labels             → Inter / uppercase / tracked
Technical numbers  → Barlow Condensed / bold
```

---

# 6. Typography Styling

## Display headings

Characteristics:

- Uppercase
- Condensed
- Strong geometric silhouette
- Tight line-height
- Minimal letter spacing

Example:

```text
CROSS THE CHASM.
BRIDGE THE HORIZONS.
```

### Highlighted words

Use mint:

```text
CROSS THE <span class="accent">CHASM.</span>
```

Do not highlight entire paragraphs.

---

# 7. Glow System

Glow is a **brand accent**, not a default effect on every element.

## 7.1 Text Glow

Use for:

- Hero display text
- Important CTA labels
- Countdown digits
- Key branded words
- Major futuristic callouts

### Figma-equivalent

```text
Drop Shadow 1
X: 0
Y: 0
Blur: 14
Color: #6EE7A8
Opacity: 85%
Show behind transparent areas: ON

Drop Shadow 2
X: 0
Y: 0
Blur: 44
Color: #3EB57F
Opacity: 60%
Show behind transparent areas: ON
```

CSS approximation:

```css
.text-glow {
  text-shadow:
    0 0 14px rgba(110, 231, 168, 0.85),
    0 0 44px rgba(62, 181, 127, 0.60);
}
```

## 7.2 Soft Glow

Use for:

- Cards
- Borders
- Icons
- Decorative bridge lines
- Ambient elements

```css
.soft-glow {
  box-shadow:
    0 0 14px rgba(110, 231, 168, 0.50);
}
```

### Glow rule

Prefer:

> **One strong glow + one subtle ambient glow**

rather than multiple stacked effects.

---

# 8. Background System

The background is a major part of the identity.

## 8.1 Base background

```css
body {
  background: #03080A;
  color: #D6E4DC;
}
```

## 8.2 Atmospheric background

Use the provided cinematic mountain/chasm imagery as the primary visual environment.

Characteristics:

- Dark mountains
- Large negative space
- Mist/fog
- Cool blue-green atmosphere
- Subtle green highlights
- Deep shadows
- Cinematic depth

### Image treatment

Images should generally be:

```css
filter:
  saturate(0.85)
  contrast(1.05)
  brightness(0.75);
```

Then use dark overlays to integrate them with the UI.

### Recommended overlay

```css
background:
  linear-gradient(
    180deg,
    rgba(3, 8, 10, 0.15),
    rgba(3, 8, 10, 0.78)
  );
```

---

# 9. Atmospheric Effects

Use sparingly:

- Fog
- Mist
- Tiny floating particles
- Distant green lights
- Subtle volumetric lighting
- Very slow background movement

Avoid:

- Constant particle explosions
- Excessive lens flares
- Rainbow lighting
- Fast camera movement
- Excessive glitch effects

The environment should feel **calm, immense, and technologically alive**.

---

# 10. Bridge Visual Language

The bridge is the central visual asset of REID XTREME.

## Bridge characteristics

- Suspension bridge geometry
- Wireframe construction
- Luminous mint-green structure
- Fine technical grid
- Transparent/holographic appearance
- Glowing cables
- Repeating structural lines
- Perspective toward a central destination

### Bridge color

Primary:

`#8CF5BD`

Secondary:

`#3FB57F`

### Bridge animation principle

The bridge should appear to be **constructed**, not magically spawned.

Preferred sequence:

```text
1. First anchor point
2. Main structural lines
3. Towers
4. Suspension cables
5. Deck/grid
6. Side supports
7. Secondary technical details
8. Final glow activation
```

Animation should feel:

- Sequential
- Mechanical
- Precise
- Calm
- Satisfying

Avoid overly complex transformations.

---

# 11. Logo

Primary logo:

**REID XTREME 5.0**

The central `X` / bridge-inspired symbol is the primary visual mark.

### Logo usage

Use the supplied transparent logo asset whenever possible.

Do not:

- Stretch the logo
- Change its proportions
- Add random colors
- Add excessive drop shadows
- Place it on a visually noisy background without contrast

### Logo spacing

Maintain generous clear space around the mark.

---

# 12. UI Philosophy

The UI should feel like a **holographic engineering interface**.

Use:

- Thin borders
- Dark translucent surfaces
- Mint edge lighting
- Technical line motifs
- Compact labels
- Sharp/controlled geometry
- Moderate corner radius

Avoid:

- Rounded SaaS-style cards everywhere
- Huge pill buttons
- Generic gradients
- Bright white cards
- Conventional corporate dashboards

---

# 13. Glass / Holographic Panels

## Base panel

```css
.holo-panel {
  background: rgba(3, 15, 13, 0.72);
  border: 1px solid rgba(140, 245, 189, 0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

### Optional inner highlight

```css
.holo-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border: 1px solid rgba(140, 245, 189, 0.08);
}
```

### Panel characteristics

- Dark
- Transparent enough to reveal environment
- Thin mint border
- Slight blur
- Minimal shadow
- Strong readability

---

# 14. Borders

Default border:

```css
border: 1px solid rgba(140, 245, 189, 0.35);
```

Active border:

```css
border-color: #8CF5BD;
```

Hover:

```css
box-shadow:
  0 0 14px rgba(140, 245, 189, 0.25);
```

Avoid thick borders.

Preferred range:

`1px – 2px`

---

# 15. Corner Geometry

Use a combination of:

- `4px` — technical controls
- `6px` — buttons and compact UI
- `8px` — cards/panels
- `12px` — major feature panels

Do not make every component heavily rounded.

The visual language should feel engineered rather than playful.

---

# 16. Buttons

## Primary CTA

Example:

```text
CONNECT & REGISTER
```

Style:

```css
.primary-button {
  background: #8CF5BD;
  color: #03080A;
  border: 1px solid #8CF5BD;
  font-family: Inter, sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
```

Hover:

```css
.primary-button:hover {
  box-shadow:
    0 0 14px rgba(140, 245, 189, 0.55),
    0 0 32px rgba(63, 181, 127, 0.30);
  transform: translateY(-1px);
}
```

## Secondary button

Dark transparent background:

```css
background: rgba(3, 8, 10, 0.65);
border: 1px solid rgba(140, 245, 189, 0.45);
color: #D6E4DC;
```

Hover → mint border + subtle glow.

---

# 17. Navigation

Navigation should be compact and unobtrusive.

### Structure

```text
[LOGO]     NAV ITEM   NAV ITEM   NAV ITEM   [CONNECT & REGISTER]
```

### Styling

- Dark transparent background
- Thin bottom border
- Small typography
- High spacing
- Active item in mint
- CTA visually dominant

### Mobile

Collapse to:

```text
[LOGO]                                  [MENU]
```

Do not allow navigation to compete with the hero.

---

# 18. Hero Section

The hero is the strongest visual moment on the site.

## Recommended composition

```text
------------------------------------------------
NAVIGATION
------------------------------------------------

       EVENT LABEL

       REID XTREME 5.0

       CROSS THE CHASM.
       BRIDGE THE HORIZONS.

       A HACKATHON INSPIRED BY BUILDING PATHS.

                  ↓

            [BRIDGE VISUAL]

------------------------------------------------
```

### Hero rules

- Large negative space
- Strong central alignment
- Bridge is the visual anchor
- Text remains readable over imagery
- CTA should not overpower the bridge
- Avoid placing too many cards in the hero

---

# 19. Hero Animation

Animation should tell one story:

> **A path is being constructed.**

### Recommended sequence

```text
0.00s
Dark mountain environment visible.

0.50s
Tiny mint energy/anchor point appears.

1.00s
First structural line begins drawing.

1.50s
Left/right cable structures extend.

2.00s
Bridge towers construct vertically.

2.50s
Deck/grid builds toward the horizon.

3.00s
Suspension cables connect.

3.50s
Fine wireframe details activate.

4.00s
Glow gradually reaches final intensity.

4.50s
Hero title settles into place.
```

### Animation constraints

- No unnecessary morphing
- No random camera rotations
- No aggressive zoom
- No excessive particles
- No rapid glitch transitions

Motion should be **cinematic and deliberate**.

---

# 20. Motion System

## Timing

```css
--duration-fast: 150ms;
--duration-standard: 300ms;
--duration-slow: 600ms;
--duration-cinematic: 1200ms;
```

### Easing

Default:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

For technical drawing:

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

### Hover motion

Keep movement small:

```text
translateY(-1px to -3px)
```

Never use exaggerated bouncing.

---

# 21. Scroll Behaviour

Scrolling should reveal the world progressively.

Recommended sequence:

```text
Hero
 ↓
Event / Mission
 ↓
Why REID XTREME
 ↓
Event Timeline
 ↓
Tracks / Challenges
 ↓
Rules / Information
 ↓
Registration
 ↓
Sponsors / Partners
 ↓
Footer
```

### Scroll effects

Use:

- Slow parallax
- Fade-up reveals
- Line drawing
- Glow activation
- Image depth

Avoid:

- Aggressive scroll-jacking
- Fast zoom transitions
- Excessive section snapping

---

# 22. Section Headers

Recommended format:

```text
01 / THE JOURNEY

EVENT TIMELINE
```

or:

```text
THE JOURNEY
```

### Styling

Eyebrow:

- Inter
- 11–13px
- uppercase
- letter-spacing: `0.12em`
- mint

Heading:

- Barlow Condensed
- uppercase
- white
- strong weight

Optional technical line:

```text
───────────────
```

in low-opacity mint.

---

# 23. Event Timeline

The timeline represents the physical construction of the bridge.

Example:

```text
PHASE 01
PROPOSAL

      ↓

PHASE 02
KICK-OFF

      ↓

PHASE 03
HACKING

      ↓

PHASE 04
MIDPOINT

      ↓

PHASE 05
FINAL PITCH

      ↓

PHASE 06
AWARDS
```

### Visual treatment

Each phase can use:

- Small bridge wireframe
- Phase number
- Date
- Short description
- Mint connection line

The bridge should visually become more complete as the timeline progresses.

---

# 24. Countdown Component

The countdown is a major technical UI component.

### Structure

```text
COUNTDOWN CLOCK
THE GAP IS CLOSING. COUNTDOWN TO START.

03 : 14 : 27 : 59
DAYS   HOURS   MIN   SEC
```

### Styling

Digits:

- Barlow Condensed
- Large
- Mint
- Text Glow
- Monospaced/numerical appearance if available

Container:

- Dark holographic panel
- Mint border
- Technical corner treatment
- Minimal glow

### Important

The countdown should look like a **machine interface**, not a generic website timer.

---

# 25. Registration Form

Registration should visually resemble a **Project Proposal Hologram**.

### Fields

```text
TEAM NAME
[________________________]

PROJECT FOCUS
[________________________]

MEMBERS
[________________________]

SKILLS MATRIX
[ ] [ ] [ ] [ ] [ ]

[ CONNECT & REGISTER YOUR PROJECT ]
```

### Form styling

Inputs:

```css
background: rgba(3, 8, 10, 0.65);
border: 1px solid rgba(140, 245, 189, 0.35);
color: #D6E4DC;
```

Focus:

```css
border-color: #8CF5BD;
box-shadow: 0 0 12px rgba(140, 245, 189, 0.20);
```

Placeholder:

`#A9C2B5`

---

# 26. Cards

Cards should feel like interface modules.

### Card anatomy

```text
[ICON / TECH MARK]

TITLE

Short description explaining the
feature, challenge, or information.

──────────────

OPTIONAL METADATA
```

### Card styling

- Dark translucent background
- Thin border
- Mint accent
- Small glow on hover
- Moderate radius
- Strong internal spacing

---

# 27. Iconography

Preferred style:

- Thin line icons
- Technical
- Geometric
- Minimal
- Mint/emerald
- Consistent stroke width

Avoid:

- Filled cartoon icons
- Emoji as primary UI icons
- Mixed icon libraries
- Heavy 3D icons

Suggested stroke:

`1.5px – 2px`

---

# 28. Circuit / Technical Decoration

Circuit patterns are secondary decorative elements.

Use them:

- Around hero edges
- Behind section headers
- Around panels
- Near footer
- As transition elements

### Characteristics

- Thin lines
- Dark emerald
- Low opacity
- Right-angle routing
- Small connection nodes
- Occasional mint highlight

### Opacity

Typical:

`10% – 35%`

Decorative circuits should never compete with content.

---

# 29. Background Grid

Optional subtle grid:

```css
background-image:
  linear-gradient(
    rgba(140, 245, 189, 0.035) 1px,
    transparent 1px
  ),
  linear-gradient(
    90deg,
    rgba(140, 245, 189, 0.035) 1px,
    transparent 1px
  );

background-size: 40px 40px;
```

Use only where the underlying image does not already contain sufficient detail.

---

# 30. Image Direction

All generated/selected imagery should follow this art direction:

> Cinematic dark mountain chasm, cool blue-green atmosphere, deep charcoal rock formations, mist and volumetric fog, subtle luminous mint-green technology integrated into the environment, futuristic wireframe engineering, restrained holographic elements, realistic cinematic lighting, high depth, premium technology event aesthetic.

### Bridge imagery

Prioritize:

- Symmetrical perspective
- Central vanishing point
- Strong foreground
- Large mountains
- Visible chasm
- Mint-green bridge
- Human scale reference

### Human silhouette

The person should generally:

- Face toward the bridge
- Remain silhouetted
- Be small relative to the environment
- Communicate exploration
- Avoid visible facial detail

The human represents the participant crossing the gap.

---

# 31. AI Image Generation Rules

When generating new visual assets, preserve:

### Environment

- Same mountain/chasm world
- Same cool dark atmosphere
- Same mist/fog
- Same cinematic depth

### Technology

- Mint-green
- Wireframe
- Holographic
- Technical
- Fine geometry

### Lighting

Primary:

`#8CF5BD`

Secondary:

`#3FB57F`

No saturated cyan/purple/pink unless specifically required for a campaign variation.

### Composition

Prefer:

- Centered perspective
- Strong leading lines
- Large negative space
- Clear foreground/midground/background separation

---

# 32. Content Tone

The copy should feel:

- Bold
- Technical
- Aspirational
- Concise
- Cinematic

### Good

> Build the path others haven't seen.

> Cross the gap. Build what's next.

> Ideas are the starting point. Construction is the journey.

### Avoid

Generic startup language such as:

> Empowering innovative solutions for tomorrow's digital ecosystem.

The writing should feel connected to the **bridge / construction / journey** metaphor.

---

# 33. Messaging Vocabulary

Prefer:

- Build
- Construct
- Cross
- Bridge
- Connect
- Horizon
- Chasm
- Path
- Structure
- Assemble
- Engineer
- Prototype
- Deploy
- Breakthrough
- Journey
- Progress

Avoid overusing:

- Revolutionize
- Disrupt
- Synergy
- Ecosystem
- Cutting-edge
- Next-generation

---

# 34. Accessibility

Despite the futuristic visual style, accessibility remains mandatory.

### Contrast

Body text must maintain strong contrast against dark surfaces.

### Focus

Keyboard focus must be visible:

```css
:focus-visible {
  outline: 2px solid #8CF5BD;
  outline-offset: 3px;
}
```

### Reduced motion

Support:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# 35. Responsive Design

## Desktop

Primary experience.

- Large cinematic imagery
- Wide bridge compositions
- Multi-column layouts
- Large typography
- Decorative circuitry

## Tablet

- Reduce decorative density
- Reduce hero height
- Maintain bridge perspective
- Collapse complex grids where necessary

## Mobile

Priority:

1. Content
2. CTA
3. Bridge visual
4. Event information
5. Decorative elements

### Mobile rules

- Do not simply scale desktop down
- Stack cards vertically
- Reduce glow intensity
- Reduce circuit decoration
- Keep typography readable
- Preserve central bridge composition
- Avoid horizontal overflow

---

# 36. Spacing System

Use a consistent spacing scale:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 96px;
--space-10: 128px;
```

Major sections should generally use:

`80px – 140px` vertical spacing on desktop.

---

# 37. Layout System

Recommended max width:

```css
--container: 1400px;
```

Main content:

```css
width: min(92%, var(--container));
margin-inline: auto;
```

Use asymmetric layouts when appropriate, but preserve strong visual alignment.

---

# 38. Z-Index / Layering

Recommended conceptual layers:

```text
10  — Navigation
20  — Hero content
30  — Interactive controls
40  — Modals
 5  — Decorative circuitry
 4  — Bridge/environment overlays
 2  — Background image
 1  — Base atmosphere
```

Decorative elements must never block interaction.

---

# 39. Component States

Every interactive component should have:

```text
DEFAULT
HOVER
FOCUS
ACTIVE
DISABLED
```

### State direction

Default → restrained  
Hover → brighter + subtle glow  
Focus → clear mint outline  
Active → strongest mint state  
Disabled → muted gray-green, no glow

---

# 40. Loading / Transition States

Loading should feel like system construction.

Possible language:

```text
INITIALIZING PATH...
CONSTRUCTING BRIDGE...
ESTABLISHING CONNECTION...
LOADING HORIZON...
```

Avoid generic:

```text
Loading...
Please wait...
```

---

# 41. Error / Empty States

Keep them within the theme.

Example:

```text
PATH NOT FOUND

The connection could not be established.
Try again or return to the previous checkpoint.
```

Primary action:

```text
RECONNECT
```

---

# 42. Footer

The footer should feel like the bridge disappearing into the horizon.

Suggested elements:

```text
REID XTREME 5.0

CROSS THE CHASM.
BRIDGE THE HORIZONS.

[Social Links] [Contact] [Organizers]

© 2026 REID XTREME
```

Use a darker version of the hero environment.

---

# 43. Social / Promotional Assets

All promotional graphics should maintain:

### Background

Dark mountain/chasm atmosphere.

### Accent

Mint/emerald technology.

### Typography

Barlow Condensed for major headlines.

### Supporting text

Inter.

### Glow

Controlled.

### Composition

One dominant visual idea per asset.

Do not fill every area with decoration.

---

# 44. Design Tokens — Quick Reference

```css
:root {

  /* COLORS */
  --color-bg: #03080A;
  --color-mint: #8CF5BD;
  --color-emerald: #3FB57F;
  --color-body: #D6E4DC;
  --color-muted: #A9C2B5;
  --color-white: #F5FAF7;

  /* TYPOGRAPHY */
  --font-display: "Barlow Condensed", sans-serif;
  --font-body: "Inter", sans-serif;

  /* RADIUS */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* BORDERS */
  --border-default: rgba(140, 245, 189, 0.35);
  --border-active: #8CF5BD;

  /* GLOW */
  --glow-small:
    0 0 14px rgba(110, 231, 168, 0.50);

  --glow-text:
    0 0 14px rgba(110, 231, 168, 0.85),
    0 0 44px rgba(62, 181, 127, 0.60);

  /* MOTION */
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 150ms;
  --duration-standard: 300ms;
  --duration-slow: 600ms;
  --duration-cinematic: 1200ms;

  /* LAYOUT */
  --container: 1400px;
}
```

---

# 45. Do / Don't

## DO

- Use dark cinematic environments
- Use mint as the signature accent
- Use Barlow Condensed + Inter
- Use restrained holographic panels
- Use thin technical borders
- Use controlled glow
- Use bridge imagery as the primary metaphor
- Use progressive construction animations
- Maintain visual breathing room
- Use consistent perspective and atmosphere

## DON'T

- Don't turn the site into generic cyberpunk
- Don't use multiple neon colors
- Don't overuse glow
- Don't use excessive glassmorphism
- Don't fill every empty space
- Don't use random gradients
- Don't use giant rounded SaaS cards
- Don't use cartoonish illustrations
- Don't animate everything
- Don't change the mountain world between sections without a strong reason

---

# 46. Design QA Checklist

Before shipping any page, verify:

### Brand

- [ ] Correct REID XTREME 5.0 branding
- [ ] Bridge/chasm concept remains recognizable
- [ ] Mint/emerald palette maintained
- [ ] Correct logo asset used

### Typography

- [ ] Barlow Condensed used for major display text
- [ ] Inter used for body/UI
- [ ] Hierarchy is obvious
- [ ] No unnecessary font variations

### Color

- [ ] Background remains dark
- [ ] Mint is the dominant accent
- [ ] Emerald is secondary
- [ ] Body text remains readable
- [ ] No unapproved neon colors

### UI

- [ ] Borders are thin
- [ ] Panels are dark/translucent
- [ ] Glow is restrained
- [ ] Buttons have consistent states
- [ ] Inputs match the holographic UI

### Imagery

- [ ] Mountain/chasm environment is consistent
- [ ] Lighting matches the established world
- [ ] Technology is mint/green
- [ ] No conflicting visual styles

### Motion

- [ ] Animation supports the construction metaphor
- [ ] Motion is smooth and deliberate
- [ ] No excessive effects
- [ ] Reduced-motion support exists

### Responsive

- [ ] Mobile layout is intentionally designed
- [ ] No horizontal overflow
- [ ] Hero remains readable
- [ ] CTA remains accessible
- [ ] Decorative effects do not obscure content

---

# 47. Master Creative Direction

When creating **any new REID XTREME 5.0 page, component, graphic, animation, illustration, or AI-generated asset**, use the following as the master reference:

> **REID XTREME 5.0 is a premium futuristic hackathon identity built around the metaphor of constructing a luminous technological suspension bridge across a vast mountain chasm. The visual world is dark, cinematic, atmospheric, and sophisticated. Deep charcoal and blue-green mountains provide the environment, while a restrained mint-green (#8CF5BD) and emerald (#3FB57F) luminous technology layer represents innovation and connection. Barlow Condensed provides bold condensed display typography, while Inter handles body and interface text. UI surfaces are dark translucent holographic panels with thin mint borders, subtle blur, and controlled green glow. Wireframe bridges, circuit traces, technical grids, fog, and tiny particles are secondary supporting motifs. Motion should be deliberate and construction-oriented: lines draw, structures assemble, cables connect, and the bridge gradually activates. Avoid generic cyberpunk aesthetics, excessive neon, visual clutter, exaggerated glassmorphism, random gradients, or unnecessary animation. Every design decision should reinforce the central idea: **Imagine it. Construct it. Cross the Chasm. Bridge the Horizons.**"

---

# 48. Asset Reference

Recommended project asset roles:

| Asset | Recommended role |
|---|---|
| `Logo_no_shadow_glowing.png` | Primary logo / navigation / branding |
| Mountain + person image | Hero background / story sections |
| Mountain + completed bridge | Hero / CTA / major transitions |
| Completed bridge close perspective | Feature sections / promotional graphics |
| Website screenshot/reference | UI composition reference |
| Original brand specification screenshot | Typography/color/glow reference |

Keep original assets unchanged whenever possible. If new assets are generated, they must visually belong to the same world.

---

# 49. Source-of-Truth Rule

When a new design decision conflicts with this document:

1. Preserve **brand consistency** first.
2. Preserve **readability** second.
3. Preserve **user experience** third.
4. Preserve **visual novelty** last.

New pages should look like they belong to the **same physical world** as the original bridge scene.

**The website should feel like one continuous journey across the same bridge—not a collection of unrelated futuristic screens.**

---

## Final Design Principle

# **BUILD THE EXPERIENCE LIKE THE BRIDGE.**

Start with a strong foundation.

Add structure.

Connect the pieces.

Guide the user forward.

Then let the horizon reveal itself.
