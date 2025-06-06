import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Eye from '../assets/Eye.svg'; // Assuming Eye.svg is used for the back button, as per your snippet

const PollHistory = () => {
  const [pollHistory, setPollHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPollHistory = async () => {
      try {
        // Use a more robust API endpoint for poll history that returns questions with their options and percentages
        const response = await fetch('http://localhost:5000/api/polls/history'); 
        const data = await response.json();
        setPollHistory(data);
      } catch (error) {
        console.error('Error fetching poll history:', error);
      }
    };

    fetchPollHistory();
  }, []);

  if (!pollHistory.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        Loading poll history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans relative px-4 py-8">
      <div className="w-full max-w-2xl mx-auto space-y-8 mt-16"> {/* Added mt-16 to avoid overlap with back button */}
        <h1 className="text-[33px] font-[Sora] font-semibold text-center leading-tight text-black">View Poll History</h1>

        {pollHistory.map((poll, pollIndex) => {
          // Calculate total votes and max percentage option for each poll
          const totalVotes = poll.options.reduce((sum, option) => sum + option.percentage, 0);
          const maxPercentageOption = totalVotes > 0
            ? poll.options.reduce((max, option) => option.percentage > max.percentage ? option : max, { percentage: -1, text: '' })
            : null;

          return (
            <div key={poll._id || pollIndex} className="w-full relative"> {/* Use poll._id for key if available */}
              {/* Question Label */}
              <h2 className="font-[Sora] font-semibold text-[22px] text-black mb-2">Question {pollIndex + 1}</h2> {/* Dynamic question number */}

              {/* Question Card */}
              <div className="rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="font-[Sora] text-[17px] bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white text-sm font-medium px-5 py-3">
                  {poll.question}
                </div>

                {/* Options */}
                <div className="bg-white px-5 py-5 space-y-4 h-auto">
                  {poll.options.map((option, optionIndex) => {
                    // Determine if this option is the dominant (highest percentage) for styling
                    const isDominant = maxPercentageOption && option.percentage === maxPercentageOption.percentage && option.percentage > 0;
                    const hasVotes = option.percentage > 0;

                    return (
                      <div
                        key={option._id || optionIndex} // Use option._id for key if available
                        className={`relative rounded-md py-3 px-4 flex items-center overflow-hidden
                          ${isDominant ? 'border-2 border-[#AF8FF1] bg-white' : 'bg-[#F6F6F6]'}
                        `}
                      >
                        {/* Background bar for percentage */}
                        {hasVotes && ( // Only show bar if there are votes
                          <div
                            className={`absolute top-0 left-0 h-full rounded-md transition-all duration-300
                              ${isDominant ? 'bg-[#6766D5]' : 'bg-[#6766D5]'}` // Both dominant and non-dominant use same bar color as per image
                            }
                            style={{ width: `${option.percentage}%` }}
                          ></div>
                        )}

                        <div className="relative z-10 flex justify-between items-center w-full">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border text-xs font-semibold flex items-center justify-center
                                ${isDominant
                                  ? 'bg-white border-[#7B61FF] text-[#7B61FF]'
                                  : 'bg-white border-[#D1D1D1] text-[#7B61FF]'
                                }`}
                            >
                              {optionIndex + 1}
                            </div>
                            <span
                              className={`text-sm font-[Sora] text-[16px] ${isDominant ? 'text-gray-800 font-semibold' : 'text-gray-800'}`}
                            >
                              {option.text}
                            </span>
                          </div>
                          <span
                            className={`text-sm font-[Sora] text-[16px] font-semibold
                              ${hasVotes ? 'text-black' : 'text-black'}`}
                          >
                            {option.percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollHistory;