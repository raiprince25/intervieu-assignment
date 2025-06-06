import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import TeacherMainBoard from './TeacherMainBoard';

const TeacherDashboard = () => {
  const [socket, setSocket] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [teacherName, setTeacherName] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(60);
  const [activePoll, setActivePoll] = useState(null);
  const [activeStudents, setActiveStudents] = useState([]);
  const [pastPolls, setPastPolls] = useState([]);
  const [showPastPolls, setShowPastPolls] = useState(false);

  useEffect(() => {
    const name = prompt('Enter your teacher name:') || 'Teacher';
    setTeacherName(name);
    
    const newSocket = io('https://new-backend-1-kyhx.onrender.com', { transports: ['websocket'] });
    setSocket(newSocket);

    newSocket.emit('teacher-join', name);

    newSocket.on('teacher-connected', ({ userId }) => {
      setTeacherId(userId);
    });

    newSocket.on('new-poll', (poll) => {
      setActivePoll(poll);
      fetchActiveStudents();
    });

    newSocket.on('poll-update', (poll) => {
      setActivePoll(poll);
    });

    newSocket.on('poll-ended', (poll) => {
      setActivePoll(poll);
      fetchPastPolls();
    });

    newSocket.on('student-joined', () => {
      fetchActiveStudents();
    });

    fetchActiveStudents();
    fetchPastPolls();

    return () => newSocket.close();
  }, []);

  const fetchActiveStudents = async () => {
    try {
      const response = await axios.get('https://new-backend-1-kyhx.onrender.com/api/active-students');
      setActiveStudents(response.data);
    } catch (err) {
      console.error('Error fetching active students:', err);
    }
  };

  const fetchPastPolls = async () => {
    if (!teacherId) return;
    try {
      socket.emit('get-past-polls', teacherId);
      socket.once('past-polls', (polls) => {
        setPastPolls(polls);
      });
    } catch (err) {
      console.error('Error fetching past polls:', err);
    }
  };

  const handleCreatePoll = () => {
  if (!question.trim() || options.length < 2) {
    alert("Please enter a question and at least 2 options.");
    return;
  }

  const payload = {
    question,
    options: options.filter(opt => opt.trim() !== ''),
    duration,
  };

  socket.emit('createPoll', payload); // make sure this matches your backend event
};


  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleKickStudent = (socketId) => {
    socket.emit('kick-student', socketId);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Teacher Dashboard: {teacherName}</h1>
      
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 ${!showPastPolls ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
          onClick={() => setShowPastPolls(false)}
        >
          Active Poll
        </button>
        <button
          className={`px-4 py-2 ${showPastPolls ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
          onClick={() => setShowPastPolls(true)}
        >
          Past Polls
        </button>
      </div>
      
      {showPastPolls ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Past Polls</h2>
          {pastPolls.length === 0 ? (
            <p className="text-gray-500">No past polls available</p>
          ) : (
            <div className="space-y-4">
              {pastPolls.map(poll => (
                <div key={poll._id} className="border p-4 rounded-lg hover:shadow-md transition">
                  <h3 className="font-medium text-lg">{poll.question}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(poll.createdAt).toLocaleString()} | {poll.answers.length} responses
                  </p>
                  <div className="mt-2 space-y-2">
                    {poll.options.map((option, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm">
                          <span>{option.text}</span>
                          <span>
                            {option.votes} votes (
                            {Math.round((option.votes / Math.max(1, poll.answers.length)) * 100)}%
                            )
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(option.votes / Math.max(1, poll.answers.length)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
      
          <TeacherMainBoard/>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Active Students ({activeStudents.length})
            </h2>
            {activeStudents.length === 0 ? (
              <p className="text-gray-500">No active students</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeStudents.map(student => (
                  <div key={student.socketId} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                    <span>{student.name}</span>
                    <button
                      onClick={() => handleKickStudent(student.socketId)}
                      className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Kick
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;