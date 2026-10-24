# UniAssist AI — Project System & Technical Information

> **Intelligent Dual-Path University Assistant & Zero-Trust Portal Companion**  
> **Institution:** GD Goenka University (GDGU) — School of Engineering and Sciences  
> **Course:** EGR4501 — Minor Project (Phase 1)  
> **Academic Session:** 2026–2027 (Odd Semester)  
> **System Architecture Lead:** Sarthak Singh

---

## 1. Executive Summary

**UniAssist AI** is an enterprise-grade, student-centric academic assistant engineered to eliminate portal navigation friction, interpret complex university regulations, and extract real-time personal academic telemetry with zero credential retention.

Unlike naive scrapers or cloud-tethered bots that consume thousands of tokens per query and risk credential theft, UniAssist AI implements an **intelligent dual-path routing engine**:
1. **Path A (Knowledge Engine):** In-browser BM25 and vector semantic search across official university policy handbooks, returning clause-cited answers.
2. **Path B (Live Telemetry Engine):** Plaid-style zero-trust browser companion that selectively extracts authorized leaf DOM nodes directly from active DigiCampus sessions.

---

## 2. Core Systems Architecture

```
+-----------------------------------------------------------------------------------+
|                                  USER INTERFACE                                   |
|   React 19 + TypeScript + Custom Glassmorphism UI (Header, ChatPanel, Sandbox)    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         INTENT ROUTER & POLICY GUARD                              |
|           Regex & Keyword Classification | Injection Defense | Read-Only Barrier  |
+-----------------------------------------------------------------------------------+
                   |                                           |
                   v (Policy / Regulations)                    v (Personal Telemetry)
+--------------------------------------+   +----------------------------------------+
|          PATH A: KNOWLEDGE           |   |           PATH B: TELEMETRY            |
|       Local Edge-RAG Engine          |   |      Targeted DigiCampus Companion     |
|  - Tokenized BM25 Search             |   |  - Plaid-Style Browser Tab Sync        |
|  - Cosine Vector Similarity          |   |  - Manifest V3 Extension Bridge        |
|  - Verifiable Clause Citations       |   |  - Targeted DOM Leaf Node Extractor    |
|  - GDGU Regulatory Corpus            |   |  - Static Hash Route Segment Registry  |
+--------------------------------------+   +----------------------------------------+
                   \                                           /
                    \                                         /
                     v                                       v
+-----------------------------------------------------------------------------------+
|                              ANSWER COMPOSER & LLM                                |
|    Multi-Provider LLM Service (OpenRouter / DeepSeek / Gemini / OpenAI) or        |
|    Local In-Browser Deterministic Fallback (Zero Token Cost, Offline Capable)     |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           STRUCTURED OUTPUT & AUDIT                               |
|   Card-based UI with Source Badges, "View in DigiCampus" Links, & Ephemeral Logs  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Technology Stack & Systems Used

### 3.1 Frontend & Application Core
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `19.0.0` | Declarative, component-based user interface |
| **TypeScript** | `5.7.2` | Strict compile-time type safety across data contracts and adapters |
| **Vite** | `6.2.0` | Ultra-fast HMR development server and production bundler |
| **Lucide React** | `1.16.0` | Modern, clean vector iconography |
| **Vanilla CSS / CSS Modules** | Modern CSS3 | Custom high-performance design system with glassmorphism, responsive grids, and zero Tailwind runtime overhead |

### 3.2 AI & Language Models (LLM Service)
The assistant supports dynamic provider switching via `src/services/llmService.ts`:
- **Default (Free / Offline):** In-Browser Edge RAG & Rule Engine (no API key required).
- **OpenRouter API:**
  - `deepseek/deepseek-chat` (DeepSeek-V3) — High-efficiency general reasoning
  - `deepseek/deepseek-r1` — Advanced mathematical and chain-of-thought logic
  - `qwen/qwen-2.5-72b-instruct` — Multilingual and nuanced query routing
  - `anthropic/claude-3.5-sonnet` — High-precision academic composition
  - `meta-llama/llama-3.3-70b-instruct` — Open-weights foundational LLM
- **Google Gemini API:** `gemini-1.5-flash`, `gemini-1.5-pro`
- **OpenAI API:** `gpt-4o`, `gpt-4o-mini`

### 3.3 Zero-Trust Browser Companion & Live Bridge
- **Plaid-Style Zero-Trust Architecture:** Operates without ever capturing, storing, or asking for student passwords. Connects via one-click active browser tab synchronization.
- **Chrome / Edge Extension (Manifest V3):**
  - Path: `extension/` (`manifest.json`, `content-script.js`, `popup.html`)
  - Permissions: `activeTab`, `storage`
  - Host Permissions: `https://gdgu.digiicampus.com/*`, `https://*.digiicampus.com/*`
