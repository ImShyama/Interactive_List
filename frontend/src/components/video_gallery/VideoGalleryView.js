import React from "react";
import thumbnail1 from "../../assets/images/thumbnail1.png"
import thumbnail2 from "../../assets/images/thumbnail2.png"
import thumbnail3 from "../../assets/images/thumbnail3.png"
import thumbnail4 from "../../assets/images/thumbnail4.png"
import thumbnail5 from "../../assets/images/thumbnail5.png"
import thumbnail6 from "../../assets/images/thumbnail6.png"
import thumbnail7 from "../../assets/images/thumbnail7.png"
import thumbnail8 from "../../assets/images/thumbnail8.png"
import TitleBarVG from "./TitleBarVG";
const VideoGalleryView = () => {
   // Dummy data for video thumbnails
   const videos = [
    { id: 1, title: "Significance of Video Thumbnail", image: thumbnail1 },
    { id: 2, title: "How to Make YouTube Thumbnails", image: thumbnail2 },
    { id: 3, title: "Inspiring Story - Shantanoo Rane", image: thumbnail3 },
    { id: 4, title: "Watch My Video!", image: thumbnail4 },
    { id: 5, title: "YouTube Thumbnail Template", image: thumbnail5 },
    { id: 6, title: "Another Inspiring Story", image: thumbnail6 },
    {id: 7, title: "Funny Video to watch", image:thumbnail7},
    {id: 8, title: "Podcast Video to Watch", image:thumbnail8},
  ];
  return (
    <div className="px-6 py-4">
      {/* TitleBar Section for video gallary page */}
      <div>
        <TitleBarVG />
      </div>
      
      
      {/* Grid Section for video thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={video.image}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{video.title}</h3>
              <p className="text-sm text-gray-600">Architecture</p>
              <p className="text-sm text-gray-600 mt-1">
                From 28% to 35% gross profit in under 3 months—Shantanoo Rane's
                story is nothing short of inspiring!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Shantanoo Rane, Roswalt Realty, CEO - Mumbai
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default VideoGalleryView;
