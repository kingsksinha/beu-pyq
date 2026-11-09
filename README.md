# BEU PYQ — Modern Academic Resource Platform

A complete, high-performance web recreation and modern redesign of the **Bihar Engineering University (BEU) Previous Year Question Papers (PYQ)** archive.

Built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS v4**, **KaTeX**, and **Lucide React**, inspired by the design aesthetics of **Linear**, **Vercel**, and **Notion**.

---

## 🌟 Key Features & Improvements

### 1. Complete Authentic Dataset (100% Preserved)
- **363 authentic question papers** covering **4 semesters (Sem 1 to 4)** across **92 engineering subjects**.
- Spans **14 examination years (2012–2025)**.
- **8,828 extracted sub-questions** and **3,263 core question blocks** preserved with instructions, marks, and formulas.
- Zero fabricated data: all data is normalized directly from the original archive.

### 2. High-Performance Two-Tier Data Architecture
- **Catalog Index (`papers_catalog.json` - ~140 KB)**: Enables instant client-side multi-filtering, sorting, global search suggestions, and dashboard metrics with zero latency.
- **On-Demand Chunks (`data/papers/[id].json`)**: Full question bodies, instructions, sub-questions, and MCQ choices are loaded dynamically when a paper is viewed (~15–25 KB per paper), completely eliminating the original website's 3.2 MB DOM bottleneck.

### 3. Advanced Filtering & Real-Time Sorting Engine
- **Simultaneous Multi-Filtering**:
  - Filter by **Semester** (1, 2, 3, 4)
  - Filter by **Subject** (searchable among 92 subjects)
  - Filter by **Exam Year** (2012 to 2025)
  - Filter by **Exam Code** (e.g. `100201`, `ESC-202`)
  - Filter by **Question Type** (Contains MCQs only)
  - Filter by **High-Yield Only** (Questions repeated $\ge 3$ times)
- **Multi-Parameter Sorting**:
  - Newest examination year first (2025 → 2012)
  - Oldest examination year first (2012 → 2025)
  - Subject Name (A → Z and Z → A)
  - Semester (Ascending and Descending)
  - Question items count (Most questions / Least questions)
- **Active Filter Chips**: Removable with one click + "Clear all filters" button.
- **URL & State Synchronization**: Filter and sort parameters are synced with URL search params (`?semester=1&year=2024&sort=newest`), preserving state when sharing links or pressing the browser back button.

### 4. Fast Global Search (`Ctrl + K` / `Cmd + K`)
- Instant search modal accessible anywhere via keyboard shortcut or topbar.
- Case-insensitive matching across subject names, subject codes, exam codes, years, and semesters.
- Categorized live search suggestions (Subjects vs Question Papers).
- Full keyboard navigation (Arrow Up / Down + Enter to open + Escape to close).
- Search query text highlighting.
- Search history persisted in `localStorage`.

### 5. Dedicated Question Paper Detail View
- Official Bihar Engineering University header with duration, paper code, and full marks.
- Examination instructions accordion.
- **KaTeX Vector Math Rendering**: Equations (e.g. $\omega_c = 2\pi \times 10^5$, $\int$, $\lambda$, Schrödinger equations) render with instant, crisp vector math.
- **Star Repetition Badges**:
  - 1★: Standard syllabus question
  - 2★: Repeated 2x across BEU exams
  - 3★: Repeated 3x across BEU exams
  - 4★: High-yield repeat question
  - 5★: Very high-yield repeat question
  - 6+★: Super repeat / critical exam question
- **University A4 Print / PDF Export**: Browser-native print stylesheet formatted to standard A4 exam sheets.
- **Paper Actions**: One-click Bookmark toggle, Copy shareable link with feedback, and jump to Related Papers.

### 6. Interactive Question Practice Mode
- Focused, distraction-free flashcard and step-by-step revision interface.
- Previous / Next buttons and quick-jump question navigator.
- "Mark for Revision" flag and "Bookmark Question" button.
- Progress bar and completion percentage.
- Interactive MCQ practice option selector.
- High-yield filter to practice only $\ge 3$★ repeated questions.

### 7. User Persistence & Customization
- **Theme Engine**: Seamless toggle between Dark Mode and Light Mode with system preference detection.
- **Bookmarks Library**: Separate tabs for saved question papers and saved individual questions.
- **Viewing History**: Timestamped history of recently opened papers with one-click clear.

---

## 📊 Original vs New Platform Comparison

