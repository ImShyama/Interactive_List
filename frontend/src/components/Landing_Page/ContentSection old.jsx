import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import GoogleSlide1 from "../../assets/images/GoogleSlide1.png";
import GoogleSlide2 from "../../assets/images/GoogleSlide2.png";
import GoogleSlide3 from "../../assets/images/GoogleSlide3.png";
import GoogleSlide5 from "../../assets/images/GoogleSlide5.png";
import LeftArrow from "../../assets/images/LeftArrow.png";
import RightArrow from "../../assets/images/RightArrow.png";
import Star from "../../assets/images/Star.png";
import SmallCircle from "../../assets/images/SmallCircle.png";
import ArrowUpper from "../../assets/images/ArrowUpper.png";
import ArrowBelow from "../../assets/images/ArrowBelow.png";

const ContentSection = () => {
  const [showSections, setShowSections] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(UserContext);
  useEffect(() => {
    const timer = setTimeout(() => setShowSections(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-auto flex flex-col  bg-white px-10">
      {/* <div className="text-2xl font-bold text-green-600">What does it actually do?</div> */}
      <div className="text-[60px] font-poppins justify-center text-center font-bold leading-normal bg-gradient-to-r from-[#598931] to-[#97CE69] bg-clip-text text-transparent mb-10 ">
        What does it actually do?
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-center w-full relative">
        
        <motion.img
          src={GoogleSlide5}
          alt="Google Slide 5"
          className="w-[35vw] h-[22vw]" // Adjusted for viewport responsiveness
          style={{ marginRight: "10%", marginTop: "-1%" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
        {/* ArrowUpper pointing from GoogleSlide5 to middle of GoogleSlide1 & GoogleSlide3 */}
        <img
          src={ArrowUpper}
          alt="Arrow Upper"
          className="absolute top-[55%] left-[41%] w-[400px] rotate-[1deg]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />

        <ul className="list-disc pl-6 space-y-4 md:pl-10 md:mt-5 text-[#323232] font-poppins text-[35px] font-normal leading-normal w-[600px]">
          <li>Tired of Unorganized and Complex Data?</li>
          <li>Can’t Find What is Actually Needed?</li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full">
        {/* Text Section */}
        <div className="text-left text-sm md:text-base mt-6 md:mt-0 md:w-1/2">
          <ul className="list-disc pl-16 space-y-4 md:pl-[93px] md:mt-10 text-[#323232] font-poppins text-[35px] font-normal leading-normal w-[600px]">
            <li>Want such type of Organized and Clean Data?</li>
            <li>Which will be easy to Access, Share, and Easy to Find.</li>
          </ul>
        </div>

        {/* Overlapping Slide Images (No Background Container) */}
        <div className="relative w-full flex justify-center mt-2">
          {/* Google Slide 1 - Small to Big (Alternating) */}

          <motion.img
            src={GoogleSlide1}
            alt="Google Slide 1"
            className="absolute"
            style={{
              top: "-2vh", // Adjust positioning based on viewport height
              left: "0vw", // Position it dynamically from the left
              width: "26vw", // Adjust width to scale proportionally
            }}
            initial={{ scale: 0.6 }}
            animate={{ scale: [0.6, 1, 0.6] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
            }}
          />

          {/* Google Slide 2 - Opposi te Scale Animation */}
          <motion.img
            src={GoogleSlide2}
            alt="Google Slide 2"
            className="absolute z-20"
            style={{
              top: "2vh", // Adjust positioning based on viewport height
              left: "12vw", // Position it dynamically from the left
              width: "26vw", // Adjust width to scale proportionally
            }}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.6, 1] }} // Big to Small to Big (Opposite)
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
            }}
          />

          {/* Google Slide 3 - Small to Big (Alternating) */}

          <motion.img
            src={GoogleSlide3}
            alt="Google Slide 3"
            className="absolute"
            style={{
              top: "-2vh", // Adjust positioning based on viewport height
              left: "22vw", // Position it dynamically from the left
              width: "26vw", // Adjust width to scale proportionally
            }}
            initial={{ scale: 0.6 }}
            animate={{ scale: [0.6, 1, 0.6] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
            }}
          />
          {/* ArrowBelow pointing from GoogleSlide2 to SmallCircle */}
          <img
            src={ArrowBelow}
            alt="Arrow Below"
            className="absolute top-[210px] right-[70%] w-[20vw] rotate-[10deg]"
          />
        </div>
      </div>

      {/* Star and SmallCircle positioned below text section */}
      <div className="flex justify-center mt-10 relative">
        <div className="absolute top-1/2 left-[330px] z-10">
          <motion.img
            src={Star}
            alt="Logo"
            className="w-[180px]"
            animate={{
              scale: [1, 1.1, 1], // Scale up to 1.1x and back to normal
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="absolute top-1/2 left-[365px] transform scale-120">
          <img src={SmallCircle} alt="Small Circle" />
        </div>
      </div>
      {/* CTA Buttons */}
      <div className="mb-10 ml-[48%] flex flex-col items-start">
        <p className="mt-4 text-[#353535] font-poppins text-[40px]">
          Try Our App For the Same!!
        </p>
        <div className="flex gap-6">
          <button
            className="bg-[#598931] text-white px-7 py-2 text-lg font-semibold rounded-xl shadow-lg"
            // onClick={() => navigate("/signin")}
            onClick={() => {
              if (token) {
                navigate("/dashboard"); // Redirect to appView if user is signed in
              } else {
                navigate("/signin"); // Redirect to sign-in page if not signed in
              }
            }}
          >
            Explore Now
          </button>
          <button
            className="border border-[#598931] text-[#598931] px-10 py-3 text-lg  rounded-xl shadow-lg"
            onClick={() => navigate("/about")}
          >
            Learn more about this
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
