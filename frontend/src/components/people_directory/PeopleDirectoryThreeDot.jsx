import React, { useCallback, useContext, useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Popover, Checkbox } from "antd";
import axios from "axios";
import { HOST } from "../../utils/constants";
import { notifyError, notifySuccess } from "../../utils/notify";
import { UserContext } from "../../context/UserContext";
import { useDispatch } from "react-redux";
import { updateSetting } from "../../utils/settingSlice";

const PeopleDirectoryThreeDot = ({ columnKey, settings }) => {
  const dispatch = useDispatch();
  const { token } = useContext(UserContext);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showInCardChecked, setShowInCardChecked] = useState(
    settings.showInCard?.some((item) => settings?.showInCard?.map(i => i?.title).includes(columnKey)) || false
  );
  
  const [showInProfileChecked, setShowInProfileChecked] = useState(
    settings.showInProfile?.some((item) => settings?.showInProfile?.map(i => i?.title).includes(columnKey)) || false
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
            if (optionType === "showInCard" && list.length >= 6) {
              notifyError("You can only add up to 6 items in Show in Card");
              return list;
            }
            // Add new entry with incremental ID
            const newId = list.length + 1; 
            return [...list, { id: newId, title: columnKey }];
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
  
  const handleButtonClick = (e) => {
    e.stopPropagation();
    setIsPopoverOpen((prev) => !prev);
  };

  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
  };

  const popoverContent = (
    <table className="w-[180px]">
      <tbody>
        <tr>
          <td>
            <Checkbox
              checked={showInCardChecked}
              onChange={(e) => handleCheckboxChange(e.target.checked, "showInCard")}
            >
              Show in Card
            </Checkbox>
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox
              checked={showInProfileChecked}
              onChange={(e) => handleCheckboxChange(e.target.checked, "showInProfile")}
            >
              Show in Profile
            </Checkbox>
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={isPopoverOpen}
      onOpenChange={(visible) => !visible && handlePopoverClose()}
      placement="bottomRight"
    >
      <button className="flex items-center rounded" onClick={handleButtonClick}>
        <BsThreeDotsVertical />
      </button>
    </Popover>
  );
};

export default PeopleDirectoryThreeDot;
