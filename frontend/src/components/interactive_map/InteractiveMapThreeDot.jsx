import React, { useCallback, useContext, useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Popover, Checkbox } from "antd";
import axios from "axios";
import { HOST } from "../../utils/constants";
import { notifyError, notifySuccess } from "../../utils/notify";
import { UserContext } from "../../context/UserContext";
import { useDispatch } from "react-redux";
import { updateSetting } from "../../utils/settingSlice";

const InteractiveMapThreeDot = ({ columnKey, settings }) => {
  const dispatch = useDispatch();
  const { token } = useContext(UserContext);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showInCardChecked, setShowInCardChecked] = useState(
    settings.showInCard?.some((item) => settings?.showInCard?.map(i => i?.title).includes(columnKey)) || false
  );
  const [showInProfileChecked, setShowInProfileChecked] = useState(
    settings.showInProfile?.some((item) => settings?.showInProfile?.map(i => i?.title).includes(columnKey)) || false
  );

  useEffect(() => {
    setShowInCardChecked(settings.showInCard?.some((item) => settings?.showInCard?.map(i => i?.title).includes(columnKey)) || false);
    setShowInProfileChecked(settings.showInProfile?.some((item) => settings?.showInProfile?.map(i => i?.title).includes(columnKey)) || false);
  }, [settings]);

  // const handleCheckboxChange = useCallback(
  //   async (checked) => {
  //     setShowInProfileChecked(checked);
  //     try {
  //       const updatedSettings = {
  //         ...settings,
  //         showInProfile: checked
  //           ? (settings?.showInProfile.length == 1 && settings?.showInProfile[0]?.title == "")
  //             ?
  //             [{ id: Date.now(), title: columnKey }]
  //             :
  //             [
  //               ...(settings.showInProfile || []),
  //               { id: Date.now(), title: columnKey },
  //             ]
  //           : settings.showInProfile?.filter(
  //             (item) => item.title !== columnKey
  //           ),
  //       };
  //       dispatch(updateSetting(updatedSettings));
  //       const response = await axios.put(
  //         `${HOST}/spreadsheet/${settings._id}`,
  //         updatedSettings,
  //         { headers: { authorization: `Bearer ${token}` } }
  //       );
  //       dispatch(updateSetting(response.data));
  //       notifySuccess("Settings updated successfully");
  //     } catch (error) {
  //       console.error("Error updating settings:", error);
  //       notifyError("Error updating settings");
  //     }
  //   },
  //   [dispatch, settings, token, columnKey]
  // );


  const handleCheckboxChange = useCallback(
    async (checked, optionType) => {
      if (!columnKey) {
        console.warn("Invalid columnKey provided");
        return;
      }

      try {
        const updatedSettings = { ...settings };

        if (optionType === "showInProfile") {
          // Existing logic for showInProfile
          const updateList = (list = []) => {
            if (checked) {
              const highestId = list.reduce((max, item) => Math.max(max, item.id), 0);
              return [...list, { id: highestId + 1, title: columnKey }];
            } else {
              return list.filter((item) => item.title !== columnKey);
            }
          };

          updatedSettings.showInProfile = updateList(settings.showInProfile);
          setShowInProfileChecked(checked);
        }

        else if (optionType === "showInCard") {

          let updatedChecked = checked; // Keep track of the checkbox state
          let found = false; // Flag to track if we already added the columnKey

          updatedSettings.showInCard = settings.showInCard.map((item) => {
            if (checked && item.title === "" && !found) {
              // Assign columnKey to the first empty title and stop further modifications
              found = true; // Mark that we've made a replacement
              return { ...item, title: columnKey };
            }
            if (!checked && item.title === columnKey) {
              // Remove columnKey when unchecked
              updatedChecked = false; // Set checked state to false only when removing
              return { ...item, title: "" };
            }
            
            return item; // Keep other items unchanged
          });

          if (!found && checked) {
            notifyError("Please remove columns from Map View Settings, Limit reaced to 3");
            return;
          }

          // Only update the checkbox state when necessary
          setShowInCardChecked(checked ? true : updatedChecked);
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


  const popoverContent = (
    // <Checkbox
    //   checked={showInProfileChecked}
    //   onChange={(e) => handleCheckboxChange(e.target.checked)}
    // >
    //   Add in detail View
    // </Checkbox>
    <table className="w-[185px]">
      <tbody>
        <tr>
          <td>
            <Checkbox
              checked={showInCardChecked}
              onChange={(e) => handleCheckboxChange(e.target.checked, "showInCard")}
            >
              Map View Settings
            </Checkbox>
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox
              checked={showInProfileChecked}
              onChange={(e) => handleCheckboxChange(e.target.checked, "showInProfile")}
            >
              Details View Settings
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
      onOpenChange={(visible) => setIsPopoverOpen(visible)}
      placement="bottomRight"
    >
      <button
        className="flex items-center rounded"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        <BsThreeDotsVertical />
      </button>
    </Popover>
  );
};

export default InteractiveMapThreeDot;
