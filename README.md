# 💻 ResumeMaster Client Application

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.x-purple?style=flat-square&logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Confetti-Canvas-orange?style=flat-square" alt="Confetti" />
  <img src="https://img.shields.io/badge/Linter-Oxlint-red?style=flat-square" alt="Oxlint" />
  <img src="https://img.shields.io/badge/Styling-Vanilla_CSS-yellow?style=flat-square&logo=css3" alt="Vanilla CSS" />
</p>

---

This is the official client-side web application for **ResumeMaster**—a premium React 19 workspace built on Vite. It manages state controls, documents, Kanban lanes, swipe interactions, and real-time print styling for standard A4 layouts.

---

## ⚡ Product Features Spotlight

### 📊 Live Interactive Resume Builder
Custom form inputs map directly onto standard printing canvases. Built-in template compiler allows you to cycle through six premium visual themes:
* **🏛️ Elegant Serif**: Classical layout designed for academic, legal, or senior management candidates.
* **🍃 Modern Minimalist**: Balance of typography and whitespace, built for tech builders.
* **🌌 Technical Indigo**: Accented structures to make technical items stand out.
* **📊 Executive Two-Column**: Dense layout that structures experiences and awards in parallel columns.
* **🎨 Creative Gradient**: Vibrant color header details tailored for designers, writers, and marketers.
* **🌲 Clean Emerald**: Formal, polished emerald lines designed to draw attention to core skills.

### 🔥 Swipe-to-Match Job Matcher
Swipable deck representing live tech job listings. The client automatically queries ATS algorithms on the backend to display real-time match percentages.

### 📋 Interactive Kanban Tracker
An interactive Kanban layout dividing applications into:
`Wishlist` ➔ `Applied` ➔ `Interview` ➔ `Offer` ➔ `Rejected`

---

## 📂 Codebase Navigation

* **`/src/components`**: Core application features:
  * [ResumeBuilder.jsx](file:///Users/yasir/Desktop/Yasir/Products/resumemaster/resumemaster-client/src/components/ResumeBuilder.jsx) – Editor input modules and dynamic styling frameworks.
  * [ResumeTemplateSlider.jsx](file:///Users/yasir/Desktop/Yasir/Products/resumemaster/resumemaster-client/src/components/ResumeTemplateSlider.jsx) – Automatic landing page preview slides.
  * [JobMatcher.jsx](file:///Users/yasir/Desktop/Yasir/Products/resumemaster/resumemaster-client/src/components/JobMatcher.jsx) – Job swipes and ATS calculations.
  * [JobTracker.jsx](file:///Users/yasir/Desktop/Yasir/Products/resumemaster/resumemaster-client/src/components/JobTracker.jsx) – Pipelines and confetti-triggered animations.
  * [CareerSuite.jsx](file:///Users/yasir/Desktop/Yasir/Products/resumemaster/resumemaster-client/src/components/CareerSuite.jsx) – Copilot modules (Letters, Interviews, SEO).
* **`/src/index.css`**: Core styling architecture hosting HSL color spaces and media adjustments.

---

## ⚙️ Development Guide

### Prerequisites
Install [Node.js (v18+)](https://nodejs.org).

### Setup and Running
1. Install client dependencies:
   ```bash
   npm install
   ```
2. Configure your environment file (`.env`):
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
3. Run local dev server:
   ```bash
   npm run dev
   ```

### Project Commands
| Command | Action |
| :--- | :--- |
| `npm run dev` | Launch local development server on `http://localhost:5173`. |
| `npm run build` | Compile optimized production bundles to `/dist`. |
| `npm run lint` | Analyze workspace files via `oxlint` rules. |
| `npm run preview` | Serve compiled build folders locally for testing. |

---

## 🌐 Production Deployment

### 1. Host on GitHub Pages
This project has configured scripts targeting automatic deployments:
1. Ensure your git origin remote is correctly linked.
2. Run:
   ```bash
   npm run deploy
   ```
   *This automatically builds the project and pushes the production `/dist` folder to the `gh-pages` branch.*
3. Ensure Pages builds are set to deploy from the `gh-pages` branch in your repository settings.

### 2. Vercel & Netlify hosting
* Set **Root Directory** to `resumemaster-client`.
* Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
* Add `VITE_API_URL` to your production environment configurations.
