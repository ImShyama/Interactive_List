import React, { useState, useContext } from "react";
import "./header.css";
import Setting from "./Setting";
import settingsIcon from "../assets/settingIcon.svg";
import settingsIcon1 from "../assets/settingIcon1.svg";
import dividerIcon from "../assets/dividerIcon.svg";
import interactiveIcon from "../assets/interactiveIcon.svg";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { token, setToken, setProfile, profile } = useContext(UserContext);

  console.log("profile",profile)
  console.log("token",token)
  return (
    <div className={`main-container ${isDrawerOpen ? "drawer-open" : ""}`}>
      <div className="header_main left-content">
        <div className="left-panel">
          <div className="left-panel-svg">
            <img className="logo_img" src="https://i.ibb.co/sbwvB0L/logo-png-1-1.webp" />
          </div>
          <div className="interact-parent">
            <div className="interact">Interact</div>
            <div className="interactive-table">Interactive Table</div>
          </div>
        </div>
        <div className="right-panel">
          <div className="right-panel-setting">
            <img
              src={settingsIcon1}
              onClick={() => {
                setIsDrawerOpen(!isDrawerOpen);
              }}
            />
          </div>
          <img src={dividerIcon} />
          <div className="right-pannel-profil">
            <img
              className="header-panel-profile"
              src="https://i.ibb.co/qC5F7XW/image25.jpg"
              alt="Profile"
            />
          </div>
        </div>
      </div>
      {isDrawerOpen && <Setting />}
    </div>
  );
};

export default Header;
