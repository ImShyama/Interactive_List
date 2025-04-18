

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
import ProductTitle from "./ProductTitle";

const HeaderSection = ({ isPopup = false, settings }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const profileRef = useRef(null);
  const profileImageRef = useRef(null);
  const headerSettings = settings?.productCatalogue?.headerSettings || {};

  const { token, setRole } = useContext(UserContext);
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

  // ✅ Fetch user profile info (same as Header.jsx)
  useEffect(() => {
    axios
      .get(`${HOST}/getuser`, {
        headers: { authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then(({ data: res }) => {
        if (!res.error) {
          setUser(res);
          setRole(res.role);
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err?.response?.data?.error);
      });
  }, [token]);

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
    <div
      className={`${isPopup ? "relative" : "fixed"} top-0 left-0 right-0 mb-6`}
      style={{ zIndex: 999 }}
    >
      <div className={`main-container ${isDrawerOpen ? "drawer-open" : ""}`}>
        <div className="header_main left-content">
          {/* Left Section */}
          <div
            className="left-panel"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <div className="left-panel-svg">
              <img
                className="logo_img"
                src="https://i.ibb.co/sbwvB0L/logo-png-1-1.webp"
                onError={(e) => handleImageError(e)}
              />
            </div>
            <div className="interact-parent">
              <div className="interact">Interact</div>
              {/* New text below Interact */}
              <div className="text-xl font-medium text-gray-600">
                Product Catalogue Preview
              </div>
              {settings?.appName && isEditMode && (
                <div className="interactive-table">{settings?.appName}</div>
              )}
            </div>
          </div>

          {/* Right Section */}
          {token && (
            <div className="right-panel pl-10">
              {isEditMode && (
                <div
                  className="right-panel-setting"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleDrawer();
                  }}
                >
                  <img
                    src={dividerIcon}
                    alt="Divider"
                    style={{ marginRight: "10px" }}
                  />
                </div>
              )}

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
      <ProductTitle />
    </div>
  );
};

export default HeaderSection;
