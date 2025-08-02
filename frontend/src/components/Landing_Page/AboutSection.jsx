

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Star from "../../assets/images/Star.png";
import SmallCircle from "../../assets/images/SmallCircle.png";
const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[100%-50px] flex flex-col items-start justify-start px-12 pt-[80px]">
      <div className="w-[60%]">
        <div className="text-main font-poppins text-[42.755px] font-semibold leading-normal self-stretch">
          About Our Product
        </div>
        <p className="text-[#323232] font-poppins text-[22px] font-medium leading-normal  mb-6">
          Welcome to Interact Tools – Where spreadsheets meet innovation!
        </p>

        <p className="mt-0 mb-0 text-[#353535] font-poppins text-[18px] font-normal leading-normal transform rotate-[0.02deg] self-stretch max-w-3xl">
          Tired of messy, hard-to-manage Google Sheets? We’ve got you covered. Interact List transforms your spreadsheets into sleek, interactive applications—no coding, no complexity, just seamless functionality.

        </p>
        <p className=" text-[#353535] font-poppins text-[18px] font-normal leading-normal transform rotate-[0.02deg] self-stretch max-w-3xl mb-0 mt-0">
          Whether you're managing projects, streamlining workflows, or sharing insights, our platform helps you create dynamic, user-friendly apps in minutes. Make your data work for you—organized, accessible, and visually engaging.
          Say goodbye to static spreadsheets and hello to a smarter, more efficient way to manage information. Start building with Interact List today!
        </p>

        <button
          className="mt-[42px] py-[1rem] px-[2rem] flex justify-center items-center gap-[4px] rounded-[16px] bg-main flex-shrink-0"
          onClick={() => navigate("/dashboard")}
        >
          <span className="text-white font-poppins text-[20px] font-medium leading-normal">
            Explore Now
          </span>
        </button>
      </div>
      <div className="w-[40%]">
        <div className="absolute right-[200px] top-[240px] z-10">
          <motion.img
            src={Star}
            alt="App Logo"
            className="w-[280px]"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="absolute right-[230px] top-[220px] transform scale-100">
          <img src={SmallCircle} alt="Small Circle" />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;