| Feature / Aspect | Reference Original Repo | Modern BEU PYQ Platform |
|---|---|---|
| **Architecture** | Monolithic 3.2 MB HTML (80,244 lines) in single DOM | Vite + React 19 + TypeScript with on-demand chunking |
| **Initial Bundle Size** | ~3.2 MB (slow on mobile) | ~101 KB main JS (19 KB gzip) + on-demand 20 KB chunks |
| **Math Rendering** | Heavy MathJax 3 with CDN fallback | Ultra-fast KaTeX vector rendering |
| **Search** | Rudimentary single substring match | Global `Ctrl+K` modal with suggestions, history, & highlight |
| **Filtering** | 1 single subject dropdown | Multi-filter: Semester, Subject, Year, Code, MCQs, High-yield |
| **Sorting** | None | 8 sorting modes operating on underlying dataset |
| **State Persistence** | None (state lost on page reload) | URL parameters sync + LocalStorage persistence |
| **Bookmarks** | None | Saved papers + saved questions library |
| **History** | None | Recently viewed papers history log |
| **Practice Mode** | None | Question-by-question practice interface with progress |
| **Theme** | Fixed dark green/cyan scheme | Clean Linear/Vercel Dark Mode + Light Mode |
| **Mobile UX** | Narrow container with menu button | Responsive mobile drawer + sticky bottom navigation bar |
| **Print / PDF** | Basic inline script | University-standard A4 print stylesheet |

---

## 📁 Project Folder Structure

```
beu-pyq-modern/
├── public/
│   ├── favicon.svg
│   ├── fonts/                       # Ubuntu font files
│   └── data/
│       ├── papers_catalog.json       # Metadata for all 363 papers (~140 KB)
│       ├── subjects.json             # 92 subjects catalog
│       ├── stats.json                # Precomputed platform statistics
│       └── papers/                   # 363 individual paper JSON files
├── scripts/
│   ├── extract_data.cjs             # Data extraction from reference repo
│   └── verify_app.cjs               # Automated production verification
├── src/
│   ├── types/
│   │   └── paper.ts                 # TypeScript interfaces
│   ├── services/
│   │   ├── dataService.ts           # Cached data loader, filter, & sorter
│   │   ├── storageService.ts        # LocalStorage persistence
│   │   └── searchService.ts         # Fuzzy/keyword search engine
│   ├── context/
│   │   └── ThemeContext.tsx         # Dark/Light theme provider
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx        # Main shell
│   │   │   ├── Sidebar.tsx          # Linear-style desktop sidebar
│   │   │   ├── Topbar.tsx           # Search bar & theme toggle
│   │   │   └── MobileNav.tsx        # Mobile drawer & bottom bar
│   │   ├── ui/
│   │   │   ├── MathText.tsx         # KaTeX LaTeX formula renderer
│   │   │   └── StarFrequency.tsx    # Repetition frequency badge
│   │   ├── search/
│   │   │   ├── SearchModal.tsx      # Ctrl+K search dialog
│   │   │   └── SearchHighlight.tsx  # Text highlight component
│   │   ├── filters/
│   │   │   ├── FilterBar.tsx        # Comprehensive filter controls
│   │   │   ├── SortDropdown.tsx     # 8-mode sorter
│   │   │   └── ActiveFilterChips.tsx# Removable active filter tags
│   │   └── paper/
│   │       ├── PaperCard.tsx        # Paper card component
│   │       ├── PaperHeader.tsx      # University exam header
│   │       ├── QuestionItem.tsx     # Question block with formulas & options
│   │       └── FrequencyLegendModal.tsx # Star rating guide modal
│   ├── pages/
│   │   ├── HomePage.tsx             # Dashboard with stats & launchpads
│   │   ├── PapersExplorerPage.tsx   # All Question Papers with multi-filter
│   │   ├── SemesterDirectoryPage.tsx# Semester-wise directory (Sem 1–4)
│   │   ├── SubjectDirectoryPage.tsx # 92 subjects directory
│   │   ├── YearArchivePage.tsx      # 2012–2025 timeline archive
│   │   ├── PaperDetailPage.tsx      # Dedicated paper viewer + A4 PDF
│   │   ├── PracticeModePage.tsx     # Question practice interface
│   │   ├── BookmarksPage.tsx        # Saved papers & questions
│   │   └── HistoryPage.tsx          # Viewing history
│   ├── App.tsx                      # HashRouter route configuration
│   ├── main.tsx                     # Entry point with KaTeX CSS
│   └── index.css                    # Tailwind CSS v4 & A4 Print CSS
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ (tested on Node 24)
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build & Preview
```bash
npm run build
npm run preview
```

### 4. Run Automated Verification Tests
```bash
npm run verify
```

---

## ☁️ Deployment Instructions for Vercel

The application is pre-configured for zero-config Vercel deployment via `vercel.json`:

### Option A: Via Vercel CLI
```bash
npm install -g vercel
vercel
vercel --prod
```

### Option B: Via GitHub Integration
1. Push `beu-pyq-modern` to your GitHub repository.
2. In the [Vercel Dashboard](https://vercel.com/new), import your repository.
3. Vercel automatically detects Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your BEU PYQ platform will be live in seconds!
