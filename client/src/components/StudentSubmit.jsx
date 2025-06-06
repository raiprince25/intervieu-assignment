import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../assets/Timer.svg';
import { toast } from 'react-toastify';

const StudentSubmit = () => {
  const [questionData, setQuestionData] = useState(null);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionIdMap, setOptionIdMap] = useState({});
  const [uniqueID, setUniqueId] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveQuestion = async () => {
    const response = await fetch('http://localhost:5000/api/results');
    const data = await response.json();

    if (!data.question) {
      navigate('/');
      return;
    }
    setQuestionData({
      question: data.question,
      options: data.options,
      timeLeft: data.timer || 60,
    });

    setUniqueId(data.unique_id);

    // Map option text to ID for selection tracking
    const map = {};
    data.options.forEach((opt) => {
      map[opt.text] = opt._id;
    });
    setOptionIdMap(map);
    setResults(data.options);
  };

    fetchActiveQuestion();

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/results');
        const data = await response.json();
        if (data.options) setResults(data.options);
      } catch (err) {
        toast.error('Polling error:', err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [navigate]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleSubmit(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleSubmit = async () => {
  if (selectedOption === null) return;

  const optionId = selectedOption;
  const questionId = uniqueID; 
  const userName = localStorage.getItem('userName');

  if (!questionId || !userName) {
    toast.error('User info missing. Please join again.');
    navigate('/');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId,  
        userName,   
        optionId 
      }),
    });

    const result = await response.json();
    if (result.success) {
      toast.success('Vote submitted!');
      navigate('/student/results');
    } else {
       if (result.error === 'You have already voted!') {
        toast.info('You have already voted!');
      } else {
        toast.error(result.error || ' Failed to submit vote.');
      }
    }
  } catch (err) {
    toast.error('Submit error:', err);
  }
};


  if (!questionData) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans relative px-4 py-8">
      <div className="w-full max-w-2xl relative">
        <div className="flex gap-4 items-center mb-2">
          <h2 className="font-[Sora] font-semibold text-[22px] text-black">Question 1</h2>
          <div className="font-[Sora] flex items-center font-semibold text-[18px] text-red-600">
            <img src={Timer} alt="Timer" className="w-6 h-6" /> {formattedTime}
          </div>
        </div>
        <div className="rounded-lg border border-gray-300 shadow-sm overflow-hidden">
          <div className="font-[Sora] text-[17px] bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white text-sm font-medium px-5 py-3">
            {questionData.question}
          </div>

          <div className="bg-white px-5 py-5 space-y-4 h-auto">
            {results.map((option, index) => (
              <div
                key={index}
                onClick={() => setSelectedOption(option.text)}
                className={`relative rounded-md py-3 px-4 flex items-center overflow-hidden cursor-pointer
                  ${selectedOption === option.text ? 'border-2 border-[#7B61FF] font-bold' : 'border border-gray-200'} bg-[#F6F6F6]`}
              >
                <div className="relative z-10 flex justify-between items-center w-full">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors duration-150
                        ${selectedOption === option.text 
                          ? 'bg-[#7B61FF] text-white' // Selected: purple bg, white text
                          : 'bg-gray-400 text-white'  // Not selected: gray bg, white text
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm font-[Sora] text-[16px] text-gray-800">
                      {option.text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -bottom-16 right-0">
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white py-2 px-6 rounded-full text-sm font-medium hover:bg-[#684de0] transition disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmit;
