# Workout "By Prasad Rawas"

A progressive, mobile-first Progressive Web App (PWA) built specifically for tracking a **7-day dual-session** (Morning Gym Strength + Evening Home Rehab/Mobility) training program following a **Right Total Hip Replacement (THR)**.

---

## ⚡ Key Highlights & Features

- **📱 Mobile-First PWA (Installable on iOS & Android)**:
  - Add to Home Screen as a standalone app.
  - Full offline capability with service worker precaching (functions smoothly in gyms without cell signal).
  - Native feel: 44px+ touch targets, prevents iOS viewport auto-zoom, and safe-area notch / home-bar insets.
- **🏋️ 7-Day Dual-Session Architecture**:
  - **Morning Gym**: Strength training (legs, chest, back, shoulders, arms, core) + 6-step interactive warm-up routine.
  - **Evening Home**: Targeted resistance bands, pelvic tilt control, gentle QL stretching, and mobility.
- **⏱️ Integrated Rest Timer with Audio & Haptics**:
  - Quick-start rest countdowns (60s, 90s, 120s, 150s) with +15s / -15s adjustments.
  - Floating circular progress dock that expands into a bottom-sheet.
  - Web Audio API synthesizer chimes and haptic vibrations when rest is complete.
- **🛡️ Right Hip Pinch & Sensation Monitor**:
  - Per-exercise sensation logger: *🟢 Pain-Free*, *🟡 Mild Tension*, *🔴 Sharp Front Pinch ⚠️*.
  - Immediate clinical alerts reminding you never to push through an anterior pinch.
  - 24-hour response monitor & 0–10 comfort rating on session completion.
- **📖 12-Week Progression & Clinical Guidance Drawer**:
  - Full roadmap (Weeks 1–2 Control, Weeks 3–4 Strength, Weeks 5–8 Functional Progression, Weeks 9–12 Reassessment).
  - Precautions & red flags (no forced figure-4/rotation, RIR 3–4, level pelvis cues).
- **💾 100% LocalStorage Persistence & Backup**:
  - All logs, weights, reps, and completed sets save in real-time.
  - **JSON Export / Import** for easy backups or transferring data across devices.
  - Week reset button to uncheck sets for a new week while archiving history logs.

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Vite dev server
npm run dev

# 3. Build for production (outputs to /dist)
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🌐 Deploying to GitHub Pages

This repository is preconfigured for GitHub Pages:

### Method A: Automated via GitHub Actions (Recommended)
1. Push your repository to GitHub (`main` branch).
2. On GitHub, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The included workflow `.github/workflows/deploy.yml` will automatically build and deploy the app!

### Method B: Manual Static Hosting
- Run `npm run build`
- Deploy the contents of the `dist/` directory to any static host or the `gh-pages` branch. The relative base `./` ensures assets resolve properly under any repository subpath.
