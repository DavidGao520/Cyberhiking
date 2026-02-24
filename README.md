# 🥾 Cyber Hiking — Pacific Crest Trail Survival Simulation

> *Feel the greatness of nature. Respect the fragility of life. Leave No Trace.*

**[Play Now →](https://cyberhiking.vercel.app)**

Cyber Hiking is a browser-based survival simulation game set on the **Pacific Crest Trail (PCT)** — 2,652 miles of wilderness stretching from the Mexican border to Canada. Manage your resources, brave dynamic weather, make life-or-death decisions, and learn to protect the wilderness through the **Leave No Trace** philosophy.

![Vite](https://img.shields.io/badge/Vite-4.5-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🗺️ Realistic PCT Route
- 30+ route nodes based on real PCT landmarks — from Campo to Manning Park
- Resupply stations at actual trail towns (Kennedy Meadows, Mammoth Lakes, Cascade Locks…)
- Key milestones like Forester Pass (13,153 ft) with altitude-based challenges

### 🌦️ Dynamic Weather System
- Procedurally generated weather: blizzards, thunderstorms, extreme heat, fog, and more
- Weather directly impacts energy cost, health, and mental state
- Gear like raincoats, goggles, and solar chargers mitigate weather penalties

### 🎒 Equipment & Gear System
- 12+ items across Gear, Electronics, and Supplies categories
- Equipment actively affects gameplay — GPS reduces getting-lost risk, satellite phone enables emergency rescue, solar charger boosts morale
- Weight management: every ounce matters on a thru-hike

### ⚡ Event System with Gear Synergy
- 20+ random events inspired by real trail scenarios — wildlife encounters, river crossings, equipment failures, fellow hiker interactions
- Your gear influences event outcomes: success boosts and damage reduction based on what you carry
- Every choice has consequences for your health, energy, and LNT score

### 🌿 Leave No Trace (LNT) Scoring
- Every decision is tracked — campfire placement, waste disposal, wildlife interaction, trail etiquette
- Final LNT grade (A+ to F) reflects your environmental impact
- Learn the 7 LNT principles through gameplay, not lectures

### 📝 Theory Exam
- 10-question quiz covering LNT principles and PCT safety knowledge
- Pass the exam to earn a gameplay bonus (starting LNT boost)
- Educational content sourced from real wilderness ethics guidelines

### 📊 Player Profile & History
- Persistent profile tracking total games, completions, deaths, and best records
- Game history with distance, LNT grade, and completion time
- All data stored locally in your browser

### 💀 Survival Mechanics
- Forced march system: low energy doesn't block you — it costs health
- Satellite phone emergency rescue as a last resort
- Multiple death conditions: dehydration, starvation, exhaustion, exposure
- Realistic resource depletion based on distance, weather, and altitude

---

## 🚀 Getting Started

### Play Online

**https://cyberhiking.vercel.app**

### Run Locally

```bash
git clone https://github.com/DavidGao520/Cyberhiking.git
cd Cyberhiking
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite 4.5 |
| Language | JavaScript (JSX) |
| State Management | React useState + Class-based GameState |
| Persistence | localStorage |
| Deployment | Vercel |
| Styling | Vanilla CSS with responsive design |

---

## 🎯 Design Philosophy

Cyber Hiking is built with a dual mission:

1. **Feel the wilderness** — Through realistic simulation of weather, terrain, and survival mechanics, players experience the raw power and beauty of one of America's greatest trails.

2. **Protect the wilderness** — The LNT scoring system weaves environmental ethics into every gameplay decision, cultivating awareness that the outdoors is not ours to conquer — it is ours to protect.

This game is not meant to encourage reckless adventure. It aims to help players understand the power of nature and the fragility of human life, inspiring them to participate in outdoor activities scientifically, safely, and responsibly.

---

## 📁 Project Structure

```
src/
├── App.jsx / App.css          # Main app, screens, profile, exam
├── main.jsx / index.css       # Entry point
├── components/
│   ├── MainMenu.jsx/.css      # Title screen & navigation
│   ├── GameView.jsx/.css      # Gameplay UI, progress bar, log
│   └── Shop.jsx/.css          # Outfitter / equipment shop
├── data/
│   ├── route.js               # PCT route nodes & landmarks
│   ├── events.js              # Random event definitions
│   ├── equipment.js           # Gear, electronics, supplies
│   ├── weather.js             # Weather patterns & effects
│   └── examQuestions.js       # LNT theory exam questions
└── game/
    └── gameState.js           # Core game logic & state machine
```

---

## 👤 Author

**David Gao** — Design, Development & Game Design

- GitHub: [@DavidGao520](https://github.com/DavidGao520)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <em>"The wilderness is not a place to visit. It is home." — Gary Snyder</em>
</p>
