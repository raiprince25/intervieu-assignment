import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import arrow_drop from '../assets/arrow_drop.svg';
import { useNavigate } from 'react-router-dom';

const TeacherMainBoard = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: 'Option 1', isCorrect: false },
    { text: 'Option 2', isCorrect: false },
  ]);

  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [isQuestionActive, setIsQuestionActive] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleAskQuestion = async () => {
    try {
      const response = await fetch('https://new-backend-1-kyhx.onrender.com/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options, timer })
      });
      
      const data = await response.json();
      if (data.success) {
        navigate('/teacher/results');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index, value) => {
    const newOptions = options.map((opt, i) =>
      i === index ? { ...opt, isCorrect: value } : opt
    );
    setOptions(newOptions);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-4 md:p-8 font-sans relative">
      <div className="w-full max-w-4xl">
        <div className="mb-2 flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-32 md:w-40" />
        </div>
        <div className="w-full md:w-[737px] h-auto md:h-[50px] gap-4 md:gap-[26px]">
          <h1 className="w-full">
            <span className="font-[Sora] font-normal text-3xl md:text-[40px] leading-[100%] tracking-[0%]">
              Let's
            </span>
            <span className="font-[Sora] font-semibold text-3xl md:text-[40px] leading-[100%] tracking-[0%]">
              {' '}Get Started
            </span>
          </h1>
        </div>
        <p className="font-[Sora] font-normal text-gray-500 text-sm md:text-base mb-4 max-w-[450px]">
          you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>
      </div>

      <div className="w-full max-w-4xl mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
          <label className="font-semibold text-lg md:text-[20px] leading-[100%] text-gray-800">Enter your question</label>
          <div className="relative w-full md:w-auto">
            <select
              value={timer}
              onChange={(e) => setTimer(parseInt(e.target.value))}
              className="appearance-none w-full md:w-auto bg-[#F1F1F1] border-gray-30 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-blue-500 text-gray-800"
            >
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
              <img src={arrow_drop} alt="Logo" className="h-2" />
            </div>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={100}
            rows={5}
            placeholder="Type your question here..."
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
            {question.length}/100
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-[320px_auto] items-center mb-3 gap-4">
          <h2 className="text-lg md:text-[20px] font-[Sora] font-semibold text-gray-800">Edit Options</h2>
          <h2 className="text-lg md:text-[20px] font-[Sora] font-semibold text-gray-800 hidden md:block">Is it Correct?</h2>
        </div>

        {options.map((option, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-[320px_auto] gap-4 items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                {index + 1}
              </div>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full h-full px-4 py-2 md:text-[16px] font-[Sora] rounded-md bg-[#F5F5F5] text-sm text-gray-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 text-sm ml-8 md:ml-0">
              <span className="text-gray-700 md:hidden">Correct?</span>
              <label className="flex items-center gap-1 text-gray-700">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.isCorrect === true}
                  onChange={() => handleCorrectChange(index, true)}
                  className="form-radio text-base md:text-[16px] font-[sora] accent-purple-600 h-4 w-4"
                />
                Yes
              </label>
              <label className="flex items-center gap-1 text-gray-700">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.isCorrect === false}
                  onChange={() => handleCorrectChange(index, false)}
                  className="form-radio text-base md:text-[16px] font-[sora] accent-purple-600 h-4 w-4"
                />
                No
              </label>
            </div>
          </div>
        ))}
        <button
          onClick={handleAddOption}
          className="text-sm mt-2 text-purple-600 border border-purple-600 px-4 py-1 rounded-md hover:bg-purple-50 transition"
        >
          + Add More option
        </button>
      </div>
      <div className="w-full max-w-4xl mx-auto mt-8 md:mt-16">
        <hr className="border-t border-gray-300" />

        <div className="mt-6 flex justify-center md:justify-end mb-12">
          <button
            onClick={handleAskQuestion}
            className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] hover:opacity-90 transition text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg w-full md:w-auto"
          >
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherMainBoard;