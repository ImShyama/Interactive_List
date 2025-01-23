// import React, { useState } from "react";
// import thumbnail1 from "../../assets/images/thumbnail1.png";
// import thumbnail2 from "../../assets/images/thumbnail2.png";
// import thumbnail3 from "../../assets/images/thumbnail3.png";
// import thumbnail4 from "../../assets/images/thumbnail4.png";
// import thumbnail5 from "../../assets/images/thumbnail5.png";
// import thumbnail6 from "../../assets/images/thumbnail6.png";
// import thumbnail7 from "../../assets/images/thumbnail7.png";
// import thumbnail8 from "../../assets/images/thumbnail8.png";
// import TitleBarPreview from "../TitleBarPreview";
// import { Pagination } from "antd";

// const VideoGallaryPreview = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(8);

//   // Dummy data for video thumbnails
//   const videos = [
//     { id: 1, title: "Significance of Video Thumbnail", image: thumbnail1 },
//     { id: 2, title: "How to Make YouTube Thumbnails", image: thumbnail2 },
//     { id: 3, title: "Inspiring Story - Shantanoo Rane", image: thumbnail3 },
//     { id: 4, title: "Watch My Video!", image: thumbnail4 },
//     { id: 5, title: "YouTube Thumbnail Template", image: thumbnail5 },
//     { id: 6, title: "Another Inspiring Story", image: thumbnail6 },
//     { id: 7, title: "Funny Video to watch", image: thumbnail7 },
//     { id: 8, title: "Podcast Video to Watch", image: thumbnail8 },
//   ];

//   // Pagination logic
//   const paginatedVideos = videos.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handlePageChange = (page, size) => {
//     setCurrentPage(page);
//     setPageSize(size);
//   };

//   return (
//     <div className="px-10 py-2">
//       {/* TitleBar Section for video gallery page */}
//       <div>
//         <TitleBarPreview
//           appName={"Video Gallery"}
//           spreadSheetID={""}
//           spreadSheetName={"Data"}
//         />
//       </div>

//       {/* Grid Section for video thumbnails */}
//       {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"> */}

//        {/* Grid Section for video thumbnails with sliding effect */}
//        <div
//         style={{ width: '100%', overflowX: 'auto', maxHeight: '600px' }}
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"
//       >

//         {paginatedVideos.map((video) => (
//           <div
//             key={video.id}
//             className="bg-white shadow-md rounded-lg overflow-hidden"
//           >
//             <img
//               src={video.image}
//               alt={video.title}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <h3 className="text-lg font-bold">{video.title}</h3>
//               <p className="text-sm text-gray-600">Architecture</p>
//               <p className="text-sm text-gray-600 mt-1">
//                 From 28% to 35% gross profit in under 3 months—Shantanoo Rane's
//                 story is nothing short of inspiring!
//               </p>
//               <p className="text-sm text-gray-500 mt-1">
//                 Shantanoo Rane, Roswalt Realty, CEO - Mumbai
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-end mt-6">
//         <Pagination
//           current={currentPage}
//           pageSize={pageSize}
//           total={videos.length}
//           showSizeChanger
//           onChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default VideoGallaryPreview;

// import React, { useState } from "react";
// import TitleBarPreview from "../TitleBarPreview";
// import { Pagination } from "antd";
// import LargeVideoView from "./LargeVideoView";
// import thumbnail1 from "../../assets/images/thumbnail1.png";
// import thumbnail2 from "../../assets/images/thumbnail2.png";
// import thumbnail3 from "../../assets/images/thumbnail3.png";
// import thumbnail4 from "../../assets/images/thumbnail4.png";
// import thumbnail5 from "../../assets/images/thumbnail5.png";
// import thumbnail6 from "../../assets/images/thumbnail6.png";
// import thumbnail7 from "../../assets/images/thumbnail7.png";
// import thumbnail8 from "../../assets/images/thumbnail8.png";

