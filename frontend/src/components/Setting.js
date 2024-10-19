import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./setting.css";
import settingIcon from "../assets/settingIcon.svg";
import cancelIcon from "../assets/cancelIcon.svg";
import searchIcon from "../assets/searchIcon.svg";
import videoIcon from "../assets/videoIcon.svg";
import refreshIcon from "../assets/refreshIcon.svg";
import helpIcon from "../assets/helpIcon.svg";
import copyIcon from "../assets/copyIcon.svg";
import shareIcon from "../assets/shareIcon.svg";
import logoutIcon from "../assets/logoutIcon.svg";
import downIcon from "../assets/downIcon.svg";
import filterIcon from "../assets/filterIcon.svg";
import sheetIcon from "../assets/sheetIcon.svg";
import openIcon from "../assets/openIcon.svg";
import { UserContext } from "../context/UserContext";
import { useSelector, useDispatch } from "react-redux";
import { updateSetting } from "../utils/settingSlice";
import { HOST } from "../utils/constants.js";

const AddData = () => {
  return (
    <div className="add_data">
      <div className="add_data_group">
        <div className="add_data_label">
          <span>Employee Name</span>
        </div>
        <div className="add_data_input">
          <input
            className="add_input"
            type="text"
            placeholder="Ex-Dharmesh Patel"
          />
        </div>
      </div>
      <div className="add_data_group">
        <div className="add_data_label">
          <span>Manager Name</span>
        </div>
        <div className="add_data_input">
          <input
            className="add_input"
            type="text"
            placeholder="Ex-Sudip Patel"
          />
        </div>
      </div>
      <div className="add_data_group">
        <div className="add_data_label">
          <span>Employee ID</span>
        </div>
        <div className="add_data_input">
          <input
            className="add_input"
            type="text"
            placeholder="Ex-dhar45@gmail.com"
          />
        </div>
      </div>
      <div className="add_data_group">
        <div className="add_data_label">
          <span>Feedback Month</span>
        </div>
        <div className="add_data_input">
          <input className="add_input" type="text" placeholder="Ex-September" />
        </div>
      </div>
      <div className="add_data_group">
        <div className="add_data_label">
          <span>Total Score</span>
        </div>
        <div className="add_data_input">
          <input className="add_input" type="number" placeholder="Ex-66" />
        </div>
      </div>
      <div className="add_data_group">
        <div className="add_data_label">
          <span>Year</span>
        </div>
        <div className="add_data_input">
          <input className="add_input" type="number" placeholder="Ex-2024" />
        </div>
      </div>
      <div className="submit_sheetData">
        <button className="submit_btn">
          <span className="span_btn">Save Changes</span>
        </button>
      </div>
    </div>
  );
};

const SpreadsheetSettings = () => {

  const dispatch = useDispatch();
  const settingData = useSelector((state) => state.setting.settings); // Get the current settings from Redux

  const [selectedSheet, setSelectedSheet] = useState(settingData?.firstSheetName);
  const [dataRange, setDataRange] = useState(settingData?.firstTabDataRange.split("!")[1]);

  const { token } = useContext(UserContext);

  const handleSheetChange = (e) => {
    setSelectedSheet(e.target.value);
  };

  const handleRangeChange = (e) => {
    setDataRange(e.target.value);
  };

  

const handleSaveChanges = async () => {
  const updatedSettings = {
    firstSheetName: selectedSheet,
    firstTabDataRange: `${selectedSheet}!${dataRange}`,
  };

  // Dispatch action to update settings in Redux
  dispatch(updateSetting(updatedSettings));

  try {
    // Make the API call to update the settings in MongoDB
    const response = await axios.put(`${HOST}/spreadsheet/${settingData._id}`, updatedSettings,{
      headers: {
        authorization: "Bearer " + token,
      },
    });
    console.log("Updated in DB:", response.data);
  } catch (error) {
    console.error("Error updating settings in DB:", error);
  }
};



  return (
    <div className="Spreadsheet_setting">
      <div className="sheet_link">
        <div className="sheet_link_header">
          <img src={sheetIcon} />
          <span className="sheet_title" >{settingData.spreadsheetName}</span>
        </div>
        <div className="sheet_btn">
          <div >
            <a className="sheet_btn_open" target="_blank" href={settingData.spreadsheetUrl}>

              <img src={openIcon} />
              <span className="sheet_btn_open_text" >Open</span>
            </a>
          </div>
          <div className="sheet_btn_select">
            <span className="sheet_btn_select_text">Select</span>
          </div>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="450"
        height="2"
        viewBox="0 0 450 2"
        fill="none"
      >
        <path d="M0 1H450" stroke="#E4E6EC" />
      </svg>
      <div className="sheet_data">
        <div className="sheet_data_tab">
          <div className="sheet_data_tabLabel">
            <span className="sheet_data_text">Select a Data Sheet</span>
          </div>
          <div className="sheet_data_select">
            <select className="add_input" value={selectedSheet} onChange={handleSheetChange}>
              <option value="volvo" >{settingData.firstSheetName}</option>
              {/* <option value="saab">Sheet2</option>
              <option value="opel">Sheet3</option>
              <option value="audi">Sheet4</option> */}
            </select>
          </div>
        </div>
        <div className="sheet_range">
          <div className="sheet_data_tabLabel">
            <span className="sheet_data_text">Select a Data Sheet</span>
          </div>
          <div className="sheet_data_select">
            <input className="add_input"
              placeholder="Ex-A1:H"
              value={dataRange}
              onChange={handleRangeChange} />
          </div>
        </div>
      </div>
      <div className="submit_sheetData">
        <button className="submit_btn" onClick={handleSaveChanges}>
          <span className="span_btn">Save Changes</span>
        </button>
      </div>
    </div>
  );
};

