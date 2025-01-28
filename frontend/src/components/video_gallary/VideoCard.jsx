import React from "react";
import videoimage from "../../assets/images/thumbnail1.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const defaultSettings = {


  "showInCard": [
    {
      "id": 6,
      "title": "video",
      "setting": {
        "fontStyle": "Regular",
        "fontColor": "#000000",
        "fontSize": "16",
        "fontType": "Poppins"
      }
    },
    {
      "id": 7,
      "title": "image",
      "setting": {
        "fontStyle": "Regular",
        "fontColor": "#000000",
        "fontSize": "16",
        "fontType": "Poppins"
      }
    },
    {
      "id": 5,
      "title": "title",
      "setting": {
        "fontStyle": "Bold",
        "fontColor": "#333131",
        "fontSize": "20",
        "fontType": "Poppins"
      }
    },
    {
      "id": 3,
      "title": "category",
      "setting": {
        "fontStyle": "Regular",
        "fontColor": "#B0B0B0",
        "fontSize": "16",
        "fontType": "Poppins"
      }
    },
    {
      "id": 8,
      "title": "description",
      "setting": {
        "fontStyle": "normal",
        "fontColor": "#333131",
        "fontSize": "16",
        "fontType": "Poppins"
      }
    },
    {
      "id": 2,
      "title": "subtitle",
      "setting": {
        "fontStyle": "normal",
        "fontColor": "#B0B0B0",
        "fontSize": "16",
        "fontType": "Poppins"
      }
    }
  ],
  "showInProfile": [],

}

// Default video object
const defaultVideo = {
  id: "default",
  video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  image: videoimage,
  title: "Default Video",
  isGoogleDrive: false,
};

const VideoCard = ({ rowData, settings }) => {
  // Use `video` if provided, otherwise use `defaultVideo`
  const videoData = rowData || defaultVideo;
  const settingsData = settings || defaultSettings;
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const navigate = useNavigate();
  const handleVideoClick = (rowData) => {
    console.log(rowData);
    // const filteredData = data.filter((person) => person.key_id === id);
    navigate(`/video/${rowData.key_id}`, { state: { data: rowData, settings: settings } });
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg"
      onMouseEnter={() => setHoveredVideo(videoData.id)}
      onMouseLeave={() => setHoveredVideo(null)}
      onClick={() => handleVideoClick(rowData)} // Navigate on click
    >
      {hoveredVideo === videoData.id ? (
        <iframe
          width="100%"
          height="200px"
          src={
            (() => {
              const titleKey = settingsData?.showInCard[0]?.title?.toLowerCase().replace(/\s/g, "_");
              const videoUrl = videoData?.[titleKey];

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
          title={settingsData?.showInCard[2]?.title?.toLowerCase().replace(/\s/g, "_") || "Video"}
          allow="autoplay; encrypted-media"
          frameBorder="0"
          allowFullScreen
        ></iframe>

      ) : (
        <img
          src={
            (() => {
              const titleKey = settingsData?.showInCard[1]?.title?.toLowerCase().replace(/\s/g, "_");
              const videoUrl = videoData?.[titleKey];

              if (!videoUrl) return videoData[settingsData?.showInCard[1]?.title?.toLowerCase().replace(/\s/g, "_")];

              if (videoUrl.includes("drive.google.com")) {
                let driveIdMatch = videoUrl.match(/(?:id=|\/d\/)([\w-]+)/);
                console.log({driveIdMatch, videoUrl});
                return driveIdMatch ? `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}` : "";
              }

              return videoData[settingsData?.showInCard[1]?.title?.toLowerCase().replace(/\s/g, "_")];
            })()
          }
          alt={videoData[settingsData?.showInCard[2]?.title?.toLowerCase().replace(/\s/g, "_")]}
          className="w-full h-[200px] object-cover"
        />
      )}
      <div className="p-4 flex flex-col gap-[10px]">
        <span style={{
          color: settingsData?.showInCard[2]?.setting?.fontColor,
          fontSize: `${settingsData?.showInCard[2]?.setting?.fontSize}px`,
          fontFamily: settingsData?.showInCard[2]?.setting?.fontType,
          fontStyle: settingsData?.showInCard[2]?.setting?.fontStyle.toLowerCase(),
          fontWeight: settingsData?.showInCard[2]?.setting?.fontStyle === "Bold" ? "bold" : "normal"
        }}>{videoData[settingsData?.showInCard[2]?.title.toLowerCase().replace(" ", "_")]}</span>


        <span style={{
          color: settingsData?.showInCard[3]?.setting?.fontColor,
          fontSize: `${settingsData?.showInCard[3]?.setting?.fontSize}px`,
          fontFamily: settingsData?.showInCard[3]?.setting?.fontType,
          fontStyle: settingsData?.showInCard[3]?.setting?.fontStyle.toLowerCase(),
          fontWeight: settingsData?.showInCard[3]?.setting?.fontStyle === "Bold" ? "bold" : "normal"
        }}>
          {videoData[settingsData?.showInCard[3]?.title.toLowerCase().replace(" ", "_")]}
        </span>

        <span
          style={{
            color: settingsData?.showInCard[4]?.setting?.fontColor,
            fontSize: `${settingsData?.showInCard[4]?.setting?.fontSize}px`,
            fontFamily: settingsData?.showInCard[4]?.setting?.fontType,
            fontStyle: settingsData?.showInCard[4]?.setting?.fontStyle?.toLowerCase(),
            fontWeight: settingsData?.showInCard[4]?.setting?.fontStyle === "Bold" ? "bold" : "normal",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {videoData[settingsData?.showInCard[4]?.title?.toLowerCase().replace(/\s/g, "_")]}
        </span>


        <span style={{
          color: settingsData?.showInCard[5]?.setting?.fontColor,
          fontSize: `${settingsData?.showInCard[5]?.setting?.fontSize}px`,
          fontFamily: settingsData?.showInCard[5]?.setting?.fontType,
          fontStyle: settingsData?.showInCard[5]?.setting?.fontStyle.toLowerCase(),
          fontWeight: settingsData?.showInCard[5]?.setting?.fontStyle === "Bold" ? "bold" : "normal"
        }}>{videoData[settingsData?.showInCard[5]?.title.toLowerCase().replace(" ", "_")]}
        </span>
      </div>
    </div>
  );
};

export default VideoCard;