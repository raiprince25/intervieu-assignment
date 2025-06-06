import React, { useState } from 'react'; // Added missing useState import
import logo from '../assets/logo.svg';
import loading from '../assets/loading.svg';

const StudentNoPoll = () => {
  const [isPollActive, setIsPollActive] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <img src={logo} alt="Logo" className="w-40 mb-12" />
      <div className="flex flex-col items-center justify-center">
        <div className="text-[120px] font-bold text-gray-800 mb-8 leading-none">
          <img src={loading} alt="Logo" className="w-[57px]  h-[58px] mb-4" />
        </div>
        
        <div className="text-center">
          <p className="text-[33px] font-[Sora] font-semibold text-[#000000] leading-tight">
           Wait for the teacher to ask questions..
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentNoPoll;