import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import videoimage from "../../assets/images/thumbnail1.png";

const defaultSettings = {
  showInCard: [
    {
      id: 6,
      title: "Link",
      setting: {
        fontStyle: "Regular",
        fontColor: "#000000",
        fontSize: "16",
        fontType: "Poppins",
      },
    },
    {
      id: 7,
      title: "Image",
      setting: {
        fontStyle: "Regular",
        fontColor: "#000000",
        fontSize: "16",
        fontType: "Poppins",
      },
    },
    {
      id: 5,
      title: "Name",
      setting: {
        fontStyle: "Regular",
        fontColor: "#000000",
        fontSize: "16",
        fontType: "Poppins",
      },
    },
    {
      id: 3,
      title: "Topic",
      setting: {
        fontStyle: "Regular",
        fontColor: "#000000",
        fontSize: "16",
        fontType: "Poppins",
      },
    },
    {
      id: 8,
      title: "Description",
      setting: {
        fontStyle: "Regular",
        fontColor: "#000000",
        fontSize: "16",
        fontType: "Poppins",
      },
    },
    {
      id: 2,
      title: "Company name",
      setting: {
        fontStyle: "Regular",
        fontColor: "#000000",
        fontSize: "16",
        fontType: "Poppins",
      },
    },
  ],
  showInProfile: [],
};

const defaultVideo = {
  id: "default",
  video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  image: videoimage,
  title: "Default Video",
  isGoogleDrive: false,
};

const VideoCard = ({ video }) => {
  const videoData = video || defaultVideo;
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const navigate = useNavigate();

  const handleVideoClick = (video) => {
    navigate(`/video/${video.id}`, { state: { video } });
  };

  const getEmbeddedVideoURL = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return url.includes("embed")
        ? url
        : `https://www.youtube.com/embed/${url.split("v=")[1].split("&")[0]}`;
    }

    if (url.includes("drive.google.com")) {
      return `https://drive.google.com/file/d/${
        url.split("/d/")[1].split("/")[0]
      }/preview`;
    }

    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    if (url.includes("dailymotion.com")) {
      const videoId = url.split("/video/")[1]?.split("_")[0];
      return `https://www.dailymotion.com/embed/video/${videoId}`;
    }

    if (url.includes("facebook.com")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        url
      )}`;
    }

    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")) {
      return url; // Direct video link
    }

    return url; // Default case (returns same URL if unknown format)
  };

  const isEmbeddable = (url) => {
    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("drive.google.com") ||
      url.includes("vimeo.com") ||
      url.includes("dailymotion.com") ||
      url.includes("facebook.com") ||
      url.endsWith(".mp4") ||
      url.endsWith(".webm") ||
      url.endsWith(".ogg")
    );
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden"
      onMouseEnter={() => setHoveredVideo(videoData.id)}
      onMouseLeave={() => setHoveredVideo(null)}
      onClick={() => handleVideoClick(videoData)}
    >
      {hoveredVideo === videoData.id && isEmbeddable(videoData.video) ? (
        <iframe
          width="100%"
          height="200px"
          src={getEmbeddedVideoURL(videoData.video)}
          title={videoData.title}
          allow="autoplay; encrypted-media"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : videoData.video.includes("instagram.com") ? (
        <div className="relative group">
          <img
            src={videoData.image} // Show thumbnail
            alt={videoData.title}
            className="w-full h-[200px] object-cover"
          />
          <a
            href={videoData.video}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            {/* Instagram Play Button SVG */}
            <svg
              className="w-12 h-12 text-white"
              viewBox="0 0 48 48"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34 24L18 34V14L34 24Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle
                cx="24"
                cy="24"
                r="23"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </a>
        </div>
      ) : (
        <img
          src={videoData.image}
          alt={videoData.title}
          className="w-full h-[200px] object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold">{videoData.title}</h3>
        <p className="text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
          {videoData.category}
        </p>
        <p className="text-[#333131] font-poppins text-base font-semibold leading-normal mt-1">
          {videoData.description}
        </p>
        <p className="text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
          {videoData.subtitle}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
