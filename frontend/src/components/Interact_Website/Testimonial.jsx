


import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import testimonialImage1 from '../../assets/images/Testimonial_Img1.png';
import testimonialImage2 from '../../assets/images/Testimonial_Img2.png';

const Testimonial = ({ onBack , scrollLocked}) => {
  const [showFirst, setShowFirst] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const hasInteracted = useRef(false);
  const scrollLock = useRef(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      const { deltaY } = e;
      const atTop = window.scrollY === 0;

      if (scrollLock.current || scrollLocked) return;
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        return;
      }

      if (deltaY < 0 && atTop) {
        scrollLock.current = true;
        onBack?.(); // Go back to AllProducts
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [onBack]);

  const handleImageClick = () => {
    setShowFirst((prev) => !prev);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-8 mt-[-20px] overflow-hidden ">
      <motion.img
        src={showFirst ? testimonialImage1 : testimonialImage2}
        alt="Client Testimonial Slide"
        className="w-[70%] h-auto rounded-lg shadow-md cursor-pointer"
        onClick={handleImageClick}
        initial={{ y: 100, opacity: 0 }}
        animate={hasMounted ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
};

export default Testimonial;
