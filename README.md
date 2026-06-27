# 💻 ResumeMaster Frontend Client

**ResumeMaster is a 100% free, open-source project. Anyone can use this workspace to build professional resumes, track applications, and make their resume builder live!**

This is the React + Vite frontend application for **ResumeMaster**, the next-generation AI-powered resume builder and career tracker workspace.

---

## 🛠️ Tech Stack & Key Libraries

* **Core**: React 19, Vite (Fast HMR & build speeds)
* **Icons**: [Lucide React](https://lucide.dev)
* **Effects**: `canvas-confetti` (for celebrating job tracking updates and resume completion achievements)
* **Styling**: Modern, responsive Vanilla CSS using light/dark HSL-tailored variables, frosted glass boundaries, bento layouts, and fluid transitions.
* **Code Linter**: `oxlint` for lightning-fast javascript rules checking.

---

## 🚀 Key Modules & Detailed Features

* **⚡ Interactive Resume Builder (`src/components/ResumeBuilder.jsx`)**:
  * Real-time sidebar entry system mapping text input directly onto styled layouts.
  * Instant document sheet rendering with responsive margins and fonts.
  * 6 selectable templates:
    * `Elegant Serif`: For senior or academic roles requiring classical typography.
    * `Modern Minimalist`: A clean, high-space developer and designer aesthetic.
    * `Technical Indigo`: Accented layout designed for technical engineers and analysts.
    * `Executive Two-Column`: Densely organized two-column grid.
    * `Creative Gradient`: Splash of colors tailored for creators and portfolios.
    * `Clean Emerald`: Balanced nature theme with sharp alignment.
* **🎭 Landing Page Slideshow (`src/components/ResumeTemplateSlider.jsx`)**:
  * Automatic transitions displaying 6 mock full-length resumes.
  * Integrated zoom sliders and interactive toolbar layouts.
* **🔥 Swipe-to-Match Job cards (`src/components/JobMatcher.jsx`)**:
  * Swipe right/left animations mapping to job databases.
  * ATS match percentage indicator highlighting matched/missing keywords on the fly.
* **📋 Kanban Job Tracker Board (`src/components/JobTracker.jsx`)**:
  * Pipelines dividing job roles into: `Wishlist`, `Applied`, `Interview`, `Offer`, and `Rejected`.
  * Click actions to update cards, transition states, and confetti-powered celebration states.
* **🤖 Career copilot tools (`src/components/CareerSuite.jsx`)**:
  * Generate custom cover letters, LinkedIn optimizations, and test technical questions.
* **🎨 Styling Architecture (`src/index.css`)**:
  * Comprehensive light/dark theme color variable schemes.
  * Responsive queries adapting to screen viewports.

---

## 🏃 Local Setup & Commands

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed.

### 1. Installation
Navigate to this directory and install package dependencies:
```bash
npm install
```

### 2. Environment Setup
Create a file named `.env` in this directory to specify your backend API endpoint:
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Available Scripts
* **Run in Development Mode**:
  ```bash
  npm run dev
  ```
  Launches the Vite dev server locally at `http://localhost:5173`.
* **Build for Production**:
  ```bash
  npm run build
  ```
  Compiles the application into static files under the `/dist` folder, optimized and ready for deployment.
* **Code Linting**:
  ```bash
  npm run lint
  ```
  Runs `oxlint` to analyze your workspace javascript files and suggest cleanups.
* **Preview Production Build**:
  ```bash
  npm run preview
  ```
  Serves the locally built `dist` folder to preview how it behaves in production.

---

## ☁️ Deployment (Making it Live)

You can host this React application for free on **GitHub Pages**, **Vercel**, or **Netlify**.

### 1. GitHub Pages (Automated Deploy Script)
Since this repository is integrated with `gh-pages`, you can publish it live directly from your terminal:
1. Ensure your repository remote points to GitHub.
2. Run the deployment script:
   ```bash
   npm run deploy
   ```
   This command automatically builds the project for production (with the correct relative asset base path) and pushes the compilation bundle to the `gh-pages` branch.
3. In your GitHub repository settings under **Pages**, ensure the build source is set to deploy from the `gh-pages` branch.
4. Your application will be live at `https://<your-username>.github.io/resumemaster-client/`.

### 2. Vercel / Netlify Setup
If hosting via Vercel or Netlify:
1. Set the root directory of your site deployment to `resumemaster-client`.
2. Configure build settings:
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Add the production environment variable:
   * `VITE_API_URL`: `https://your-deployed-backend-api.com/api`

---

## 💖 Support, Donations & Sponsors

If ResumeMaster helped you build your resume or track jobs, please support this open-source project:
* **⭐ Star this Repository**: Help other developers discover ResumeMaster by starring this project on GitHub.
* **☕ Buy Me A Coffee**: Support development with a one-time donation via [Buy Me A Coffee](https://www.buymeacoffee.com/yasirraeesit).
* **🤝 Sponsors**: Interested in corporate sponsorship to showcase your logo here? Reach out via [email/contact details] or sponsor on GitHub.


