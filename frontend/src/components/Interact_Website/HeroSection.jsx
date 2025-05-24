


import React, { useEffect, useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { motion, useAnimation } from "framer-motion";  // Import motion and useAnimation

import feature1 from "../../assets/images/feature1.png";
import feature2 from "../../assets/images/feature2.png";
import feature3 from "../../assets/images/feature3.png";
import feature4 from "../../assets/images/feature4.png";
import feature5 from "../../assets/images/feature5.png";
import { useOutletContext } from "react-router-dom";

const features = [
  {
    title: "Google Sheet Integration",
    subtitle: "Seamlessly connect and display data from Google Sheets.",
    image: feature1,
  },
  {
    title: "Dynamic and Interactive Table",
    subtitle: "Filter, sort, and search data easily in real-time.",
    image: feature2,
  },
  {
    title: "Customizable Layout",
    subtitle: "Choose from various views like tables, cards, charts, and maps.",
    image: feature3,
  },
  {
    title: "Live Data Sync",
    subtitle: "Automatically updates when Google Sheets data changes.",
    image: feature4,
  },
  {
    title: "User-Friendly Interface",
    subtitle: "No coding required, simple drag-and-drop customization.",
    image: feature5,
  },
];

const HeroSection = ({ onExit }) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const scrollLock = useRef(false);
  const { heroRef } = useOutletContext();
  const controls = useAnimation();  // Create an animation controller for the section
  
  useEffect(() => {
    if (activeFeatureIndex === features.length - 1) {
      document.body.style.overflow = "auto"; // allow normal scroll
    } else {
      document.body.style.overflow = "hidden"; // lock scroll during feature navigation
    }

    const handleScroll = (e) => {
      if (scrollLock.current) return;

      // If at the last feature and user scrolls down, trigger exit
      if (activeFeatureIndex === features.length - 1 && e.deltaY > 0) {
        onExit?.();  // call onExit to notify parent to switch to AllProducts
        return;
      }

      e.preventDefault();
      scrollLock.current = true;

      if (e.deltaY > 0 && activeFeatureIndex < features.length - 1) {
        setActiveFeatureIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && activeFeatureIndex > 0) {
        setActiveFeatureIndex((prev) => prev - 1);
      }

      setTimeout(() => {
        scrollLock.current = false;
      }, 700);
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel", handleScroll);
    };
  }, [activeFeatureIndex, onExit]);

  // Animate the HeroSection when it's in view
  useEffect(() => {
    controls.start({ x: 0, opacity: 1, transition: { duration: 1 } }); // animate to visible
  }, [controls]);

  const { title, subtitle, image } = features[activeFeatureIndex];

  return (
    <section ref={heroRef} className="relative w-full flex overflow-hidden">
      <motion.div
        initial={{ x: "100%", opacity: 0 }} // Start offscreen on the right
        animate={controls} // Control animation with framer-motion
        exit={{ x: "-100%", opacity: 0 }} // Exit by moving to the left
        className="relative z-10 w-full flex"
      >
        {/* Left Section */}
        <div className="w-1/2 px-12 pt-20 pb-12">
          <button className="bg-[#dbfce4] text-green-800 text-lg px-6 py-2 rounded-full mb-6 flex items-center gap-2 hover:bg-[#c9f5d7] ml-16">
            <Sparkles size={18} /> Features
          </button>

          <ul className="space-y-8">
            {features.map((feature, index) => {
              const isActive = index === activeFeatureIndex;
              return (
                <li
                  key={index}
                  className="flex items-start gap-14 transition-all duration-500 ease-in-out"
                >
                  {/* Bullet circle */}
                  <span
                    className={`mt-2 w-3 h-3 rounded-full flex-shrink-0 ${isActive ? "bg-main" : "bg-gray-300"}`}
                  />
                  <div>
                    <div
                      className={`transition-all duration-500 ${isActive ? "text-black text-4xl font-extrabold" : "text-gray-400 text-xl"}`}
                    >
                      {feature.title}
                    </div>
                    <div
                      className={`mt-1 transition-all duration-500 ${isActive ? "text-gray-700 text-lg font-semibold" : "text-gray-400 text-sm"}`}
                    >
                      {feature.subtitle}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Section */}
        <div className="w-1/2 relative flex justify-center items-center overflow-hidden">
          <motion.div
            initial={{ x: "100%", opacity: 0 }} // Start offscreen on the right
            animate={controls} // Control animation with framer-motion
            exit={{ x: "-100%", opacity: 0 }} // Exit by moving to the left
            className="relative w-full h-full flex justify-center items-start pt-16"
          >
            <img
              src={features[activeFeatureIndex].image}
              alt={features[activeFeatureIndex].title}
              className="max-w-[100%] max-h-[90%] object-contain transition-all duration-700 ease-in-out -mt-12"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
