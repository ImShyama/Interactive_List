import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { CgArrowsExpandRight } from "react-icons/cg";
import { PiStarFour } from "react-icons/pi";
import { GoLink } from "react-icons/go";

import { FaPlay, FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { Carousel } from "antd";
import { IoPlayOutline } from "react-icons/io5";

const ProductCatalogueBiggerPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [multipleimages, setMultipleimages] = useState([]);
  const [sheetlink, setSheetlink] = useState("");
  const [videolink, setVideolink] = useState("");
  const [features, setFeatures] = useState(null);

  const channel = useMemo(() => new BroadcastChannel('product-data'), []);

  useEffect(() => {
    const expectedUid = searchParams.get('uid');

    // If navigated internally with state and no uid, just use it
    if (!expectedUid && location.state) {
      const s = location.state;
      setTitle(s.title);
      setSubtitle(s.subtitle);
      setDescription(s.description);
      setMultipleimages(Array.isArray(s.multipleimages) ? s.multipleimages : (s.multipleimages ? [s.multipleimages] : []));
      setSheetlink(s.sheetlink);
      setVideolink(s.videolink);
      setFeatures(s.features);
      return;
    }

    if (!expectedUid) {
      return;
    }

    const applyData = (data) => {
      const p = data?.payload || {};
      setTitle(p.title);
      setSubtitle(p.subtitle);
      setDescription(p.description);
      setMultipleimages(Array.isArray(p.multipleimages) ? p.multipleimages : (p.multipleimages ? [p.multipleimages] : []));
      setSheetlink(p.sheetlink);
      setVideolink(p.videolink);
      setFeatures(p.features);
    };

    try {
      const raw = localStorage.getItem(`catalogue_data_${expectedUid}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if ((parsed?.type === 'PRODUCT_DATA' || parsed?.type === 'CATALOGUE_DATA') && parsed?.id === expectedUid) {
          applyData(parsed);
          return;
        }
      }
    } catch (e) {}

    const onMessage = (event) => {
      const msg = event?.data;
      if ((msg?.type === 'PRODUCT_DATA' || msg?.type === 'CATALOGUE_DATA') && msg?.id === expectedUid) {
        applyData(msg);
      }
    };
    channel.addEventListener('message', onMessage);
    const timeout = setTimeout(() => {
      channel.removeEventListener('message', onMessage);
    }, 5000);
    return () => {
      clearTimeout(timeout);
      channel.removeEventListener('message', onMessage);
    };
  }, [channel, location.state, searchParams]);

  // State to track active section (default: "features")
  const [activeSection, setActiveSection] = useState("features");
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

   // Navigation functions for carousel
   const goToPrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };
  
  // Custom carousel dots component
  const CustomCarouselDots = () => {
    if (multipleimages.length <= 1) return null;
    
    return (
      <div className="absolute bottom-4 left-0 w-full py-2 flex justify-center">
        <div className="flex gap-2">
          {multipleimages.map((media, index) => {
            const isVideo = isVideoUrl(media) || isYouTubeUrl(media);
            const isActive = index === currentIndex;
            
            if (isVideo) {
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.goTo(index);
                    }
                  }}
                  className="w-3 h-3 transition-all duration-300 hover:scale-110"
                  title={`Go to slide ${index + 1}`}
                >
                  <FaPlay className="text-[#598931] text-sm" />
                </button>
              );
            }
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (carouselRef.current) {
                    carouselRef.current.goTo(index);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#598931] scale-125' 
                    : 'bg-[#598931] opacity-50 hover:opacity-75'
                }`}
                title={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    );
  };
  
  // Helpers to detect media types for the carousel
  const isVideoUrl = (url) => {
    if (!url) return false;
    const u = url.toString().toLowerCase();
    return u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.ogg');
  };

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return /(?:youtube\.com\/.+v=|youtu\.be\/)/i.test(url);
  };

  const getYouTubeEmbedSrc = (url) => {
    try {
      const ytMatch = url.match(/(?:v=|youtu\.be\/)([\w-]+)/i);
      const id = ytMatch ? ytMatch[1] : null;
      return id ? `https://www.youtube.com/embed/${id}` : url;
    } catch (e) {
      return url;
    }
  };
  return (
    <div className="min-h-screen  flex flex-col px-2">
      {/* Product Image and Description Section - Full Width */}
      <div className="w-[90%] md:w-[95%] mx-auto py-4">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-16">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2">
            {/* <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-[#598931] p-2 rounded-full shadow-md z-10"
            >
              <IoArrowBack className="text-white text-3xl" />
            </button> */}

            <div className="relative w-full bg-[#FDFEFF] rounded-[35.746px] border-[2.07px] border-[#F1F1F1] shadow-lg overflow-hidden h-auto group">
              <Carousel
                ref={carouselRef}
                autoplay={true}
                dots={false}
                className="w-full h-full"
                afterChange={(index) => setCurrentIndex(index)}
              >
                {multipleimages.length > 0 ? (
                  multipleimages.map((media, index) => (
                    <div key={index} className="w-full h-full">
                      <div className="w-full h-[360px] object-cover">
                        {isVideoUrl(media) ? (
                          <video controls className="max-w-full max-h-full" src={media} />
                        ) : isYouTubeUrl(media) ? (
                          <iframe
                            className="w-full h-full"
                            src={getYouTubeEmbedSrc(media)}
                            title={`video-${index}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <img
                            src={media}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-[360px] object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No images available
                  </div>
                )}
              </Carousel>

                {/* Navigation Arrows */}
                {multipleimages.length > 1 && (
                  <>
                    {/* Left Arrow */}
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 "
                      title="Previous image"
                    >
                      <FaCircleChevronLeft className="text-[#598931] text-2xl" />
                    </button>

                    {/* Right Arrow */}
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                      title="Next image"
                    >
                      <FaCircleChevronRight className="text-[#598931] text-2xl" />
                    </button>
                  </>
                )}

              <CustomCarouselDots />

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

      <div className="w-[90%] md:w-[95%] mx-auto  mb-8 relative">
        {/* Features Section - Also Full Width */}
        <div className="relative flex flex-col  items-start gap-[15.246px] rounded-[50px] bg-[rgba(211,238,188,0.10)] px-12 md:px-20 pt-8 md:py-4 shadow-lg ">
          {/* Buttons at the Top Center */}
          <div className="w-full flex justify-center gap-8">
            <button
              onClick={() => setActiveSection("features")}
              className={`px-4 py-2 rounded-[8px] font-semibold shadow-md transition-all duration-300 text-base ${
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
      {/* Custom carousel dots are now handled by the CustomCarouselDots component */}
    </div>
  );
};

export default ProductCatalogueBiggerPreview;


