import React from "react";

const VideoCard = ({ video, hoveredVideo, setHoveredVideo, handleVideoClick }) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden"
      onMouseEnter={() => setHoveredVideo(video.id)}
      onMouseLeave={() => setHoveredVideo(null)}
      onClick={() => handleVideoClick(video)} // Navigate on click
    >
      {hoveredVideo === video.id ? (
        <iframe
          width="100%"
          height="200"
          src={
            video.isGoogleDrive
              ? `https://drive.google.com/file/d/${
                  video.video.split("/d/")[1].split("/")[0]
                }/preview` // Google Drive preview link
              : `${video.video}?autoplay=1&mute=1`
          }
          title={video.title}
          allow="autoplay; encrypted-media"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <img
          src={video.image}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold">{video.title}</h3>

        <p className="self-stretch text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
          Architecture
        </p>

        <p className="self-stretch text-[#333131] font-poppins text-base font-semibold leading-normal mt-1">
          From 28% to 35% gross profit in under 3 months—Shantanoo Rane's story is nothing short of inspiring!
        </p>

        <p className="self-stretch text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
          Shantanoo Rane, Roswalt Realty, CEO - Mumbai
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
