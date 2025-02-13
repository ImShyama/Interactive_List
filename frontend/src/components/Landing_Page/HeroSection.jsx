import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import GoogleSlide1 from "../../assets/images/GoogleSlide1.png";
import GoogleSlide2 from "../../assets/images/GoogleSlide2.png";
import GoogleSlide3 from "../../assets/images/GoogleSlide3.png";
import GoogleSlide4 from "../../assets/images/GoogleSlide4.png";
import LeftArrow from "../../assets/images/LeftArrow.png";
import RightArrow from "../../assets/images/RightArrow.png";
import UpperArrow from "../../assets/images/UpperArrow.png";
import SmallCircle from "../../assets/images/SmallCircle.png";
import Star from "../../assets/images/Star.png";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [showSections, setShowSections] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const navigate = useNavigate();
   const { token } = useContext(UserContext);

  useEffect(() => {
    const sectionTimer = setTimeout(() => {
      setShowSections(true);
    }, 500);

    // Show right section circle after 1s (delay)
    const circleTimer = setTimeout(() => {
      setShowCircle(true);
    }, 500);

    return () => {
      clearTimeout(sectionTimer);
      clearTimeout(circleTimer);
    };
  }, []);

  return (
    <div className=" w-[100%] h-[100vh] flex overflow-auto bg-[#FFF] ">
      {/* Left Section - Text and Button */}
      <div
        className={`left-section w-[40%] flex flex-col items-start justify-center pl-[76px] mt-[-181px] ${
          showSections ? "slide-in" : ""
        }`}
      >
        <div className="text-[#353535] font-poppins text-[3vw] font-normal leading-normal w-[120%]">
          Bring Google Sheets to Life with Our Custom App.
        </div>
       
        <button
          className="mt-[56px] py-[1rem] px-[2rem] flex justify-center items-center gap-[4px] rounded-[16px] bg-[#598931] flex-shrink-0"
          // onClick={() => navigate("/home")}
          onClick={() => {
            if (token) {
              navigate("/dashboard"); // Redirect to appView if user is signed in
            } else {
              navigate("/signin"); // Redirect to sign-in page if not signed in
            }
          }}
        >
          <span className="text-white font-poppins text-[28px] font-medium leading-normal">
            Explore Now
          </span>
        </button>
      </div>

      {/* Right Section - Circle with Seat Image Reveal*/}
      <div
        className={`right-section w-[60%] flex justify-center items-center mt-[-70px] relative ${
          showCircle ? "fade-in" : ""
        }`}
      >
        <div className="w-[37vw] h-[37vw] rounded-full bg-[#F1FDE7] shadow-lg  flex items-center justify-center">
          <motion.img
            src={GoogleSlide1}
            alt="Google Slide 1"
            // className="absolute left-[60px] bottom-[210px] w-80 h-55"
            className="absolute w-[21vw] h-[14vw]"
            style={{ marginRight: "50%", marginBottom: "-12%" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          />

          <motion.img
            src={GoogleSlide2}
            alt="Google Slide 2"
            // className="absolute bottom-[120px] w-90 h-60 z-10"
            className="absolute w-[25vw] h-[16vw] z-10"
            style={{ marginRight: "5%", marginBottom: "-30%" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          />

          <motion.img
            src={GoogleSlide3}
            alt="Google Slide 3"
            // className="absolute right-[60px] bottom-[210px] w-80 h-55"
            className="absolute w-[21vw] h-[14vw]"
            style={{ marginLeft: "50%", marginBottom: "-12%" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          />

          <motion.img
            src={GoogleSlide4}
            alt="Google Slide 4"
            // className="absolute left-[220px] bottom-[460px] w-80 h-55"
            className=" w-[25vw] h-[16vw]"
            style={{ marginRight: "34%", marginBottom: "70%" }}
            initial={{ opacity: 0, y: 20, rotate: -20 }} // Start with a slight tilt
            animate={{ opacity: 1, y: 0, rotate: 0 }} // Rotate back to normal
            transition={{ duration: 2, delay: 1, ease: "easeOut" }}
          />

         

          <img
            src={RightArrow}
            alt="Right Arrow"
            className="absolute"
            style={{
              right: "14.5vw", 
              bottom: "51vh", 
              width: "16vw", 
              height: "16vh", 
            }}
          />

          {/* Left Arrow (Pointing from GoogleSlide1 to SmallCircele joint ) */}

          <img
            src={LeftArrow}
            alt="Left Arrow"
            className="absolute"
            style={{
              left: "17vw",
              bottom: "60vh",
              width: "20vw",
              height: "7vh",
            }}
          />

          {/* Small Circle */}

          <img
            src={SmallCircle}
            alt="Small Circle"
            className="absolute"
            style={{
              right: "18.5vw", // Adjusts position relative to viewport width
              bottom: "68vh", // Adjusts position relative to viewport height
              width: "6vw", // Adjusts size relative to viewport width
              height: "6vw", // Keeps the shape proportional
            }}
          />
         

          <img
            src={UpperArrow}
            alt="Upper Arrow"
            className="absolute"
            style={{
              right: "20vw", 
              bottom: "82vh", 
              width: "5.5vw", 
              height: "6vh", 
            }}
          />

          {/* Star */}

          <motion.img
            src={Star}
            alt="Star"
            className="absolute"
            style={{
              right: "18.5vw", // Adjusts position relative to viewport width
              bottom: "66vh", // Adjusts position relative to viewport height
              width: "6.5vw", // Scales width with viewport width
              height: "7vw", // Scales height proportionally
            }}
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
      </div>
    </div>
  );
};
export default HeroSection;