// const VideoGalleryPreview = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const [hoveredVideo, setHoveredVideo] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   const videos = [
//     {
//       id: 1,
//       title: "Significance of Video Thumbnail",
//       video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//       image: thumbnail1,
//     },
//     {
//       id: 2,
//       title: "How to Make YouTube Thumbnails",
//       video: "https://www.youtube.com/embed/3fumBcKC6RE",
//       image: thumbnail2,
//     },
//     {
//       id: 3,
//       title: "Inspiring Story - Shantanoo Rane",
//       video: "https://www.youtube.com/embed/VYOjWnS4cMY",
//       image: thumbnail3,
//     },
//     {
//       id: 4,
//       title: "Watch My Video!",
//       video: "https://www.youtube.com/embed/tgbNymZ7vqY",
//       image: thumbnail4,
//     },
//     {
//       id: 5,
//       title: "YouTube Thumbnail Template",
//       video: "https://www.youtube.com/embed/2Vv-BfVoq4g",
//       image: thumbnail5,
//     },
//     {
//       id: 6,
//       title: "Another Inspiring Story",
//       video: "https://www.youtube.com/embed/kJQP7kiw5Fk",
//       image: thumbnail6,
//     },
//     {
//       id: 7,
//       title: "Funny Video to watch",
//       video: "https://www.youtube.com/embed/lTTajzrSkCw",
//       image: thumbnail7,
//     },
//     {
//       id: 8,
//       title: "Podcast Video to Watch",
//       video: "https://www.youtube.com/embed/9bZkp7q19f0",
//       image: thumbnail8,
//     },
//   ];

//   const paginatedVideos = videos.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handlePageChange = (page, size) => {
//     setCurrentPage(page);
//     setPageSize(size);
//   };

//   return (
//     <div className="px-10 py-2">
//       <div>
//         <TitleBarPreview
//           appName={"Video Gallery"}
//           spreadSheetID={""}
//           spreadSheetName={"Data"}
//         />
//       </div>

//       {/* Grid Section for video thumbnails */}
//       {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"> */}

//       {/* Grid Section for video thumbnails with sliding effect */}
//       <div
//         style={{ width: "100%", overflowX: "auto", maxHeight: "600px" }}
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"
//       >
//         {paginatedVideos.map((video) => (
//           <div
//             key={video.id}
//             className="bg-white shadow-md rounded-lg overflow-hidden"
//             onMouseEnter={() => setHoveredVideo(video.id)}
//             onMouseLeave={() => setHoveredVideo(null)}
//             onClick={() => setSelectedVideo(video)} // Handle thumbnail click
//           >
//             {hoveredVideo === video.id ? (
//               <iframe
//                 width="100%"
//                 height="200"
//                 src={`${video.video}?autoplay=1&mute=1`}
//                 title={video.title}
//                 allow="autoplay; encrypted-media"
//                 frameBorder="0"
//                 allowFullScreen
//               ></iframe>
//             ) : (
//               <img
//                 src={video.image}
//                 alt={video.title}
//                 className="w-full h-48 object-cover"
//               />
//             )}
// <div className="p-4">
//   <h3 className="text-lg font-bold">{video.title}</h3>
//   {/* <p className="text-sm text-gray-600">Architecture</p> */}
//   <p className="self-stretch text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
//     Architecture
//   </p>
//   {/* <p className="text-sm text-gray-600 mt-1">
//     From 28% to 35% gross profit in under 3 months—Shantanoo Rane's
//     story is nothing short of inspiring!
//   </p> */}

//   <p className="self-stretch text-[#333131] font-poppins text-base font-semibold leading-normal mt-1">
//     From 28% to 35% gross profit in under 3 months—Shantanoo Rane's
//     story is nothing short of inspiring!
//   </p>

//   {/* <p className="text-sm text-gray-500 mt-1">
//     Shantanoo Rane, Roswalt Realty, CEO - Mumbai
//   </p> */}

//   <p className="self-stretch text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
//     Shantanoo Rane, Roswalt Realty, CEO - Mumbai
//   </p>
// </div>
//           </div>
//         ))}
//       </div>

//       {/* Large Video View */}
//       <LargeVideoView
//         video={selectedVideo}
//         onClose={() => setSelectedVideo(null)}
//       />

//       <div className="flex justify-end mt-6">
//         <Pagination
//           current={currentPage}
//           pageSize={pageSize}
//           total={videos.length}
//           showSizeChanger
//           onChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default VideoGalleryPreview;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import TitleBarPreview from "../TitleBarPreview";
// import { Pagination } from "antd";
// import thumbnail1 from "../../assets/images/thumbnail1.png";
// import thumbnail2 from "../../assets/images/thumbnail2.png";
// import thumbnail3 from "../../assets/images/thumbnail3.png";
// import thumbnail4 from "../../assets/images/thumbnail4.png";
// import thumbnail5 from "../../assets/images/thumbnail5.png";
// import thumbnail6 from "../../assets/images/thumbnail6.png";
// import thumbnail7 from "../../assets/images/thumbnail7.png";
// import thumbnail8 from "../../assets/images/thumbnail8.png";

