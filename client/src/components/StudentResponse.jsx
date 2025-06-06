// StudentResponse.js
import React, { useState } from 'react';

const StudentResponse = ({ questionId }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasResponded, setHasResponded] = useState(false);

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:5000/api/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, optionIndex: selectedOption })
      });
      setHasResponded(true);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  if (hasResponded) {
    return <div>Thanks for responding!</div>;
  }

  return (
    <div>
      <h2>{activeQuestion.question}</h2>
      {activeQuestion.options.map((option, index) => (
        <div key={index}>
          <label>
            <input
              type="radio"
              name="response"
              checked={selectedOption === index}
              onChange={() => setSelectedOption(index)}
            />
            {option}
          </label>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};