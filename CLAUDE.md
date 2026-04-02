# Cyberhiking Optimization Plan — Option C (Full Alignment)

## Project Overview
- **Repo**: https://github.com/DavidGao520/Cyberhiking
- **Live**: https://cyberhiking.vercel.app
- **Stack**: React 18 + Vite 4 + vanilla CSS, deployed on Vercel
- **Original (reference)**: https://cyberhiking.cn/ — Chinese version set on the Ao Tai Line (鳌太线)
- **This version**: English version set on the Pacific Crest Trail (PCT)

## Goal
Redesign the English version's UX/UI to match the immersive quality of the original Chinese version at cyberhiking.cn, while keeping the PCT theme and English language.

---

## Original Game UX/UI Analysis (from playing cyberhiking.cn)

### Main Menu
- Dark theme with mountain background
- Background music toggle on main menu
- Clean vertical button layout

### Story Intro (between menu and shop)
- Immersive narrative prologue: a burned-out office worker decides to escape to the mountains
- Background image of an urban scene (apartment/office)
- "前往物资商店 →" button at bottom to proceed to shop
- Sets emotional tone before gameplay

### Shop
- Header: Store name + budget (gold coin icon) + weight (current/max)
- 4 category tabs with icons (Core Backpack, Survival Gear, Supplies, Special Gear)
- Active tab has green pill highlight
- Items show: icon/image, name, weight badge, gold price, description
- Quantity controls (- 0 +) on right side
- Bottom: "选好了，出发 ▶" (Ready, depart) button
- One item pre-selected by default (65L backpack qty 1)

### Game View — Main Screen (the KEY difference)
- **Full-screen immersive background** that changes per location
- **Top bar (minimal)**: `DAY 1 | 📍 Location Name` (left) ... `Time | Weather Icon Temp°` (right)
- **Status strip below top bar**: 4 segmented/dashed progress bars in a horizontal row:
  - 🌡️ Core Temperature (green) — value on right
  - ❤️ Energy Reserve (red) — value on right
  - 🧠 Mental Will (purple) — value on right
  - 🍽️ Hunger/Satiety (orange) — value on right
- **Center area**: Narrative text describing current scene or event result
- **Bottom navigation**: 3 icon buttons
  - Left: 👤 Person icon → opens Status Dashboard
  - Center: 🥾 Walking icon (highlighted/white) → Move Forward
  - Right: 🎒 Backpack icon → opens Inventory + Quick Actions

### Game View — Status Dashboard (person icon)
- Scrollable page overlaying the game
- **行程进度 (Journey Progress)**: Route progress bar with colored dots
  - Green dots = resupply/safe points
  - Red dots = dangerous segments
  - Gold circle = current position
  - Shows location name and percentage
- **Info Cards** (2x2 grid):
  - 💰 Money (with gold coin icon)
  - ⛰️ Elevation (in meters/feet)
  - ⚖️ Pack Weight (kg)
  - ⚠️ Status (normal / abnormal)
- **Vital Signs** (full-width bars):
  - Each stat has: icon, label, value, segmented progress bar
  - **Debuff tags** shown as red/orange badges on affected stats (e.g., "肌肉抽筋" = Muscle Cramp)
- **Backpack Items**: Grid of equipped items with icons and quantity badges
- **Journey Gallery**: Collapsible log
- **Settings**: Battery saver mode toggle, background music toggle
- **暂时离开 (Leave Temporarily)** = save & return to menu
- **放弃挑战 (Abandon Challenge)** = quit game (red text)

### Game View — Events
- **Full-screen background image** unique to each event type
- Event card overlay at bottom with:
  - Event title (colored)
  - Narrative description
  - 2-3 choice buttons at bottom
  - **Locked options** (🔒 icon + grayed out) when player lacks required equipment
- After choosing: result text appears with green/red title, narrative description
- **Stat change highlight**: The affected stat bar in the top strip gets an amber/highlight overlay animation

### Game View — Backpack Panel (backpack icon)
- **使用物品 (Use Items)**: Grid of usable items (diary, consumables, etc.)
- **快捷行动 (Quick Actions)**:
  - 🔍 Search for Supplies — search area for resources, costs energy + time
  - ⏱️ Rest in Place — short rest, recover energy + willpower
  - (These replace the standalone "Rest" button from the English version)

### Game Over / Victory
- Similar to current English version (settlement card with stats + LNT grade)

---

## Implementation Plan

### Phase 1: Game View Restructure (HIGHEST PRIORITY)
**Goal**: Transform game view from "status bar + buttons" to immersive full-screen experience

1. **Redesign GameView.jsx layout**:
   - Full-screen background (keep current Unsplash image for now)
   - Minimal top bar: `DAY X | 📍 Location` (left) + `Time | Weather Temp°` (right)
   - Horizontal segmented status strip below top bar (4 stats)
   - Center: narrative text area for location descriptions + event results
   - Bottom: 3 icon buttons (Status / Walk / Backpack)
   - Remove the current text-based action buttons

2. **Create segmented progress bars** (CSS):
   - Dashed/segmented bar style matching original
   - Color-coded: green (temp), red (health/energy), purple (mental), orange (food/hunger)
   - Value displayed on right side of each bar

3. **Add Status Dashboard** (new component or view within GameView):
   - Route progress with colored dots
   - 2x2 info card grid (money, elevation, weight, status)
   - Full vital signs with debuff tags
   - Equipment grid
   - Save/quit options

4. **Add Backpack/Inventory Panel** (new component or view):
   - Show equipped items as icon grid
   - Quick Actions: Search for Supplies, Rest in Place
   - Replace standalone Rest button

### Phase 2: Event System Enhancement
1. **Locked options**: When an event option requires equipment the player doesn't have, show it grayed out with 🔒 icon
2. **Better event card styling**: Larger card, narrative formatting, colored titles
3. **Stat change animation**: Highlight the affected stat bar when values change
4. **Event result display**: Show result inline (not as a separate overlay), with colored title

### Phase 3: Story Intro
1. **Add StoryIntro component**: Narrative page between menu and shop
   - PCT-themed story (e.g., burned-out tech worker planning a PCT thru-hike)
   - Background image (urban → wilderness transition)
   - "Head to the Outfitter →" button at bottom
   - Scrollable text with fade-in paragraphs

### Phase 4: Status/Debuff System
1. **Add debuff tracking** to GameState:
   - Track active debuffs (e.g., "Muscle Cramp", "Dehydration", "Hypothermia")
   - Debuffs shown as tags on affected stat bars
   - Status field: "All Normal" vs "Abnormal" based on active debuffs
2. **Status text** in dashboard changes based on player condition

### Phase 5: Save/Resume
1. **Save game state to localStorage** when player clicks "Leave Temporarily"
2. **Resume option on main menu** when saved game exists
3. **Auto-save** after each move

### Phase 6: Polish & Missing Features
1. **Add water display** — currently missing from game HUD entirely!
2. **Fix cloneGameState** — replace manual property copying with JSON serialize/deserialize or structured clone
3. **Fix event weighting** — use proper weighted random instead of array duplication
4. **Background music toggle** on menu (optional, low priority)
5. **Improve mobile responsiveness** for the new layout
6. **Add location descriptions** to narrative text area

---

## Code Architecture Notes

### Current File Structure
```
src/
├── App.jsx (490 lines) — main orchestration, screen routing
├── App.css — global styles + settlement screens
├── components/
│   ├── MainMenu.jsx (46 lines) + MainMenu.css
│   ├── GameView.jsx (191 lines) + GameView.css — MAIN REDESIGN TARGET
│   └── Shop.jsx (200 lines) + Shop.css
├── game/
│   └── gameState.js (752 lines) — core game logic
└── data/
    ├── route.js — 25 PCT waypoints
    ├── events.js — 24 random events
    ├── equipment.js — 15 gear items
    ├── weather.js — weather system
    └── examQuestions.js — LNT theory exam
```

### Key Issues in Current Code
1. **`cloneGameState()` in App.jsx** (line 43-68): Manually copies each property — will break when new fields are added. Replace with: `const newState = Object.assign(new GameState(), JSON.parse(JSON.stringify(prev)))`
2. **Event weighting** in `gameState.js` (line 422-461): Uses array duplication to weight events. Should use weighted random selection.
3. **Water not displayed** in GameView status bar — only food, money, LNT shown on the right side
4. **No location description** shown during gameplay — `currentLocation.description` exists but isn't rendered
5. **Resupply store** closes after each purchase — event is cleared after handling, forcing player to click Resupply again

### New Components Needed
- `StoryIntro.jsx` — narrative prologue page
- `StatusDashboard.jsx` — full status overview panel (or integrate into GameView as a view mode)
- `BackpackPanel.jsx` — inventory + quick actions panel (or integrate into GameView)
- Possibly refactor GameView into sub-views toggled by bottom nav

### CSS Strategy
- Keep dark theme, enhance with glassmorphism effects
- Segmented bars: use CSS `background` with repeating linear gradients or multiple box-shadows
- Bottom nav: fixed position, icon-based, with active state highlight
- Event cards: larger, more narrative-focused, with locked option styling
