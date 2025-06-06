import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.svg'; // Make sure to import your actual logo image

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
      {/* Logo */}
      <img src={logo} alt="Logo" className="w-40 mb-2" />
      <div className="w-[981px] flex flex-col items-center gap-[69px]">
        <div className="w-[600px] h-[103px] flex flex-col gap-[12px] mx-auto">
          <h1 className="w-full font-[Sora] text-[40px] leading-[40px] tracking-[0%] font-normal text-center mt-2">
            Welcome to the <span className="font-semibold">Live Polling System</span>
          </h1>

          <p className="w-full font-[Sora] text-[19px] break-words leading-[19px] tracking-[0%] text-center text-gray-600 ">
            Please select the role that best describes you to begin using the live polling system
          </p>

        </div>
      </div>

      <div className="w-[600px] h-[143px] flex gap-4 mt-6 mb-6">
        <div
          onClick={() => handleRoleSelect('student')}
          className={`w-[737px] h-[143px] flex flex-col gap-[17px] pt-[15px] pr-[17px] pb-[15px] pl-[25px] rounded-[10px] border-[3px] cursor-pointer transition-colors duration-200 ${
            selectedRole === 'student'
              ? 'border-[#8F64E1]'
              : 'border-[#D3D3D3] hover:shadow-md'
          }`}
        >

          <h3 className="font-[Sora] font-semibold text-[23px] leading-[23px] tracking-[0%] text-gray-800">
            I'm a Student
          </h3>
          <div className="text-gray-400 mb-6 space-y-1">
            <p className="font-[Sora] font-normal text-[14px] leading-[16px] tracking-[0%]">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </div>
        </div>
        
        {/* Teacher Card */}
        <div
          onClick={() => handleRoleSelect('teacher')}
          className={`w-[737px] h-[143px] flex flex-col gap-[17px] pt-[15px] pr-[17px] pb-[15px] pl-[25px] rounded-[10px] border-[3px] cursor-pointer transition-colors duration-200 ${
            selectedRole === 'teacher'
              ? 'border-[#8F64E1]'
              : 'border-[#D3D3D3] hover:shadow-md'
          }`}
        >

          <h3 className="font-[Sora] font-semibold text-[23px] leading-[23px] tracking-[0%] text-gray-800">
            I'm a Teacher
          </h3>
          <div className="text-gray-400 mb-6 space-y-1">
            <p className="font-[Sora] font-normal text-[16px] leading-[14px] tracking-[0%]">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
          
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className={`w-[200px] mt-2 h-[48px] rounded-[36px] text-white font-semibold transition-colors duration-200 ${
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