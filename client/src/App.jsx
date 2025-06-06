import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import TeacheMainDashboard from './components/TeacherMainBoard';
import StudentDashboard from './components/StudentDashboard';
import TeacherMainBoard from './components/TeacherMainBoard';
import QuestionResults from './components/QuestionResults';
import StudentSubmit from './components/StudentSubmit';
import StudentAnswerPage from './components/StudentAnswerPage';
import PollHistory from './components/PollHistory';
import { ToastContainer } from 'react-toastify';
import StudentNoPoll from './components/StudentNoPoll';
import 'react-toastify/dist/ReactToastify.css';
import KickOut from './components/kickout';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/teacher" element={<TeacherMainBoard />} />
          <Route path="/student" element={<StudentDashboard />} />         
          <Route path="/teacher/results" element={<QuestionResults />} />
          <Route path="/student/results" element={<StudentAnswerPage/>} />
          <Route path="/student/poll" element={<StudentSubmit />} />
          <Route path="/student/noactivePolls" element={<StudentNoPoll/>} />
          <Route path="/polls/history" element={<PollHistory />} />
          <Route path="/student/kickout" element={<KickOut />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;