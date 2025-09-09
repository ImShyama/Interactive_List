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
import ErrorHandle from "../component/ErrorHandle";

const VideoGallaryView = ({ data, headers, tempHeader, filteredData, setFilteredData, paginatedData, settings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const navigate = useNavigate();
  const videoData = data[0];
  const titleKey = settings?.showInCard[0]?.title?.toLowerCase().replace(/\s/g, "_");
  const videoUrl = videoData?.[titleKey];
  console.log({ videoUrl });

  const videos = data;

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
    <>
      {videoUrl ? (
        <div className="px-10">

          <div
            style={{ width: "100%", overflowX: "auto", maxHeight: "70vh" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"
          >
        
            {paginatedVideos.map((video) => (
            <VideoCard
              key={video.id}
              rowData={video}
              settings={settings}
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
      ) : (
        // <div>missing video links, please check</div>
        <ErrorHandle msg={'missing video links, please check'}/>
      )}
    </>
  );
};

export default VideoGallaryView;
