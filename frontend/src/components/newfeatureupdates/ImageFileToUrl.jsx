import axios from "axios";

export const ImageFileToUrl = async (file) => {
  const cloudinaryInfo = {
    cloud_name: "dodljshqs",
    upload_preset: "zgoizyqx",
  };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryInfo.upload_preset);

  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudinaryInfo.cloud_name}/image/upload`;

  try {
    const response = await axios.post(uploadEndpoint, formData);
    if (response.status === 200) {
      const mediaURL = response.data.url;

      return mediaURL;
    } else {
      console.error("Media upload failed.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred during media upload:", error);
    return null;
  }
};