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

## 🚀 Key Modules & Components

* **`src/components/ResumeBuilder.jsx`**: A powerful resume customizer that maps workspace entries to live PDF previews. Includes customizable style templates (`Elegant Serif`, `Modern Minimalist`, `Technical Indigo`, `Executive Two-Column`, `Creative Gradient`, `Clean Emerald`).
* **`src/components/ResumeTemplateSlider.jsx`**: Dynamic slideshow carousel rendering professional layouts on the landing page hero panel.
* **`src/components/JobMatcher.jsx`**: Tinder-inspired card swiper interface calculating ATS keyword match thresholds.
* **`src/components/JobTracker.jsx`**: Interactive drag-and-drop styled Kanban board columns tracking active applications (`Wishlist`, `Applied`, `Interview`, `Offer`, `Rejected`).
* **`src/components/CareerSuite.jsx`**: Career copilot panel managing AI Cover Letter drafts, LinkedIn profile optimizations, and interview simulation questions.

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

