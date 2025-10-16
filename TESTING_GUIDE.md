# MahaLearn - Quick Testing Guide

## 🚀 How to Test All Features

### 1. Start the Application

**Backend:**
```bash
cd D:\Project 2.o\backend
npm start
```
Backend should be running on: http://localhost:5000

**Frontend:**
```bash
cd D:\Project 2.o\frontend
npm run dev
```
Frontend should be running on: http://localhost:5173

---

### 2. Test Registration & Login

#### Register as Student:
1. Go to http://localhost:5173/register
2. Fill in:
   - Role: Student
   - Username: `student1`
   - Standard: `5`
   - Mobile: `9876543210`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click Register
4. Should redirect to `/student/dashboard`

#### Register as Teacher:
1. Go to http://localhost:5173/register
2. Fill in:
   - Role: Teacher
   - Username: `teacher1`
   - Mobile: `9876543211`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click Register
4. Should redirect to `/teacher/dashboard`

#### Login:
1. Go to http://localhost:5173/login
2. Enter username and password
3. Click Login

---

### 3. Test Student Features

#### Learning Content:
1. Click **Learning** in sidebar
2. See list of subjects for your standard
3. Click on any subject (e.g., "Mathematics")
4. See list of chapters
5. Click on a chapter
6. You should see:
   - Chapter title and description
   - Stats cards (Videos count, Tests count, Practice count)
   - **Educational Videos** section with YouTube thumbnails
   - **Online Tests** section with test cards
   - **Practice Problems** section

#### Generate Notes:
1. While viewing a chapter, click **"Generate Notes"** button
2. A PDF should download automatically
3. Open the PDF to see:
   - Chapter details
   - Video lessons list
   - Practice tests list
   - Key learning points
   - Study tips

#### Take a Test:
1. From chapter details, click **"Start Test"** on any test
2. Answer the questions
3. Submit the test
4. See your results with score and correct answers

#### Chat with Teacher:
1. Click **Chat** in sidebar
2. See list of teachers/users on the left
3. Click on a teacher
4. Send a message
5. Test edit (click pencil icon) and delete (click trash icon)

#### Chatbot:
1. Click **Chatbot** in sidebar
2. Try asking:
   - "Hello"
   - "How do I use MahaLearn?"
   - "Tell me about videos"
   - "What subjects are available?"
   - "Give me study tips"
3. Bot should respond with helpful answers

#### Performance Tracker:
1. Click **Performance** in sidebar
2. See your stats:
   - Tests taken
   - Average score
   - Subject-wise performance
   - Test history
   - Progress over time

#### Leaderboard:
1. Click **Leaderboard** in sidebar
2. See ranking of students in your standard
3. View top performers

#### Community Forum:
1. Click **Community** in sidebar
2. Create a new post:
   - Type your question or message
   - Click **Post**
3. Reply to existing posts:
   - Click reply icon
   - Type your reply
   - Click **Reply**
4. Like posts by clicking the like button

#### Profile:
1. Click **Profile** in sidebar
2. See your:
   - Avatar
   - Personal information
   - Performance stats
   - Achievements
3. Click **Edit Profile**
4. Change username or mobile
5. Click **Save**

#### Settings:
1. Click **Settings** in sidebar
2. **Profile Tab**:
   - Edit username and mobile
   - Click **Save Changes**
3. **Password Tab**:
   - Enter current password
   - Enter new password
   - Confirm new password
   - Click **Change Password**
4. **Notifications Tab**:
   - Toggle various notification preferences
   - Click **Save Preferences**

---

### 4. Test Teacher Features

#### Dashboard:
1. Login as teacher
2. See real-time stats:
   - Total students
   - Active students
   - Average score
   - Total tests

#### Students Management:
1. Click **Students** in sidebar
2. View list of all students
3. See their performance and activity

#### Chat with Students:
1. Click **Chat** in sidebar
2. See list of students who have messaged
3. Click on a student
4. Reply to their messages

#### Performance Tracking:
1. Click **Performance** in sidebar
2. View student performance data
3. Filter by student or subject

#### Community Forum:
1. Click **Community** in sidebar
2. Create posts to share knowledge
3. Reply to student questions
4. Like and engage with posts

#### Profile:
1. Click **Profile** in sidebar
2. See your:
   - Avatar
   - Personal information
   - Teaching stats (students, avg score, etc.)
   - Impact metrics
   - Achievements
3. Edit profile information

#### Settings:
1. Click **Settings** in sidebar
2. Update profile, change password, manage notifications

---

### 5. Test Real-Time Features

#### Socket.io Chat:
1. Open two browser windows
2. Login as student in one, teacher in another
3. Send messages between them
4. Messages should appear instantly in both windows

---

### 6. Test API Endpoints (Optional)

Use Postman or curl to test:

#### Get Subjects:
```bash
GET http://localhost:5000/api/curriculum/standards/5/subjects
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Chapter Details:
```bash
GET http://localhost:5000/api/curriculum/chapters/1
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Generate Notes:
```bash
POST http://localhost:5000/api/notes/generate
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "chapterId": 1
}
```

#### Chatbot Query:
```bash
POST http://localhost:5000/api/chatbot/query
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "query": "Tell me about videos"
}
```

---

### 7. Expected Results

✅ **All Features Should Work:**
- Registration and login with proper validation
- Subjects, chapters, videos, and tests loading correctly
- PDF notes generating and downloading
- Real-time chat working between users
- Chatbot responding to queries
- Community posts, replies, and likes working
- Performance stats showing real data
- Leaderboard displaying rankings
- Profile and settings updates saving correctly
- No console errors in browser
- Backend API responding without errors

✅ **No Errors:**
- Check browser console (F12) - should be clean
- Check backend terminal - no error messages
- All data loading from MySQL database
- All images and videos displaying properly

---

### 8. Common Issues & Solutions

**Issue: Videos not showing**
- Solution: Already fixed! ChapterDetails.jsx now handles `practiceProblems` correctly

**Issue: Can't login**
- Solution: Make sure backend is running and database is connected

**Issue: Notes PDF not downloading**
- Solution: Check backend console for errors, ensure PDFKit is installed

**Issue: Chat messages not sending**
- Solution: Make sure Socket.io server is running (backend should show "Socket.io: Connected")

**Issue: Community posts not loading**
- Solution: Check database for `community_posts` table and ensure backend API is accessible

---

### 9. Database Verification

Run these queries in MySQL to verify data:

```sql
-- Check users
SELECT id, name, role, std FROM users;

-- Check subjects
SELECT * FROM subjects WHERE standard = 5;

-- Check chapters
SELECT * FROM chapters LIMIT 10;

-- Check videos
SELECT id, title, chapter_id FROM videos LIMIT 10;

-- Check tests
SELECT id, title, chapter_id FROM tests LIMIT 10;

-- Check if student has taken tests
SELECT * FROM results WHERE user_id = 1;

-- Check chat messages
SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 10;

-- Check community posts
SELECT * FROM community_posts ORDER BY created_at DESC LIMIT 10;
```

---

## 🎉 Success Criteria

All features are working if you can:
1. ✅ Register and login as both student and teacher
2. ✅ Browse subjects, chapters, and view videos
3. ✅ Take tests and see results
4. ✅ Generate and download PDF notes
5. ✅ Chat in real-time with other users
6. ✅ Get responses from the chatbot
7. ✅ Post, reply, and like in community forum
8. ✅ View performance stats and leaderboard
9. ✅ Update profile and change password
10. ✅ See real data from MySQL (no mock data)

**Congratulations! MahaLearn is fully functional! 🚀**
