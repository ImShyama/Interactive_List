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
import { HOST } from "../utils/constants";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { handleImageError, handlePCImageError } from "../utils/globalFunctions";
import { notifyError } from "../utils/notify";
import Avatar from "../assets/images/avatar.png";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const { token, setToken, setProfile, setRole, user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation(); // Access the current route
  const isEditMode = window.location.pathname.endsWith("/edit");
  const isViewMode = window.location.pathname.endsWith("/view");
  const profileRef = useRef(null); // Ref for the Profile component
  const profileImageRef = useRef(null); // Ref for the profile image

  const settings = useSelector((state) => state.setting.settings);

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

        // navigate("/signin");
        if (err?.response?.data?.error === "Token expired. Please log in again.") {
          Cookies.remove("token");
          setToken(null);
          navigate("/signin"); // Redirect to login page
        }


      });
  }, [token]);

  // {userDetails, }

  // Scroll to top whenever the location (route) changes
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
              <div className="right-pannel-profil">
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
              <button
                className="flex py-[10px] px-[25px] justify-center items-center gap-[10px] rounded-[14px] bg-[#598931] ml-[69px]"
                onClick={(e) => {
                  navigate("/signin");
                }}
              >
                <span className="text-[#F5F6F7] font-poppins text-[16px] font-medium leading-normal ">
                  {isViewMode ? "Create Account" : "Sign In"}
                </span>
              </button>
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
    </div>
  );
};

export default Header;
