import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios, { spread } from "axios";
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
import { HOST } from "../utils/constants.jsx";
import ColorPick from "./ColorPick.jsx";
import useDrivePicker from "react-google-drive-picker";
import { CLIENTID, DEVELOPERKEY } from "../utils/constants.jsx";
import { ColorPicker } from "antd";
import Loader from "./Loader";
import { notifyError, notifySuccess } from "../utils/notify.jsx";
import { Reset } from "../assets/svgIcons.jsx";
import DeleteAlert from "./DeleteAlert.jsx";

const AddData = ({ activateSave }) => {
  
  const dispatch = useDispatch();
  const settingData = useSelector((state) => state.setting.settings);
  const { token } = useContext(UserContext);
  const tableSettings = settingData?.tableSettings?.length > 0 ? settingData.tableSettings[0] : null;
  const fontSizes = Array.from({ length: 15 }, (_, i) => i + 10);
  const fontFamilies = [
    { display: "Poppins", value: "Poppins" },
    { display: "Roboto", value: "Roboto" },
    { display: "Arial", value: "Arial" },
    { display: "Times", value: "Times New Roman" },
    { display: "Courier", value: "Courier New" },
    { display: "Verdana", value: "Verdana" },
    { display: "Georgia", value: "Georgia" },
    { display: "Trebuchet", value: "Trebuchet MS" },
    { display: "Lucida", value: "Lucida Console" },
    { display: "Comic Sans", value: "Comic Sans MS" },
    { display: "Tahoma", value: "Tahoma" },
    { display: "Impact", value: "Impact" },
    { display: "Gill Sans", value: "Gill Sans" },
    { display: "Palatino", value: "Palatino" },
    { display: "Arial Black", value: "Arial Black" },
    { display: "Brush Script", value: "Brush Script MT" },
  ];

  const handleSaveChanges = async (updatedSettings) => {
    try {
      // Update the settings in the backend
      const response = await axios.put(
        `${HOST}/spreadsheet/${settingData._id}`,
        { ...settingData, ...updatedSettings }, // Merge existing settings with updates
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );

      console.log("Settings updated successfully:", response.data);

      // Dispatch updated settings to Redux store
      dispatch(updateSetting(response.data));

      // setIsLoading(false);
      // setIsSaveChanges(false);
      // notifySuccess("Settings updated successfully");
      // closeDrawer();
    } catch (error) {
      console.error("Error updating settings in DB:", error);
      notifyError("Error updating settings in DB:", error);
      // setIsLoading(false);
      // setIsSaveChanges(false);
    }
  };

  // Initial state to manage all inputs
  const [formData, setFormData] = useState({
    headerBgColor: tableSettings?.headerBgColor || "#f1f1f1",
    headerTextColor: tableSettings?.headerTextColor || "#000000",
    headerFontSize: tableSettings?.headerFontSize || "14",
    headerFontStyle: tableSettings?.headerFontStyle || "Poppins",
    bodyBgColor: tableSettings?.bodyBgColor || "#ffffff",
    bodyTextColor: tableSettings?.bodyTextColor || "#000000",
    bodyFontSize: tableSettings?.bodyFontSize || "14",
    bodyFontStyle: tableSettings?.bodyFontStyle || "Poppins",
  });


  const handleChange = (field, value) => {
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [field]: value,
      };

      // Dispatch and log after the formData is updated
      const updatedSettings = {
        tableSettings: [updatedFormData],
      };
      dispatch(updateSetting(updatedSettings));
      console.log("Updated settings:", settingData);

      // Call the API to update the backend with the new settings
      handleSaveChanges(updatedSettings);

      return updatedFormData;
    });

  };

  

  

  return (
    <div className="w-[100%]">
      <div className="flex gap-5 px-2">
        {/* Header Settings */}
        <div className="w-[50%]">
          <div className="inline-flex h-[30px] px-[16px] mb-2 flex-col justify-center items-start gap-[35.163px] flex-shrink-0 border-l-2 border-primary">
            <span className="text-[#111] font-poppins text-[16px] font-medium leading-normal">
              Header Settings
            </span>
          </div>
          <div className="flex justify-between items-center my-3">
            <span className="text-[#111] font-poppins text-[14px] font-normal leading-normal">
              Font Color
            </span>
            <ColorPicker
              value={formData.headerTextColor} // value should come from the state
              onChange={(color) => {
                console.log("Color object: ", color.toHexString()); // Log to verify the object
                if (color && color.toHexString()) {
                  handleChange("headerTextColor", color.toHexString());
                }
              }}
            />
          </div>
          <div className="flex justify-between items-center my-3">
            <span className="text-[#111] font-poppins text-[14px] font-normal leading-normal">
              Font Size
            </span>
            <select
              className="bg-[#EDEDED] rounded-[4.789px]"
              value={formData.headerFontSize}
              onChange={(e) => handleChange("headerFontSize", e.target.value)}
            >
              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center my-3">
            <span className="text-[#111] font-poppins text-[14px] font-normal leading-normal">
              Font Style
            </span>
            <select
              className="bg-[#EDEDED] rounded-[4.789px]"
              value={formData.headerFontStyle}
              onChange={(e) => handleChange("headerFontStyle", e.target.value)}
            >
              {fontFamilies.map((font, index) => (
                <option key={index} value={font.value}>
                  {font.display}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center my-3">
            <span className="text-[#111] font-poppins text-[14px] font-normal leading-normal">
              Background Color
            </span>
            <ColorPicker
              value={formData.headerBgColor}
              onChange={(color) => {
                if (color && color.toHexString()) {
                  handleChange("headerBgColor", color.toHexString());
                }
              }}
            />
          </div>
        </div>

        {/* Body Settings */}
        <div className="w-[50%]">
          <div className="inline-flex h-[30px] px-[16px] mb-2 flex-col justify-center items-start gap-[35.163px] flex-shrink-0 border-l-2 border-primary">
            <span className="text-[#111] font-poppins text-[16px] font-medium leading-normal">
              Body Settings
            </span>
          </div>
          {/* <div className="flex justify-between items-center my-3">
            <span className="text-[#111] font-poppins text-[14px] font-normal leading-normal">Background Color</span>
            <ColorPicker
              value={formData.bodyBgColor}
              onChange={(color) => handleChange('bodyBgColor', color.toHexString())}
            />
          </div> */}
          <div className="flex justify-between items-center my-3 ml-2">
            <span className="text-[#111] font-poppins text-[14px] font-normal leading-normal">
              Font Color
            </span>
            <ColorPicker
              value={formData.bodyTextColor}
              onChange={(color) =>
                handleChange("bodyTextColor", color.toHexString())
              }
            />
          </div>
          <div className="flex justify-between items-center my-3 ml-2">
            <span className="text-[#111] font-poppins text-[14px] font-normal leading-normal">
              Font Size
            </span>
            <select
              className="bg-[#EDEDED] rounded-[4.789px]"
              value={formData.bodyFontSize}
              onChange={(e) => handleChange("bodyFontSize", e.target.value)}
            >
              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center my-3 ml-2">
            <span className="text-[#111] font-poppins text-[14px] font-normal leading-normal">
              Font Style
            </span>
            <select
              className="bg-[#EDEDED] rounded-[4.789px]"
              value={formData.bodyFontStyle}
              onChange={(e) => handleChange("bodyFontStyle", e.target.value)}
            >
              {fontFamilies.map((font, index) => (
                <option key={index} value={font.value}>
                  {font.display}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* <div className="submit_sheetData my-2">
        <button className="submit_btn" onClick={handleTableSaveChanges}>
          <span className="span_btn">Save Changes</span>
        </button>
      </div> */}

      
    </div>
  );
};

const SpreadsheetSettings = ({ activateSave }) => {
  const dispatch = useDispatch();
  const settingData = useSelector((state) => state.setting.settings); // Get the current settings from Redux

  const [selectedSheet, setSelectedSheet] = useState(
    settingData?.firstSheetName
  );
  const [dataRange, setDataRange] = useState(
    settingData?.firstTabDataRange.split("!")[1]
  );
  const [loading, setLoading] = useState(false);

  const { token } = useContext(UserContext);

  const clientId = CLIENTID;
  const developerKey = DEVELOPERKEY;

  const handleSheetChange = (e) => {
    setSelectedSheet(e.target.value);
    const updatedSettings = {
      firstSheetName: e.target.value,
    };
    dispatch(updateSetting(updatedSettings));
    activateSave();
  };

  const handleRangeChange = (e) => {
    setDataRange(e.target.value);
    const updatedSettings = {
      firstTabDataRange: `${selectedSheet}!${e.target.value}`,
    };
    dispatch(updateSetting(updatedSettings));
    activateSave();
  };

  const handleSaveChanges = async () => {
    const updatedSettings = {
      firstSheetName: selectedSheet,
      firstTabDataRange: `${selectedSheet}!${dataRange}`,
    };

    // Dispatch action to update settings in Redux
    dispatch(updateSetting(updatedSettings));
    const updatedSpreadsheet = settingData;

    // Make the API call to update the settings in MongoDB
    try {
      // Make the API call to update the settings in MongoDB
      const response = await axios.put(
        `${HOST}/spreadsheet/${settingData._id}`,
        updatedSpreadsheet,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.error("Error updating settings in DB:", error);
    }
  };

  const getSpreadsheetDetails = async (spreadSheetID) => {
    try {
      const response = await axios.post(
        `${HOST}/getSpreadsheetDetails`,
        { spreadSheetID }, // Request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming you have the token for auth
          },
        }
      );
      // setSelectSpreadsheet(response.data.data);
      const data = response.data.data;

      console.log({ data });
      console.log({ URL: data.sheetUrl });
      const updatedSettings = {
        sheetDetails: data.sheetDetails,
        firstSheetName: data.sheetDetails[0].name,
        firstTabDataRange: data.firstSheetDataRange,
        spreadsheetName: data.spreadsheetName,
        sheetUrl: data.sheetUrl,
        spreadsheetUrl: data.sheetUrl,
        spreadsheetId: spreadSheetID,
      };
      // Dispatch action to update settings in Redux
      dispatch(updateSetting(updatedSettings));
      notifySuccess("Spreadsheet selected successfully");
      setLoading(false);

    } catch (error) {
      console.error("Error fetching spreadsheet details:", error);
    }
  };

  const [openPicker, authResponse] = useDrivePicker();

  // Function to trigger the Google Drive Picker
  const handleOpenPicker = () => {
    setLoading(true);
    openPicker({
      clientId,
      developerKey,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false, // Single file picker for spreadsheet
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
          setLoading(false);
        } else if (data.action === "picked") {
          const spreadSheetID = data.docs[0].id; // Extract Spreadsheet ID
          console.log(`Spreadsheet ID: ${spreadSheetID}`);
          getSpreadsheetDetails(spreadSheetID); // Call the API to get sheet details
          activateSave();
        }
      },
    });
  };

  console.log({ settingData });

  return (
    <div className="Spreadsheet_setting">
      <div className="sheet_link">
        <div className="sheet_link_header">
          <img src={sheetIcon} />
          <span className="sheet_title">{settingData.spreadsheetName}</span>
        </div>
        <div className="sheet_btn">
          <div>
            <a
              className="sheet_btn_open"
              target="_blank"
              href={settingData.spreadsheetUrl}
            >
              <img src={openIcon} />
              <span className="sheet_btn_open_text">Open</span>
            </a>
          </div>
          <button
            className="sheet_btn_select w-[100px]"
            onClick={() => handleOpenPicker()}
            disabled={loading}
          >
            {loading ? (
              <div className="loader" /> // Display loader during loading
            ) : (
              <span className="sheet_btn_select_text">Select</span>
            )}
          </button>
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
            <select
              className="add_input"
              value={selectedSheet}
              onChange={handleSheetChange}
            >
              {settingData.sheetDetails.map((sheet, index) => (
                <option key={index} value={sheet.name}>
                  {sheet.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sheet_range">
          <div className="sheet_data_tabLabel">
            <span className="sheet_data_text">Add a Range</span>
          </div>
          <div className="sheet_data_select">
            <input
              className="add_input"
              placeholder="Ex-A1:H"
              value={settingData.firstTabDataRange?.split("!")[1]}
              onChange={handleRangeChange}
            />
          </div>
        </div>
      </div>
      {/* <div className="submit_sheetData">
        <button className="submit_btn" onClick={handleSaveChanges}>
          <span className="span_btn">Save Changes</span>
        </button>
      </div> */}
    </div>
  );
};

const Setting = ({ closeDrawer, handleToggleDrawer }) => {
  const { setToken, setProfile } = useContext(UserContext);
  console.log(setToken, setProfile);
  const [addData, setAddData] = useState(false);
  const [addSheet, setAddSheet] = useState(false);
  const [isSaveChanges, setIsSaveChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const nav = useNavigate();
  const { token } = useContext(UserContext);
  const dispatch = useDispatch();

  const settingData = useSelector((state) => state.setting.settings);

  const activateSave = () => {
    setIsSaveChanges(true);
  };

  const handleSaveChanges = async (updatedSetting) => {
    setIsLoading(true);
    try {
      // Use the passed settings or fallback to the Redux state
      const settingsToSave = updatedSetting || settingData;
  
      const response = await axios.put(
        `${HOST}/spreadsheet/${settingData._id}`,
        settingsToSave,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );
  
      console.log("Settings updated successfully:", response.data);
      dispatch(updateSetting(response.data));
      setIsLoading(false);
      setIsSaveChanges(false);
      notifySuccess("Table Style Reset successfully");
      closeDrawer();
    } catch (error) {
      console.error("Error updating settings in DB:", error);
      setIsLoading(false);
      setIsSaveChanges(false);
    }
  };
  
  const handleReset = () => {
    setConfirmModalOpen(true);
  }

  const handleResetChange = async () => {
    // Define the updated settings
    const updatedSetting = {
      tableSettings: [
        {
          headerBgColor: "#f1f1f1",
          headerTextColor: "#000000",
          headerFontSize: "14",
          headerFontStyle: "Poppins",
          bodyBgColor: "#ffffff",
          bodyTextColor: "#000000",
          bodyFontSize: "14",
          bodyFontStyle: "Poppins",
        },
      ],
    };
  
    // Dispatch the settings to update Redux state
    dispatch(updateSetting(updatedSetting));
  
    // Directly pass the updated settings to handleSaveChanges
    await handleSaveChanges(updatedSetting);
  };
  

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
              <button
                className="submit_btn"
                onClick={handleSaveChanges}
                disabled={!isSaveChanges}
              >
                {/* {isLoading ? (
                  <span className="span_btn">
                    <Loader textToDisplay="" />  
                  </span>
                ) : ( */}
                <span className="span_btn">Save Changes</span>
                {/* )} */}
              </button>
              <div
                className="setting_icons_top_right_inner"
                onClick={() => handleToggleDrawer()}
              >
                {/* <span>Cancel</span> */}
                <img src={cancelIcon} />
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
          {addSheet && <SpreadsheetSettings activateSave={activateSave} />}

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
              <span className="setting_filter_top1_text">Table Settings</span>
              <img className="setting_filter_top1_img" src={downIcon} />
            </div>
            {addData && 
            <button onClick={handleResetChange} className="bg-primary rounded-[4px] p-1" title="Reset">
              <Reset />
            </button>
            }
            {/* <div className="setting_filter_top2">
              <div className="setting_filter_top2_inner">
                <img src={filterIcon} />
                <span>Filter</span>
                <img src={downIcon} />
              </div>
            </div> */}
          </div>
          {addData && <AddData activateSave={activateSave} />}
        </div>
      </div>
      <DeleteAlert
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleResetChange}
        sheetName={"Are you sure you want to reset table styling."} // Optional: Provide a dynamic name
      />
    </div>
  );
};

export default Setting;
