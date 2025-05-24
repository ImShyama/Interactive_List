

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import directoryImg from "../../assets/images/thumbnail1.png";
import mapImg from "../../assets/images/thumbnail2.png";
import listImg from "../../assets/images/thumbnail3.png";
import { useNavigate } from "react-router-dom";
import { APPS } from "../../utils/constants";

const products = APPS
// [
//   {
//     title: "People Directory",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     image: directoryImg,
//   },
//   {
//     title: "Interactive Map",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     image: mapImg,
//   },
//   {
//     title: "Interactive List",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     image: listImg,
//   },
// ];

const AllProducts = ({ onExit, onBack,scrollLocked }) => {
  const hasInteracted = useRef(false);
  const scrollLock = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleWheel = (e) => {
      const { deltaY } = e;
      const bottomReached = window.innerHeight + window.scrollY >= document.body.scrollHeight - 5;
      const topReached = window.scrollY === 0;

      if (scrollLock.current || scrollLocked) return;
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        return;
      }

      if (deltaY > 0 && bottomReached) {
        scrollLock.current = true;
        onExit?.();
      } else if (deltaY < 0 && topReached) {
        scrollLock.current = true;
        onBack?.();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [onExit, onBack]);

  return (
    <section className="w-full max-h-[100vh] overflow-y-scroll py-24 px-6 md:px-12 min-h-screen ">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Choose What actually&nbsp;
          <span className="whitespace-nowrap">you needed</span>
          <br /> from our wide range of Apps
        </motion.h2>

        <motion.button
          onClick={() => navigate("/products")}
          className="bg-main hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full text-lg mt-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          See All Products →
        </motion.button>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {products.slice(0, 3).map((product, idx) => (
            <div
              key={idx}
              className="bg-[#f4fff6] rounded-2xl p-6 text-left hover:shadow-lg transition shadow-md"
            >
              <img src={product.appImg} alt={product.title} className="w-full mb-4 rounded-xl" />
              <h3 className="text-lg font-semibold mb-2">{product.appName}</h3>
              <p className="text-gray-500 text-sm">{product.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AllProducts;