const Setting = ({ closeDrawer }) => {
  const { setToken, setProfile } = useContext(UserContext);
  console.log(setToken, setProfile);
  const [addData, setAddData] = useState(false);
  const [addSheet, setAddSheet] = useState(false);
  const nav = useNavigate();

  const handleLogout = () => {
    console.log("logout clicked");
    // Clear cookies
    Cookies.remove("token");
    Cookies.remove("profile");

    // Clear user context
    setToken(null);
    setProfile(null);
    closeDrawer();

    // Redirect to login page
    nav("/");
  };

  // subscribing to  the store using Selector 

  const setting = useSelector((store) => store.setting.settings)
  console.log("setting", setting);

  return (
    <div>
      <div className="setting_drawer">
        <div className="setting_icons">
          <div className="setting_icons_top">
            <div className="setting_icons_top_left">
              <div className="setting_icons_top_left_img">
                <img src={settingIcon} />
              </div>
              <div>
                <span className="setting_icons_top_left_span">Settings</span>
              </div>
            </div>
            <div className="setting_icons_top_right">
              <div className="setting_icons_top_right_inner">
                <span>Cancel</span>
                <img src={cancelIcon} />
              </div>
            </div>
          </div>
          <div className="setting_icons_bottom">
            <div className="setting_icons_bottom_1">
              <div className="setting_icons_bottom_search">
                <img
                  className="setting_icons_bottom_searchIcon"
                  src={searchIcon}
                />
                <span className="setting_icons_bottom_span">Search...</span>
              </div>
            </div>
            <div className="setting_icons_bottom_2">
              <div className="icon_outer">
                <div className="icon_inner">
                  <img className="icon" src={videoIcon} />
                </div>
              </div>
              <div className="icon_outer">
                <div className="icon_inner">
                  <img className="icon" src={refreshIcon} />
                </div>
              </div>
              <div className="icon_outer">
                <div className="icon_inner">
                  <img className="icon" src={helpIcon} />
                </div>
              </div>
              <div className="icon_outer">
                <div className="icon_inner">
                  <img className="icon" src={copyIcon} />
                </div>
              </div>
              <div className="icon_outer">
                <div className="icon_inner">
                  <img className="icon" src={shareIcon} />
                </div>
              </div>
              <div className="icon_outer">
                <div className="icon_inner">
                  <img
                    onClick={() => {
                      handleLogout();
                    }}
                    className="icon"
                    src={logoutIcon}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="setting_filter">
          <div className="setting_filter_bottom">
            <div
              className="setting_filter_bottom_inner"
              onClick={() => {
                setAddSheet(!addSheet);
              }}
            >
              <span className="setting_filter_bottom_span">
                Spreadsheet Settings
              </span>
              <img src={downIcon} />
            </div>
          </div>
          {addSheet && <SpreadsheetSettings />}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="472"
            height="2"
            viewBox="0 0 472 2"
            fill="none"
          >
            <path d="M0 1.21265H621" stroke="#EDEEF3" />
          </svg>
          <div className="setting_filter_top">
            <div
              className="setting_filter_top1"
              onClick={() => {
                setAddData(!addData);
              }}
            >
              <span className="setting_filter_top1_text">+ Add New Data</span>
              <img className="setting_filter_top1_img" src={downIcon} />
            </div>
            <div className="setting_filter_top2">
              <div className="setting_filter_top2_inner">
                <img src={filterIcon} />
                <span>Filter</span>
                <img src={downIcon} />
              </div>
            </div>
          </div>
          {addData && <AddData />}
        </div>
      </div>
    </div>
  );
};

export default Setting;
