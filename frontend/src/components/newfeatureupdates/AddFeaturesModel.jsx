import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button,
  styled,
  CircularProgress,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { message } from "antd";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import linkContext from "../../context/links/linkContext";
import { ImageFileToUrl } from "../Custom/ImageFileToUrl";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  borderRadius: "30px",
  boxShadow: 24,
  p: "20px 25px",
  outline: "none",
  border: "1px solid #E3EAEB",
  background: "#FFF",
  boxShadow: "10px 7px 61.8px 0px rgba(181, 189, 210, 0.25)",
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddFeaturesModel = ({
  openFeatureModal,
  handleCloseFeatureModal,
  isEditing,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  let { handleAddFeatures } = useContext(linkContext);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const success = (message) => {
    messageApi.open({
      type: "success",
      content: message,
      duration: 5,
    });
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    if (event.target.value) {
      setFile(null);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    if (event.target.files.length > 0) {
      setUrl("");
    }
    event.target.value = "";
  };

  const handleDeleteFile = () => {
    setFile(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    let convertUrl = "";

    if (file) {
      convertUrl = await ImageFileToUrl(file);
      if (!convertUrl) {
        message.error("Failed to upload image.");
        return;
      }
    }

    console.log("convertUrl", convertUrl);

    const formData = {
      featureName: title,
      month: date,
      videoUrl: url || "",
      imgUrl: convertUrl || "",
    };

    await handleAddFeatures(formData);
    setIsLoading(false);
    setTitle("");
    setDate("");
    setUrl("");
    setFile("");
    success("Feature added successfully.");
    handleCloseFeatureModal();
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={openFeatureModal}
        onClose={handleCloseFeatureModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box className="muiModalBox" sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ color: "#161616", fontSize: "24px", fontWeight: 600 }}
            >
              Update Feature
            </Typography>

            <IconButton size="small" onClick={handleCloseFeatureModal}>
              <IoMdClose size={24} />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box>
              <input
                className="signInInputs"
                placeholder="Title of Feature"
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <input
                className="signInInputs"
                placeholder="DD/MM/YYYY"
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: "14px", color: "#6E7183", p: 1 }}>
                (Choose either a URL or upload a file)
              </Typography>
              <input
                className="signInInputs"
                placeholder="Video/Image Link"
                type="url"
                name="url"
                value={url}
                onChange={handleUrlChange}
              />
              <Box sx={{ mt: 2 }}>
                <Button
                  className="uploadBtn"
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  endIcon={<FiUpload />}
                >
                  Upload Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
              {file && (
                <Box
                  sx={{
                    mt: 2,
                    p: "0px 5px",
                    border: "1px solid #E3EAEB",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>{file.name}</Typography>
                  <IconButton onClick={handleDeleteFile} size="small">
                    <FiTrash2 size={16} />
                  </IconButton>
                </Box>
              )}
              <Box
                sx={{
                  mt: "20px",
                  mb: "10px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "85px",
                    background: "#0FB3E2",
                    textTransform: "none",
                    fontSize: "18px",
                    padding: "8px 30px",
                    "&:hover": {
                      background: "#2FCCFF",
                    },
                  }}
                  onClick={handleSave}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                  ) : (
                    "Save"
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AddFeaturesModel;