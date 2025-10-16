# MahaLearn - Smart Learning Platform Instructions

## Project Overview
You are an advanced full-stack AI software engineer specialized in building complete production-ready web applications using React.js (frontend), Node.js with Express (backend), and MySQL (database). Build the entire application exactly as per the following specifications, end-to-end, with a fully working frontend and backend connected to MySQL.

## Project Name
**MahaLearn** — Smart Learning Platform (Maharashtra Board 1st–8th Std)

## Tech Stack
- **Frontend:** React.js (Vite setup) with React Router, Axios, TailwindCSS
- **Backend:** Node.js + Express.js + JWT Authentication + Multer (for file/image upload) + PDFKit (for notes generation)
- **Database:** MySQL
- **Real-time Chat:** Socket.io
- **Chatbot:** Rule-based + optional LLM placeholder for doubt solving
- **PDF Notes:** Auto-generate from videos and online tests using backend endpoint

## App Features and Requirements

### 1. Role-Based Access
- Roles: Teacher and Student
- Both roles have separate dashboards and permissions
- Use JWT tokens to secure routes

### 2. Authentication
- **Registration Page (UI + Backend)**
  - Fields:
    - Role Selection (Student/Teacher)
    - Username
    - Standard (only visible if role = Student)
    - Mobile Number
    - Password
    - Confirm Password
- **Login Page (UI + Backend)**
  - Username
  - Password
- After successful login:
  - If Student → redirect to Student Dashboard
  - If Teacher → redirect to Teacher Dashboard

### 3. Student Dashboard Features
- **Learning Content:**
  - Videos and Online Tests auto-fetched from backend based on student's standard (1st–8th Std)
  - Display by Subject
- **Notes Button:**
  - When clicked, automatically generates summarized notes from the selected video or test
  - The notes are downloadable in PDF format
- **Chat System:**
  - Students can chat with teachers in real-time using Socket.io
  - Supports text, image upload, edit and delete messages
- **Chatbot:**
  - Integrated chatbot that answers platform-related queries and subject-related doubts
- **Performance Tracker:**
  - Displays student test performance, total score, and learning progress
- **Leaderboard:**
  - Shows top-performing students across the same standard
  
### 4. Teacher Dashboard Features
- View and reply to student chat messages
- Monitor each student's test performance and progress
- Participate in the Student–Teacher Community forum

### 5. Community System (Both Roles)
- Global community where both teachers and students can:
  - Post questions, question images, or educational videos
  - Reply or comment on others' posts
- Each post shows username, role, timestamp, and reply section

### 6. Database (MySQL)
- **Tables:**
  - users (id, username, password, role, std, mobile, created_at)
  - videos (id, title, subject, std, description, url, uploaded_by)
  - tests (id, title, std, subject, questions JSON)
  - results (id, user_id, test_id, score, date)
  - chat_messages (id, sender_id, receiver_id, content, media_path, created_at)
  - community_posts (id, user_id, content, media_path, created_at)
- Foreign keys between related tables

### 7. Backend API Endpoints
- `/api/auth/register` — Register user with role & JWT
- `/api/auth/login` — Login & get token
- `/api/videos` — Get videos by standard
- `/api/tests` — Get online tests by standard
- `/api/tests/submit` — Save test results
- `/api/notes/generate` — Generate and download PDF notes
- `/api/chat` — Send, edit, delete, and get chat messages
- `/api/chat/upload` — Upload chat images
- `/api/community` — Get/create/reply to posts
- `/api/performance` — Get performance data
- `/api/leaderboard` — Get leaderboard by standard
- `/api/chatbot` — Respond to user queries

### 8. Frontend UI Pages (React.js)
- `/register` — Registration form with role-based fields
- `/login` — Login form
- `/student-dashboard` — Dashboard with tabs:
  - Learning Content
  - Notes
  - Chat
  - Chatbot
  - Performance
  - Leaderboard
  - Community
- `/teacher-dashboard` — Dashboard with tabs:
  - Chat
  - Student Performance
  - Community
- Use clean TailwindCSS UI with responsive layouts

### 9. Chat System (Socket.io)
- Real-time chat between student and teacher
- Messages saved to MySQL
- Allow edit, delete, and image upload

### 10. Notes Generation (PDFKit)
- Automatically generate short summarized notes for each video or online test
- Return downloadable PDF file to frontend

### 11. Chatbot System
- Rule-based answers for platform navigation
- Optional placeholder function for integration with a language model later

### 12. Performance Tracker & Leaderboard
- Track student test scores
- Rank students by average score per standard

### 13. Learning Content (Pre-uploaded)
- Maharashtra Board 1st–8th standard content already uploaded to MySQL via `videos` and `tests` tables

### 14. Output Expectations
- Provide complete folder structure for frontend and backend
- Include all configuration files: `.env`, `package.json`, `vite.config.js`, etc.
- Write step-by-step setup guide (commands to run frontend, backend, MySQL setup)
- Ensure full integration (frontend connected to backend APIs)
- The project should be deployable locally and on cloud servers
- Provide full explanation for every major component and how the system works end-to-end
