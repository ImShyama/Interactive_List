import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Star from "../../assets/images/Star.png";
import SmallCircle from "../../assets/images/SmallCircle.png";
const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col items-start justify-start bg-white px-12 pt-[80px]">
      <div className="text-[#598931] font-poppins text-[59.755px] font-semibold leading-normal self-stretch">
        About Our Product
      </div>

      <p className="mt-0 mb-0 text-[#353535] font-poppins text-[20.514px] font-normal leading-normal transform rotate-[0.02deg] self-stretch max-w-3xl">
        Welcome to [Your App Name], the ultimate solution for transforming
        disorganized Google Sheets into sleek, interactive applications. Our
        mission is simple: to make your data more accessible, organized, and
        visually appealing, no matter the purpose.
      </p>
      <p className=" text-[#353535] font-poppins text-[20.514px] font-normal leading-normal transform rotate-[0.02deg] self-stretch max-w-3xl mb-0 mt-0">
        At [Your App Name], we believe that sharing data shouldn’t be a hassle.
        We’ve created a platform that turns your spreadsheets into functional
        and user-friendly apps.
      </p>

      <button
          className="mt-[42px] py-[1rem] px-[2rem] flex justify-center items-center gap-[4px] rounded-[16px] bg-[#598931] flex-shrink-0"
          onClick={() => navigate("/explore")}
        >
          <span className="text-white font-poppins text-[25px] font-medium leading-normal">
            Explore Now
          </span>
        </button>
     
      <div className="absolute right-[160px] top-[280px] z-10">
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
      <div className="absolute right-[230px] top-[280px] transform scale-150">
        <img src={SmallCircle} alt="Small Circle"/>
      </div>
    </div>
  );
};

export default AboutSection;
