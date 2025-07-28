


import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import testimonialImage1 from '../../assets/images/testimonialImage1.png';
import testimonialImage2 from '../../assets/images/testimonialImage2.png';
import testimonialImage3 from '../../assets/images/testimonialImage3.png';

const Testimonial = ({ onBack , scrollLocked}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const hasInteracted = useRef(false);
  const scrollLock = useRef(false);

  const images = [testimonialImage1, testimonialImage2, testimonialImage3];

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
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-8 mt-[-20px] overflow-hidden ">
      <motion.img
        src={images[currentImageIndex]}
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
