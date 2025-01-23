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
import { set } from "lodash";
import { debounce } from "lodash";
import { ImSpinner2 } from "react-icons/im";
import Info from "./info.jsx";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { SixDots } from "../assets/svgIcons.jsx";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { handleUpdateSettings } from "../APIs/index.jsx";
import HeadingTitle from "./people_directory/HeadingTitle.jsx";

const AddData = ({ activateSave, isTableLoading, setIsTableLoading }) => {

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


  // const handleChange = (field, value) => {
  //   setFormData((prevFormData) => {
  //     const updatedFormData = {
  //       ...prevFormData,
  //       [field]: value,
  //     };

  //     // Dispatch and log after the formData is updated
  //     const updatedSettings = {
  //       tableSettings: [updatedFormData],
  //     };
  //     dispatch(updateSetting(updatedSettings));
  //     console.log("Updated settings:", settingData);

  //     // Call the API to update the backend with the new settings
  //     handleSaveChanges(updatedSettings);

  //     return updatedFormData;
  //   });

  // };

  const handleSaveChangesDebounced = debounce((updatedSettings) => {
    // Call the API to update the backend with the new settings
    handleSaveChanges(updatedSettings);

    // Dispatch the updated settings
    dispatch(updateSetting(updatedSettings));
    console.log("Updated settings:", updatedSettings);
    setIsTableLoading(false);
  }, 300); // Adjust the debounce delay as needed

  const handleChange = (field, value) => {
    setIsTableLoading(true);
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [field]: value,
      };

      // Prepare the settings object
      const updatedSettings = {
        tableSettings: [updatedFormData],
      };

      // Debounce the backend update
      handleSaveChangesDebounced(updatedSettings);


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

  // const handleSheetChange = (e) => {
  //   setSelectedSheet(e.target.value);

  //   const updatedSettings = {
  //     firstSheetName: e.target.value,
  //   };
  //   dispatch(updateSetting(updatedSettings));
  //   activateSave();
  // };

  const handleSheetChange = (e) => {
    const newSheetName = e.target.value;
    setSelectedSheet(e.target.value);

    // Extract the column range from `firstTabDataRange`
    const currentRange = settingData.firstTabDataRange.split("!")[1]; // Extracts "A1:S"

    // Create updated settings with the new sheet name
    const updatedSettings = {
      firstSheetName: newSheetName,
      firstTabDataRange: `${newSheetName}!${currentRange}` // Update tab name in range
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

  const handleSaveChangesSettings = async (updatedSettings) => {
    // const updatedSettings = {
    //   firstSheetName: selectedSheet,
    //   firstTabDataRange: `${selectedSheet}!${dataRange}`,
    // };

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
      // handleSaveChangesSettings(updatedSettings);
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
        if (data?.action === "cancel") {
          console.log("User clicked cancel/close button");
          setLoading(false);
        } else if (data?.action === "picked") {
          const spreadSheetID = data?.docs[0].id; // Extract Spreadsheet ID
          console.log(`Spreadsheet ID: ${spreadSheetID}`);
          getSpreadsheetDetails(spreadSheetID); // Call the API to get sheet details
          activateSave();
        }
      },
    });
  };


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
            <Info info="After selecting the spreadsheet, all tabs will appear in the dropdown. Choose the data tab you wish to work with." />
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
            <Info info="Define the range of data you need, for example, A1:H." />
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

