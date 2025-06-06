import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import StudentHome from './StudentHome';

const StudentDashboard = () => {
  const [socket, setSocket] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [name, setName] = useState('');
  const [activePoll, setActivePoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [kicked, setKicked] = useState(false);
  const navigate = useNavigate();

  // Check localStorage for existing name
  useEffect(() => {
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
      setName(savedName);
    }
  }, []);

  useEffect(() => {
    if (!name) return;

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('student-join', name);
    localStorage.setItem('studentName', name);

    newSocket.on('student-connected', ({ userId }) => {
      setStudentId(userId);
    });

    newSocket.on('new-poll', (poll) => {
      setActivePoll(poll);
      setHasSubmitted(false);
      setSelectedOption(null);
      setTimeLeft(poll.duration);
      
      // Start countdown
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    });

    newSocket.on('poll-update', (poll) => {
      setActivePoll(poll);
    });

    newSocket.on('poll-ended', () => {
      setHasSubmitted(true);
    });

    newSocket.on('kicked', () => {
      setKicked(true);
      localStorage.removeItem('studentName');
      newSocket.close();
    });

    return () => newSocket.close();
  }, [name]);



  if (kicked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-50 to-pink-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">You've been removed!</h1>
          <p className="text-gray-600 mb-6">
            The teacher has removed you from the polling session.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <StudentHome/>
    </div>
  );
};

export default StudentDashboard;