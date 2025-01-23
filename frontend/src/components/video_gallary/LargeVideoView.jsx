
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { IoMdArrowBack } from "react-icons/io";

// const LargeVideoView = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const video = location.state?.video;

//   if (!video) {
//     navigate(-1); // Redirect to home if no video is found
//     return null;
//   }

//   return (
//     <div className="flex flex-col items-center">
//       {/* Title Bar Section */}
//       <div className="w-[1337px] h-[57px] flex items-center gap-[39px] mt-[63px]">
//         <IoMdArrowBack
//           className="text-xl cursor-pointer"
//           style={{ height: "45px", width: "45px", color: "#000000" }}
//           onClick={() => navigate(-1)}
//         />
//         <div className="text-[38.176px] font-medium text-[#3D3C3C] font-poppins leading-normal">
//           Tech Friday | {video.title}
//         </div>
//       </div>

//       {/* Video Section */}
//       <div className="w-[1250px] h-[534px] mt-[85px] flex justify-center">
//         <iframe
//           width="100%"
//           height="auto"
//           style={{ aspectRatio: "16/9", borderRadius: "36.443px" }}
//           src={video.video}
//           title={video.title}
//           allow="autoplay; encrypted-media"
//           frameBorder="0"
//           allowFullScreen
//         ></iframe>
//       </div>

//       {/* Content Section */}
//       <div className="w-[1250px] mt-[85px] flex flex-col items-start gap-[16px]">
//         <div className="text-[32.786px] font-normal text-[#797979] font-poppins leading-normal">
//           Revive Old Leads and Boost Your Sales
//         </div>
//         <div className="text-[#9B9B9B] font-poppins text-[25.072px] font-light leading-normal">
//           Watch our latest Tech Friday video and learn to Centralize Customer
//           Data for Sales Explosion: ✅ Revive old customers🎉 & multiply repeat
//           orders😄✅ Move from Transactions to Relations🤝✅ Analyze with AI🤖 for
//           super Sales Strategy
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LargeVideoView;


// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { IoMdArrowBack } from "react-icons/io";

// const LargeVideoView = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const video = location.state?.video;

//   const [isPlaying, setIsPlaying] = useState(false);

//   if (!video) {
//     navigate(-1); // Redirect to home if no video is found
//     return null;
//   }

//   const handlePlayVideo = () => {
//     setIsPlaying(true);
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {/* Title Bar Section */}
//       <div className="w-[1337px] h-[57px] flex items-center gap-[39px] mt-[63px]">
//         <IoMdArrowBack
//           className="text-xl cursor-pointer"
//           style={{ height: "45px", width: "45px", color: "#000000" }}
//           onClick={() => navigate(-1)}
//         />
//         <div className="text-[38.176px] font-medium text-[#3D3C3C] font-poppins leading-normal">
//           Tech Friday | {video.title}
//         </div>
//       </div>

//       {/* Video Section */}
//       <div className="w-[1250px] h-[534px] mt-[63px] flex justify-center relative">
//         {!isPlaying ? (
//           <div className="relative w-full h-full cursor-pointer" onClick={handlePlayVideo}>
//             <img
//               src={video.image} // custom thumbnail here
//               alt={video.title}
//               className="w-full h-full object-cover rounded-[36.443px]"
//             />
//             {/* Custom Play Button Overlay */}
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="bg-black bg-opacity-50 rounded-full p-[24px]">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-[64px] w-[64px] text-white"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                 >
//                   <path d="M8 5v14l11-7z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <iframe
//             width="100%"
//             height="100%"
//             style={{ aspectRatio: "16/9", borderRadius: "36.443px" }}
//             src={`${video.video}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`}
//             title={video.title}
//             allow="autoplay; encrypted-media"
//             frameBorder="0"
//             allowFullScreen
//           ></iframe>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="w-[1250px] mt-[86px] flex flex-col items-start gap-[16px]">
//         <div className="text-[32.786px] font-normal text-[#797979] font-poppins leading-normal">
//           Revive Old Leads and Boost Your Sales
//         </div>
//         <div className="text-[#9B9B9B] font-poppins text-[25.072px] font-light leading-normal">
//           Watch our latest Tech Friday video and learn to Centralize Customer
//           Data for Sales Explosion: ✅ Revive old customers🎉 & multiply repeat
//           orders😄✅ Move from Transactions to Relations🤝✅ Analyze with AI🤖 for
//           super Sales Strategy
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LargeVideoView;


import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const LargeVideoView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const video = location.state?.video;

  const [isPlaying, setIsPlaying] = useState(false);

  if (!video) {
    navigate(-1); // Redirect to home if no video is found
    return null;
  }

  const getVideoSrc = (video) => {
    if (video.isGoogleDrive) {
      const fileId = video.video.split("/d/")[1]?.split("/")[0];
      return `https://drive.google.com/file/d/${fileId}/preview`; // Google Drive embed link
    }
    return `${video.video}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`;
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center mx-20">
      {/* Title Bar Section */}
      <div className="w-[100%] flex items-center gap-[39px] py-3">
        <IoMdArrowBack
          className="text-xl cursor-pointer"
          style={{ height: "45px", width: "45px", color: "#000000" }}
          onClick={() => navigate(-1)}
        />
        <div className="text-[38.176px] font-medium text-[#3D3C3C] font-poppins leading-normal">
          Tech Friday | {video.title}
        </div>
      </div>

      {/* Video Section */}
      <div className="w-[100%] flex justify-center relative">
        {!isPlaying ? (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={handlePlayVideo}
          >
            <img
              src={video.image}
              alt={video.title}
              className="w-full h-[100vh-200px] object-cover rounded-[36.443px]"
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
            width="100%"
            height="50%"
            style={{ aspectRatio: "16/9", borderRadius: "36.443px" }}
            src={getVideoSrc(video)} // Dynamic video URL
            title={video.title}
            allow="autoplay; encrypted-media"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* Content Section */}
      <div className="w-[100%] flex flex-col items-start gap-[16px]">
        <div className="text-[32.786px] font-normal text-[#797979] font-poppins leading-normal">
          Revive Old Leads and Boost Your Sales
        </div>
        <div className="text-[#9B9B9B] font-poppins text-[25.072px] font-light leading-normal">
          Watch our latest Tech Friday video and learn to Centralize Customer
          Data for Sales Explosion: ✅ Revive old customers🎉 & multiply repeat
          orders😄✅ Move from Transactions to Relations🤝✅ Analyze with AI🤖 for
          super Sales Strategy
        </div>
      </div>
    </div>
  );
};

export default LargeVideoView;

