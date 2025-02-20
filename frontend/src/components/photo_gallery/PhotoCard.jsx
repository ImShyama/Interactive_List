import React, { useState, useRef } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import BiggerView from "./BiggerView"; // Import BiggerView
import defaultImage from "../../assets/images/Photo1.png";
import noPhoto from "../../assets/images/noPhoto.jpg";
import { getDriveThumbnail, handleImageError } from "../../utils/globalFunctions";

const defaultPhoto = {
  id: "default",
  images: [defaultImage, defaultImage, defaultImage],
  description: "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
  date: "October 2024",
};

const PhotoCard = ({ image, title, subTitle }) => {
  // console.log({photo, settings})
  // const photoData = photo || defaultPhoto;
  const [isHovered, setIsHovered] = useState(false);
  const [showBiggerView, setShowBiggerView] = useState(false);
  const carouselRef = useRef(null);
  
  // const image = getDriveThumbnail(photoData[settings?.showInCard[0].title.toLowerCase().replace(" ","_")]);
  // const title = photoData[settings?.showInCard[1].title.toLowerCase().replace(" ","_")] || "";
  // const subTitle = photoData[settings?.showInCard[2].title.toLowerCase().replace(" ","_")] || "";

  // console.log({photo, settings, image, title, subTitle});

  return (
    <>
      {/* Photo Card Container */}
      <div
        className="relative w-full aspect-[4/3] rounded-[15px] overflow-hidden cursor-pointer"
        onClick={() => setShowBiggerView(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Carousel for Photo Swiping */}
        <div className="absolute inset-0 w-full h-full">
          <Carousel ref={carouselRef} autoplay={false} dots={false} className="w-full h-full">
            {/* {photoData.image.tostring().splite(",").map((img, index) => (
              <div key={index} className="relative w-full h-full">
                <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))} */}
            <img src={image} 
            // alt={`Slide ${index + 1}`} 
            className="w-full h-full object-cover" 
            // onError={(e)=>{handleImageError(e,noPhoto)}}
            />
            
          </Carousel>
        </div>

        {/* Navigation Buttons (Show on Hover) */}
        {isHovered && (
          <>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white text-3xl p-3 rounded-full shadow-md hover:bg-opacity-80 transition-all z-10"
              onClick={(e) => {
                e.stopPropagation();
                carouselRef.current.prev();
              }}
            >
              <LeftOutlined />
            </button>

            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white text-3xl p-3 rounded-full shadow-md hover:bg-opacity-80 transition-all z-10"
              onClick={(e) => {
                e.stopPropagation();
                carouselRef.current.next();
              }}
            >
              <RightOutlined />
            </button>
          </>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Description */}
        <div className="absolute bottom-1 left-4 right-4">
          <p className="text-white font-poppins text-[16px] font-normal leading-normal">{title}</p>
          <p className="text-[#DEDEDE] font-poppins text-[13.823px] font-normal leading-normal">{subTitle}</p>
        </div>
      </div>

      {/* BiggerView (Opens when Photo is Clicked) */}
      {showBiggerView && <BiggerView photo={image} title={title} onClose={() => setShowBiggerView(false)} />}
    </>
  );
};

export default PhotoCard;


