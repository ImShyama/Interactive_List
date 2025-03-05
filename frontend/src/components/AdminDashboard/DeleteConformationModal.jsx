import React from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  CircularProgress,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: "15px 20px",
};

const DeleteConformationModal = ({
  openDeleteModal,
  handleCancel,
  deleteUser,
  userId,
  loading,
}) => {
  return (
    <Box>
      <Modal
        open={openDeleteModal}
        onClose={handleCancel}
        aria-labelledby="delete-confirmation-modal"
      >
        <Box className="muiModalBox" sx={style}>
          <Typography
            variant="h6"
            id="delete-confirmation-modal"
            sx={{ mb: 2 }}
          >
            Are you sure you want to delete this user?
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: "20px",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                m: "16px 0px",
                textTransform: "none",
                borderColor: "#4D8733",
                color: "#4D8733",
                fontWeight: 500,
                "&:hover": {
                  color: "#4f8b33",
                  border: "1px solid #4f8b33",
                },
              }}
              onClick={handleCancel}
              style={{ marginTop: "16px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteUser(userId)}
              variant="contained"
              sx={{
                m: "16px 0px",
                borderColor: "#4D8733",
                background: "#4D8733",
                color: "#fff",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#376927",
                  background: "#376927",
                },
              }}
            >
              {loading ? (
                <>
                  {" "}
                  <CircularProgress
                    size={16}
                    sx={{ color: "#fff", marginRight: "5px" }}
                  />{" "}
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DeleteConformationModal;
