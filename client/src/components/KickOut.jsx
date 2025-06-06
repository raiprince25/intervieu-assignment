import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import loading from '../assets/loading.svg';

const KickOut = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <img src={logo} alt="Logo" className="w-46 mb-4" />
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="w-[600px] text-[40px] font-[Sora] font-normal text-[#000000] leading-tight">
            You’ve been Kicked out !
          </p>
          <p className="w-[600px] text-[19px] font-[Sora] font-normal text-[#313131]">
            Looks like the teacher had removed you from the poll system .Please Try again sometime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KickOut;