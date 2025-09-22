import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { useParams } from "react-router-dom";
import noPhoto from "../../assets/images/noPhoto.jpg";
import { handleImageError } from "../../utils/globalFunctions";
import axios from "axios";
import { HOST } from "../../utils/constants";
import { UserContext } from "../../context/UserContext";

const LargeVideoView = () => {
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  // const video = location.state?.video;
  const dummySetting = {
    "_id": "679e4eb7145f160ae5f9a287",
    "userId": "665cba3eef771aacc222afb0",
    "spreadsheetName": "Copy of Video Gallery",
    "spreadsheetId": "1IBSYE3bGNBRq6hbX7f58dyXFux6Zq_cA9R-2nWquNYc",
    "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/1IBSYE3bGNBRq6hbX7f58dyXFux6Zq_cA9R-2nWquNYc/edit",
    "firstSheetName": "Data",
    "firstSheetId": "1435322083",
    "firstSheetUrl": "https://docs.google.com/spreadsheets/d/1IBSYE3bGNBRq6hbX7f58dyXFux6Zq_cA9R-2nWquNYc/edit#gid=1435322083",
    "firstTabDataRange": "Data!A1:N",
    "firstTabHeader": [
      "Company name",
      "Domain",
      "Name",
      "Designation",
      "Topic",
      "Title",
      "Description",
      "City",
      "Link",
      "Type",
      "Designation11",
      "Designation12",
      "Link 2",
      "Image"
    ],
    "appName": "Video Gallery",
    "sheetDetails": [
      {
        "name": "Data",
        "url": "https://docs.google.com/spreadsheets/d/1IBSYE3bGNBRq6hbX7f58dyXFux6Zq_cA9R-2nWquNYc/edit#gid=1435322083",
        "sheetId": 1435322083
      },
      {
        "name": "HTML",
        "url": "https://docs.google.com/spreadsheets/d/1IBSYE3bGNBRq6hbX7f58dyXFux6Zq_cA9R-2nWquNYc/edit#gid=1940464747",
        "sheetId": 1940464747
      }
    ],
    "sharedWith": [],
    "tableSettings": [],
    "access": "Owner",
    "lastUpdatedDate": "Sat Feb 01 2025 22:26:21 GMT+0545 (Nepal Time)",
    "showInCard": [
      {
        "id": 0,
        "title": "Link 2"
      },
      {
        "id": 4,
        "title": "Image"
      },
      {
        "id": 2,
        "title": "Company name"
      },
      {
        "id": 1,
        "title": ""
      },
      {
        "id": 3,
        "title": "Domain"
      },
      {
        "id": 5,
        "title": ""
      }
    ],
    "showInProfile": [
      {
        "id": 1,
        "title": "City",
        "setting": {
          "fontStyle": "Regular",
          "fontColor": "#000000",
          "fontSize": "16",
          "fontType": "Poppins"
        }
      },
      {
        "id": 2,
        "title": "Link",
        "setting": {
          "fontStyle": "Regular",
          "fontColor": "#000000",
          "fontSize": "16",
          "fontType": "Poppins"
        }
      },
      {
        "id": 3,
        "title": "Designation",
        "setting": {
          "fontStyle": "Regular",
          "fontColor": "#000000",
          "fontSize": "16",
          "fontType": "Poppins"
        }
      }
    ],
    "hiddenCol": [],
    "__v": 0
  }
  // const location = useLocation();
  // const data = location.state?.data || [];
  // const settings = location.state?.settings || dummySetting;
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const video = data?[settings?.showInCard[0]?.title.toLowerCase().replace(/\s/g, "_")]:"";

  // if (!video) {
  //   navigate(-1); // Redirect to home if no video is found
  //   return null;
  // }

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState(dummySetting);

  const titleKey = settings?.showInCard[0]?.title?.toLowerCase().replace(/\s/g, "_");
  const videoUrl = data?.[titleKey];

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

  const { settingsId, videoId } = useParams();
  const [searchParams] = useSearchParams();

  // Create broadcast channel for receiving video data
  const channel = useMemo(() => new BroadcastChannel('video-data'), []);

  // Data loading useEffect - MUST be before any early returns!
  useEffect(() => {
    const expectedUid = searchParams.get('uid');
    console.log('🎯 LargeVideoView mounted with UID:', expectedUid);

    if (!expectedUid) {
      console.log('❌ No UID found in URL');
      setError('No video ID found');
      setLoading(false);
      return;
    }

    // Function to process video data
    const processVideoData = (videoData) => {
      console.log('✅ Processing video data:', videoData);
      setData(videoData.rowData);
      setSettings(videoData.settings);
      setLoading(false);

      // Don't clean localStorage immediately - let it persist for reloads
      // Clean up after 1 hour instead
      setTimeout(() => {
        localStorage.removeItem(`video_data_${expectedUid}`);
        console.log('🧹 Cleaned up localStorage after 1 hour');
      }, 60 * 60 * 1000); // 1 hour
    };

    // First, try to get data from localStorage (immediate)
    const localStorageKey = `video_data_${expectedUid}`;
    const storedData = localStorage.getItem(localStorageKey);

    if (storedData) {
      try {
        const videoData = JSON.parse(storedData);
        console.log('💾 Found data in localStorage:', videoData);
        if (videoData.type === 'VIDEO_DATA' && videoData.id === expectedUid) {
          processVideoData(videoData);
          return; // Exit early if localStorage worked
        }
      } catch (error) {
        console.error('❌ Error parsing localStorage data:', error);
      }
    }

    // If localStorage didn't work, try server fallback
    console.log('🌐 Trying to fetch data from server...');

    const fetchFromServer = async () => {
      try {
        const response = await axios.post(`${HOST}/getSheetRowData`, {
          sheetID: settingsId,
          key_id: videoId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('✅ Fetched data from server:', response.data);
        setData(response.data.data);
        setSettings(response.data.settings);
        setLoading(false);
        return true; // Success
      } catch (error) {
        console.error("❌ Error fetching from server:", error);
        return false; // Failed
      }
    };

    // Try server fetch first, then fall back to BroadcastChannel
    fetchFromServer().then(success => {
      if (success) {
        console.log('✅ Server fetch successful, no need for BroadcastChannel');
        return; // Exit if server fetch worked
      }

      // If server fetch failed, listen for BroadcastChannel
      console.log('📻 Server fetch failed, waiting for BroadcastChannel message...');

      const handleMessage = (event) => {
        console.log('🔥 Received broadcast message:', {
          eventData: event.data,
          expectedUid,
          timestamp: new Date().toISOString()
        });

        if (event.data && event.data.type === 'VIDEO_DATA' && event.data.id === expectedUid) {
          processVideoData(event.data);
        } else {
          console.log('❌ Message did not match criteria:', {
            hasData: !!event.data,
            type: event.data?.type,
            messageId: event.data?.id,
            expectedUid
          });
        }
      };

      channel.addEventListener('message', handleMessage);

      // Timeout fallback - if no data received in 5 seconds, show error
      const fallbackTimeout = setTimeout(() => {
        console.log('⏰ Timeout: No video data received');
        setError('Video data not found. Please try clicking the video again.');
        setLoading(false);
      }, 5000);

      // Store cleanup function for this scenario
      window.videoCleanup = () => {
        clearTimeout(fallbackTimeout);
        channel.removeEventListener('message', handleMessage);
      };
    });

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up event listener and timeout');
      if (window.videoCleanup) {
        window.videoCleanup();
        delete window.videoCleanup;
      }
    };
  }, [channel, searchParams]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.post(`${HOST}/getSheetRowData`, {
  //         sheetID: settingsId,
  //         key_id: videoId
  //       }, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });

  //       setData(response.data.data);
  //       setSettings(response.data.settings);
  //     } catch (error) {
  //       console.error("Error fetching video data:", error);
  //       setError("An error occurred while fetching video data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (settingsId && videoId) {
  //     fetchData();
  //   }
  // }, [settingsId, videoId, token]);

  // Shimmer UI for loading state
  const LargeVideoViewShimmer = () => (
    <div className="flex flex-col items-center mx-20 animate-pulse">
      {/* Title Bar Section */}
      <div className="w-full flex items-center gap-[39px] py-3">
        <div className="h-8 w-2/3 bg-gray-200 rounded"></div>
      </div>

      {/* Video/Image Section */}
      <div className="w-full max-w-full h-[480px] flex justify-center mx-auto">
        <div className="relative w-full h-full bg-gray-200 rounded-[36.443px] flex items-center justify-center">
          {/* Play button shimmer */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-300 bg-opacity-70 rounded-full p-[24px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[64px] w-[64px] text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-[16px] mt-6">
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
      </div>
    </div>
  );

  if (loading) return <LargeVideoViewShimmer />;
  if (error) return <p>{error}</p>;

  console.log({ data, settings });
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


  const getYoutubeThumbnail = (url) => {
    if (!url) return noPhoto;

    try {
      const urlObj = new URL(url);

      if (url.includes("youtu.be")) {
        const videoId = urlObj.pathname.slice(1);
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }

      if (url.includes("youtube.com")) {
        const videoId = urlObj.searchParams.get("v");
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
    } catch (err) {
      console.error("Invalid YouTube URL:", url);
    }

    return noPhoto; // fallback
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center mx-20">
      {/* Title Bar Section */}
      <div className="w-[100%] flex items-center gap-[39px] py-3">
        {/* <div> */}
        {/* <IoMdArrowBack
            className="text-xl cursor-pointer"
            style={{ height: "45px", width: "45px", color: "#000000" }}
            onClick={() => navigate(-1)}
          /> */}
        {/* </div> */}
        <div className="">
          <span style={{
            fontStyle: ["normal", "italic", "oblique"].includes(
              settings?.showInCard[2]?.setting?.fontStyle
            )
              ? settings?.showInCard[2]?.setting?.fontStyle
              : undefined, // Apply only if it's a valid font-style
            fontWeight: settings?.showInCard[2]?.setting?.fontStyle === "bold" ? "bold" : "normal",
            textDecoration: [
              "underline",
              "line-through",
              "overline",
            ].includes(settings?.showInCard[2]?.setting?.fontStyle)
              ? settings?.showInCard[2]?.setting?.fontStyle
              : undefined,
            fontVariant:
              settings?.showInCard[2]?.setting?.fontStyle === "small-caps"
                ? "small-caps"
                : undefined,
            textTransform: ["uppercase", "lowercase"].includes(
              settings?.showInCard[2]?.setting?.fontStyle
            )
              ? settings?.showInCard[2]?.setting?.fontStyle
              : undefined,

            color: settings?.showInCard[2]?.setting?.fontColor || "#000000",
            fontSize: `${settings?.showInCard[2]?.setting?.fontSize}px`,
            fontFamily: settings?.showInCard[2]?.setting?.fontType,
          }}>{data[settings?.showInCard[2]?.title.toLowerCase().replace(" ", "_")]}</span>
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full max-w-full h-[480px] flex justify-center mx-auto">
        {settings?.showInCard[1]?.title == "" && settings?.showInCard[0]?.title == "" ? (
          <div className="relative w-full h-full cursor-pointer" >
            <img src={noPhoto}
              className="w-full h-full rounded-[36.443px]"
              onError={(e) => handleImageError(e, noPhoto)}
            />
          </div>
        )
          :
          (!isPlaying ? (
            (settings?.showInCard[1]?.title == "") ?

              <iframe
                // width="100%"
                // height="100%"
                className="w-full h-full rounded-[36.443px]"
                src={
                  getEmbeddedVideoURL(videoUrl)
                }
                title={settings?.showInCard[2]?.title?.toLowerCase().replace(/\s/g, "_") || "Video"}
                // allow="autoplay; encrypted-media"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              :
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={handlePlayVideo}
              >
                {/* <img
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
                  onError={(e) => handleImageError(e, noPhoto)}
                /> */}

                <img
                  src={
                    (() => {
                      const titleKey = settings?.showInCard[1]?.title?.toLowerCase().replace(/\s/g, "_");
                      const videoUrl = data?.[titleKey];

                      if (!videoUrl) return noPhoto;

                      // If Google Drive
                      if (videoUrl.includes("drive.google.com")) {
                        const driveIdMatch = videoUrl.match(/(?:id=|\/d\/)([\w-]+)/);
                        return driveIdMatch
                          ? `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}`
                          : noPhoto;
                      }

                      // If YouTube → return default thumbnail
                      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
                        return getYoutubeThumbnail(videoUrl);
                      }

                      // Otherwise just return the image itself
                      return videoUrl;
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
              src={getEmbeddedVideoURL(videoUrl)
              }
              title={settings?.showInCard[2]?.title?.toLowerCase().replace(/\s/g, "_") || "Video"}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ))}
      </div>

      {/* Content Section */}
      <div className="w-[100%] flex flex-col items-start gap-[16px] mt-6">
        <div className="">
          <span style={{
            fontStyle: ["normal", "italic", "oblique"].includes(
              settings?.showInCard[3]?.setting?.fontStyle
            )
              ? settings?.showInCard[3]?.setting?.fontStyle
              : undefined, // Apply only if it's a valid font-style
            fontWeight: settings?.showInCard[3]?.setting?.fontStyle === "bold" ? "bold" : "normal",
            textDecoration: [
              "underline",
              "line-through",
              "overline",
            ].includes(settings?.showInCard[3]?.setting?.fontStyle)
              ? settings?.showInCard[3]?.setting?.fontStyle
              : undefined,
            fontVariant:
              settings?.showInCard[3]?.setting?.fontStyle === "small-caps"
                ? "small-caps"
                : undefined,
            textTransform: ["uppercase", "lowercase"].includes(
              settings?.showInCard[3]?.setting?.fontStyle
            )
              ? settings?.showInCard[3]?.setting?.fontStyle
              : undefined,

            color: settings?.showInCard[3]?.setting?.fontColor || "#000000",
            fontSize: `${settings?.showInCard[3]?.setting?.fontSize}px`,
            fontFamily: settings?.showInCard[3]?.setting?.fontType,
            whiteSpace: "pre-line", // Preserve line breaks
          }}>
            {data[settings?.showInCard[3]?.title.toLowerCase().replace(" ", "_")]}
          </span>
        </div>
        <div className="">
          <span
            style={{
              fontStyle: ["normal", "italic", "oblique"].includes(
                settings?.showInCard[4]?.setting?.fontStyle
              )
                ? settings?.showInCard[4]?.setting?.fontStyle
                : undefined, // Apply only if it's a valid font-style
              fontWeight: settings?.showInCard[4]?.setting?.fontStyle === "bold" ? "bold" : "normal",
              textDecoration: [
                "underline",
                "line-through",
                "overline",
              ].includes(settings?.showInCard[4]?.setting?.fontStyle)
                ? settings?.showInCard[4]?.setting?.fontStyle
                : undefined,
              fontVariant:
                settings?.showInCard[4]?.setting?.fontStyle === "small-caps"
                  ? "small-caps"
                  : undefined,
              textTransform: ["uppercase", "lowercase"].includes(
                settings?.showInCard[4]?.setting?.fontStyle
              )
                ? settings?.showInCard[4]?.setting?.fontStyle
                : undefined,

              color: settings?.showInCard[4]?.setting?.fontColor || "#000000",
              fontSize: `${settings?.showInCard[4]?.setting?.fontSize}px`,
              fontFamily: settings?.showInCard[4]?.setting?.fontType,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "pre-line", // Preserve line breaks
            }}
          >
            {data[settings?.showInCard[4]?.title?.toLowerCase().replace(/\s/g, "_")]}
          </span>
        </div>
        <div className="">
          <span style={{
            fontStyle: ["normal", "italic", "oblique"].includes(
              settings?.showInCard[5]?.setting?.fontStyle
            )
              ? settings?.showInCard[5]?.setting?.fontStyle
              : undefined, // Apply only if it's a valid font-style
            fontWeight: settings?.showInCard[5]?.setting?.fontStyle === "bold" ? "bold" : "normal",
            textDecoration: [
              "underline",
              "line-through",
              "overline",
            ].includes(settings?.showInCard[5]?.setting?.fontStyle)
              ? settings?.showInCard[5]?.setting?.fontStyle
              : undefined,
            fontVariant:
              settings?.showInCard[5]?.setting?.fontStyle === "small-caps"
                ? "small-caps"
                : undefined,
            textTransform: ["uppercase", "lowercase"].includes(
              settings?.showInCard[5]?.setting?.fontStyle
            )
              ? settings?.showInCard[5]?.setting?.fontStyle
              : undefined,

            color: settings?.showInCard[5]?.setting?.fontColor || "#000000",
            fontSize: `${settings?.showInCard[5]?.setting?.fontSize}px`,
            fontFamily: settings?.showInCard[5]?.setting?.fontType,
            whiteSpace: "pre-line", // Preserve line breaks
          }}>{data[settings?.showInCard[5]?.title.toLowerCase().replace(" ", "_")]}
          </span>
        </div>

        {settings?.showInProfile?.map((item, index) => (
          <div key={index}>
            <span

              style={{
                fontStyle: ["normal", "italic", "oblique"].includes(
                  item?.setting?.fontStyle
                )
                  ? item?.setting?.fontStyle
                  : undefined, // Apply only if it's a valid font-style
                fontWeight: item?.setting?.fontStyle === "bold" ? "bold" : "normal",
                textDecoration: [
                  "underline",
                  "line-through",
                  "overline",
                ].includes(item?.setting?.fontStyle)
                  ? item?.setting?.fontStyle
                  : undefined,
                fontVariant:
                  item?.setting?.fontStyle === "small-caps"
                    ? "small-caps"
                    : undefined,
                textTransform: ["uppercase", "lowercase"].includes(
                  item?.setting?.fontStyle
                )
                  ? item?.setting?.fontStyle
                  : undefined,

                color: item?.setting?.fontColor || "#000000",
                fontSize: `${item?.setting?.fontSize}px`,
                fontFamily: item?.setting?.fontType,
                whiteSpace: "pre-line", // Preserve line breaks
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

