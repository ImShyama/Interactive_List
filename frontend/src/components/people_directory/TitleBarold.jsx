import React from "react";
import { LiaUndoAltSolid } from "react-icons/lia";
import { IoMdArrowBack } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
const TitleBar = () => {
  return (
    <div className="flex justify-between items-center bg-transparent box-border py-[10px] px-[20px]">
      {/* Title Section */}
      <div className="flex items-center justify-start w-full gap-[38px]">
        <IoMdArrowBack className="text-[28px] text-black " />
        <h1 className="text-[30px] font-medium leading-normal text-[#2A3C54] font-poppins m-0">
          People Directory Preview
        </h1>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-[20px]">
        <button className="flex justify-center items-center w-[41.163px] h-[41.163px] bg-[#598931] border-none rounded-[5.145px] cursor-pointer transition-colors duration-300 hover:bg-[#497626]">
          <IoSearch className="text-white w-[22.297px] h-[22.297px] " />
        </button>
        <button className="flex justify-center items-center w-[41.163px] h-[41.163px] bg-[#598931] border-none rounded-[5.145px] cursor-pointer transition-colors duration-300 hover:bg-[#497626]">
          <LiaUndoAltSolid className="text-white w-[22.297px] h-[22.297px] " /> {/* Undo icon */}
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
