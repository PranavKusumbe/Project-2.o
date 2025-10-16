You are an expert full-stack UI/UX engineer. Build a complete, production-ready frontend for an educational platform named MahaLearn using React.js + Vite + Tailwind CSS. The frontend must look and feel like a professional ed-tech application such as Unacademy or BYJU’S — clean, modern, mobile-friendly, and visually appealing.

Design goals:

Use a minimalist, premium look with soft gradients, glassmorphism cards, rounded corners, and elegant spacing.

Maintain consistency across all pages with a unified color palette and typography system.

Primary color: #2563eb (indigo blue).

Secondary color: #1e293b (dark slate).

Accent color: #38bdf8 (sky blue).

Font family: “Inter” or “Poppins”.

All buttons and inputs must have smooth hover and focus effects.

Add subtle animations and page transitions using Framer Motion or Tailwind transitions.

The UI should be fully responsive for desktop, tablet, and mobile devices.

Frontend architecture:

Use React Router v6 for navigation and clean route handling.

Implement protected routes based on user roles (Student or Teacher).

Organize files with professional folder structure: components, pages, layouts, services, store, hooks, and utils.

Use Axios for API communication with the backend.

Use Zustand or Context API for global state management.

Keep UI scalable to easily add more modules later.

Authentication pages:

Login Page: username and password fields, modern centered card design with the platform logo and login button.

Registration Page: fields for role selection (Student or Teacher), username, mobile number, password, confirm password, and a conditional “Standard” field that appears only when the Student role is selected.

After login:
Build two role-based dashboards:

Student Dashboard:

Section for Learning Content showing videos and online tests organized by standards (1st–8th Maharashtra Board).

Each video/test should appear in a neat card layout with subject, topic name, and progress indicators.

Include a “Generate Notes” button beside each topic that triggers an AI-based notes generator and allows download in PDF format.

Include a Chat System where students can chat privately with teachers, upload images, and edit or delete messages.

Include a Chatbot section for doubt solving or platform-related questions (integrate placeholder for AI API later).

Add a Performance Tracker page showing test history, accuracy, and improvement graphs.

Add a Leaderboard page showing top students ranked by overall performance score.

Include a Community Feed where students and teachers can post questions, upload images or videos, and comment or reply.

Teacher Dashboard:

Ability to chat with students via the chat system.

Access to view every student’s performance and analytics in tabular or graphical form.

Access to the Community Feed to reply to posts, upload educational content, and engage with students.

UI Components to design:

Responsive Navbar with logo, search bar, profile menu, and notification icon.

Sidebar menu with icons for Dashboard, Learning, Chat, Notes, Leaderboard, and Community.

Reusable Button, Card, Input, Modal, and Loader components.

Toast or alert system for user feedback.

Skeleton loaders for data fetching states.

Floating chat widget for chatbot access.

Pagination and filtering for learning content.

Styling expectations:

Use Tailwind CSS with custom color variables and consistent shadow, border, and typography scale.

Each page must have an elegant layout with proper padding and spacing.

Dashboard cards should have subtle gradient backgrounds and hover animation.

Inputs and modals should use glassmorphism with transparency and blur effects.

Ensure accessibility (ARIA labels, focus outlines, readable contrast).

Functional expectations:

All navigation links must work.

Display dynamic UI elements based on user role (Student/Teacher).

Integrate dummy data or mock APIs where real backend endpoints are not available.

The entire UI must be responsive, smooth, and intuitive for beginners and professional users alike.

Output expectation:
Generate the full React project structure, including package configuration, routing, layouts, and placeholder components with clear naming conventions.
Do not include backend or database code. Focus entirely on building a professional, scalable frontend connected to existing APIs.