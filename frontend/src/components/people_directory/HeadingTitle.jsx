import React, { useState, useContext } from "react";
import { Form, Input, Space, Button } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateSetting } from "../../utils/settingSlice";
import { handleUpdateSettings } from "../../APIs";
import axios from "axios";
import { HOST } from "../../utils/constants";
import { notifyError, notifySuccess } from "../../utils/notify";
import { UserContext } from "../../context/UserContext";

const HeadingTitle = ({settings}) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(settings?.peopleDirectory?.HeaderTitle || ""); // Stores the input value
    const dispatch = useDispatch();
    const { token } = useContext(UserContext);

    // const handleSave = () => {
    //     const updatedSetting = {
    //         peopleDirectory: { HeaderTitle: value }
    //     };

    //     // Dispatch the settings to update Redux state
    //     dispatch(updateSetting(updatedSetting));

    //     // Directly pass the updated settings to handleSaveChanges
    //     // await handleSaveChanges(updatedSetting, "Table Style Reset successfully");

    //     // const updatedSetting = { ...settings, peopleDirectory: { HeaderTitle: value } };
    //     console.log({ settings })
    //     // handleUpdateSettings(updateSetting,)
    //     notifySuccess(`Saved: ${value}`); // Example: Show success message
    //     setEditing(false);
    // };


    // console.log(settings);

    const handleSaveChanges = async (newSettings) => {
        try {
          // Update the settings in the backend
          const response = await axios.put(
            `${HOST}/spreadsheet/${settings._id}`,
            { ...settings,...newSettings }, // Merge existing settings with updates
            {
              headers: {
                authorization: "Bearer " + token,
              },
            }
          );
    
          console.log("Settings updated successfully:", response.data);
    
          // Dispatch updated settings to Redux store
        //   dispatch(updateSetting(response.data));
    
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

    // const handleSave = async () => {
    //     const updatedSetting = {
    //         peopleDirectory: { HeaderTitle: value }
    //     };
    
    //     // Now use the updated settings directly in API function
    //     await handleSaveChanges(updatedSetting);

    //     setEditing(false);
    // };
    
    const handleSave = async () => {
        const updatedSetting = {
            peopleDirectory: { HeaderTitle: value }
        };
    
        // Ensure `updatedSetting` merges inside `settings` correctly
        const newSettings = {
            ...settings, // Keep existing settings
            peopleDirectory: {
                ...(settings.peopleDirectory || {}), // Preserve existing `peopleDirectory` if present
                ...updatedSetting.peopleDirectory // Merge new updates
            }
        };

        console.log({newSettings})
    
        dispatch(updateSetting(newSettings)); // Ensure correct structure is passed
    
        // Use the updated settings directly in API function
        await handleSaveChanges(newSettings);
        setEditing(false);
    };
    
    console.log({settings});
    

    return (
        <div className="flex gap-2 items-center pl-1">
            <label className="text-[#000] text-[16px]">Header Title: </label>
            <Input  style={{ width: 160 }} value={value} onChange={(e) => setValue(e.target.value)} disabled={!editing} placeholder="Enter Header Title" />
            <Button
                type="text"
                icon={editing ? <SaveOutlined /> : <EditOutlined />}
                onClick={editing ? handleSave : () => setEditing(true)}
            />
        </div>
    );
};

export default HeadingTitle;
