import React, { useCallback, useEffect, useState } from "react";
import {
  Popover,
  Modal,
  Tooltip,
  Button,
  message,
  Popconfirm,
  Empty,
  Spin,
} from "antd";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import { MdFullscreen } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { SiGoogledrive } from "react-icons/si";
import debounce from "lodash.debounce";
import axios from "axios";
import AddFeature from "./AddFeature";
import EditFeature from "./EditFeature";
import { url } from "../../redux/store";
import { useSelector } from "react-redux";
import "./DisplayNewFeatures.css";


const DisplayNewFeatures = ({
  id,
  handleCloseUpdateModal,
  openPopover,
  openUpdateModal,
  children, 
  onVisibleChange, 
}) => {
  const { isAdmin } = useSelector((state) => state.admin);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchQuery, setSearchQuery] = useState("");
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const success = (msg) => {
    messageApi.success(msg);
  };

  const error = (msg) => {
    messageApi.error(msg);
  };

  // Fetch all features
  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/v4/getAllFeatures`);
      if (response.data.success) {
        setFeatures(response.data.features || []);
        // Don't show error if no features found, it's a normal state
        if (response.data.features && response.data.features.length === 0) {
          console.log("No features found - this is normal");
        }
      } else {
        // Only show error for actual failures, not empty states
        if (response.status !== 200) {
          error(response.data.message || "Failed to fetch features");
        } else {
          setFeatures([]);
        }
      }
    } catch (err) {
      console.error("Error fetching features:", err);
      // Only show error for network/server errors, not empty data
      if (err.response && err.response.status !== 404) {
        error("Failed to connect to server");
      } else {
        setFeatures([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete feature
  const handleDeleteFeature = async (featureId) => {
    try {
      const response = await axios.delete(
        `${url}/v4/delete-feature/${featureId}`
      );
      if (response.data.success) {
        success("Feature deleted successfully");
        fetchFeatures();
      } else {
        error(response.data.message || "Failed to delete feature");
      }
    } catch (err) {
      console.error("Error deleting feature:", err);
      error("Failed to delete feature");
    }
  };

  // Handle edit feature
  const handleEditFeature = (feature) => {
    setSelectedFeature(feature);
    setEditModalVisible(true);
  };

  // Handle preview image
  const handlePreviewImage = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewModalVisible(true);
  };

  // Search functionality
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    debouncedSearch.cancel();
  };

  // Filter features based on search
  const filteredFeatures = features
    ?.filter((item) =>
      item.featureName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  // Handle popover visibility change
  const handleVisibleChange = (visible) => {
    setPopoverVisible(visible);
    if (onVisibleChange) {
      onVisibleChange(visible);
    }
    if (visible) {
      fetchFeatures();
    }
  };

  // Close popover
  const handleClosePopover = () => {
    setPopoverVisible(false);
    if (onVisibleChange) {
      onVisibleChange(false);
    }
  };

  useEffect(() => {
    if (openUpdateModal) {
      fetchFeatures();
    }
  }, [openUpdateModal]);

  // Popover content with Ant Design and Tailwind CSS
  const popoverContent = (
    <div className="bg-white rounded-[36px] p-4 shadow-2xl border border-gray-200">
      {contextHolder}

      {/* ----------- Heading -------------- */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleClosePopover}
          className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
        >
          <IoMdArrowBack size={24} className="text-[#334155]" />
        </button>
        <div className="flex items-center gap-2.5 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-[200px] px-4 py-2.5 text-sm bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-0 focus:border-0 pl-10 pr-4 placeholder-gray-600 text-gray-800 search-input"
              onChange={handleSearchChange}
              value={searchQuery}
            />
            <GoSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              size={16}
            />
          </div>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="p-1 text-gray-400 hover:text-[#00bce0] transition-colors duration-200"
            >
              <IoMdClose size={14} />
            </button>
          )}
          <button
            onClick={handleClosePopover}
            className="p-2 text-gray-500 hover:text-[#334155] transition-colors duration-200"
          >
            <IoMdClose size={24} />
          </button>
        </div>
      </div>

      {/* ----------- Heading Text-------------- */}
      <div className="mt-1 mb-4">
        <div className="flex items-center gap-2.5 mb-2">
          <h1 className="text-xl font-bold text-[#181818] tracking-wider uppercase">
            What's New
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="18"
            viewBox="0 0 17 18"
            fill="none"
          >
            <path
              d="M0 9.07629C2.81147 8.43112 8.22159 5.81648 7.97993 0.453672C7.96373 0.295349 7.95272 0.143754 7.94649 0C7.96212 0.153359 7.97321 0.304578 7.97993 0.453672C8.27657 3.35354 10.3133 8.51039 16.6154 9.07629C14.0468 8.86907 8.71706 10.245 7.94649 17.4066C7.82609 14.6298 6.06823 9.07629 0 9.07629Z"
              fill="#FFC545"
            />
          </svg>
        </div>
        <p className="text-xs text-[#181818] tracking-wider font-normal">
          We are excited to introduce the latest updates to our site!
        </p>
      </div>

      {/* ------------- Render features ------------------ */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : filteredFeatures?.length > 0 ? (
          filteredFeatures.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              {/* Media Container */}
              <div className="flex-shrink-0">
                {item.videoUrl ? (
                  <iframe
                    width="175"
                    height="100"
                    className="rounded-[30px] shadow-md"
                    src={item.videoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}
                  />
                ) : item.driveLink &&
                  item.driveLink.includes("drive.google.com") ? (
                  <div
                    className="relative w-[175px] h-[100px] rounded-[30px] shadow-md bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-300"
                    onClick={() => window.open(item.driveLink, "_blank")}
                  >
                    <SiGoogledrive size={40} className="text-blue-500" />
                    <span className="absolute bottom-1 text-xs text-gray-600">
                      Drive Video
                    </span>
                  </div>
                ) : item.imgUrl ? (
                  <div className="relative w-[175px] h-[100px] rounded-[30px] shadow-md overflow-hidden group">
                    <img
                      src={item.imgUrl}
                      alt={item.featureName}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handlePreviewImage(item.imgUrl)}
                      className="absolute right-2.5 bottom-2.5 bg-black bg-opacity-70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-opacity-90 transition-all duration-300 z-10"
                    >
                      <MdFullscreen size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-[175px] h-[100px] rounded-[30px] shadow-md bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Media</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#737C95]">
                    {formatDate(item.createdAt || item.month)}
                  </span>

                  {/* Actions - Always show edit and delete icons */}
                  {isAdmin && (
                  <div className="flex items-center gap-1">
                    <Tooltip title="Edit" placement="top">
                      <Button
                        type="text"
                        size="small"
                        icon={<CiEdit size={14} />}
                        onClick={() => handleEditFeature(item)}
                        className="p-1 text-gray-500 hover:text-[#00bce0] border-none shadow-none"
                      />
                    </Tooltip>
                    <Tooltip title="Delete" placement="top">
                      <Popconfirm
                        title="Delete Feature"
                        description="Are you sure you want to delete this feature?"
                        onConfirm={() => handleDeleteFeature(item._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={<MdDeleteOutline size={14} />}
                          className="p-1 text-gray-500 hover:text-red-500 border-none shadow-none"
                        />
                      </Popconfirm>
                    </Tooltip>
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-[#181818] leading-tight truncate">
                  {item.featureName}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Empty 
              description={
                <div className="space-y-3">
                  <span className="text-gray-500 block">
                    {isAdmin ? "No features added yet. Add your first feature!" : "No new features available at the moment."}
                  </span>
                </div>
              }
              className="text-gray-500"
            />
          </div>
        )}
      </div>
    </div>
  );

  // If children is provided, render as Popover, otherwise render as Modal (for backward compatibility)
  if (children) {
    return (
      <>
        <Popover
          content={popoverContent}
          title={null}
          trigger="click"
          open={popoverVisible}
          onOpenChange={handleVisibleChange}
          placement="bottomLeft"
          overlayClassName="whats-new-popover-overlay"
          overlayStyle={{
            // maxWidth: "450px",
            width:"450px",
            maxHeight: "80vh",
            borderRadius: "36px",
            border: "1px solid #EDF2E6",
            boxShadow: "15px 11px 100px 0px rgba(79, 91, 121, 0.25)",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {children}
        </Popover>

        {/* Image Preview Modal */}
        <Modal
          title="Image Preview"
          open={previewModalVisible}
          onCancel={() => setPreviewModalVisible(false)}
          footer={null}
          width={800}
          centered
          className="image-preview-modal"
          zIndex={2000}
          maskStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
          }}
          style={{
            top: 20
          }}
        >
          <div className="flex justify-center">
            <img
              src={previewImage}
              alt="Feature Preview"
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        </Modal>

        {/* Edit Update Modal */}
        <Modal
          title="Edit Update"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
          width={600}
          centered
          className="edit-feature-modal"
          zIndex={1500}
        >
          {selectedFeature && (
            <EditFeature
              feature={selectedFeature}
              onClose={() => setEditModalVisible(false)}
              onSuccess={() => {
                setEditModalVisible(false);
                fetchFeatures();
              }}
            />
          )}
        </Modal>

        {/* Add Update Modal */}
        <Modal
          title="Add New Update"
          open={addModalVisible}
          onCancel={() => setAddModalVisible(false)}
          footer={null}
          width={600}
          centered
          className="add-feature-modal"
          zIndex={1500}
        >
          <AddFeature
            onClose={() => setAddModalVisible(false)}
            onSuccess={() => {
              setAddModalVisible(false);
              fetchFeatures();
            }}
          />
        </Modal>
      </>
    );
  }

  // Backward compatibility - render as Modal if no children provided
  if (!openUpdateModal) {
    return null;
  }

  return (
    <Modal
      title={null}
      open={openUpdateModal}
      onCancel={handleCloseUpdateModal}
      footer={null}
      width={800}
      centered
      destroyOnClose
      className="whats-new-modal"
      zIndex={1200}
    >
      <div className="max-h-[80vh] overflow-y-auto">{popoverContent}</div>
    </Modal>
  );
};

export default DisplayNewFeatures;
