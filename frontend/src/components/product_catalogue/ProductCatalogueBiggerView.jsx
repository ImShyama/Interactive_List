import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { CgArrowsExpandRight } from "react-icons/cg";
import { PiStarFour } from "react-icons/pi";
import { GoLink } from "react-icons/go";
import { LiaFileVideo } from "react-icons/lia";
import { Carousel } from "antd";

const ProductCatalogueBiggerView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    title,
    subtitle,
    description,
    multipleimages = [],
    sheetlink,
    videolink,
    features,
  } = location.state || {};

  // State to track active section (default: "features")
  const [activeSection, setActiveSection] = useState("features");
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className="min-h-screen bg-white flex flex-col p-2">
      {/* Product Image and Description Section - Full Width */}
      <div className="w-[90%] md:w-[95%] mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-[#598931] p-2 rounded-full shadow-md z-10"
            >
              <IoArrowBack className="text-white text-3xl" />
            </button>

            <div className="relative w-full bg-[#FDFEFF] rounded-[51.746px] border-[2.07px] border-[#F1F1F1] shadow-lg overflow-hidden h-auto">
              <Carousel
                ref={carouselRef}
                autoplay={true}
                dots={true}
                className="w-full h-full"
                afterChange={(index) => setCurrentIndex(index)}
              >
                {multipleimages.length > 0 ? (
                  multipleimages.map((img, index) => (
                    <div key={index} className="w-full h-full">
                      <img
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-[320px] object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No images available
                  </div>
                )}
              </Carousel>

              <div className="absolute bottom-4 left-0 w-full py-2 flex justify-center">
                <ul className="custom-carousel-dots"></ul>
              </div>

              <button
                onClick={() =>
                  window.open(multipleimages[currentIndex], "_blank")
                }
                className="absolute bottom-4 right-4 bg-[#D3EEBC] p-2 rounded-full shadow-md"
              >
                <CgArrowsExpandRight className="text-[#598931] text-2xl" />
              </button>
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full  md:w-1/2 flex flex-col items-start text-left ">
            <div className="text-4xl font-[Poppins] font-semibold text-[#060606]">
              {title}
            </div>
            <div className="text-xl font-normal font-[Poppins] text-[#363636] mt-2">
              {subtitle}
            </div>
            <div className="text-2xl font-normal  text-[#363636] mt-2 leading-relaxed">
              {description}
            </div>
            <div className="text-xl font-normal font-[Poppins] text-[#363636] mt-2">
              {subtitle}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[90%] md:w-[95%] mx-auto py-12 relative">
        {/* Features Section - Also Full Width */}
        <div className="relative flex flex-col  items-start gap-[15.246px] rounded-[50px] bg-[rgba(211,238,188,0.10)] px-12 md:px-20 pt-8 md:pt-12 pb-20 shadow-lg ">
          {/* Buttons at the Top Center */}
          <div className="w-full flex justify-center gap-8 mb-10">
            <button
              onClick={() => setActiveSection("features")}
              className={`px-4 py-2 rounded-[8px] font-semibold shadow-md transition-all duration-300 text-xl ${
                activeSection === "features"
                  ? "bg-[#598931] text-white"
                  : "bg-[#EBEEE9] text-[#9B9B9B]"
              }`}
            >
              <PiStarFour className="inline-block mr-2" /> Features
            </button>

            <button
              onClick={() => setActiveSection("link")}
              className={`px-4 py-2 rounded-[8px] font-semibold shadow-md transition-all duration-300 text-xl ${
                activeSection === "link"
                  ? "bg-[#598931] text-white"
                  : "bg-[#EBEEE9] text-[#9B9B9B]"
              }`}
            >
              <PiStarFour className="inline-block mr-2" /> Sheet Link / Website
              Link
            </button>

            <button
              onClick={() => setActiveSection("video")}
              className={`px-4 py-2 rounded-[8px] font-semibold shadow-md transition-all duration-300 text-xl ${
                activeSection === "video"
                  ? "bg-[#598931] text-white"
                  : "bg-[#EBEEE9] text-[#9B9B9B]"
              }`}
            >
              <PiStarFour className="inline-block mr-2" /> Update / Video
            </button>
          </div>

          {/* Conditional Rendering of Content */}
          {activeSection === "features" && features && (
            <div className="w-[95%] mx-auto">
              <div className="text-4xl font-bold text-gray-900 mb-6">
                Features:
              </div>

              {/* Benefits Section */}
              <div className="mb-10">
                <h4 className="text-3xl font-semibold text-gray-800 mb-6">
                  Benefits
                </h4>
                <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
                  {features.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              {/* Use Cases Section */}
              <div className="mb-10">
                <h4 className="text-3xl font-semibold text-gray-800 mb-6">
                  Use Cases
                </h4>
                <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
                  {features.useCases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>

              {/* Features List */}
              <div>
                <h4 className="text-3xl font-semibold text-gray-800 mb-6">
                  Features List
                </h4>
                <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
                  {features.featureList.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSection === "link" && (
            <div className="w-[80%] mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Sheet Link / Website
              </h3>

              <a
                href={
                  sheetlink?.startsWith("http")
                    ? sheetlink
                    : `https://${sheetlink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D3EEBC80] border-2 rounded-3xl px-4 py-1 text-xl underline hover:text-[#598931]"
              >
                Make a Link
              </a>
            </div>
          )}

          {activeSection === "video" && (
            <div className="w-[80%] mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Updates / Video
              </h3>

              <a
                href={
                  videolink?.startsWith("http")
                    ? videolink
                    : `https://${videolink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D3EEBC80] border-2 rounded-3xl px-4 py-1 text-xl underline hover:text-[#598931]"
              >
                Instruction Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogueBiggerView;