- **Vite Live Bridge Dev Server Middleware:**
  - Embedded in `vite.config.ts` under `/api/bridge/*`
  - Endpoints:
    - `GET /api/bridge/status` — Reports connection status, active URL, and student metadata
    - `POST /api/bridge/heartbeat` — Ingests live telemetry from companion extension
    - `POST /api/bridge/command` — Dispatches targeted extraction commands to tab
    - `POST /api/bridge/command-result` — Returns targeted DOM scrape results

### 3.4 Regulatory Knowledge Base (Path A)
- **Local RAG Service:** `src/services/knowledgeService.ts` & `src/services/dynamicRAGEngine.ts`
- **Scoring Mechanisms:**
  - In-browser BM25 term frequency / inverse document frequency scoring
  - Cosine semantic vector similarity matching
  - Strict minimum relevance thresholding (filters out ambiguous documents)
- **Authoritative Handbooks Covered:**
  - Attendance Regulations (75% mandatory, 60% medical/sports condonation limits)
  - CBCS Examination & Grading Framework (10-point scale: A+, A, B+, B, C, P, F)
  - Academic Malpractice & UFM Penalties (Category A to D)
  - Course Withdrawal & Re-appear Guidelines
  - Fee Payment Schedules & Refund Tier Deductions
  - Hostel Curfews, Discipline, and Leave Sanctions

### 3.5 Targeted SiteMap & Leaf Extractor (Path B)
- **SiteMap Registry:** `src/data/digicampusSiteMap.ts`
- Routes queries directly to explicit hash-route segments rather than spidering:
  - `EXAMINATIONS`: `#/examinationManagement/studentExamRecords/:id`
  - `ATTENDANCE_TIMETABLE`: `#/profile/:id/attendance`
  - `FEES_PAYMENTS`: `#/feeManagement/studentFeeLedger`
  - `CLASSROOM_TIMETABLE`: `#/classroom`
  - `COMMUNITY_FEED`: `#/community/feed`
  - `ACADEMIC_CALENDAR`: `#/academicCalendar/events`
- **Leaf DOM Extraction:** Extracts strictly scoped values (`classesHeld`, `classesAttended`, `sgpa`, `cgpa`, `courseGrades`) and discards surrounding navigation and styling DOM nodes.

---

## 4. Project Directory Structure

