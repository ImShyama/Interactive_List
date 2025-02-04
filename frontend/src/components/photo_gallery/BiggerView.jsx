import React, { useState, useRef } from "react";
import { TbCopy } from "react-icons/tb";
import {
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";

const BiggerView = ({ photo, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level is 1 (100%)
  const [isAutoPlay, setIsAutoPlay] = useState(false); // Track if auto-play is active
  const intervalRef = useRef(null); // Store the interval ID for clearing it later

  if (!photo) {
    return null; // Handle case if no photo is passed
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photo.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photo.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Copy the current page URL to the clipboard
  const handleCopyLink = () => {
    const currentUrl = window.location.href; // Get the current page URL
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("Page link copied to clipboard!"); // Optionally, show an alert or a message
      })
      .catch((error) => {
        console.error("Failed to copy link: ", error);
      });
  };
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Max zoom level 2x
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 1)); // Min zoom level 1x
  };

  // Handle opening the image in a new tab
  const handleExpand = () => {
    const imageUrl = photo.images[currentIndex];
    window.open(imageUrl, "_blank"); // Open image in new tab
  };

  const handlePlayPause = () => {
    if (isAutoPlay) {
      clearInterval(intervalRef.current);
      setIsAutoPlay(false);
    } else {
      // Start auto-play
      setIsAutoPlay(true);
      intervalRef.current = setInterval(() => {
        handleNext(); // Move to the next image
      }, 2000); // Change image every 3 seconds
    }
  };
  // Clear interval when the component is unmounted or closed
  React.useEffect(() => {
    return () => {
      clearInterval(intervalRef.current); // Cleanup on component unmount
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center flex-shrink-0 z-50 bg-[#403535] bg-opacity-85">
      <div className="flex justify-center items-center gap-4 md:gap-[75px] flex-wrap">
        {/* Left Navigation Button */}
        <button
          onClick={handlePrev}
          className="text-white text-4xl p-3 rounded-full"
        >
          <LeftOutlined />
        </button>

        {/* Image Wrapper with Aspect Ratio */}
        <div className="relative w-[90vw] max-w-[800px] aspect-[16/9] flex-shrink-0 rounded-[28px]">
          {/* Image */}
          <img
            src={photo.images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover rounded-[28px]"
            style={{
              transform: `scale(${zoomLevel})`,
              transition: "transform 0.3s",
            }}
          />
        </div>

        {/* Right Navigation Button */}
        <button
          onClick={handleNext}
          className="text-white text-4xl p-3 rounded-full"
        >
          <RightOutlined />
        </button>
        {/* Description Box */}
        <div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-4/5 text-center max-w-[80vw]  text-white  rounded-2xl text-[21px] font-semibold transition-opacity duration-300"
          style={{
            opacity: zoomLevel > 1 ? 0 : 1, // Hide description when zoomed in
          }}
        >
          {photo.description}
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="absolute top-1/2 rounded-full text-2xl bg-opacity-50 right-6 p-6 transform -translate-y-1/2 flex flex-col items-end gap-[41px] w-[44px] flex-shrink-0 text-white">
        {/* Close Button */}
        <button onClick={onClose}>
          <CloseOutlined />
        </button>
        <button onClick={handleCopyLink}>
          <TbCopy />
        </button>
        {/* <button onClick={handleZoomOut}>
          <ZoomOutOutlined />
        </button>
        <button onClick={handleZoomIn}>
          <ZoomInOutlined />
        </button> */}
        <button
          onClick={handleZoomOut}
          className={`rounded-full ${
            zoomLevel > 1 ? "text-white" : "text-gray-500 bg-transparent"
          }`}
          disabled={zoomLevel <= 1} // Disable button at min zoom
        >
          <ZoomOutOutlined />
        </button>

        <button
          onClick={handleZoomIn}
          className={`rounded-full ${
            zoomLevel < 2 ? "text-white" : "text-gray-500 bg-transparent"
          }`}
          disabled={zoomLevel >= 2} // Disable button at max zoom
        >
          <ZoomInOutlined />
        </button>

        <button onClick={handleExpand}>
          <ExpandOutlined />
        </button>

        <button onClick={handlePlayPause}>
          {isAutoPlay ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        </button>
      </div>
    </div>
  );
};

export default BiggerView;