// const VideoGalleryPreview = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const [hoveredVideo, setHoveredVideo] = useState(null);
//   const navigate = useNavigate();

//   const videos = [
//     {
//       id: 1,
//       title: "Significance of Video Thumbnail",
//       video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//       image: thumbnail1,
//     },
//     {
//       id: 2,
//       title: "How to Make YouTube Thumbnails",
//       video: "https://www.youtube.com/embed/3fumBcKC6RE",
//       image: thumbnail2,
//     },
//     {
//       id: 3,
//       title: "Inspiring Story - Shantanoo Rane",
//       video: "https://www.youtube.com/embed/Oa_RSwwpPaA",
//       image: thumbnail3,
//     },
//     {
//       id: 4,
//       title: "Watch My Video!",
//       video: "https://www.youtube.com/embed/tgbNymZ7vqY",
//       image: thumbnail4,
//     },
//     {
//       id: 5,
//       title: "YouTube Thumbnail Template",
//       video: "https://www.youtube.com/embed/2Vv-BfVoq4g",
//       image: thumbnail5,
//     },
//     {
//       id: 6,
//       title: "Another Inspiring Story",
//       video: "https://www.youtube.com/embed/kJQP7kiw5Fk",
//       image: thumbnail6,
//     },
//     {
//       id: 7,
//       title: "Funny Video to watch",
//       video: "https://www.youtube.com/embed/Mv3SZDP7QUo",
//       image: thumbnail7,
//     },
//     {
//       id: 8,
//       title: "Podcast Video to Watch",
//       video: "https://www.youtube.com/embed/1mAgelsVrHs",
//       image: thumbnail8,
//     },
//   ];

//   const paginatedVideos = videos.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handlePageChange = (page, size) => {
//     setCurrentPage(page);
//     setPageSize(size);
//   };

//   const handleVideoClick = (video) => {
//     navigate(`/video/${video.id}`, { state: { video } });
//   };

//   return (
//     <div className="px-10 py-2">
//       <div>
//         <TitleBarPreview
//           appName={"Video Gallery"}
//           spreadSheetID={""}
//           spreadSheetName={"Data"}
//         />
//       </div>

//       <div
//         style={{ width: "100%", overflowX: "auto", maxHeight: "600px" }}
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"
//       >
//         {paginatedVideos.map((video) => (
//           <div
//             key={video.id}
//             className="bg-white shadow-md rounded-lg overflow-hidden"
//             onMouseEnter={() => setHoveredVideo(video.id)}
//             onMouseLeave={() => setHoveredVideo(null)}
//             onClick={() => handleVideoClick(video)} // Navigate on click
//           >
//             {hoveredVideo === video.id ? (
//               <iframe
//                 width="100%"
//                 height="200"
//                 src={`${video.video}?autoplay=1&mute=1`}
//                 title={video.title}
//                 allow="autoplay; encrypted-media"
//                 frameBorder="0"
//                 allowFullScreen
//               ></iframe>
//             ) : (
//               <img
//                 src={video.image}
//                 alt={video.title}
//                 className="w-full h-48 object-cover"
//               />
//             )}
//             {/* <div className="p-4">
//               <h3 className="text-lg font-bold">{video.title}</h3>
//               <p className="self-stretch text-[#333131] font-poppins text-base font-semibold leading-normal mt-1">
//                 From 28% to 35% gross profit in under 3 months—Shantanoo Rane's
//                 story is nothing short of inspiring!
//               </p>
//             </div> */}
//             <div className="p-4">
//               <h3 className="text-lg font-bold">{video.title}</h3>

//               <p className="self-stretch text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
//                 Architecture
//               </p>

//               <p className="self-stretch text-[#333131] font-poppins text-base font-semibold leading-normal mt-1">
//                 From 28% to 35% gross profit in under 3 months—Shantanoo Rane's
//                 story is nothing short of inspiring!
//               </p>

