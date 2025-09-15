import React from "react";
import { Modal, Image } from "antd";

const FeatureImgPreview = ({ 
  visible, 
  onClose, 
  imageUrl, 
  title = "Feature Preview" 
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <div className="flex justify-center">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Feature Preview"
            className="max-w-full h-auto rounded-lg"
            preview={{
              mask: "Click to preview",
              maskClassName: "rounded-lg"
            }}
          />
        )}
      </div>
    </Modal>
  );
};

export default FeatureImgPreview;