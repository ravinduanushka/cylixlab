# CylixLab - AI-Powered Learning Management & Skill Assessment Platform

> **Live Application:** [https://cylixlab-77bz.vercel.app/](https://cylixlab-77bz.vercel.app/)

---

## 🌟 Overview

**CylixLab** (*"Learn Smarter. Achieve More"*) is an AI-powered learning management and skill assessment platform designed to connect **Students**, **Parents**, and **Administrators** in one unified digital ecosystem.

The platform provides personalized learning pathways, interactive assignment submissions with an embedded high-performance PDF canvas viewer, smart to-do productivity management, multi-provider AI tutoring (supporting English and Sinhala), real-time progress analytics with comparative bar charts, and an administrator control center for curriculum uploads and institutional metrics.

---

## ✨ Key Features

### 1. Student Experience
- **Personal Profile Management**: View and manage profile details including name, age, grade, email, and academic credentials.
- **Interactive To-Do List Manager**:
  - Filter tasks by **All Tasks**, **Today**, **Upcoming**, **Overdue**, and **Completed**.
  - Priority labeling: `Urgent`, `High`, `Medium`, and `Low`.
  - Due date tracking, inline task creation, editing, deletion, and quick status toggling.
  - Persistent state management with dual-layer synchronization (Local Storage + Cloud state).
- **Curriculum Learning Paths (Paths 01 to 05)**:
  - Step-by-step modular curriculum tracks.
  - Interactive view with integrated learning objectives and study materials.
- **Interactive Assignments (Assignments 01 to 05)**:
  - High-performance in-browser **PDF Canvas Viewer** powered by `pdfjs-dist` (no browser extensions or downloads needed).
  - Multi-page navigation, high-DPI scaling, and responsive rendering.
  - Direct student response submission with marks scoring (scaled out of 30).
  - Status tracking with immediate feedback and automatic progress calculation.
- **Analyze Progress Dashboard**:
  - Custom SVG/CSS bar charts displaying individual assignment marks against maximum scores (30 marks scale).
  - Completion status indicators, total performance summary, and pass/fail thresholds.
- **Motivational Quotes Hub**:
  - Curated collection of uplifting quotes from renowned thinkers and leaders to inspire daily study habits.
- **Interactive AI Study Assistant**:
  - Direct arithmetic and mathematics problem solver (e.g., `12 * 5`, `100 / 4`).
  - Programming tutor for Python, JavaScript, and algorithmic concepts.
  - English and Sinhala bilingual query support.

### 2. Parent Experience
- **Parent Portal Dashboard**: Tailored interface designed specifically for parental monitoring and encouragement.
- **Linked Student Progress Tracking**:
  - Real-time visibility into the child's assignment progress, individual scores, and completion status.
  - Color-coded assignment indicators: Orange (Asg 1), Peach (Asg 2), Coral Pink (Asg 3), Green (Asg 4), and Grey (Asg 5).
  - Passing score evaluation (threshold at 20/30 marks) and score summaries.
- **Parent Advisor AI**:
  - Specialized AI assistant configured to answer parental queries regarding study routines, exam stress, and learning motivation in concise 1–3 sentence responses.
- **Shared Account Support**:
  - Students and parents can register independently using the same family email address with strict role segregation in MongoDB (`{ email: 1, role: 1 }` unique compound index).

### 3. Administrator Dashboard
- **Institutional Analytics**:
  - Live breakdown of registered users (Student vs. Parent percentages and counts).
  - Dynamic assignment performance metrics across the entire student body (Average Marks & Total Completed Students per assignment).
- **Curriculum & Asset Management**:
  - Drag-and-drop / file browser upload for **Learning Path PDFs** and **Assignment PDFs**.
  - Dual payload support: Multipart form uploads via Multer and base64 payloads for serverless compatibility.
  - Cloudinary cloud storage integration with local disk fallback.
- **Real-Time Operational Widgets**:
  - Live dynamic digital clock and formatted date display (`Day, DDth Month`).
  - Instant synchronization upon student submission events via custom window event dispatchers.
- **Role-Gated Security**:
  - Strict client-side route guards and server-side JWT authorization ensuring only verified `admin` roles can access management capabilities.

### 4. AI Assistant & Smart Tutoring
- **Multi-Engine LLM Fallback Pipeline**:
  - Primary: **Google Generative AI (Gemini 1.5 / 2.0)**
  - Alternative: **Grok AI / xAI (`grok-beta`)**
  - Fallback: **Groq (`llama-3.3-70b-versatile`)** and **OpenAI (`gpt-4o-mini`)**
  - Offline / Local Fallback: Built-in deterministic regex arithmetic engine and instant knowledge base for uninterrupted offline development.
- **Persona-Aware Prompt Engineering**:
  - Adapts response tone, brevity, and focus depending on whether the caller is a `student` (concise academic tutor) or `parent` (encouraging educational guide).

### 5. Security & Authentication
- **Authentication Flows**:
  - Standard email and password authentication with `bcryptjs` salt hashing (10 rounds).
  - Google OAuth single sign-on via `google-auth-library`.
  - Transactional email verification powered by `nodemailer`.
- **API Hardening**:
  - **Helmet**: Sets HTTP security headers (`cross-origin-resource-policy`, disables Express header fingerprinting).
  - **Express Rate Limit**: Brute-force and DoS mitigation (60 authentication attempts per 15 min; 1000 general API requests per 15 min).
  - **CORS Protection**: Whitelisted origins covering local development (`localhost:5173`, `localhost:3000`) and Vercel domains (`*.vercel.app`).

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose / Usage |
| :--- | :--- |
| **React** | Core UI library for reactive, component-based user interfaces |
| **Vite** | Ultra-fast build tool, local dev server with Hot Module Replacement (HMR) |
| **React Router DOM** | Declarative client-side routing and protected navigation |
| **Axios** | Promise-based HTTP client for API communications with credentials support |
| **PDF.js (`pdfjs-dist`)** | Hardware-accelerated HTML5 Canvas PDF rendering for learning materials |
| **CSS3 / Glassmorphism** | Custom modular styling, responsive grid, gradients, and dark/light themes |

### Backend

| Technology | Purpose / Usage |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment executing the server backend |
| **Express** | Lightweight, scalable REST API web framework |
| **MongoDB & Mongoose** | Document database and Object Data Modeling (ODM) with schema validation |
| **JSON Web Token (`jsonwebtoken`)** | Cryptographically signed stateless bearer authentication tokens |
| **Bcrypt.js** | One-way hashing algorithm for storing salted user passwords securely |
| **Google Generative AI** | Gemini API client powering the intelligent interactive chatbot |
| **Cloudinary & Multer** | Cloud-hosted file storage and multipart form handling for PDF curricula |
| **Nodemailer** | SMTP mailer for account verification and password reset workflows |
| **Helmet** | HTTP header security suite safeguarding against common web vulnerabilities |
| **Express Rate Limit** | IP-based request throttling protecting endpoints against abuse and DoS |
| **Google Auth Library** | Google OAuth token verification and credential processing |
| **PDF-Parse** | Server-side parsing and text extraction utility for PDF documents |

### Cloud Services & DevOps

| Service | Provider | Purpose |
| :--- | :--- | :--- |
| **Frontend Hosting** | Vercel | Global CDN deployment with continuous deployment from GitHub |
| **Backend API Hosting** | Vercel Serverless | Express app wrapped in Vercel Serverless function (`index.js` / `server.js`) |
| **Database Cluster** | MongoDB Atlas | Managed cloud NoSQL database with automated replication and backups |
| **Asset & PDF Storage** | Cloudinary | High-availability CDN delivery for learning path and assignment PDFs |

---

## 👥 User Roles & Permissions

CylixLab incorporates a multi-tier Role-Based Access Control (**RBAC**) model supporting four primary roles:

### Role Descriptions

1. 👨‍🎓 **Student (`student`)**:
   - Accesses the personalized Student Dashboard.
   - Views personal academic profile and grade information.
   - Manages personal To-Do tasks (creating, editing, completing, filtering).
   - Explores modular Learning Paths (01–05) and views accompanying curriculum PDFs.
   - Solves and submits Assignments (01–05) with real-time mark calculation.
   - Tracks individual progress charts and assignment performance.
   - Interacts with the AI Assistant for academic and programming support.

2. 👨‍👩‍👧 **Parent (`parent`)**:
   - Accesses the dedicated Parent Dashboard.
   - Links with the registered student account using the student's name or family email.
   - Monitors student assignment submissions, score reports, and pass/fail indicators.
   - Accesses the Parent Advisor AI for guidance on study routines and motivation.
   - Browses motivational resources to encourage positive learning habits.

3. 🛡️ **Administrator (`admin`)**:
   - Accesses the restricted Admin Control Center.
   - Observes global user registration metrics (student-to-parent distribution).
   - Monitors institutional analytics (average assignment marks and student completion rates).
   - Uploads, updates, and manages PDF curricula for Learning Paths and Assignments.
   - Oversees system health and platform operations.

4. 👨‍🏫 **Teacher / Instructor (`teacher` / `instructor`)**:
   - Authorized to manage course details, curriculum content, and evaluate student work.

---

### Role-Based Access Control (RBAC) Matrix

| Feature / Capability | Student | Parent | Admin | Teacher |
| :--- | :---: | :---: | :---: | :---: |
| **View Landing Page & Course Plans** | ✅ | ✅ | ✅ | ✅ |
| **Manage Personal To-Do Lists** | ✅ | ❌ | ❌ | ❌ |
| **View Learning Paths & PDF Viewer** | ✅ | ❌ | ✅ | ✅ |
| **Submit Assignments & View Marks** | ✅ | ❌ | ❌ | ❌ |
| **View Individual Student Analytics** | ✅ | ✅ *(Linked)* | ✅ *(All)* | ✅ |
| **Access AI Assistant** | ✅ *(Student AI)* | ✅ *(Parent AI)* | ✅ | ✅ |
| **Upload Learning Path & Assignment PDFs** | ❌ | ❌ | ✅ | ✅ |
| **View Global Institutional Stats & Charts**| ❌ | ❌ | ✅ | ✅ |
| **Manage Course & Curriculum Records** | ❌ | ❌ | ✅ | ✅ |

---

## 📂 Folder Structure

```
cylixlab/
├── .gitignore                      # Git ignored files (node_modules, .env, uploads)
├── README.md                       # Comprehensive project documentation
│
├── frontend/                       # React 19 + Vite Frontend Application
│   ├── public/                     # Static public assets
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js              # Re-exported unified Axios API instance
│   │   │   └── axios.js            # Axios client configuration with dynamic Base URL
│   │   ├── assets/                 # Brand assets, vectors, and imagery (hero.png, react.svg)
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx           # Institutional metrics, PDF uploaders, analytics
│   │   │   ├── AnalyseProgressView.jsx      # Student progress bar charts & score summary
│   │   │   ├── AssignmentDetailView.jsx     # Assignment viewer, question reader, submissions
│   │   │   ├── FeaturesSection.jsx          # Public landing page features grid
│   │   │   ├── Footer.jsx                   # Universal application footer
│   │   │   ├── Hero.jsx                     # Landing page hero section & call-to-actions
│   │   │   ├── Icons.jsx                    # Reusable SVG vector icon components
│   │   │   ├── LearningPathDetailView.jsx   # Learning track viewer & curriculum display
│   │   │   ├── Login.jsx                    # User authentication portal (Local & Google OAuth)
│   │   │   ├── MotivationalQuotesView.jsx   # Curated inspirational quotes carousel
│   │   │   ├── Navbar.jsx                   # Navigation bar with responsive links & auth state
│   │   │   ├── OnlineChatbox.jsx            # Multi-model AI Chatbot widget (Student/Parent)
│   │   │   ├── ParentDashboard.jsx          # Dedicated parent portal home
│   │   │   ├── ParentStudentProgressView.jsx# Child progress monitoring & performance metrics
│   │   │   ├── PdfCanvasViewer.jsx          # Custom high-fidelity PDF.js canvas viewer
│   │   │   ├── PlanSection.jsx              # Landing page study roadmap cards
│   │   │   ├── Register.jsx                 # Role-based user registration portal
│   │   │   ├── StudentDashboard.jsx         # Core student hub (To-Do, Paths, Progress, AI)
│   │   │   └── TodoListManager.jsx          # Full-featured task management board
│   │   ├── App.css                 # Application-wide styling & theme variables
│   │   ├── App.jsx                 # React Router configuration & route declarations
│   │   ├── index.css               # Global CSS reset & typography styles
│   │   └── main.jsx                # Application root entry point
│   ├── index.html                  # HTML5 template
│   ├── package.json                # Frontend scripts and dependencies
│   └── vite.config.js              # Vite server & proxy configuration
│
└── server/                         # Express 5 + Node.js REST API Backend
    ├── index.js                    # Serverless entry wrapper for Vercel deployment
    ├── server.js                   # Primary Express application setup, middlewares, routes
    ├── vercel.json                 # Vercel deployment configuration & route rewrites
    ├── package.json                # Backend dependencies and execution scripts
    ├── uploads/                    # Local storage fallback for PDF files & submissions
    └── src/
        ├── config/
        │   ├── cloudinary.js       # Cloudinary SDK credentials & storage initialization
        │   └── db.js               # MongoDB connection handler with connection caching
        ├── controllers/
        │   ├── authController.js   # User registration, login, Google OAuth, stats
        │   ├── chatController.js   # Multi-provider AI chatbot handler & prompt personas
        │   └── courseController.js # PDF uploads, assignment submissions, course management
        ├── middlewares/
        │   ├── authMiddleware.js   # JWT verification & role authorization guards
        │   └── uploadMiddleware.js # Multer & Cloudinary multipart/form-data handler
        ├── models/
        │   ├── Assignment.js       # Assignment schema & metadata
        │   ├── AssignmentSubmission.js # Student assignment submission records & marks
        │   ├── Course.js           # Course schema
        │   ├── LearningPath.js     # Learning path modules & PDF mapping
        │   └── User.js             # User schema (roles, bcrypt hooks, OAuth IDs)
        ├── routes/
        │   ├── authRoutes.js       # Auth endpoints (/api/auth)
        │   ├── chatRoutes.js       # AI chat endpoints (/api/chat)
        │   └── courseRoutes.js     # Course & PDF endpoints (/api/courses)
        └── utils/
            └── sendEmail.js        # Nodemailer SMTP email sender utility
```

---

## 🔌 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new account (`student`, `parent`, `teacher`) | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token + user details | Public |
| `POST` | `/api/auth/google` | Single Sign-On with Google OAuth credential | Public |
| `GET` | `/api/auth/verify-email` | Verify account via verification token link | Public |
| `GET` | `/api/auth/profile` | Retrieve profile information for logged-in user | Authenticated |
| `GET` | `/api/auth/stats` | Retrieve registration metrics (student vs. parent counts) | Public / Admin |

### Courses, Learning Paths & Assignments (`/api/courses`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Fetch all available courses | Public |
| `GET` | `/api/courses/:id` | Fetch specific course by ID | Public |
| `POST` | `/api/courses` | Create new course record | Authenticated |
| `PUT` | `/api/courses/:id` | Update existing course record | Admin / Instructor |
| `DELETE` | `/api/courses/:id` | Remove course record | Admin / Instructor |
| `POST` | `/api/courses/learning-path-pdf` | Upload or update Learning Path PDF file | Admin / Instructor |
| `GET` | `/api/courses/learning-path-pdf/:pathId` | Download / stream Learning Path PDF | Public |
| `POST` | `/api/courses/assignment-pdf` | Upload or update Assignment PDF file | Admin / Instructor |
| `GET` | `/api/courses/assignment-pdf/:assignmentId` | Download / stream Assignment PDF | Public |
| `POST` | `/api/courses/assignment-submit` | Submit student assignment work and record marks | Authenticated |
| `GET` | `/api/courses/admin-assignment-stats` | Fetch institutional completion counts & average marks | Admin |
| `GET` | `/api/courses/student-submissions` | Retrieve submission records for a specific student | Authenticated |

### AI Assistant (`/api/chat`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | Send prompt to AI tutor and receive role-specific response | Public / Authenticated |
| `POST` | `/api/chat/message` | Alternative route for chat completions | Public / Authenticated |

---

## 🔐 Environment Variables

### Backend Configuration (`server/.env`)

```env
# Server Port
PORT=5000

# MongoDB Connection String (Atlas or Local)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cylixlab?retryWrites=true&w=majority

# JWT Token Secret
JWT_SECRET=your_super_secret_jwt_key_here_cylixlab_2026

# Client Application URL (For CORS whitelist)
CLIENT_URL=http://localhost:5173

# Admin Credentials (Protected system administrator account)
ADMIN_EMAIL=admin@cylixlab.com
ADMIN_PASSWORD=AdminSecurePassword123!

# AI Chatbot Integration (Provide at least one)
GEMINI_API_KEY=your_google_gemini_api_key_here
GROK_API_KEY=your_xai_grok_api_key_here
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Cloudinary Storage (For hosting curriculum PDF files)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (Nodemailer for verification emails)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google OAuth Integration
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

### Frontend Configuration (`frontend/.env`)

```env
# Base API URL (Leave blank in local dev to use Vite proxy; set to backend URL in production)
VITE_API_URL=https://cylixlab.vercel.app
```

---

## 🚀 How to Run Locally

### Prerequisites
Before running the application, ensure the following are installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/) (Local installation or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/cylixlab.git
cd cylixlab
```

---

### Step 2: Server Setup & Configuration

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file with the variables listed above.

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000` with nodemon auto-reload.*

---

### Step 3: Frontend Setup & Configuration

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will start on `http://localhost:5173`.*

---

### Step 4: Running in Development Mode

Once both servers are running:
1. Open your browser and visit: `http://localhost:5173`
2. **Register a Student Account**:
   - Go to `http://localhost:5173/register`
   - Select the **Student** role, fill in your details, and submit.
3. **Register a Parent Account**:
   - Go to `http://localhost:5173/register`
   - Select the **Parent** role, enter your details and the registered student's name.
4. **Log in as Administrator**:
   - Go to `http://localhost:5173/login`
   - Enter your configured `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`.
   - Access the Admin Dashboard at `http://localhost:5173/admin`.

---

## ☁️ Deployment

### Deploying on Vercel

CylixLab is optimized for deployment on [Vercel](https://vercel.com/):

1. **Frontend Deployment**:
   - Framework preset: `Vite`
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: Set `VITE_API_URL` to your production backend URL.

2. **Backend Serverless Deployment**:
   - Root directory: `server`
   - Built-in `vercel.json` routes all incoming requests to `index.js`:
     ```json
     {
       "version": 2,
       "builds": [{ "src": "index.js", "use": "@vercel/node" }],
       "routes": [{ "src": "/(.*)", "dest": "index.js" }]
     }
     ```
   - Add all environment variables from `server/.env` into the Vercel Project Settings.

---

## ❓ Troubleshooting & FAQs

<details>
<summary><b>1. Why does the PDF viewer display a blank canvas locally?</b></summary>
Ensure that you have uploaded a valid PDF file via the Admin Dashboard or that your server's static <code>/uploads</code> path has read permissions. The custom <code>PdfCanvasViewer</code> also gracefully falls back to bundled assignment PDFs.
</details>

<details>
<summary><b>2. How can parents and students share the same email address?</b></summary>
The MongoDB <code>User</code> schema uses a compound unique index on <code>{ email: 1, role: 1 }</code>. This allows a student and parent account to register with the same email address without credential conflicts.
</details>

<details>
<summary><b>3. What happens if the AI API keys are not provided?</b></summary>
The CylixLab Chatbox features an intelligent built-in deterministic fallback engine that resolves basic math equations, common coding syntax inquiries, and study guidance even when third-party AI API keys are absent.
</details>

<details>
<summary><b>4. CORS errors during local development?</b></summary>
Ensure Vite's development proxy is configured in <code>frontend/vite.config.js</code> to forward <code>/api</code> and <code>/uploads</code> to <code>http://localhost:5000</code>.
</details>

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

<p align="center">
  <b>Built with ❤️ for better learning by the CylixLab Team.</b><br>
  <sub>Learn Smarter. Achieve More. &bull; <a href="https://cylixlab-77bz.vercel.app/">Visit Live App</a></sub>
</p>
