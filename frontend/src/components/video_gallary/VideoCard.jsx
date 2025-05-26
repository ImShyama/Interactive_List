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
    // // Create dynamic storage keys using settings._id and rowData.key_id
    // const profileDataKey = `profileData_${settings._id}_${rowData.key_id}`;
    // const profileSettingsKey = `profileSettings_${settings._id}_${rowData.key_id}`;

    // // Store data and settings in localStorage with dynamic keys
    // localStorage.setItem(profileDataKey, JSON.stringify(rowData));
    // localStorage.setItem(profileSettingsKey, JSON.stringify(settings));
    // console.log({rowData, settings});

    // // Open the profile in a new tab
    // window.open(`/video/${settings._id}/${rowData.key_id}`, '_blank');

    const dataToEncode = {
      rowData: rowData,
      dataSettings: settings
    };

    // First encode the string to handle Unicode characters
    const encodedString = encodeURIComponent(JSON.stringify(dataToEncode));
    // Then convert to base64
    const encodedData = btoa(encodedString);


    // Open the profile in a new tab with encoded data in URL
    window.open(`/video/${settings._id}/${rowData.key_id}?data=${encodedData}`, '_blank');
    console.log({ encodedData });
  };

  

  // const getEmbeddedVideoURL = (url) => {
  //   if (url.includes("youtube.com") || url.includes("youtu.be")) {
  //     return url.includes("embed")
  //       ? url
  //       : `https://www.youtube.com/embed/${url?.split("v=")[1]?.split("&")[0]}`;
  //   }

  //   if (url.includes("drive.google.com")) {
  //     return `https://drive.google.com/file/d/${
  //       url.split("/d/")[1].split("/")[0]
  //     }/preview`;
  //   }

  //   if (url.includes("vimeo.com")) {
  //     const videoId = url.split("/").pop();
  //     return `https://player.vimeo.com/video/${videoId}`;
  //   }

  //   if (url.includes("dailymotion.com")) {
  //     const videoId = url.split("/video/")[1]?.split("_")[0];
  //     return `https://www.dailymotion.com/embed/video/${videoId}`;
  //   }

  //   if (url.includes("facebook.com")) {
  //     return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
  //       url
  //     )}`;
  //   }
  //   if (url.includes("instagram.com")) {
  //     // https://www.instagram.com/reel/C5lSU9qNl0n/?utm_source=ig_web_button_share_sheet
  //     // https://www.instagram.com/p/BdJRABkDbXU/embed/
  //     // url = "https://www.instagram.com/reel/C5lSU9qNl0n/"
  //     return `https://www.instagram.com/p/${url.split("/")[4]}/embed/`;
  //   }


  //   if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")) {
  //     return url; // Direct video link
  //   }

  //   return url; // Default case (returns same URL if unknown format)
  // };

  const getEmbeddedVideoURL = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      try {
        const urlObj = new URL(url);

        // Already an embed URL
        if (url.includes("embed")) {
          return url;
        }

        // youtu.be short link
        if (urlObj.hostname === "youtu.be") {
          const videoId = urlObj.pathname.slice(1);
          return `https://www.youtube.com/embed/${videoId}`;
        }

        // youtube.com with v=VIDEO_ID
        const videoId = urlObj.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      } catch (e) {
        console.error("Invalid YouTube URL:", url);
        return url;
      }
    }

    if (url.includes("drive.google.com")) {
      return `https://drive.google.com/file/d/${url.split("/d/")[1].split("/")[0]
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

    if (url.includes("instagram.com")) {
      return `https://www.instagram.com/p/${url.split("/")[4]}/embed/`;
    }

    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")) {
      return url;
    }

    return url; // Default fallback
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

  const titleKeyTemp = settingsData?.showInCard[1]?.title?.toLowerCase().replace(/\s/g, "_");
  const videoUrlTemp = videoData?.[titleKeyTemp];
  console.log({ videoUrlTemp });

  const titleKey = settingsData?.showInCard[0]?.title?.toLowerCase().replace(/\s/g, "_");
  const videoUrl = videoData?.[titleKey];
  console.log({ videoUrl });

  return (
    <div
      className="bg-white shadow-md rounded-lg"
      onMouseEnter={() => setHoveredVideo(videoData.key_id)}
      onMouseLeave={() => setHoveredVideo(null)}
      onClick={() => handleVideoClick(rowData)} // Navigate on click
    >
      {(settingsData?.showInCard[1]?.title == "" && settingsData?.showInCard[0]?.title == "") ?

        (<img src={noPhoto} />)
        :
        (
          hoveredVideo === videoData.key_id ? (
            <iframe
              width="100%"
              height="200px"
              src={
                getEmbeddedVideoURL(videoUrl)
              }
              title={settingsData?.showInCard[2]?.title?.toLowerCase().replace(/\s/g, "_") || "Video"}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              allowFullScreen
            ></iframe>

          ) : (
            (settingsData?.showInCard[1]?.title == "" || !videoUrlTemp) ?

              <iframe
                width="100%"
                height="200px"
                src={
                  getEmbeddedVideoURL(videoUrl)
                }
                title={settingsData?.showInCard[2]?.title?.toLowerCase().replace(/\s/g, "_") || "Video"}
                // allow="autoplay; encrypted-media"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              :
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
              // onError={(e) => handleImageError(e, noPhoto)}
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
            whiteSpace: "pre-line", // Preserve line breaks
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
          whiteSpace: "pre-line", // Preserve line breaks
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
            whiteSpace: "pre-line", // Preserve line breaks
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
          whiteSpace: "pre-line", // Preserve line breaks
        }}>{videoData[settingsData?.showInCard[5]?.title.toLowerCase().replace(" ", "_")]}
        </span>
      </div>
    </div>
  );
};

export default VideoCard;