//               <p className="self-stretch text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
//                 Shantanoo Rane, Roswalt Realty, CEO - Mumbai
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-end mt-6">
//         <Pagination
//           current={currentPage}
//           pageSize={pageSize}
//           total={videos.length}
//           showSizeChanger
//           onChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default VideoGalleryPreview;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import TitleBarPreview from "../TitleBarPreview";
// import { Pagination } from "antd";
// import thumbnail1 from "../../assets/images/thumbnail1.png";
// import thumbnail2 from "../../assets/images/thumbnail2.png";
// import thumbnail3 from "../../assets/images/thumbnail3.png";
// import thumbnail4 from "../../assets/images/thumbnail4.png";
// import thumbnail5 from "../../assets/images/thumbnail5.png";
// import thumbnail6 from "../../assets/images/thumbnail6.png";
// import thumbnail7 from "../../assets/images/thumbnail7.png";
// import thumbnail8 from "../../assets/images/thumbnail8.png";

// const VideoGallaryPreview = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const [hoveredVideo, setHoveredVideo] = useState(null);
//   const navigate = useNavigate();

//   const videos = [
    // {
    //   id: 1,
    //   title: "Significance of Video Thumbnail",
    //   video:"https://drive.google.com/file/d/1sbiKGp8iIyTzOHACuSm0xOME4fzz29uz/view?usp=sharing",
    //   image: thumbnail1,
    //   isGoogleDrive: true, // Flag to identify Google Drive videos
    // },
    // {
    //   id: 2,
    //   title: "How to Make YouTube Thumbnails",
    //   video: "https://www.youtube.com/embed/02kVDdzlflM",
    //   image: thumbnail2,
    // },
    // {
    //   id: 3,
    //   title: "Inspiring Story - Shantanoo Rane",
    //   video: "https://www.youtube.com/embed/HD4IUbTZsfM",
    //   image: thumbnail3,
    // },
    // {
    //   id: 4,
    //   title: "Watch My Video!",
    //   video: "https://www.youtube.com/embed/C0UyDNCx3qo",
    //   image: thumbnail4,
    // },
    // {
    //   id: 5,
    //   title: "YouTube Thumbnail Template",
    //   video: "https://www.youtube.com/embed/hDZ91RzzgkY",
    //   image: thumbnail5,
    // },
    // {
    //   id: 6,
    //   title: "Another Inspiring Story",
    //   video: "https://www.youtube.com/embed/0lAuwVLJ_nw",
    //   image: thumbnail6,
    // },
    // {
    //   id: 7,
    //   title: "Funny Video to watch",
    //   video: "https://www.youtube.com/embed/AreWQuDjtUE",
    //   image: thumbnail7,
    // },
    // {
    //   id: 8,
    //   title: "Podcast Video to Watch",
    //   video:"https://drive.google.com/file/d/1NCGl77J5498TNDuDp4_9g3C5cfb4RraZ/view?usp=sharing",
    //   image: thumbnail8,
    //   isGoogleDrive: true, // Flag for Google Drive
    // },
//   ];

//   const paginatedVideos = videos.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handlePageChange = (page, size) => {
//     setCurrentPage(page);
//     setPageSize(size);
//   };

//   const handleVideoClick = (video) => {
//     navigate(`/video/${video.id}`, { state: { video } });
//   };

//   return (
//     <div className="px-10 py-2">
//       <div>
//         <TitleBarPreview
//           appName={"Video Gallary"}
//           spreadSheetID={"1AXbyb8PFWZ0lCqiRAxLl5ymdLERTnHhvP9SMNVjuI0A"}
//           spreadSheetName={"Data"}
//         />
//       </div>

//       <div
//         style={{ width: "100%", overflowX: "auto", maxHeight: "600px" }}
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"
//       >
//         {paginatedVideos.map((video) => (
//           <div
//             key={video.id}
//             className="bg-white shadow-md rounded-lg overflow-hidden"
//             onMouseEnter={() => setHoveredVideo(video.id)}
//             onMouseLeave={() => setHoveredVideo(null)}
//             onClick={() => handleVideoClick(video)} // Navigate on click
//           >
//             {hoveredVideo === video.id ? (
//               <iframe
//                 width="100%"
//                 height="200"
//                 src={
//                   video.isGoogleDrive
//                     ? `https://drive.google.com/file/d/${
//                         video.video.split("/d/")[1].split("/")[0]
//                       }/preview` // Google Drive preview link
//                     : `${video.video}?autoplay=1&mute=1`
//                 }
//                 title={video.title}
//                 allow="autoplay; encrypted-media"
//                 frameBorder="0"
//                 allowFullScreen
//               ></iframe>
//             ) : (
//               <img
//                 src={video.image}
//                 alt={video.title}
//                 className="w-full h-48 object-cover"
//               />
//             )}
//             <div className="p-4">
//               <h3 className="text-lg font-bold">{video.title}</h3>

