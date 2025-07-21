import React, { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../../context/UserContext";

const LoadingPage = ({ onScroll }) => {
  const { initialLoadingCount, setInitialLoadingCount } = useContext(UserContext);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        onScroll();  // Trigger the transition when scroll occurs
        // setInitialLoadingCount(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onScroll]);

  return (
    <div className="">
    <div className="min-h-screen w-full flex items-center justify-center text-center px-4 relative overflow-y-scroll">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          borderRadius: "80px",
          background: "#F4FDED",
        }}
        className="relative backdrop-blur-lg px-6 py-20 shadow-md max-w-3xl w-full"
      >
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://i.ibb.co/sbwvB0L/logo-png-1-1.webp"
            alt="Logo"
            className="h-6 w-6 mr-2"
          />
          <span className="text-lg font-semibold text-gray-700">
            INTERACTIVE
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Transform Your Google Sheets into a Powerful App
        </h1>

        <p className="mt-4 text-gray-600 text-sm sm:text-base">
          Seamlessly Convert Data into an Interactive Experience
        </p>

        {/* Custom SVG Scroll Icon positioned beside the card */}
        <motion.div
          onClick={onScroll}
          className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="74"
            viewBox="0 0 58 104"
            fill="none"
          >
            <rect
              x="10.6602"
              y="2.5"
              width="36.6732"
              height="60.0895"
              rx="17.3444"
              stroke="#3D465E"
              strokeWidth="5"
            />
            <rect
              x="23.8371"
              y="13.343"
              width="10.3191"
              height="19.8444"
              rx="5.15953"
              fill="#3D465E"
              stroke="#3D465E"
              strokeWidth="0.396887"
            />
            <path
              d="M3 62.9062L27.5107 87.4169C28.4407 88.3469 29.9484 88.3469 30.8784 87.417L55.3891 62.9062"
              stroke="#3D465D"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M3 75.8047L27.5107 100.315C28.4407 101.245 29.9484 101.245 30.8784 100.315L55.3891 75.8047"
              stroke="#3D465D"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
    </div>
  );
};

export default LoadingPage;
