import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.svg';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("student");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === 'student') navigate('/student');
    if (selectedRole === 'teacher') navigate('/teacher');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      {/* Logo - Made responsive */}
      <img src={logo} alt="Logo" className="w-32 md:w-40 mb-4 md:mb-8" />
      
      {/* Welcome section - Made responsive */}
      <div className="w-full max-w-[981px] flex flex-col items-center gap-8 md:gap-[69px] px-4">
        <div className="w-full max-w-[600px] flex flex-col gap-3 md:gap-[12px] mx-auto">
          <h1 className="w-full font-[Sora] text-2xl md:text-[40px] leading-tight md:leading-[40px] tracking-normal font-normal text-center">
            Welcome to the <span className="font-semibold">Live Polling System</span>
          </h1>

          <p className="w-full font-[Sora] text-base md:text-[19px] leading-normal md:leading-[19px] tracking-normal text-center text-gray-600">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>
      </div>

      {/* Role cards - Made responsive with flex-col on mobile */}
      <div className="w-full max-w-[600px] flex flex-col md:flex-row gap-4 mt-6 mb-6 px-4">
        {/* Student Card */}
        <div
          onClick={() => handleRoleSelect('student')}
          className={`w-full md:w-[737px] h-auto md:h-[143px] flex flex-col gap-2 md:gap-[17px] p-4 md:pt-[15px] md:pr-[17px] md:pb-[15px] md:pl-[25px] rounded-[10px] border-[3px] cursor-pointer transition-colors duration-200 ${
            selectedRole === 'student'
              ? 'border-[#8F64E1]'
              : 'border-[#D3D3D3] hover:shadow-md'
          }`}
        >
          <h3 className="font-[Sora] font-semibold text-lg md:text-[23px] leading-tight md:leading-[23px] tracking-normal text-gray-800">
            I'm a Student
          </h3>
          <div className="text-gray-400 mb-2 md:mb-6 space-y-1">
            <p className="font-[Sora] font-normal text-sm md:text-[14px] leading-snug md:leading-[16px] tracking-normal">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </div>
        </div>
        
        {/* Teacher Card */}
        <div
          onClick={() => handleRoleSelect('teacher')}
          className={`w-full md:w-[737px] h-auto md:h-[143px] flex flex-col gap-2 md:gap-[17px] p-4 md:pt-[15px] md:pr-[17px] md:pb-[15px] md:pl-[25px] rounded-[10px] border-[3px] cursor-pointer transition-colors duration-200 ${
            selectedRole === 'teacher'
              ? 'border-[#8F64E1]'
              : 'border-[#D3D3D3] hover:shadow-md'
          }`}
        >
          <h3 className="font-[Sora] font-semibold text-lg md:text-[23px] leading-tight md:leading-[23px] tracking-normal text-gray-800">
            I'm a Teacher
          </h3>
          <div className="text-gray-400 mb-2 md:mb-6 space-y-1">
            <p className="font-[Sora] font-normal text-sm md:text-[16px] leading-snug md:leading-[14px] tracking-normal">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className={`w-full max-w-[200px] mt-2 h-12 md:h-[48px] rounded-[36px] text-white font-semibold transition-colors duration-200 ${
          selectedRole
            ? 'bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] hover:opacity-90'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default RoleSelection;