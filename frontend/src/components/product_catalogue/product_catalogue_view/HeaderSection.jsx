

import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../header.css";
import Setting from "../settings/Setting";
import { UserContext } from "../../../context/UserContext";
import { useSelector } from "react-redux";
import axios from "axios";
import { HOST } from "../../../utils/constants";
import { handleImageError } from "../../../utils/globalFunctions";
import Profile from "../../Profile"; // Import Profile component
import dividerIcon from "../../../assets/dividerIcon.svg";

const HeaderSection = ({ isPopup = false, settings }) => {
  console.log({ settings });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [user, setUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const profileRef = useRef(null);
  const profileImageRef = useRef(null);
  const headerSettings = settings?.productCatalogue?.headerSettings || {};
  const cardSettings = settings?.productCatalogue?.cardSettings || {};
  const footerSettings = settings?.productCatalogue?.footerSettings || {};

  console.log({ settings, headerSettings, cardSettings, footerSettings });
  const { token, setRole, user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = window.location.pathname.endsWith("/edit");
  // const settings = useSelector((state) => state.setting.settings);

  const closeDrawer = () => setIsDrawerOpen(false);
  const handleToggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  // ✅ Close drawer when location changes
  useEffect(() => {
    if (!window.location.pathname.endsWith("/edit")) {
      setIsDrawerOpen(false);
    }
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  // ✅ Toggle Profile visibility
  const toggleProfileVisibility = (e) => {
    e.stopPropagation();
    setIsProfileVisible((prev) => !prev);
  };

  // ✅ Close Profile when clicked outside
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${isPopup ? "relative" : "fixed"} top-0 left-0 right-0 mb-[-10px]`} >
      <div className={`main-container ${isDrawerOpen ? "drawer-open" : ""}`} >
        <div className="header_main left-content shadow-lg"
          style={{
            backgroundColor: headerSettings?.bg || "#ffffff",
          }}
        >
          {/* Left Section */}
          <div
            className="left-panel"
            style={{ cursor: "pointer" }}
          >
            <div className="left-panel-svg">
              <img
                className="logo_img"
                src={headerSettings?.logoURL || "https://i.ibb.co/sbwvB0L/logo-png-1-1.webp"}
                onError={(e) => handleImageError(e)}
              />
            </div>
            <div className="interact-parent">
              {/* <div className="interact">Interact</div> */}
              {/* New text below Interact */}
              <div className="text-xl font-medium"
                style={{
                  fontFamily: headerSettings?.headerFont || "Poppins",
                  fontSize: headerSettings?.headerFontSize || "16px",
                  color: headerSettings?.headerFontColor || "#000000",
                }}
              >
                {headerSettings?.headerText == "" ? settings?.spreadsheetName : headerSettings?.headerText}
              </div>
              {/* {settings?.appName && isEditMode && (
                <div className="interactive-table">{settings?.appName}</div>
              )} */}
            </div>
          </div>

          {/* Right Section */}
          {token && (
            <div className="right-panel pl-10">

              {/* Profile Image */}
              <div className="right-pannel-profil">
                <img
                  ref={profileImageRef}
                  className="header-panel-profile"
                  src={
                    user?.profileUrl || "https://i.ibb.co/qC5F7XW/image25.jpg"
                  }
                  alt="Profile"
                  onClick={toggleProfileVisibility}
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer */}
        {isDrawerOpen && (
          <Setting
            closeDrawer={closeDrawer}
            handleToggleDrawer={handleToggleDrawer}
          />
        )}

        {/* Profile Dropdown */}
        {isProfileVisible && (
          <div ref={profileRef} className="absolute right-[55px] mt-[70px] ">
            <Profile
              name={user?.name}
              email={user?.email}
              closeProfile={() => setIsProfileVisible(false)}
            />
          </div>
        )}
      </div>
      
    </div>
  );
};

export default HeaderSection;