//               <p className="self-stretch text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
//                 Architecture
//               </p>

//               <p className="self-stretch text-[#333131] font-poppins text-base font-semibold leading-normal mt-1">
//                 From 28% to 35% gross profit in under 3 months—Shantanoo Rane's
//                 story is nothing short of inspiring!
//               </p>

//               <p className="self-stretch text-[#B0B0B0] font-poppins text-base font-normal leading-normal">
//                 Shantanoo Rane, Roswalt Realty, CEO - Mumbai
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-end mt-6">
//         <Pagination
//           current={currentPage}
//           pageSize={pageSize}
//           total={videos.length}
//           showSizeChanger
//           onChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default VideoGallaryPreview;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleBarPreview from "../TitleBarPreview";
import { Pagination } from "antd";
import VideoCard from "./VideoCard"; // Import the new VideoCard component
import thumbnail1 from "../../assets/images/thumbnail1.png";
import thumbnail2 from "../../assets/images/thumbnail2.png";
import thumbnail3 from "../../assets/images/thumbnail3.png";
import thumbnail4 from "../../assets/images/thumbnail4.png";
import thumbnail5 from "../../assets/images/thumbnail5.png";
import thumbnail6 from "../../assets/images/thumbnail6.png";
import thumbnail7 from "../../assets/images/thumbnail7.png";
import thumbnail8 from "../../assets/images/thumbnail8.png";

const VideoGallaryPreview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const navigate = useNavigate();

  const videos = [
    // Video objects here...
    {
      id: 1,
      title: "Significance of Video Thumbnail",
      video:"https://drive.google.com/file/d/1sbiKGp8iIyTzOHACuSm0xOME4fzz29uz/view?usp=sharing",
      image: thumbnail1,
      isGoogleDrive: true, // Flag to identify Google Drive videos
    },
    {
      id: 2,
      title: "How to Make YouTube Thumbnails",
      video: "https://www.youtube.com/embed/02kVDdzlflM",
      image: thumbnail2,
    },
    {
      id: 3,
      title: "Inspiring Story - Shantanoo Rane",
      video: "https://www.youtube.com/embed/HD4IUbTZsfM",
      image: thumbnail3,
    },
    {
      id: 4,
      title: "Watch My Video!",
      video: "https://www.youtube.com/embed/C0UyDNCx3qo",
      image: thumbnail4,
    },
    {
      id: 5,
      title: "YouTube Thumbnail Template",
      video: "https://www.youtube.com/embed/hDZ91RzzgkY",
      image: thumbnail5,
    },
    {
      id: 6,
      title: "Another Inspiring Story",
      video: "https://www.youtube.com/embed/0lAuwVLJ_nw",
      image: thumbnail6,
    },
    {
      id: 7,
      title: "Funny Video to watch",
      video: "https://www.youtube.com/embed/AreWQuDjtUE",
      image: thumbnail7,
    },
    {
      id: 8,
      title: "Podcast Video to Watch",
      video:"https://drive.google.com/file/d/1NCGl77J5498TNDuDp4_9g3C5cfb4RraZ/view?usp=sharing",
      image: thumbnail8,
      isGoogleDrive: true, // Flag for Google Drive
    },
  ];

  const paginatedVideos = videos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleVideoClick = (video) => {
    navigate(`/video/${video.id}`, { state: { video } });
  };

  return (
    <div className="px-10 py-2">
      <div>
        <TitleBarPreview
          appName={"Video Gallary"}
          spreadSheetID={"1AXbyb8PFWZ0lCqiRAxLl5ymdLERTnHhvP9SMNVjuI0A"}
          spreadSheetName={"Data"}
        />
      </div>

      <div
        style={{ width: "100%", overflowX: "auto", maxHeight: "600px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"
      >
        {paginatedVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            hoveredVideo={hoveredVideo}
            setHoveredVideo={setHoveredVideo}
            handleVideoClick={handleVideoClick}
          />
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={videos.length}
          showSizeChanger
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default VideoGallaryPreview;