const ViewSettings = ({ settingsData }) => {
  console.log({ settingsData });
  const [showCard, setShowCard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const { token } = useContext(UserContext);

  // const CardSettings = ({ settingsData }) => {
  //   const cardData = settingsData?.showInCard
  //   return (
  //     <div className="flex w-[100%]">
  //       <div className="flex flex-col m-2 w-[130px]">
  //         <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Profile</span>
  //         <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Name</span>
  //         <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Sub Header 1</span>
  //         <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Sub Header 2</span>
  //         <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Email</span>
  //         <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Contact</span>
  //       </div>
  //       <div className="flex flex-col m-2">
  //         {cardData?.map((item, index) => (
  //           <div key={item.id} className="flex items-center">
  //              <SixDots /> <span className="m-[6px] text-[16px] font-medium leading-normal text-[#CDCCCC] font-[Poppins]">{item.title}</span>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  const ProfileSettings = ({ settingsData }) => {
    const [profileData, setProfileData] = useState(settingsData?.showInProfile || []);

    // Draggable Item Component
    const handleDragEnd = async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = profileData.findIndex((item) => item.id === active.id);
      const newIndex = profileData.findIndex((item) => item.id === over.id);

      // Update the local state
      const updatedData = arrayMove(profileData, oldIndex, newIndex);
      setProfileData(updatedData);

      // Prepare the updated settings to be saved
      const updatedSetting = { ...settingsData, showInProfile: updatedData };

      // Call the API to save changes
      const response = await handleUpdateSettings(updatedSetting, token, dispatch);
      console.log({ response });
    };

    const DraggableItem = ({ item }) => {
      const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

      return (
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={{ transform: CSS.Transform.toString(transform), transition }}
          className="flex items-center cursor-grab"
        >
          <SixDots />
          <span className="m-[6px] text-[16px] font-medium leading-normal text-[#CDCCCC] font-[Poppins]">
            {item.title}
          </span>
        </div>
      );
    };

    return (
      <div>
        <div className="m-2">
          <HeadingTitle settings={settingsData} />
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={profileData}>
            <div className="flex w-[100%] h-[400px]">
              {/* Left Side (Headings) */}
              <div className="flex flex-col m-2 w-[130px]">
                {profileData.map((_, index) => (
                  <div key={index} className="flex items-center">
                    <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">
                      Heading {index + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Side (Draggable Items) */}
              <div className="flex flex-col m-2">

                {profileData.map((item) => (
                  <DraggableItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    );
  };

  const CardSettings = ({ settingsData }) => {
    const [cardData, setCardData] = useState(settingsData?.showInCard || []);

    const handleDragEnd = async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = cardData.findIndex((item) => item.id === active.id);
      const newIndex = cardData.findIndex((item) => item.id === over.id);

      // Update the local state
      const updatedData = arrayMove(cardData, oldIndex, newIndex);
      setCardData(updatedData);

      // Prepare the updated settings to be saved
      const updatedSetting = { ...settingsData, showInCard: updatedData };

      // Call the API to save changes
      const response = await handleUpdateSettings(updatedSetting, token, dispatch);
      console.log({ response });
    };


    // Draggable Item Component
    const DraggableItem = ({ item }) => {
      const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

      return (
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={{ transform: CSS.Transform.toString(transform), transition }}
          className="flex items-center cursor-grab"
        >
          <SixDots />
          <span className="m-[6px] text-[16px] font-medium leading-normal text-[#CDCCCC] font-[Poppins]">
            {item.title}
          </span>
        </div>
      );
    };

    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cardData}>
          <div className="flex w-[100%]">
            {/* Left Column (Fixed) */}
            <div className="flex flex-col m-2 w-[130px]">
              <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Profile</span>
              <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Name</span>
              <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Sub Header 1</span>
              <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Sub Header 2</span>
              <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Email</span>
              <span className="m-[6px] text-[16px] font-medium leading-normal text-[#111] font-[Poppins]">Contact</span>
            </div>

            {/* Right Column (Draggable Items) */}
            <div className="flex flex-col m-2">
              {cardData?.map((item) => (
                <DraggableItem key={item?.id} item={item} />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <div className="w-[100%]">
      {/* // show card drower */}
      <div className="ml-[30px] mb-[20px] w-[100%]">
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowCard(!showCard)}
        >
          <span
            className="text-[16px] font-medium leading-normal text-[#111] font-[Poppins]"
          >
            Card Settings
          </span>
          <img src={downIcon} />
        </div>
        {showCard && <CardSettings settingsData={settingsData} />}
      </div>

      {/* // show profile drower */}
      <div className="ml-[30px]">
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowProfile(!showProfile)}
        >
          <span
            className="text-[16px] font-medium leading-normal text-[#111] font-[Poppins]"
          >
            Profile Settings
          </span>
          <img src={downIcon} />
        </div>
        {showProfile && <ProfileSettings settingsData={settingsData} />}
      </div>
    </div>
  )
}

const Setting = ({ closeDrawer, handleToggleDrawer }) => {
  const { setToken, setProfile } = useContext(UserContext);
  const [addData, setAddData] = useState(false);
  const [addSheet, setAddSheet] = useState(false);
  const [addView, setAddView] = useState(false);
  const [isSaveChanges, setIsSaveChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const nav = useNavigate();
  const { token } = useContext(UserContext);
  const dispatch = useDispatch();
  const [isTableLoading, setIsTableLoading] = useState(false);

  const settingData = useSelector((state) => state.setting.settings);

  const activateSave = () => {
    setIsSaveChanges(true);
  };

  const handleSaveChanges = async (updatedSetting, message) => {
    setIsLoading(true);
    try {
      console.log({ updatedSetting, settingData });
      // Use the passed settings or fallback to the Redux state
      const settingsToSave = updatedSetting || settingData;
      console.log({ settingsToSave })

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
      notifySuccess(message);
      setIsTableLoading(false);
      closeDrawer();

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error updating settings in DB:", error);
      setIsTableLoading(false);
      setIsLoading(false);
      setIsSaveChanges(false);
    }
  };


  const handleResetChange = async () => {
    setIsTableLoading(true);
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
    await handleSaveChanges(updatedSetting, "Table Style Reset successfully");
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
                onClick={() => handleSaveChanges(settingData, "Settings saved successfully, Reloading...")}
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
          <div className="setting_filter_bottom flex justify-between items-center w-[100%]">
            <div className="flex items-center">
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
              <div>

              </div>
              <Info info={"With these settings, you can manage your spreadsheet options, including fetching a spreadsheet directly from Google Drive and selecting the desired data range."} />
            </div>
            <div>
              {addSheet &&
                <button onClick={
                  () => {
                    window.location.reload();
                  }
                } className="bg-primary rounded-[4px] p-1" title="Refresh Spreadsheet">
                  <Reset />
                </button>
              }
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

          <div className="flex justify-between items-center w-[100%]">
            <div className="flex justify-center items-center">
              <div className="flex items-center">
                <div
                  className="setting_filter_top1"
                  onClick={() => {
                    setAddData(!addData);
                  }}
                >
                  <span className="setting_filter_top1_text">Table Settings</span>
                  <img className="setting_filter_top1_img" src={downIcon} />
                </div>
                <Info info={"These settings allow you to customize the view of your table, including options to modify the color, size and font of both the header and body content, You can easily revert to the original settings by clicking the Reset icon."} />
              </div>
              {isTableLoading && <ImSpinner2 className="animate-spin" color="#598931" title="Saving..." />}
            </div>
            <div>
              {addData &&
                <button onClick={
                  () => {
                    setIsTableLoading(true);
                    handleResetChange();
                  }
                } className="bg-primary rounded-[4px] p-1" title="Reset Table Styles">
                  <Reset />
                </button>
              }
            </div>
          </div>
          {addData && <AddData activateSave={activateSave} isTableLoading={isTableLoading} setIsTableLoading={setIsTableLoading} />}

          {settingData?.appName == "People Directory" &&
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="472"
                height="2"
                viewBox="0 0 472 2"
                fill="none"
              >
                <path d="M0 1.21265H621" stroke="#EDEEF3" />
              </svg>
              <div className="flex justify-between items-center w-[100%]">
                <div className="flex justify-center items-center">
                  <div className="flex items-center">
                    <div
                      className="setting_filter_top1"
                      onClick={() => {
                        setAddView(!addView);
                      }}
                    >
                      <span className="setting_filter_top1_text ">View Settings</span>
                      <img className="setting_filter_top1_img" src={downIcon} />
                    </div>
                    {/* <Info info={"These settings allow you to customize the view of your table, including options to modify the color, size and font of both the header and body contect, You can easily revert to the original settings by clicking the Reset icon."}/> */}
                  </div>
                  {isTableLoading && <ImSpinner2 className="animate-spin" color="#598931" title="Saving..." />}
                </div>

              </div>
              {addView && <ViewSettings settingsData={settingData} />}
            </>}
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
