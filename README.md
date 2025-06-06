# Live Polling System - Intervue Assignment

## Key Features Implemented

### 🎯 Core Functionality
- **Teacher Dashboard**
  - ✔ Create polls with multiple options (text inputs)
  - ✔ Set customizable timers (10s/30s/60s)
  - ✔ Real-time results visualization with percentage bars
  - ✔ Correct answer highlighting (purple border)
  - ✔ Multi-select capability for questions
  - ✔ Participant management (kick functionality)
  - ✔ Poll history view (last 50 polls)

- **Student Experience**
  - ✔ Anonymous participation with name entry
  - ✔ Real-time poll updates
  - ✔ Automatic kick-out notification (dedicated screen)
  - ✔ Submission blocking after timeout
  - ✔ 1-hour active poll validation window
  - ✔ Responsive design across devices

### ⚙ Technical Implementation
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Socket.io
- **Database**: MongoDB Atlas

## System Flow

1. **Teacher Creates Poll**  
   → Sets question, options, timer  
   → Marks correct answer(s)  
   → Broadcasts to all students

2. **Student Participation**  
   → Enters name (stored in localStorage)  
   → Selects option(s) before timer expires  
   → Sees real-time results

3. **Admin Controls**  
   → Kick students (triggers instant logout)  
   → View historical poll data  
   → Monitor active participants

## Hosted Solution
🔗 **Frontend**: [Vercel Deployment](https://intervieu-assignment-live.netlify.app/)  
🔗 **Backend**: [Render Deployment](https://new-backend-1-kyhx.onrender.com)
⚠ *Note: Render's free tier may cause backend cold starts*

## Local Setup
```bash
# Client
cd client
npm install
npm run dev

# Server
cd server
npm install
node index.js
