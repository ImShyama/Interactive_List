import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const LargeVideoView = () => {
  const navigate = useNavigate();
  // const video = location.state?.video;

  const location = useLocation();
  const data = location.state?.data || [];
  const settings = location.state?.settings || {};
  const [isPlaying, setIsPlaying] = useState(false);
  console.log({ data, settings });

  // const video = data?[settings?.showInCard[0]?.title.toLowerCase().replace(/\s/g, "_")]:"";


  // if (!video) {
  //   navigate(-1); // Redirect to home if no video is found
  //   return null;
  // }

  /** Function to Extract Thumbnail for Drive Images */
  const getThumbnailSrc = (imageUrl) => {
    if (!imageUrl) return "";

    if (imageUrl.includes("drive.google.com")) {
      const driveIdMatch = imageUrl.match(/(?:id=|\/d\/)([\w-]+)/);
      return driveIdMatch
        ? `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=s600?authuser=0`
        : imageUrl;
    }

    return imageUrl;
  };


  // const getVideoSrc = (video) => {
  //   if (video.isGoogleDrive) {
  //     const fileId = video.video.split("/d/")[1]?.split("/")[0];
  //     return `https://drive.google.com/file/d/${fileId}/preview`; // Google Drive embed link
  //   }
  //   return `${video.video}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`;
  // };

  /** Function to Extract Video URL */
  const getVideoSrc = (videoUrl) => {
    if (!videoUrl) return "";

    if (videoUrl.includes("drive.google.com")) {
      // Extract Google Drive File ID
      const driveIdMatch = videoUrl.match(/(?:id=|\/d\/)([\w-]+)/);
      return driveIdMatch
        ? `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`
        : "";
    }

    // YouTube or Other Video URL
    return `${videoUrl}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`;
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center mx-20">
      {/* Title Bar Section */}
      <div className="w-[100%] flex items-center gap-[39px] py-3">
        <div>
          <IoMdArrowBack
            className="text-xl cursor-pointer"
            style={{ height: "45px", width: "45px", color: "#000000" }}
            onClick={() => navigate(-1)}
          />
        </div>
        <div className="">
          <span style={{
            color: settings?.showInCard[2]?.setting?.fontColor,
            fontSize: `${settings?.showInCard[2]?.setting?.fontSize}px`,
            fontFamily: settings?.showInCard[2]?.setting?.fontType,
            fontStyle: settings?.showInCard[2]?.setting?.fontStyle.toLowerCase(),
            fontWeight: settings?.showInCard[2]?.setting?.fontStyle === "Bold" ? "bold" : "normal"
          }}>{data[settings?.showInCard[2]?.title.toLowerCase().replace(" ", "_")]}</span>
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full max-w-full h-[480px] flex justify-center mx-auto">
        {!isPlaying ? (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={handlePlayVideo}
          >
            <img
              src={
                (() => {
                  const titleKey = settings?.showInCard[1]?.title?.toLowerCase().replace(/\s/g, "_");
                  const videoUrl = data?.[titleKey];

                  if (!videoUrl) return data[settings?.showInCard[1]?.title?.toLowerCase().replace(/\s/g, "_")];

                  if (videoUrl.includes("drive.google.com")) {
                    let driveIdMatch = videoUrl.match(/(?:id=|\/d\/)([\w-]+)/);
                    console.log({ driveIdMatch, videoUrl });
                    return driveIdMatch ? `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}` : "";
                  }

                  return data[settings?.showInCard[1]?.title?.toLowerCase().replace(/\s/g, "_")];
                })()
              }
              alt={data[settings?.showInCard[2]?.title?.toLowerCase().replace(/\s/g, "_")]}
              className="w-full h-full object-cover rounded-[36.443px]"
            />
            {/* Custom Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-[24px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[64px] w-[64px] text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <iframe
             className="w-full h-full rounded-[36.443px] object-cover"
            src={
              (() => {
                const titleKey = settings?.showInCard[0]?.title?.toLowerCase().replace(/\s/g, "_");
                const videoUrl = data?.[titleKey];

                if (!videoUrl) return "";

                if (videoUrl.includes("drive.google.com")) {
                  const driveIdMatch = videoUrl.match(/\/d\/(.*?)(\/|$)/);
                  return driveIdMatch ? `https://drive.google.com/file/d/${driveIdMatch[1]}/preview` : "";
                }

                if (videoUrl.includes("youtube.com/watch") || videoUrl.includes("youtu.be")) {
                  const youtubeIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
                  return youtubeIdMatch ? `https://www.youtube.com/embed/${youtubeIdMatch[1]}?autoplay=1&mute=1` : "";
                }

                return videoUrl; // Fallback for other video sources
              })()
            }
            title={settings?.showInCard[2]?.title?.toLowerCase().replace(/\s/g, "_") || "Video"}
            allow="autoplay; encrypted-media"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* Content Section */}
      <div className="w-[100%] flex flex-col items-start gap-[16px] mt-6">
        <div className="">
          <span style={{
            color: settings?.showInCard[3]?.setting?.fontColor,
            fontSize: `${settings?.showInCard[3]?.setting?.fontSize}px`,
            fontFamily: settings?.showInCard[3]?.setting?.fontType,
            fontStyle: settings?.showInCard[3]?.setting?.fontStyle.toLowerCase(),
            fontWeight: settings?.showInCard[3]?.setting?.fontStyle === "Bold" ? "bold" : "normal"
          }}>
            {data[settings?.showInCard[3]?.title.toLowerCase().replace(" ", "_")]}
          </span>
        </div>
        <div className="">
          <span
            style={{
              color: settings?.showInCard[4]?.setting?.fontColor,
              fontSize: `${settings?.showInCard[4]?.setting?.fontSize}px`,
              fontFamily: settings?.showInCard[4]?.setting?.fontType,
              fontStyle: settings?.showInCard[4]?.setting?.fontStyle?.toLowerCase(),
              fontWeight: settings?.showInCard[4]?.setting?.fontStyle === "Bold" ? "bold" : "normal",

            }}
          >
            {data[settings?.showInCard[4]?.title?.toLowerCase().replace(/\s/g, "_")]}
          </span>
        </div>
        <div className="">
          <span style={{
            color: settings?.showInCard[5]?.setting?.fontColor,
            fontSize: `${settings?.showInCard[5]?.setting?.fontSize}px`,
            fontFamily: settings?.showInCard[5]?.setting?.fontType,
            fontStyle: settings?.showInCard[5]?.setting?.fontStyle.toLowerCase(),
            fontWeight: settings?.showInCard[5]?.setting?.fontStyle === "Bold" ? "bold" : "normal"
          }}>{data[settings?.showInCard[5]?.title.toLowerCase().replace(" ", "_")]}
          </span>
        </div>

        {settings?.showInProfile?.map((item, index) => (
          <div key={index}>
            <span style={{
              color: item?.setting?.fontColor,
              fontSize: `${item?.setting?.fontSize}px`,
              fontFamily: item?.setting?.fontType,
              fontStyle: item?.setting?.fontStyle.toLowerCase(),
              fontWeight: item?.setting?.fontStyle === "Bold" ? "bold" : "normal"
            }}>
              {data[item?.title.toLowerCase().replace(" ", "_")]}
            </span>
          </div>          
        ))}

      </div>
    </div>
  );
};

export default LargeVideoView;