```
UniAssistAI/
├── extension/                     # Manifest V3 Chrome/Edge Browser Companion
│   ├── manifest.json              # Extension permissions and host patterns
│   ├── content-script.js          # In-page leaf extractor & bridge messenger
│   └── popup.html                 # Companion status popup
├── src/
│   ├── components/                # Modular React UI Components
│   │   ├── AuditLogsModal.tsx     # Operational audit viewer (zero PII)
│   │   ├── ChatPanel.tsx          # Main conversational interface
│   │   ├── DigiCampusSandbox.tsx  # Interactive DigiCampus telemetry simulator
│   │   ├── DocumentUploadModal.tsx# Dynamic campus PDF/document ingestion
│   │   ├── EvaluationModal.tsx    # 15-test automated benchmark runner
│   │   ├── Header.tsx             # System status, breadcrumb, and controls
│   │   ├── MessageCard.tsx        # Structured message cards with citations
│   │   ├── PrivacyNoticeModal.tsx # Zero-trust credential disclosure modal
│   │   ├── SettingsModal.tsx      # LLM provider & API key configuration
│   │   ├── Sidebar.tsx            # Navigation, quick prompts, student card
│   │   ├── SiteMapModal.tsx       # Interactive DigiCampus hash route explorer
│   │   └── SiteMapSegmentDock.tsx # Floating quick-jump segment selector
│   ├── data/
│   │   ├── campusPolicies.ts      # Verifiable GDGU policy database
│   │   ├── digicampusSiteMap.ts   # Authoritative DOM selector & segment map
│   │   └── mockPortalData.ts      # Verified student records & fallback fixtures
│   ├── services/
│   │   ├── answerComposer.ts      # Multi-source answer synthesis engine
│   │   ├── auditLogger.ts         # Ephemeral session event logger
│   │   ├── dynamicRAGEngine.ts    # In-memory document indexing & RAG
│   │   ├── intentRouter.ts        # Dual-path query classifier
│   │   ├── knowledgeService.ts    # Policy search and chunk retrieval
│   │   ├── livePortalBridge.ts    # Plaid-style tab sync & data consumer
│   │   ├── llmService.ts          # OpenRouter/Gemini/OpenAI connector
│   │   ├── policyGuard.ts         # Safety, read-only barrier, & refusals
│   │   └── portalConnector.ts     # Portal session state manager
│   ├── tests/
│   │   └── evaluationSuite.ts     # 15-scenario rigorous test benchmark
│   ├── types/
│   │   └── index.ts               # Complete TypeScript schemas & interfaces
│   ├── App.tsx                    # Root application component
│   ├── index.css                  # Custom styling and glassmorphism tokens
│   └── main.tsx                   # React root entry point
├── info.md                        # Project systems & technical information (this file)
├── package.json                   # Project scripts and dependencies
├── phase-1-prd.md                 # Complete Phase 1 Product Requirements Document
├── phase-1-evaluation-report.md   # Benchmark verification & metrics report
├── README.md                      # Academic documentation, deliverable packs, & guides
└── vite.config.ts                 # Build configuration & live bridge middleware
```

---

## 5. Security & Privacy Guarantees

| Concern | Conventional Chatbots / Scrapers | UniAssist AI Implementation |
| :--- | :--- | :--- |
| **Credential Storage** | Stores roll number & passwords in DB | **Zero Credential Retention:** Never asks for or stores passwords |
| **Session Capture** | Steals session cookies & tokens | **Ephemeral Bridge:** Relies on student's existing, authenticated browser session |
| **DOM Parsing** | Full HTML scraped & uploaded to cloud | **Leaf Node Only:** Only requested numerical/status values are read |
| **Write Actions** | Unbounded automation risks account tampering | **Strict Read-Only Barrier:** Blocks fee payment, course changes, and profile edits |
| **Audit Logs** | Stores chat queries and answers | **Zero PII Logging:** Diagnostic events log only event codes, route names, and latency |

---

## 6. Key Performance Indicators & Benchmark Results

- **Routing Accuracy:** `100%` (15/15 test scenarios passed in `evaluationSuite.ts`)
- **Token Efficiency:** `93.7%` average token savings vs full-page scraping
- **Response Latency:** `< 850ms` (In-Browser Edge RAG mode)
- **Data Integrity:** `100%` alignment with official GDGU DigiCampus transcript records (Semesters 1 through 6)
- **Fail-Closed Safety:** `100%` refusal rate on malicious, out-of-scope, or write-action requests

---

## 7. Developer Quick Start

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **Package Manager:** `npm` (v9+)
- **Supported Browser:** Google Chrome, Microsoft Edge, or Brave (supporting MV3 extensions)

### Installation & Execution
```bash
# 1. Clone the repository
git clone https://github.com/sarthaksingh02-sudo/UniAssist--AI.git
cd UniAssist--AI

# 2. Install dependencies
npm install

# 3. Launch the Vite development server & Live Bridge
npm run dev
# Running on http://localhost:5173

# 4. Verify TypeScript compilation and build
npm run build
```

### Loading the Browser Companion Extension
1. Open Chrome/Edge and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked** and select the `extension/` directory from this project.
4. Open `https://gdgu.digiicampus.com` in a tab and log in.
5. In UniAssist AI, click **"Sync Active Browser Session (1-Click)"** to link instantly.
