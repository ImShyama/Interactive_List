import React, { useState, useEffect } from "react";
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
import { data } from "../../utils/VideoGallery_DumyData";

const VideoGallaryPreview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [filteredVideos, setFilteredVideos] = useState(data);
  const navigate = useNavigate();

  const videos = data;
  // [
  //   // Video objects here...
  //   {
  //     key_id: 1,
  //     title: "Significance of Video Thumbnail",
  //     video:
  //       "https://drive.google.com/file/d/1sbiKGp8iIyTzOHACuSm0xOME4fzz29uz/view?usp=sharing",
  //     image: thumbnail1,
  //     category: "Architecture",
  //     description:
  //       "From 28% to 35% gross profit in under 3 months—Shantanoo Rane's story is nothing short of inspiring!",
  //     subtitle: "Shantanoo Rane, Roswalt Realty, CEO - Mumbai",
  //   },
  //   {
  //     key_id: 2,
  //     title: "How to Make YouTube Thumbnails",
  //     video: "https://www.youtube.com/embed/02kVDdzlflM",
  //     image: thumbnail2,
  //     category: "Architecture",
  //     description:
  //       "From 28% to 35% gross profit in under 3 months—Shantanoo Rane's story is nothing short of inspiring!",
  //     subtitle: "Shantanoo Rane, Roswalt Realty, CEO - Mumbai",
  //   },
  //   {
  //     key_id: 3,
  //     title: "Inspiring Story - Shantanoo Rane",
  //     video: "https://www.youtube.com/embed/HD4IUbTZsfM",
  //     image: thumbnail3,
  //     category: "Architecture",
  //     description:
  //       "From 28% to 35% gross profit in under 3 months—Shantanoo Rane's story is nothing short of inspiring!",
  //     subtitle: "Shantanoo Rane, Roswalt Realty, CEO - Mumbai",
  //   },
  //   {
  //     key_id: 4,
  //     title: "Watch My Video!",
  //     video: "https://www.youtube.com/embed/C0UyDNCx3qo",
  //     image: thumbnail4,
  //     category: "Architecture",
  //     description:
  //       "From 28% to 35% gross profit in under 3 months—Shantanoo Rane's story is nothing short of inspiring!",
  //     subtitle: "Shantanoo Rane, Roswalt Realty, CEO - Mumbai",
  //   },
  //   {
  //     key_id: 5,
  //     title: "YouTube Thumbnail Template",
  //     video: "https://www.youtube.com/embed/hDZ91RzzgkY",
  //     image: thumbnail5,
  //     category: "Architecture",
  //     description:
  //       "From 28% to 35% gross profit in under 3 months—Shantanoo Rane's story is nothing short of inspiring!",
  //     subtitle: "Shantanoo Rane, Roswalt Realty, CEO - Mumbai",
  //   },
  //   {
  //     key_id: 6,
  //     title: "Another Inspiring Story",
  //     video: "https://www.youtube.com/embed/0lAuwVLJ_nw",
  //     image: thumbnail6,
  //     category: "Architecture",
  //     description:
  //       "From 28% to 35% gross profit in under 3 months—Shantanoo Rane's story is nothing short of inspiring!",
  //     subtitle: "Shantanoo Rane, Roswalt Realty, CEO - Mumbai",
  //   },
  //   {
  //     key_id: 7,
  //     title: "Funny Video to watch",
  //     video: "https://www.youtube.com/embed/AreWQuDjtUE",
  //     image: thumbnail7,
  //     category: "Architecture",
  //     description:
  //       "From 28% to 35% gross profit in under 3 months—Shantanoo Rane's story is nothing short of inspiring!",
  //     subtitle: "Shantanoo Rane, Roswalt Realty, CEO - Mumbai",
  //   },
  //   {
  //     key_id: 8,
  //     title: "Podcast Video to Watch",
  //     video:
  //       "https://drive.google.com/file/d/1NCGl77J5498TNDuDp4_9g3C5cfb4RraZ/view?usp=sharing",
  //     image: thumbnail8,
  //     category: "Architecture",
  //     description:
  //       "From 28% to 35% gross profit in under 3 months—Shantanoo Rane's story is nothing short of inspiring!",
  //     subtitle: "Shantanoo Rane, Roswalt Realty, CEO - Mumbai",
  //   },
  // ];

  // const paginatedVideos = videos.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize
  // );

  // Limit videos to only 2 pages worth of data
  const maxPages = 2;
  const limitedVideos = filteredVideos.slice(0, pageSize * maxPages);

  const paginatedVideos = limitedVideos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setFilteredVideos(videos);
  }, [videos]);

  useEffect(() => {
    const cappedLength = limitedVideos.length || 1;
    const totalPages = Math.max(1, Math.ceil(cappedLength / pageSize));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [limitedVideos.length, pageSize, currentPage]);


  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleVideoClick = (video) => {
    navigate(`/video/${video.id}`, { state: { video } });
  };





  const defaultSettings = {
    "showInCard": [
      {
        "id": 6,
        "title": "link",
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
        "title": "topic",
        "setting": {
          "fontStyle": "Bold",
          "fontColor": "#333131",
          "fontSize": "20",
          "fontType": "Poppins"
        }
      },
      {
        "id": 3,
        "title": "month",
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
    "showInProfile": [
      {
        "id": 6,
        "title": "header",
        "setting": {
          "fontStyle": "Regular",
          "fontColor": "#000000",
          "fontSize": "16",
          "fontType": "Poppins"
        }
      },
    ],
    "_id": "1234567890987654"
  }

  return (
    <div className="px-10 py-2">
      <div>
        <TitleBarPreview
          appName={"Video Gallary"}
          spreadSheetID={"1AXbyb8PFWZ0lCqiRAxLl5ymdLERTnHhvP9SMNVjuI0A"}
          spreadSheetName={"Data"}
          data={videos}
          setFilteredData={setFilteredVideos}
        />
      </div>

      <div
        style={{ width: "100%", overflowX: "auto", maxHeight: "600px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"
      >
        {paginatedVideos.map((video) => (
          <VideoCard
            key={video.key_id}
            rowData={video}
            hoveredVideo={hoveredVideo}
            setHoveredVideo={setHoveredVideo}
            handleVideoClick={handleVideoClick}
            settings={defaultSettings}
          />
        ))}
      </div>

      <div className="flex justify-end mt-6">
        {/* <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={videos.length}
          showSizeChanger
          onChange={handlePageChange}
        /> */}

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={limitedVideos.length}  // ✅ only 2 pages of data (after filters/search)
          showSizeChanger     
          onChange={handlePageChange}
        />

      </div>
    </div>
  );
};

export default VideoGallaryPreview;
