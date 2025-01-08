import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [user, setUser] = useState(null);
  const { token, setToken, setProfile } = useContext(UserContext);
  const navigate = useNavigate();
  const isEditMode = window.location.pathname.endsWith("/edit");
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

  // useEffect(() => {
  //   axios
  //     .get(`${HOST}/getuser`, {
  //       headers: {
  //         authorization: "Bearer " + token,
  //       },
  //     })
  //     .then(({ data: res }) => {
  //       if (res.error) {
  //         alert(res.error);
  //         return;
  //       }
  //       setUser(res);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // }, [token]);

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
          // Handle server-sent error messages
          alert(res.error);
          if (res.error === "Token expired. Please log in again.") {
            // Clear token and redirect to login if the token has expired
            localStorage.removeItem("token"); // Assuming token is stored in localStorage
            navigate("/signin"); // Redirect to login page
          }
          return;
        }
        setUser(res); // Set user data if successful
      })
      .catch((err) => {
        // Handle network or unexpected errors
        console.error("Error fetching user data:", err?.response?.data?.error);
        if(err?.response?.data?.error === "Token expired. Please log in again."){
          Cookies.remove("token");
          navigate("/signin") // Redirect to login page
        }
      });
  }, [token]);

  
  return (
    <div className="fixed top-0 left-0 right-0 " style={{ zIndex: 999 }}>
      <div className={`main-container ${isDrawerOpen ? "drawer-open" : ""}`}>
        <div className="header_main left-content">
          <div className="left-panel"
            onClick={() => navigate("/")} style={{ cursor: "pointer" } }
          >
            <div className="left-panel-svg" >
              <img
                className="logo_img"
                src="https://i.ibb.co/sbwvB0L/logo-png-1-1.webp"
              />
            </div>
            <div className="interact-parent">
              <div className="interact">Interact</div>
              { settings?.appName &&  
              (<div className="interactive-table">{settings?.appName}</div>)}
            </div>
          </div>
          {token ? (
            <div className="right-panel">
              {isEditMode && (
                <div className="right-panel-setting"
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
                    user?.profileUrl || "https://i.ibb.co/qC5F7XW/image25.jpg"
                  }
                  alt="Profile"
                  onClick={toggleProfileVisibility}
                />
              </div>
            </div>
          ) : (
            <div>
              <button
                className="flex w-[140px] p-[10px] justify-center items-center gap-[10px] rounded-[14px] bg-[#598931]"
                onClick={(e) => {
                  navigate("/signin");
                }}
              >
                <span className="text-[#F5F6F7] font-poppins text-[16px] font-medium leading-normal">
                  Sign in
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
        <div ref={profileRef} className="absolute right-[45px] mt-[-10px]">
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
