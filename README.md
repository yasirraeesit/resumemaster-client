# 💻 ResumeMaster Frontend Client Application

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.x-purple?style=flat-square&logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Confetti-Canvas-orange?style=flat-square" alt="Confetti" />
  <img src="https://img.shields.io/badge/Linter-Oxlint-red?style=flat-square" alt="Oxlint" />
  <img src="https://img.shields.io/badge/Styling-Vanilla_CSS-yellow?style=flat-square&logo=css3" alt="Vanilla CSS" />
</p>

---

This is the React 19 + Vite single-page application (SPA) client workspace for **ResumeMaster**. It houses the resume customizer sandbox, drag-and-drop Kanban application trackers, Tinder job swiper grids, AI Career Copilots, and the HSL design tokens.

---

## 📖 Table of Contents
* [🌟 Detailed Client Features](#-detailed-client-features)
* [🏛️ Resume Customizer & Styles Templates](#️-resume-customizer--styles-templates)
* [📂 Folder Structure Outline](#-folder-structure-outline)
* [⚙️ Development Setup & Local Run](#️-development-setup--local-run)
* [☁️ Hosting and Production Deployments](#️-hosting-and-production-deployments)
* [💖 Support & Donation Options](#-support--donation-options)

---

## 🌟 Detailed Client Features

### 1. Interactive Resume Builder (`src/components/ResumeBuilder.jsx`)
* **Real-time Live-bind**: Form elements instantly update the document sheet preview layout.
* **Dynamic Sections Manager**: Easily add or delete lists under Work Experience, Education rows, Projects, and Skills tags.
* **Auto-Scale margins**: Ensures built sections align correctly on standard A4 formats.
* **PDF Exporter**: Connected to HTML-to-PDF compilation scripts for clean file downloads.

### 2. Swipe-to-Match Job listings (`src/components/JobMatcher.jsx`)
* **Tinder-style gesture cards**: Swipe right/left to match or reject tech roles.
* **Real-time ATS Score**: Compares your resume skills array against targeted job description keyword strings on the backend to display match levels.

### 3. Kanban Application Tracker (`src/components/JobTracker.jsx`)
* **Drag-and-Drop Columns**: Manage job status categories: `Wishlist`, `Applied`, `Interview`, `Offer`, and `Rejected`.
* **State Updates**: Updates active database documents instantly when cards transition between columns.
* **Celebration Layer**: Confetti triggers on state updates transition into `Offer`.

### 4. Career Copilot Suites (`src/components/CareerSuite.jsx`)
* Forms requesting Cover Letters, Technical Interview simulator runs, and LinkedIn headline optimizations.

### 5. Marketing landing pages (`src/components/LandingPage.jsx`)
* Overhauled Light Mode and Dark Mode configurations.
* Contains interactive FAQ accordions, pricing tables, verified customer reviews, and bento marketing layouts.

---

## 🏛️ Resume Customizer & Styles Templates

Users can compile their resumes across 6 premium templates:
* **🏛️ Elegant Serif** – Traditional template utilizing elegant serif fonts (e.g. Garamond/Georgia) with classic spacing.
* **🍃 Modern Minimalist** – Minimal tech design using sans-serif fonts, spacious layouts, and clean alignments.
* **🌌 Technical Indigo** – Sharp modern grid featuring deep indigo dividers to highlight programming items.
* **📊 Executive Two-Column** – Dense, two-column layout aligning personal metadata alongside experiences in parallel.
* **🎨 Creative Gradient** – Modern layout accented by a vibrant gradient top-bar for portfolios.
* **🌲 Clean Emerald** – Professional theme using balanced emerald accent lines and headers.

---

## 📂 Folder Structure Outline

```text
resumemaster-client/
├── src/
│   ├── components/            # UI Components
│   │   ├── ResumeBuilder.jsx          # Live builder & template compiler
│   │   ├── ResumeTemplateSlider.jsx   # Carousel slide mockups for Landing Page
│   │   ├── JobMatcher.jsx             # Swipe interface & ATS calculations
│   │   ├── JobTracker.jsx             # Drag-and-drop Kanban pipeline board
│   │   ├── CareerSuite.jsx            # Cover Letter, Interview & SEO panels
│   │   ├── LandingPage.jsx            # Landing Page sections & tables
│   │   ├── LoginPage.jsx              # User authorization portals
│   │   ├── RegisterPage.jsx           # User sign-ups
│   │   ├── ProfilePage.jsx            # Dashboard profiles
│   │   └── SettingsPage.jsx           # User account variables
│   ├── App.jsx                # Main workspace application shell
│   ├── index.css              # Glassmorphic and responsive styling system
│   └── main.jsx               # React DOM initialization
├── package.json               # Package commands and dependencies
└── vite.config.js             # Vite compilers and paths configs
```

---

## ⚙️ Development Setup & Local Run

### Setup Steps
1. Navigate to the client directory:
   ```bash
   cd resumemaster-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your local environment configurations by creating a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
4. Start your Vite local server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`.

### Command Dictionary
* **`npm run dev`**: Spin up development workspace.
* **`npm run build`**: Compile production files to `/dist`.
* **`npm run lint`**: Inspect source code via `oxlint` rules.
* **`npm run preview`**: Review the production bundle locally.

---

## ☁️ Hosting and Production Deployments

### 1. Host on GitHub Pages (Built-in Script)
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

---

## 💖 Support & Donation Options

ResumeMaster is an open-source product created to help candidates build resumes. Support its continuous development!

<p align="center">
  <a href="https://www.buymeacoffee.com/yasirraeesit" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" />
  </a>
</p>

* **⭐ Star the repo**: Help us grow our developer community.
* **☕ Sponsor a developer**: Send a one-time support contribution via [Buy Me A Coffee](https://www.buymeacoffee.com/yasirraeesit).
* **🤝 Partner / Sponsor**: If your company benefits from ResumeMaster or wants to sponsor features, get in touch to get your logo placed right here!
