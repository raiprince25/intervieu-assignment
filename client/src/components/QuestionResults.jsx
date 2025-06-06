import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Eye from '../assets/Eye.svg';
import ChatIcon from '../assets/Chat.svg';
import TeacherChat from './TeacherChat';

const QuestionResults = () => {
  const [questionData, setQuestionData] = useState(null);
  const [results, setResults] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState([]);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchActiveQuestion = async () => {
      try {
        const response = await fetch('https://new-backend-1-kyhx.onrender.com/api/results');
        const data = await response.json();

        if (!data.question) {
          navigate('/');
          return;
        }

        setQuestionData({
          question: data.question,
          options: data.options,
          _id: data._id
        });
        setResults(data.options);
        
        if (data.participants) {
          setParticipants(data.participants);
        }

      } catch (error) {
        console.error('Error fetching question:', error);
        navigate('/');
      }
    };

    fetchActiveQuestion();

    const interval = setInterval(async () => {
      try {
        const response = await fetch('https://new-backend-1-kyhx.onrender.com/api/results');
        const data = await response.json();
        if (data.options) setResults(data.options);
        if (data.participants) {
          setParticipants(data.participants);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  const toggleChat = () => {
    setShowChat(prev => !prev);
  };

  if (!questionData) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const totalVotes = results.reduce((sum, option) => sum + option.percentage, 0); 

  const maxPercentageOption = totalVotes > 0 
    ? results.reduce((max, option) => option.percentage > max.percentage ? option : max, { percentage: -1, text: '' })
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans relative px-4 py-20 md:py-8">
      <div className="absolute top-4 md:top-6 right-4 md:right-6 z-10">
        <button 
          onClick={() => navigate('/polls/history')}
          className="w-[150px] md:w-[267px] h-[40px] px-2 md:px-4 py-2 bg-[#8F64E1] text-white rounded-full text-sm hover:bg-[#684de0] transition
                     flex items-center justify-center space-x-1 md:space-x-2"
        >
          <img src={Eye} alt="Eye" className="w-4 h-4 md:w-6 md:h-6" /> 
          <span className='font-[Sora] font-semibold text-[14px] md:text-[18px]'>View Poll history</span>
        </button>
      </div>

      <div
        className="fixed right-4 md:right-16 bottom-4 md:bottom-12 bg-[#6766D5] rounded-full shadow-lg cursor-pointer hover:bg-[#5a59c7] transition-colors z-10"
        onClick={toggleChat}
      >
        <img src={ChatIcon} alt="Chat" className="w-[60px] h-[57px] md:w-[80px] md:h-[76px]" />
      </div>
      <div className="w-full max-w-2xl relative pb-16 md:pb-0">
        <h2 className="font-[Sora] font-semibold text-[18px] md:text-[22px] text-black mb-2">Question</h2>

        <div className="rounded-lg border border-gray-300 shadow-sm overflow-hidden">
 
          <div className="font-[Sora] text-[15px] md:text-[17px] bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white text-sm font-medium px-4 md:px-5 py-3">
            {questionData.question}
          </div>

          <div className="bg-white px-4 md:px-5 py-4 md:py-5 space-y-3 md:space-y-4 h-auto">
            {results.map((option, index) => {
              const isDominant = option.isCorrect === true;
              const hasVotes = option.percentage > 0;

              return (
                <div 
                  key={index} 
                  className={`relative rounded-md py-2 md:py-3 px-3 md:px-4 flex items-center overflow-hidden 
                    ${isDominant && hasVotes ? 'border-2 border-[#AF8FF1] bg-white' : 'bg-[#F6F6F6]'}`}
                >
                  {!(isDominant && hasVotes) && (
                    <div
                      className="absolute top-0 left-0 h-full bg-[#6766D5] rounded-md transition-all duration-300"
                      style={{ width: `${option.percentage}%` }}
                    ></div>
                  )}
                  {isDominant && hasVotes && (
                    <div
                      className="absolute top-0 left-0 h-full bg-[#6766D5] rounded-md transition-all duration-300"
                      style={{ width: `${option.percentage}%` }}
                    ></div>
                  )}
                  
                  <div className="relative z-10 flex justify-between items-center w-full">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div 
                        className={`w-5 h-5 md:w-6 md:h-6 rounded-full border text-xs font-semibold flex items-center justify-center 
                          ${isDominant && hasVotes ? 'bg-white border-[#7B61FF] text-[#7B61FF]' : 'bg-white border-[#D1D1D1] text-[#7B61FF]'}`}
                      >
                        {index + 1}
                      </div>
                      <span 
                        className={`text-xs md:text-sm font-[Sora] text-[14px] md:text-[16px] ${isDominant && hasVotes ? 'text-gray-800 font-semibold' : 'text-gray-800'}`}
                      >
                        {option.text}
                      </span>
                    </div>
                    <span 
                      className={`text-xs md:text-sm font-[Sora] text-[14px] md:text-[16px] font-semibold
                        ${isDominant && hasVotes 
                          ? 'text-black'
                          : (hasVotes ? 'text-black' : 'text-black')
                        }`}
                    >
                      {option.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="fixed md:absolute bottom-4 md:-bottom-16 left-0 right-0 md:right-0 flex justify-center md:justify-end px-4 md:px-0">
          <button
            onClick={() => navigate('/teacher')}
            className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white py-2 px-6 rounded-full text-sm font-medium hover:bg-[#684de0] transition w-full md:w-auto"
          >
            ＋ Ask a new question
          </button>
        </div>
      </div>

      {showChat && (
        <TeacherChat
          toggleChat={toggleChat}
          participants={participants}
        />
      )}
    </div>
  );
};

export default QuestionResults;