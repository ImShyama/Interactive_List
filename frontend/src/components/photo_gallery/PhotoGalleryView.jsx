import React, { useState } from "react";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import PhotoCard from "./PhotoCard"; // Import the new PhotoCard component
import BiggerView from "./BiggerView"; // Import BiggerView
import { getDriveThumbnail } from "../../utils/globalFunctions";

const PhotoGalleryView = ({ settings, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [hoveredPhoto, setHoveredPhoto] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // State to hold the selected photo for BiggerView
  const [showBiggerView, setShowBiggerView] = useState(false); // State to control visibility of BiggerView

  const photo1 = "https://drive.google.com/file/d/1he_7YkWxonjUYPxS8nvVkTGdCUqyH5zj/view?usp=sharing";
  const photo2 = "https://drive.google.com/file/d/19MO-u2a8dGdO3DxQrqjNDodVJxubYg65/view?usp=sharing";
  const photo3 = "https://drive.google.com/file/d/1gs68Zzlqtf79ZY-sADE6cfW0cUq_zFCY/view?usp=sharing";
  const photo4 = "https://drive.google.com/file/d/1XvukSmBPU0IKZiSUhJ-jOFpr2zfT7LnJ/view?usp=sharing";
  const photo5 = "https://drive.google.com/file/d/1XvukSmBPU0IKZiSUhJ-jOFpr2zfT7LnJ/view?usp=sharing";
  const photo6 = "https://drive.google.com/file/d/1xe1ZCr1bNZAmtYZswRvhAyXfBaeFZwBy/view?usp=sharing";
  const photo7 = "https://drive.google.com/file/d/1jUdXZ-efaZfsQoJP2fKSuf7OdUMnciiD/view?usp=sharing";
  const photo8 = "https://drive.google.com/file/d/1K680yMFCs__bOM5ZHBfd3ZFqcOSIbDcR/view?usp=sharing";

  // Sample photos data
  const photos = data;


  const paginatedPhotos = photos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo); // Set the selected photo
    setShowBiggerView(true); // Show the BiggerView
  };

  const handleCloseBiggerView = () => {
    setShowBiggerView(false); // Close the BiggerView modal
    setSelectedPhoto(null); // Clear the selected photo
  };

  const handleImage = (url) => {
    if (!url) return [];
    let urlArr = url.split(",");
    return urlArr.map((url) => getDriveThumbnail(url));
  };

  return (
    <div className="px-10 py-2">
      {/* Photo Gallery */}
      <div
        style={{ width: "100%", overflowX: "auto", maxHeight: "600px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"
      >
        {paginatedPhotos.map((photo) => {
          const image = handleImage(photo[settings.showInCard[0].title.toLowerCase().replace(/\s/g, "_")]);
          const title = photo[settings.showInCard[1].title.toLowerCase().replace(/\s/g, "_")] || "";
          const subTitle = photo[settings.showInCard[2].title.toLowerCase().replace(/\s/g, "_")] || "";
          console.log({photo:photo[settings.showInCard[0].title.toLowerCase().replace(/\s/g, "_")], image});
          return (
            <PhotoCard
              key={photo.key_id}
              image={image}
              title={title}
              subTitle={subTitle}
              hoveredPhoto={hoveredPhoto}
              setHoveredPhoto={setHoveredPhoto}
              handlePhotoClick={() => handlePhotoClick(photo)}
            />
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={photos.length}
          showSizeChanger
          onChange={handlePageChange}
        />
      </div>

      {/* Show BiggerView as a modal */}
      {/* {showBiggerView && (
        <BiggerView photo={selectedPhoto} onClose={handleCloseBiggerView} />
      )} */}
    </div>
  );
};

export default PhotoGalleryView;
