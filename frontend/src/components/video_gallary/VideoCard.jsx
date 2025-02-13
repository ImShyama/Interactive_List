import React from "react";
import videoimage from "../../assets/images/thumbnail1.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriveThumbnail, handleImageError } from "../../utils/globalFunctions";
import noPhoto from "../../assets/images/noPhoto.jpg";



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
  // const handleVideoClick = (rowData) => {
  //   console.log(rowData);
  //   // const filteredData = data.filter((person) => person.key_id === id);
  //   navigate(`/video/${rowData.key_id}`, { state: { data: rowData, settings: settings } });
  // };

  const handleVideoClick = (rowData) => {

    // Store data and settings in localStorage
    localStorage.setItem(`profileData_${rowData.key_id}`, JSON.stringify(rowData));
    localStorage.setItem(`profileSettings_${rowData.key_id}`, JSON.stringify(settings));

    // Open the profile in a new tab
    window.open(`/video/${rowData.key_id}`, '_blank');
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg"
      onMouseEnter={() => setHoveredVideo(videoData.key_id)}
      onMouseLeave={() => setHoveredVideo(null)}
      onClick={() => handleVideoClick(rowData)} // Navigate on click
    >
      {(settingsData?.showInCard[1]?.title == "" && settingsData?.showInCard[0]?.title == "") ? (
        <img
          src={noPhoto}
        />
      )
        :
        (
          hoveredVideo === videoData.key_id ? (
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
                    console.log({ driveIdMatch, videoUrl });
                    return driveIdMatch ? `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}` : "";
                  }

                  return videoData[settingsData?.showInCard[1]?.title?.toLowerCase().replace(/\s/g, "_")];
                })()
              }
              alt={videoData[settingsData?.showInCard[2]?.title?.toLowerCase().replace(/\s/g, "_")]}
              className="w-full h-[200px] object-cover"
              onError={(e) => handleImageError(e, noPhoto)}
            />
          )
        )}
      <div className="p-4 flex flex-col gap-[10px] cursor-pointer">
        <span

          style={{
            fontStyle: ["normal", "italic", "oblique"].includes(
              settingsData?.showInCard[2]?.setting?.fontStyle
            )
              ? settingsData?.showInCard[2]?.setting?.fontStyle
              : undefined, // Apply only if it's a valid font-style
            fontWeight: settingsData?.showInCard[2]?.setting?.fontStyle.toLowerCase() === "bold" ? "bold" : "normal",
            textDecoration: [
              "underline",
              "line-through",
              "overline",
            ].includes(settingsData?.showInCard[2]?.setting?.fontStyle.toLowerCase())
              ? settingsData?.showInCard[2]?.setting?.fontStyle.toLowerCase()
              : undefined,
            fontVariant:
              settingsData?.showInCard[2]?.setting?.fontStyle.toLowerCase() === "small-caps"
                ? "small-caps"
                : undefined,
            textTransform: ["uppercase", "lowercase"].includes(
              settingsData?.showInCard[2]?.setting?.fontStyle
            )
              ? settingsData?.showInCard[2]?.setting?.fontStyle
              : undefined,

            color: settingsData?.showInCard[2]?.setting?.fontColor || "#000000",
            fontSize: `${settingsData?.showInCard[2]?.setting?.fontSize}px`,
            fontFamily: settingsData?.showInCard[2]?.setting?.fontType,
          }}

        // style={{
        //   color: settingsData?.showInCard[2]?.setting?.fontColor,
        //   fontSize: `${settingsData?.showInCard[2]?.setting?.fontSize}px`,
        //   fontFamily: settingsData?.showInCard[2]?.setting?.fontType,
        //   fontStyle: settingsData?.showInCard[2]?.setting?.fontStyle.toLowerCase(),
        //   fontWeight: settingsData?.showInCard[2]?.setting?.fontStyle === "Bold" ? "bold" : "normal"
        // }}

        >{videoData[settingsData?.showInCard[2]?.title.toLowerCase().replace(" ", "_")]}</span>


        <span style={{
          fontStyle: ["normal", "italic", "oblique"].includes(
            settingsData?.showInCard[3]?.setting?.fontStyle
          )
            ? settingsData?.showInCard[3]?.setting?.fontStyle
            : undefined, // Apply only if it's a valid font-style
          fontWeight: settingsData?.showInCard[3]?.setting?.fontStyle.toLowerCase() === "bold" ? "bold" : "normal",
          textDecoration: [
            "underline",
            "line-through",
            "overline",
          ].includes(settingsData?.showInCard[3]?.setting?.fontStyle)
            ? settingsData?.showInCard[3]?.setting?.fontStyle
            : undefined,
          fontVariant:
            settingsData?.showInCard[3]?.setting?.fontStyle === "small-caps"
              ? "small-caps"
              : undefined,
          textTransform: ["uppercase", "lowercase"].includes(
            settingsData?.showInCard[3]?.setting?.fontStyle
          )
            ? settingsData?.showInCard[3]?.setting?.fontStyle
            : undefined,

          color: settingsData?.showInCard[3]?.setting?.fontColor || "#000000",
          fontSize: `${settingsData?.showInCard[3]?.setting?.fontSize}px`,
          fontFamily: settingsData?.showInCard[3]?.setting?.fontType,
        }}>
          {videoData[settingsData?.showInCard[3]?.title.toLowerCase().replace(" ", "_")]}
        </span>

        <span
          style={{
            fontStyle: ["normal", "italic", "oblique"].includes(
              settingsData?.showInCard[4]?.setting?.fontStyle
            )
              ? settingsData?.showInCard[4]?.setting?.fontStyle
              : undefined, // Apply only if it's a valid font-style
            fontWeight: settingsData?.showInCard[4]?.setting?.fontStyle === "bold" ? "bold" : "normal",
            textDecoration: [
              "underline",
              "line-through",
              "overline",
            ].includes(settingsData?.showInCard[4]?.setting?.fontStyle)
              ? settingsData?.showInCard[4]?.setting?.fontStyle
              : undefined,
            fontVariant:
              settingsData?.showInCard[4]?.setting?.fontStyle === "small-caps"
                ? "small-caps"
                : undefined,
            textTransform: ["uppercase", "lowercase"].includes(
              settingsData?.showInCard[4]?.setting?.fontStyle
            )
              ? settingsData?.showInCard[4]?.setting?.fontStyle
              : undefined,

            color: settingsData?.showInCard[4]?.setting?.fontColor || "#000000",
            fontSize: `${settingsData?.showInCard[4]?.setting?.fontSize}px`,
            fontFamily: settingsData?.showInCard[4]?.setting?.fontType,
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
          fontStyle: ["normal", "italic", "oblique"].includes(
            settingsData?.showInCard[5]?.setting?.fontStyle
          )
            ? settingsData?.showInCard[5]?.setting?.fontStyle
            : undefined, // Apply only if it's a valid font-style
          fontWeight: settingsData?.showInCard[5]?.setting?.fontStyle === "bold" ? "bold" : "normal",
          textDecoration: [
            "underline",
            "line-through",
            "overline",
          ].includes(settingsData?.showInCard[5]?.setting?.fontStyle)
            ? settingsData?.showInCard[5]?.setting?.fontStyle
            : undefined,
          fontVariant:
            settingsData?.showInCard[5]?.setting?.fontStyle === "small-caps"
              ? "small-caps"
              : undefined,
          textTransform: ["uppercase", "lowercase"].includes(
            settingsData?.showInCard[5]?.setting?.fontStyle
          )
            ? settingsData?.showInCard[5]?.setting?.fontStyle
            : undefined,

          color: settingsData?.showInCard[5]?.setting?.fontColor || "#000000",
          fontSize: `${settingsData?.showInCard[5]?.setting?.fontSize}px`,
          fontFamily: settingsData?.showInCard[5]?.setting?.fontType,
        }}>{videoData[settingsData?.showInCard[5]?.title.toLowerCase().replace(" ", "_")]}
        </span>
      </div>
    </div>
  );
};

export default VideoCard;