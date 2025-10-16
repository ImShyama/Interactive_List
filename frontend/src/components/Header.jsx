import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import "./header.css";
import Setting from "./Setting";
import Profile from "./Profile";
import settingsIcon1 from "../assets/settingIcon1.svg";
import { SettingIcon, SettingIcon1 } from "../assets/svgIcons";
import dividerIcon from "../assets/dividerIcon.svg";
import { UserContext } from "../context/UserContext";
import { useHeaderVisibility } from "../context/HeaderVisibilityContext";
import { HOST } from "../utils/constants";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { handleImageError, handlePCImageError } from "../utils/globalFunctions";
import { notifyError } from "../utils/notify";
import Avatar from "../assets/images/avatar.png";
import RaiseTicket from "../components/tickets_instructions/RaiseTicket";
import InstrucationTutorial from "./tickets_instructions/InstrucationTutorial";
import DisplayNewFeatures from "./newfeatureupdates/DisplayNewFeatures";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Tooltip, Badge, Button } from "antd";
import { IoVideocamOutline } from "react-icons/io5";
import { TbSpeakerphone } from "react-icons/tb";
import AddFeature from "./newfeatureupdates/AddFeature";
import { FaPlus } from "react-icons/fa";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const { token, setToken, profile, setProfile, setRole, user, setUser } = useContext(UserContext);
  const { hideHeader } = useHeaderVisibility();
  const navigate = useNavigate();
  const location = useLocation(); // Access the current route
  const isEditMode = window.location.pathname.endsWith("/edit");
  const isViewMode = window.location.pathname.endsWith("/view");
  const profileRef = useRef(null); // Ref for the Profile component
  const profileImageRef = useRef(null); // Ref for the profile image
  const [showInstructionVideo, setShowInstructionVideo] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const [features, setFeatures] = useState([]);
  const [viewedFeatures, setViewedFeatures] = useState(new Set());
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [showRaiseTicket, setShowRaiseTicket] = useState(false);

  const settings = useSelector((state) => state.setting.settings);

  console.log({token, profile, user})

  // Define preview pages and their corresponding video URLs
  const previewPagesConfig = {
    "/interactiveListView": {
      name: "Interactive List",
      videoUrl: "https://drive.google.com/file/d/13awgRTBiDsg2sRt4HQH8aMebh2Jsts-l/preview"
    },
    "/peopleDirectoryPreview": {
      name: "People Directory",
      videoUrl: "https://drive.google.com/file/d/1QKnzt5cKbZRL_kiQn0p1UGYdVLVTP8ed/preview"
    },
    "/VideoGalleryPreview": {
      name: "Video Gallery",
      videoUrl: "https://drive.google.com/file/d/1QKnzt5cKbZRL_kiQn0p1UGYdVLVTP8ed/preview"
    },
    "/PhotoGalleryPreview": {
      name: "Photo Gallery",
      videoUrl: "https://drive.google.com/file/d/1QKnzt5cKbZRL_kiQn0p1UGYdVLVTP8ed/preview"
    },
    "/InteractiveMapPreview": {
      name: "Interactive Map",
      videoUrl: "https://drive.google.com/file/d/1QKnzt5cKbZRL_kiQn0p1UGYdVLVTP8ed/preview"
    },
    "/ProductCataloguePreview": {
      name: "Product Catalogue",
      videoUrl: "https://drive.google.com/file/d/1QKnzt5cKbZRL_kiQn0p1UGYdVLVTP8ed/preview"
    },
  };

  // Check if current page is a preview page
  const isDashboard = location.pathname === "/dashboard";

  const isPreviewPage = Object.keys(previewPagesConfig).some(path =>
    location.pathname.toLowerCase() === path.toLowerCase()
  );

  const currentPreviewConfig = Object.entries(previewPagesConfig).find(([path]) =>
    location.pathname.toLowerCase() === path.toLowerCase()
  )?.[1];


  const closeDrawer = () => setIsDrawerOpen(false);

  // Toggle visibility only if not already open
  const toggleProfileVisibility = (e) => {
    e.stopPropagation();
    setIsProfileVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target) &&
      profileImageRef.current &&
      !profileImageRef.current.contains(event.target)
    ) {
      setIsProfileVisible(false);
    }
  };

  const handleToggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Check if the current pathname ends with "/edit"
    const checkEditMode = () => {
      if (!window.location.pathname.endsWith("/edit") && isDrawerOpen) {
        handleToggleDrawer(); // Close the drawer if not in edit mode
      }
    };

    // Run the check whenever the location changes
    checkEditMode();
  }, [location, isDrawerOpen, handleToggleDrawer]);



  useEffect(() => {
    axios
      .get(`${HOST}/getuser`, {
        headers: {
          authorization: `Bearer ${token}`, // Include the token in the authorization header
        },
        withCredentials: true, // Include cookies if needed
      })
      .then(({ data: res }) => {
        if (res.error) {
          alert(res.error);
          if (res.error === "Token expired. Please log in again.") {
            localStorage.removeItem("token"); // Assuming token is stored in localStorage
            setToken(null);
            navigate("/signin"); // Redirect to login page
          }
          return;
        }
        console.log({ res });
        setUser(res); // Set user data if successful
        setRole(res.role);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err?.response?.data?.error);

       
        if (err?.response?.data?.error === "Token expired. Please log in again.") {
          Cookies.remove("token");
          setToken(null);
          navigate("/signin"); // Redirect to login page
        }
      });
  }, [token]);




  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Scroll to top whenever the location (route) changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isLandingPage = location.pathname === "/"; // Check if the current page is the landing page
  const isAboutPage = location.pathname === "/about";
  const isProductsPage = location.pathname === "/products";
  // const isOverviewPage= location.pathname==="/products/:appName";
  const isOverviewPage = matchPath("/products/:appName", location.pathname);
  // const [activeButton, setActiveButton] = useState("/");
  // const [activeButton, setActiveButton] = useState(window.location.pathname); // Set initial state based on current route
  const [activeButton, setActiveButton] = useState(location.pathname);

  // Update state whenever the route changes
  useEffect(() => {
    setActiveButton(location.pathname);
  }, [location.pathname]);

  /**
   * Handles the click event for navigation buttons.
   * Sets the active button state and navigates to the specified path.
   *
   * @param {string} path - The path to navigate to.
   */

  const handleClick = (path) => {
    setActiveButton(path);
    navigate(path);
  };

  // Don't render header if hideHeader is true
  if (hideHeader) {
    return null;
  }

  // New Features Functions
  const handleCloseNewFeatures = () => {
    // Reset badge count when modal is closed
    resetBadgeCount();
  };

  const handleOpenAddFeature = () => {
    setShowAddFeature(true);
  };

  const handleFeatureAdded = () => {
    // When admin adds new features, DON'T mark them as viewed
    // This way they will show up in the badge count
    // Just refresh the features data to get the new count
    getAllNewFeaturesData();
  };

  const handleCloseAddFeature = () => {
    setShowAddFeature(false);
  };

  const resetBadgeCount = () => {
    // Mark all current features as viewed
    const savedViewedFeatures = localStorage.getItem("viewedFeatures");
    const currentViewedFeatures = savedViewedFeatures
      ? new Set(JSON.parse(savedViewedFeatures))
      : new Set();

    const currentFeatureIds = features.map((f) => f._id);
    const newViewedFeatures = new Set([
      ...currentViewedFeatures,
      ...currentFeatureIds,
    ]);

    // Save to localStorage
    localStorage.setItem(
      "viewedFeatures",
      JSON.stringify(Array.from(newViewedFeatures))
    );

    // Update state
    setViewedFeatures(newViewedFeatures);

    // Reset badge count
    setBadgeCount(0);
  };

  // Fetch features data
  const getAllNewFeaturesData = async () => {
    try {
      const response = await fetch(`${url}/v4/getAllFeatures`);
      const data = await response.json();

      if (data.success) {
        setFeatures(data.features);

        // Get current viewed features from localStorage
        const savedViewedFeatures = localStorage.getItem("viewedFeatures");
        const currentViewedFeatures = savedViewedFeatures
          ? new Set(JSON.parse(savedViewedFeatures))
          : new Set();

        // Update viewedFeatures state to match localStorage
        setViewedFeatures(currentViewedFeatures);

        // Count only unviewed features
        const unviewedFeatures = data.features.filter(
          (feature) => !currentViewedFeatures.has(feature._id)
        );

        setBadgeCount(unviewedFeatures.length);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };




  return (
    <div className="fixed top-0 left-0 right-0 " style={{ zIndex: 999 }}>
      <div className={`main-container ${isDrawerOpen ? "drawer-open" : ""}`}>
        <div className="header_main left-content">
          <div
            className="left-panel"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <div className="left-panel-svg">
              <img
                className="logo_img"
                src="https://i.ibb.co/sbwvB0L/logo-png-1-1.webp"
                onClick={() => navigate("/landing")} // Redirect to landing page
                onError={(e) => handleImageError(e)}
              />
            </div>

            <div className="interact-parent">
              {/* <div className="interact">Interact<span
                className={`h-[2px] bg-[#598931] w-full}`}
              ></span></div> */}
              <div className="interact flex gap-6 text-[22px] font-[500] tracking-[0.78px] font-poppins text-[#A0A0A0]">
                {["/"].map((path) => (
                  <button
                    key={path}
                    className="relative transition-colors duration-200 text-[#598931]"
                    onClick={() => handleClick(path)}
                  >
                    {path === "/"
                      ? "Interact"
                      : path.replace("/", "").charAt(0).toUpperCase() +
                      path.slice(2)}
                    {/* Underline Effect */}
                    <span
                      className="absolute left-0 -bottom-[1px] h-[2px] bg-[#598931] transition-all duration-200 w-full"
                    ></span>
                  </button>
                ))}
              </div>
              {(settings?.appName && (isViewMode || isEditMode)) && (
                <div className="interactive-table "><span className="interactive-table ">{settings?.appName}</span></div>
              )}
            </div>
          </div>

          <div className=" flex items-center ml-auto ">
            {/* Conditional rendering for LandingPage */}

            {(isLandingPage ||
              isAboutPage ||
              isProductsPage ||
              isOverviewPage) && (
                // <div className="flex gap-6 text-[26px] font-[500] tracking-[0.78px] font-poppins text-[#A0A0A0]">
                //   <button
                //     className="hover:text-[var(--Button-color,#598931)] transition-colors duration-200"
                //     onClick={() => navigate("/")}
                //   >
                //     Home
                //   </button>
                //   <button
                //     className="hover:text-[var(--Button-color,#598931)] transition-colors duration-200"
                //     onClick={() => navigate("/products")}
                //   >
                //     Products
                //   </button>
                //   <button
                //     className="hover:text-[var(--Button-color,#598931)] transition-colors duration-200"
                //     onClick={() => navigate("/about")}
                //   >
                //     About
                //   </button>
                //   <button
                //     className="hover:text-[var(--Button-color,#598931)] transition-colors duration-200"
                //     onClick={() => navigate("/support")}
                //   >
                //     Support
                //   </button>
                // </div>
                <div className="flex gap-6 text-[22px] font-[500] tracking-[0.78px] font-poppins text-[#A0A0A0]">
                  {["/", "/products"].map((path) => (
                    <button
                      key={path}
                      className={`relative transition-colors duration-200 ${activeButton === path
                        ? "text-[#598931]"
                        : "text-[#A0A0A0]"
                        } hover:text-[#598931]`}
                      onClick={() => handleClick(path)}
                    >
                      {path === "/"
                        ? "Home"
                        : path.replace("/", "").charAt(0).toUpperCase() +
                        path.slice(2)}
                      {/* Underline Effect */}
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] bg-[#598931] transition-all duration-200 ${activeButton === path ? "w-full" : "w-0"
                          }`}
                      ></span>
                    </button>
                  ))}
                </div>
              )}
          </div>

          <div className="flex items-center gap-2 mr-2">
            {isDashboard && (
              <>
                <Tooltip title="Support" placement="bottom">
                  <a
                    aria-label="Support"
                    className="p-2 text-[#598931] hover:text-[#334155] transition-colors duration-200 cursor-pointer"
                    onClick={() => setShowRaiseTicket(true)}
                  >
                    <MdOutlineSupportAgent className="w-5 h-5" />
                  </a>
                </Tooltip>
                {/* New Features */}
                <DisplayNewFeatures
                  id="new-features-popover-user"
                  handleCloseUpdateModal={handleCloseNewFeatures}
                  openPopover={false}
                  openUpdateModal={false}
                  onVisibleChange={(visible) => {
                    if (!visible) {
                      // Reset badge count when popover is closed
                      resetBadgeCount();
                    }
                  }}
                >
                  <Tooltip title="See New Features" placement="bottom">
                    <Badge count={badgeCount} color="#334155" size="small">
                      <button
                        aria-label="New Features"
                        className="p-2 text-[#598931] hover:text-[#334155] transition-colors duration-200"
                        style={{
                          background:
                            badgeCount > 0 ? "#f1f5f9" : "transparent",
                          borderRadius: "50%",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <TbSpeakerphone className="w-5 h-5" />
                      </button>
                    </Badge>
                  </Tooltip>
                </DisplayNewFeatures>

                {/* <Tooltip title="Add Updates" placement="bottom">
                  <Button
                    onClick={handleOpenAddFeature}
                    size="small"
                    className="flex items-center gap-2 px-3 py-1 h-8 text-xs font-medium"
                    style={{
                      background: "#598931",
                      color: "#fff",
                      border: "none",
                      borderRadius: "20px",
                    }}
                    icon={<FaPlus size={12} />}
                  >
                    Add Updates
                  </Button>
                </Tooltip> */}

                {user?.role === "admin" && (
                  <Tooltip title="Add Updates" placement="bottom">
                    <Button
                      onClick={handleOpenAddFeature}
                      size="small"
                      className="flex items-center gap-2 px-3 py-1 h-8 text-xs font-medium"
                      style={{
                        background: "#598931",
                        color: "#fff",
                        border: "none",
                        borderRadius: "20px",
                      }}
                      icon={<FaPlus size={12} />}
                    >
                      Add Updates
                    </Button>
                  </Tooltip>
                )}

              </>
            )}

            {/* Instruction Video - Show on Dashboard & Preview */}
            {(isDashboard || isPreviewPage) && (
              <Tooltip title="Instruction Video" placement="bottom">
                <button
                  onClick={() => setShowInstructionVideo(true)}
                  aria-label="Instruction Video"
                  className="p-2 text-[#598931] hover:text-[#334155] transition-colors duration-200"
                >
                  <IoVideocamOutline className="w-5 h-5" />
                </button>
              </Tooltip>
            )}

          </div>

          {token ? (
            <div className="right-panel pl-10">
              {isEditMode && (
                <div
                  className="right-panel-setting"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleDrawer();
                  }}
                >
                  {/* <img
                    className={`cursor-pointer ${
                      isDrawerOpen ? "" : "text-orange-500"
                    }`}
                    // src={isDrawerOpen ? SettingIcon : settingsIcon1}
                    src={isDrawerOpen ? SettingIcon : settingsIcon1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDrawer();
                    }}
                  /> */}
                  {isDrawerOpen ? <SettingIcon /> : <SettingIcon1 />}
                </div>
              )}
              {isEditMode && <img src={dividerIcon} />}
              <div className="right-pannel-profile cursor-pointer">
                <img
                  ref={profileImageRef} // Added ref to the profile image
                  className="header-panel-profile"
                  src={
                    user?.profileUrl || Avatar
                  }
                  alt="Profile"
                  onClick={toggleProfileVisibility}
                  onError={(e) => handleImageError(e)}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              {/* <button
                className="flex py-[10px] px-[25px] justify-center items-center gap-[10px] rounded-[14px] bg-[#598931] ml-[69px]"
                onClick={(e) => {
                  navigate("/signin");
                }}
              >
                <span className="text-[#F5F6F7] font-poppins text-[16px] font-medium leading-normal ">
                  {isViewMode ? "Create Account" : "Sign In"}
                </span>
              </button> */}
            </div>
          )}
        </div>

        {isDrawerOpen && (
          <Setting
            closeDrawer={closeDrawer}
            handleToggleDrawer={handleToggleDrawer}
          />
        )}
      </div>
      {isProfileVisible && (
        <div ref={profileRef} className="absolute right-[45px] mt-[-10px] ">
          <Profile
            name={user?.name}
            email={user?.email}
            closeProfile={() => setIsProfileVisible(false)}
          />
        </div>

      )}

      {/* Instruction Video Modal */}
      {/* <InstrucationTutorial
        open={showInstructionVideo}
        handleClose={() => setShowInstructionVideo(false)}
      /> */}

      {/* Instruction Video Modal */}
      <InstrucationTutorial
        open={showInstructionVideo}
        handleClose={() => setShowInstructionVideo(false)}
        videoUrl={currentPreviewConfig?.videoUrl}
        title={currentPreviewConfig ? `${currentPreviewConfig.name} Tutorial` : "Instruction Video"}
      />

      {/* Support Ticket Modal */}
      <RaiseTicket
        open={showRaiseTicket}
        handleClose={() => setShowRaiseTicket(false)}
      />


      {/* Add Feature Modal */}
      {showAddFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Feature
              </h2>
              <button
                onClick={handleCloseAddFeature}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <AddFeature
              onClose={handleCloseAddFeature}
              onSuccess={() => {
                handleCloseAddFeature();
                handleFeatureAdded(); // Use the new function
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
