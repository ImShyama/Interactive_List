
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Popover, Checkbox, Input, Select, Button, Slider } from "antd";
import axios from "axios";
import { HOST } from "../../utils/constants";
import { notifyError, notifySuccess } from "../../utils/notify";
import { UserContext } from "../../context/UserContext";
import { useDispatch } from "react-redux";
import { updateSetting } from "../../utils/settingSlice";
import { Edit } from "../../assets/svgIcons";
import CirclePicker from "./CirclePicker";
import { set } from "lodash";
import SeeCardPreview from "./SeeCardPreview";

const { Option } = Select;

const VideoGallaryThreeDot = ({ columnKey, settings, firstRowData }) => {
  const dispatch = useDispatch();
  const { token } = useContext(UserContext);

  const [showCardPreview, setShowCardPreview] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false); // Track edit box visibility
  const [selectedOption, setSelectedOption] = useState("Font Style"); // Default editing option
  const currentStylingSettings = settings?.showInCard?.find((item) => item?.title === columnKey);
  const [editValues, setEditValues] = useState({
    fontStyle: currentStylingSettings?.setting?.fontStyle || "Regular",
    fontColor: currentStylingSettings?.setting?.fontColor || "#000000",
    fontSize: currentStylingSettings?.setting?.fontSize || "16",
    fontType: currentStylingSettings?.setting?.fontType || "Poppins",
  });


  const [colorPickerVisible, setColorPickerVisible] = useState(false); // Track if color picker is visible
  const [pickerVisible, setPickerVisible] = React.useState(false); // Toggle CirclePicker visibility
  const fileInputRef = React.useRef(null); // Ref for the default color picker

  const colorRef = useRef(null);
  const applyColor = (color) => {
    console.log(color);
  };
  console.log(settings);
  const handleDotClick = (e) => {
    e.stopPropagation();
    // setIsPopoverOpen((prev) => !prev);
    if (!isEditBoxOpen) {
      setIsPopoverOpen((prev) => !prev);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditBoxOpen(true);
    setIsPopoverOpen(false);
  };

  const [showInCardChecked, setShowInCardChecked] = useState(
    settings.showInCard?.some((item) =>
      settings?.showInCard?.map((i) => i?.title).includes(columnKey)
    ) || false
  );

  const [showInProfileChecked, setShowInProfileChecked] = useState(
    settings.showInProfile?.some((item) =>
      settings?.showInProfile?.map((i) => i?.title).includes(columnKey)
    ) || false
  );

  const handleCheckboxChange = useCallback(
    async (checked, optionType) => {
      if (!columnKey) {
        console.warn("Invalid columnKey provided");
        return;
      }

      try {
        const updatedSettings = { ...settings };

        const updateList = (list = []) => {
          if (checked) {
            // Add new entry with incremental ID
            const newId = list.length + 1;
            return [
              ...list,
              { id: newId, title: columnKey, setting: editValues },
            ];
          } else {
            // Remove entry by title
            return list.filter((item) => item.title !== columnKey);
          }
        };

        if (optionType === "showInCard") {
          updatedSettings.showInCard = updateList(settings.showInCard);
          setShowInCardChecked(checked);
        } else if (optionType === "showInProfile") {
          updatedSettings.showInProfile = updateList(settings.showInProfile);
          setShowInProfileChecked(checked);
        }

        // Dispatch updated settings locally
        dispatch(updateSetting(updatedSettings));

        // Update backend
        const response = await axios.put(
          `${HOST}/spreadsheet/${settings._id}`,
          updatedSettings,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        console.log("Settings updated successfully:", response.data);
        dispatch(updateSetting(response.data));
        notifySuccess("Settings updated successfully");
      } catch (error) {
        console.error("Error updating settings:", error);
        notifyError("Error updating settings");
      }
    },
    [dispatch, settings, token, columnKey]
  );
  const handlePopoverClose = () => {
    if (!isEditBoxOpen) {
      setIsPopoverOpen(false);
    }
  };
  const handleSaveEdit = async () => {
    try {
      const updatedShowInCard = settings?.showInCard?.map((item) =>
        item?.title === columnKey
          ? { ...item, setting: { ...item.setting, ...editValues } }
          : item
      );
      
      const updatedSettings = {
        ...settings,
        showInCard: updatedShowInCard,
      };

      dispatch(updateSetting(updatedSettings));

      const response = await axios.put(
        `${HOST}/spreadsheet/${settings._id}`,
        updatedSettings,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      dispatch(updateSetting(response.data));
      notifySuccess("Settings updated successfully");
      setIsEditBoxOpen(false); // Close the edit box
    } catch (error) {
      console.error("Error saving edits:", error);
      notifyError("Error saving edits");
    }
  };

  const handleCancelEdit = () => {
    setIsEditBoxOpen(false); // Close the edit box
    setEditValues({
      fontStyle: currentStylingSettings?.setting?.fontStyle || "Regular",
      fontColor: currentStylingSettings?.setting?.fontColor || "#000000",
      fontSize: currentStylingSettings?.setting?.fontSize || "16",
      fontType: currentStylingSettings?.setting?.fontType || "Poppins",
    });
  };

  const handleInputChange = (key, value) => {
    setEditValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderEditOptionContent = () => {
    switch (selectedOption) {
      case "Font Style":
        <Slider
          min={10} // Minimum font size
          max={100} // Maximum font size
          value={editValues.fontSize} // Current font size
          onChange={(value) => handleInputChange("fontSize", value)} // Update the font size
          style={{ width: "100%" }}
          tooltipVisible // Show tooltip with current value
          tooltipPlacement="top"
        />;
        return (
          <Select
            value={editValues.fontStyle}
            onChange={(value) => handleInputChange("fontStyle", value)}
            style={{ width: "100%" }}
            showSearch
            placeholder="Search Font Style"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            dropdownMatchSelectWidth={false} // Prevents unwanted resizing
            virtual // Enables virtua
          >
            {/* Valid CSS font-style values */}
            <Option value="normal">Regular</Option>
            <Option value="italic">Italic</Option>
            <Option value="oblique">Oblique</Option>
            <Option value="bold">Bold</Option>
            <Option value="underline">Underline</Option>
            <Option value="line-through">Strikethrough</Option>
            <Option value="overline">Overline</Option>
            <Option value="small-caps">Small Caps</Option>
            <Option value="uppercase">Uppercase</Option>
            <Option value="lowercase">Lowercase</Option>
          </Select>
        );

      case "Font Color":
        return (
          <div>
            {/* Color Line */}
            {/* <div
              onClick={() => setPickerVisible(!pickerVisible)}
              style={{
                width: "full",
                height: "10px",
                backgroundColor: editValues.fontColor,
                cursor: "pointer",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            ></div> */}

            {/* Hidden Input for Default Color Picker */}
            <input
              id="colorpickerinput"
              type="color"
              ref={colorRef}
              style={{
                visibility: "hidden", // Keep it hidden but in the DOM
                position: "absolute", // Ensure proper positioning
              }}
              onChange={(e) => handleInputChange("fontColor", e.target.value)}
            />
            {/* Circle Picker */}
            {/* {pickerVisible && ( */}
            <div
              style={{
                position: "relative",
                zIndex: "1000",
                background: "#fff",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "10px",
                maxWidth: "300px",
              }}
            >
              <CirclePicker
                colorRef={colorRef}
                applyColor={(color) => handleInputChange("fontColor", color)}
                colors={[
                  "#000000",
                  "#434343",
                  "#666666",
                  "#999999",
                  "#b7b7b7",
                  "#cccccc",
                  "#d9d9d9",
                  "#efefef",
                  "#f3f3f3",
                  "#ffffff",
                  "#980000",
                  "#ff0000",
                  "#ff9900",
                  "#ffff00",
                  "#00ff00",
                  "#00ffff",
                  "#4a86e8",
                  "#0000ff",
                  "#9900ff",
                  "#ff00ff",
                  "#e6b8af",
                  "#f4cccc",
                  "#fce5cd",
                  "#fff2cc",
                  "#d9ead3",
                  "#d0e0e3",
                  "#c9daf8",
                  "#cfe2f3",
                  "#d9d2e9",
                  "#ead1dc",
                  "#dd7e6b",
                  "#ea9999",
                  "#f9cb9c",
                  "#ffe599",
                  "#b6d7a8",
                  "#a2c4c9",
                  "#a4c2f4",
                  "#9fc5e8",
                  "#b4a7d6",
                  "#d5a6bd",
                  "#cc4125",
                  "#e06666",
                  "#f6b26b",
                  "#ffd966",
                  "#93c47d",
                  "#76a5af",
                  "#6d9eeb",
                  "#6fa8dc",
                  "#8e7cc3",
                  "#c27ba0",
                  "#a61c00",
                  "#cc0000",
                  "#e69138",
                  "#f1c232",
                  "#6aa84f",
                  "#45818e",
                  "#3c78d8",
                  "#3d85c6",
                  "#674ea7",
                  "#a64d79",
                  "#85200c",
                  "#990000",
                  "#b45f06",
                  "#bf9000",
                  "#38761d",
                  "#134f5c",
                  "#1155cc",
                  "#0b5394",
                  "#351c75",
                  "#741b47",
                  "#5b0f00",
                  "#660000",
                  "#783f04",
                  "#7f6000",
                  "#274e13",
                  "#0c343d",
                  "#1c4587",
                  "#073763",
                  "#20124d",
                  "#4c1130",
                ]}
              />
            </div>
            {/* )} */}
          </div>
        );

      case "Font Size":
        return (
          <Select
            value={editValues.fontSize}
            onChange={(value) => handleInputChange("fontSize", value)}
            style={{ width: "100%" }}
            showSearch
            placeholder="Select Font Size"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            dropdownMatchSelectWidth={false} // Prevents unwanted resizing
            virtual // Enables virtua
          >
            {/* Common font sizes */}
            {[6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40].map((size) => (
              <Option key={size} value={size}>{`${size}px`}</Option>
            ))}
          </Select>
        );
      case "Font Type":
        return (
          <Select
            value={editValues.fontType}
            onChange={(value) => handleInputChange("fontType", value)}
            style={{ width: "100%" }}
            showSearch
            placeholder="Search Font Type"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            dropdownMatchSelectWidth={false} // Prevents unwanted resizing
            virtual // Enables virtua
          >
            {[
              "Arial",
              "Roboto",
              "Poppins",
              "Times New Roman",
              "Courier New",
              "Georgia",
              "Verdana",
              "Trebuchet MS",
              "Comic Sans MS",
              "Tahoma",
              "Montserrat",
              "Lato",
              "Source Sans Pro",
              "Noto Sans",
              "Ubuntu",
              "Dancing Script",
              "Pacifico",
            ].map((font) => (
              <Option key={font} value={font}>
                {font}
              </Option>
            ))}
          </Select>
        );
      default:
        return null;
    }
  };

  const handleShowCardPreview = () => {
    setShowCardPreview(!showCardPreview);
  }

  // const [columnSettings, setColumnSettings] = useState(
  //   settings?.showInCard
  // );

  // useEffect(() => {

  // }, [settings]);

  const editBox = isEditBoxOpen && (

    <div className="fixed inset-0 flex items-center justify-center z-[1000] cursor-pointer ">
      <div
        className="bg-white border border-gray-200 shadow-lg overflow-hidden flex"
        style={{
          width: "889px",
          height: "469px",
          borderRadius: "50px",
        }}
      >
        {/* Left menu */}
        <div className="flex flex-col items-start gap-[38px]  ml-[56px] mt-[80px] mb-[95px] w-[25%]">
          {["Font Style", "Font Color", "Font Size", "Font Type"].map(
            (option) => (
              <div
                key={option}
                className={`cursor-pointer p-2 rounded-md text-[30px] font-semibold font-poppins leading-none ${selectedOption === option
                  ? "text-[#598931]"
                  : "text-[#CDCCCC]"
                  }`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </div>
            )
          )}
        </div>

        {/* Thin Vertical Line */}
        <div className="min-w-[2px] bg-[#ECECEC]"></div>

        {/* Center edit options */}
        <div className="flex flex-col flex-grow p-6 w-[40%]">
          {/* Display Selected Option */}
          <div className="text-[#598931] text-[20px] font-poppins font-semibold mb-4 text-center">
            {selectedOption || "Select an Option"}
          </div>

          {renderEditOptionContent()}
        </div>

        {/* Thin Vertical Line */}
        <div className="min-w-[2px] bg-[#ECECEC]"></div>

        {/* Right preview */}
        <div className="flex flex-col flex-grow p-6 w-[35%]">
          {/* Preview Title */}
          <div className="text-[#333131] font-poppins text-[30px] font-normal leading-normal mb-2">
            Preview
          </div>

          {/* Text Preview Box */}

          <div
            className="inline-flex items-center justify-start overflow-hidden  gap-2 px-4 py-2  rounded-lg text-center  bg-[#FFF] shadow-lg"
            style={{
              // fontStyle: editValues.fontStyle,
              border: "2px solid #598931",
              fontStyle: ["normal", "italic", "oblique"].includes(
                editValues.fontStyle
              )
                ? editValues.fontStyle
                : undefined, // Apply only if it's a valid font-style
              fontWeight: editValues.fontStyle === "bold" ? "bold" : undefined,
              textDecoration: [
                "underline",
                "line-through",
                "overline",
              ].includes(editValues.fontStyle)
                ? editValues.fontStyle
                : undefined,
              fontVariant:
                editValues.fontStyle === "small-caps"
                  ? "small-caps"
                  : undefined,
              textTransform: ["uppercase", "lowercase"].includes(
                editValues.fontStyle
              )
                ? editValues.fontStyle
                : undefined,

              color: editValues.fontColor || "#000000",
              fontSize: `${editValues.fontSize || 16}px`,
              fontFamily: editValues.fontType || "Arial, sans-serif",
            }}
          >
            {/* Header Name */}

            {columnKey || "Default Header"}
          </div>

          {/* Show Card Preview Link */}
          <div>
            <button className="mt-2 text-[#598931] text-sm font-semibold cursor-pointer underline decoration-solid decoration-[#598931] underline-offset-auto decoration-thick text-[12px] font-poppins"
              onClick={handleShowCardPreview}
            >
              See Card Preview
            </button>
          </div>
          <div className="flex justify-end gap-4 mt-auto pt-4">
            <Button
              onClick={handleCancelEdit}
              className="w-[71px] rounded-md text-[#598931] font-poppins text-[14px] font-medium border leading-normal border-[#598931]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              type="primary"
              className="w-[71px] rounded-md text-white font-poppins text-[14px] font-medium leading-normal border-[#598931] bg-[#598931]"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Save and Cancel buttons */}
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-end w-full py-4 px-10 space-x-4">
        <Button
          onClick={handleCancelEdit}
          className="w-[71px] rounded-md text-[#598931] font-poppins text-[14px] font-medium border leading-normal border-[#598931]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveEdit}
          type="primary"
          className="w-[71px] rounded-md text-white font-poppins text-[14px] font-medium leading-normal border-[#598931] bg-[#598931]"
        >
          Save
        </Button>
      </div> */}
        {showCardPreview && (
          <SeeCardPreview onClose={handleShowCardPreview} settings={settings} rowData={firstRowData} />
        )}
      </div>
    </div>
  );

  const popoverContent = (
    <div className="z-10">
      <table>
        <tbody>
          {/* Show in Card */}
          <tr>
            <td>
              <Checkbox
                checked={showInCardChecked}
                onChange={(e) =>
                  handleCheckboxChange(e.target.checked, "showInCard")
                }
              >
                Show in Card
              </Checkbox>
            </td>
            <td>
              <button
                className="edit-icon-button"
                onClick={handleEditClick}
                disabled={!showInCardChecked} // Disable button if checkbox is not checked
                style={{
                  cursor: showInCardChecked ? "pointer" : "not-allowed", // Change cursor style
                  background: "none", // Remove any default button background
                }}
              >
                {/* Faded light gray color when disabled */}
                <Edit
                  color={showInCardChecked ? "#111111" : "rgba(0, 0, 0, 0.3)"}
                />
              </button>
            </td>
          </tr>

          {/* Show in Profile */}

          <tr>
            <td>
              <Checkbox
                checked={showInProfileChecked}
                onChange={(e) =>
                  handleCheckboxChange(e.target.checked, "showInProfile")
                }
              >
                Show in Profile
              </Checkbox>
            </td>
            <td>
              <button
                className="edit-icon-button"
                onClick={handleEditClick}
                disabled={!showInProfileChecked} // Disable button if checkbox is not checked
                style={{
                  cursor: showInProfileChecked ? "pointer" : "not-allowed", // Change cursor style
                  background: "none", // Remove any default button background
                }}
              >
                {/* Faded light gray color when disabled */}
                <Edit
                  color={
                    showInProfileChecked ? "#111111" : "rgba(0, 0, 0, 0.3)"
                  }
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex items-center">
      <Popover
        content={popoverContent}
        trigger="click"
        open={isPopoverOpen}
        onOpenChange={handlePopoverClose}
        placement="bottomRight"
        overlayStyle={{ zIndex: 999 }}
      >
        <button onClick={handleDotClick}>
          <BsThreeDotsVertical />
        </button>
      </Popover>
      {editBox}
    </div>
  );
};

export default VideoGallaryThreeDot;
