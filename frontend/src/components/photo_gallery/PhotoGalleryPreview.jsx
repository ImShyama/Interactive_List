import React, { useState } from "react";
import { Pagination } from "antd";
import TitleBarPreview from "../TitleBarPreview";
import PhotoCard from "./PhotoCard";
import {APPS} from "../../utils/constants";

import { getDriveThumbnail } from "../../utils/globalFunctions";

// Sample photo URLs from Google Drive (replace with actual URLs)
const photo1 = "https://drive.google.com/file/d/1he_7YkWxonjUYPxS8nvVkTGdCUqyH5zj/view?usp=sharing";
const photo2 = "https://drive.google.com/file/d/19MO-u2a8dGdO3DxQrqjNDodVJxubYg65/view?usp=sharing";
const photo3 = "https://drive.google.com/file/d/1gs68Zzlqtf79ZY-sADE6cfW0cUq_zFCY/view?usp=sharing";
const photo4 = "https://drive.google.com/file/d/1XvukSmBPU0IKZiSUhJ-jOFpr2zfT7LnJ/view?usp=sharing";
const photo5 = "https://drive.google.com/file/d/1XvukSmBPU0IKZiSUhJ-jOFpr2zfT7LnJ/view?usp=sharing";
const photo6 = "https://drive.google.com/file/d/1xe1ZCr1bNZAmtYZswRvhAyXfBaeFZwBy/view?usp=sharing";
const photo7 = "https://drive.google.com/file/d/1jUdXZ-efaZfsQoJP2fKSuf7OdUMnciiD/view?usp=sharing";
const photo8 = "https://drive.google.com/file/d/1K680yMFCs__bOM5ZHBfd3ZFqcOSIbDcR/view?usp=sharing";
const PhotoGalleryPreview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Sample photos data
  const photos = [
    {
      id: 1,
      images: [photo1, photo2, photo3].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 2,
      images: [photo2, photo3, photo4].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 3,
      images: [photo3, photo4, photo5].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 4,
      images: [photo4, photo5, photo6].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 5,
      images: [photo5, photo6, photo7].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 6,
      images: [photo6, photo7, photo8].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 7,
      images: [photo7, photo8, photo1].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 8,
      images: [photo8, photo1, photo2].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 5,
      images: [photo5, photo6, photo7].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 6,
      images: [photo6, photo7, photo8].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 7,
      images: [photo7, photo8, photo1].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
    {
      id: 8,
      images: [photo8, photo1, photo2].map(getDriveThumbnail), // Use helper to convert to thumbnails,
      description:
        "Tech Friday | Want More Sales This Festive Season? Try These Simple Steps!",
      date: "October 2024",
    },
  ];

  const paginatedPhotos = photos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const appsDetails = APPS[3];

  return (
    <div className="px-10 py-2">
      <TitleBarPreview
        appName={appsDetails.appName}
        spreadSheetID={appsDetails.appID}
        spreadSheetName={appsDetails.spreadSheetName}
      />

      {/* Photo Gallery Grid */}

      <div
        style={{ width: "100%", overflowX: "auto", maxHeight: "600px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4 mt-4"
      >
        {paginatedPhotos.map((photo) => {

          const image = getDriveThumbnail(photo.images);
          const title = photo.description || "";
          const subTitle = photo.date || "";

          return (<PhotoCard key={photo.id} image={image} title={title} subTitle={subTitle} />)
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={photos.length}
          showSizeChanger
          onChange={(page, size) => setCurrentPage(page) || setPageSize(size)}
        />
      </div>
    </div>
  );
};

export default PhotoGalleryPreview;
