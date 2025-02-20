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
  const [showInProfileChecked, setShowInProfileChecked] = useState(false);

  useEffect(() => {
    setShowInProfileChecked(
      settings.showInProfile?.some((item) => item.title === columnKey) || false
    );
  }, [settings, columnKey]);

  const handleCheckboxChange = useCallback(
    async (checked) => {
      setShowInProfileChecked(checked);
      try {
        const updatedSettings = {
          ...settings,
          showInProfile: checked
            ? [
                ...(settings.showInProfile || []),
                { id: Date.now(), title: columnKey },
              ]
            : settings.showInProfile?.filter(
                (item) => item.title !== columnKey
              ),
        };
        dispatch(updateSetting(updatedSettings));
        const response = await axios.put(
          `${HOST}/spreadsheet/${settings._id}`,
          updatedSettings,
          { headers: { authorization: `Bearer ${token}` } }
        );
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
    <Checkbox
      checked={showInProfileChecked}
      onChange={(e) => handleCheckboxChange(e.target.checked)}
    >
      Add in detail View
    </Checkbox>
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
