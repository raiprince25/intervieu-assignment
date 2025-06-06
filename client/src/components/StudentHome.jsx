import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import logo from '../assets/logo.svg';

const StudentHome = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const checkActivePoll = async () => {
  try {
    const currentTimestamp = Date.now();
    const response = await fetch(`https://new-backend-1-kyhx.onrender.com/api/questions/active?timestamp=${currentTimestamp}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check active poll');
    }

    const data = await response.json();
    return data.isActive;
  } catch (error) {
    console.error('Error checking active poll:', error);
    return false;
  }
};

const handleContinue = async () => {
  if (!name.trim()) {
    setNameError('Please enter your name');
    return;
  }

  setIsLoading(true);

  try {
    const hasActivePoll = await checkActivePoll();

    const socket = io('https://new-backend-1-kyhx.onrender.com', { transports: ['websocket'] });
    socket.emit('student-join', name);

    socket.on('student-connected', ({ studentId }) => {
      localStorage.setItem('studentName', name);
      localStorage.setItem('userName', name);
      localStorage.setItem('userId', name + Date.now());

      navigate(hasActivePoll ? '/student/poll' : '/student/noactivePolls');
    });

    // Handle connection timeout
    setTimeout(() => {
      if (!localStorage.getItem('userId')) {
        setNameError('Failed to connect. Try again.');
        setIsLoading(false);
      }
    }, 5000);

  } catch (error) {
    console.error('Error:', error);
    setNameError('An error occurred. Please try again.');
    setIsLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <img src={logo} alt="Logo" className="w-40 mb-8" />
      <div className="w-full max-w-[600px] flex flex-col items-center">
        <div className="w-full flex flex-col items-center mb-8">
          <h1 className="text-[40px] font-[Sora] text-center">
            <span className="font-normal">Let's</span>
            <span className="font-semibold"> Get Started</span>
          </h1>
          <p className="text-[19px] font-[Sora] text-center text-gray-600 max-w-[602px]">
            If you're a student, you'll be able to <span className="font-semibold">submit your answers</span>, participate in live polls, and see how your responses compare with your classmates.
          </p>
        </div>

        <div className="w-full max-w-[400px]">
          <h2 className="font-[Sora] text-[16px] mb-2">Enter your Name</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError('');
            }}
            className={`w-full px-4 py-3 bg-gray-300 ${
              nameError ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:border-[#8F64E1] font-[Sora] text-[16px]`}
          />
          {nameError && (
            <p className="text-red-500 text-sm mt-1 font-[Sora]">{nameError}</p>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-[200px] py-3 rounded-[36px] bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white font-[Sora] font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;