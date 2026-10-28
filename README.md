# CylixLab - AI-Powered Learning Management & Skill Assessment Platform

> **Live Application:** [https://cylixlab-77bz.vercel.app/](https://cylixlab-77bz.vercel.app/)

---

##  Overview

**CylixLab** (*"Learn Smarter. Achieve More"*) is an AI-powered learning management and skill assessment platform designed to connect **Students**, **Parents**, and **Administrators** in one unified digital ecosystem.



---

##  Key Features

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

##  Tech Stack

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

##  User Roles & Permissions

CylixLab incorporates a multi-tier Role-Based Access Control (**RBAC**) model supporting four primary roles:

### Role Descriptions

1.  **Student (`student`)**:
   - Accesses the personalized Student Dashboard.
   - Views personal academic profile and grade information.
   - Manages personal To-Do tasks (creating, editing, completing, filtering).
   - Explores modular Learning Paths (01–05) and views accompanying curriculum PDFs.
   - Solves and submits Assignments (01–05) with real-time mark calculation.
   - Tracks individual progress charts and assignment performance.
   - Interacts with the AI Assistant for academic and programming support.

2.  **Parent (`parent`)**:
   - Accesses the dedicated Parent Dashboard.
   - Links with the registered student account using the student's name or family email.
   - Monitors student assignment submissions, score reports, and pass/fail indicators.
   - Accesses the Parent Advisor AI for guidance on study routines and motivation.
   - Browses motivational resources to encourage positive learning habits.

3.  **Administrator (`admin`)**:
   - Accesses the restricted Admin Control Center.
   - Observes global user registration metrics (student-to-parent distribution).
   - Monitors institutional analytics (average assignment marks and student completion rates).
   - Uploads, updates, and manages PDF curricula for Learning Paths and Assignments.
   - Oversees system health and platform operations.

4.  **Teacher / Instructor (`teacher` / `instructor`)**:
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

##  API Endpoints Reference

### 1. Authentication & User Management (`/api/auth`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token |
| `POST` | `/api/auth/google` | Single Sign-On with Google OAuth credential |
| `GET` | `/api/auth/verify-email` | Verify account via email token link |
| `GET` | `/api/auth/profile` | Retrieve profile of the logged-in user |
| `GET` | `/api/auth/stats` | Retrieve platform registration statistics |

### 2. Courses, Learning Paths & Assignments (`/api/courses`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/courses` | Retrieve all available courses |
| `GET` | `/api/courses/:id` | Retrieve specific course details by ID |
| `POST` | `/api/courses` | Create a new course record |
| `PUT` | `/api/courses/:id` | Update an existing course record |
| `DELETE` | `/api/courses/:id` | Delete a course record |
| `POST` | `/api/courses/learning-path-pdf` | Upload or update Learning Path PDF file |
| `GET` | `/api/courses/learning-path-pdf/:pathId` | Retrieve / stream Learning Path PDF |
| `POST` | `/api/courses/assignment-pdf` | Upload or update Assignment PDF file |
| `GET` | `/api/courses/assignment-pdf/:assignmentId` | Retrieve / stream Assignment PDF |
| `POST` | `/api/courses/assignment-submit` | Submit student assignment marks & progress |
| `GET` | `/api/courses/admin-assignment-stats` | Fetch institutional completion counts & averages |
| `GET` | `/api/courses/student-submissions` | Retrieve all assignment submissions for a student |

### 3. AI Assistant & Smart Chatbot (`/api/chat`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat` | Send query to AI tutor (Gemini, Grok, Groq, OpenAI) |
| `POST` | `/api/chat/message` | Alternative endpoint for chat message query |

---

##  How to Run Locally

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

3. Configure your `server/.env` file with your database URI, JWT secret, and port.

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

##  Deployment

CylixLab is deployed on [Vercel](https://vercel.com/):

- 🌐 **Live Link:** [https://cylixlab-77bz.vercel.app/](https://cylixlab-77bz.vercel.app/)

---

<p align="center">
  <b>Built with  for better learning by the CylixLab Team.</b><br>
  <sub>Learn Smarter. Achieve More. &bull; <a href="https://cylixlab-77bz.vercel.app/">Visit Live App</a></sub>
</p>
