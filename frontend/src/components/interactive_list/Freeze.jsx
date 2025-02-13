import { useCallback, useContext, memo, useState } from "react";
import { BsPinAngleFill, BsPinFill, BsPin } from "react-icons/bs";
import { HOST } from "../../utils/constants";
import axios from "axios";
import { notifyError, notifySuccess } from "../../utils/notify";
import { useDispatch, useSelector } from "react-redux";
import { updateSetting } from "../../utils/settingSlice";
import { UserContext } from "../../context/UserContext";

const Freeze = ({ columnKey, isEditMode,setFreezeCol, freezeCol, settings }) => {

    const dispatch = useDispatch();
    const { token } = useContext(UserContext);

    const handleFreezeColumn = useCallback(async (columnKey, option, event) => {
        const isChecked = event.target.checked;

        if (option == 'removeFreezeCol') {
            columnKey = "";
        }
        setFreezeCol(columnKey);
        const updatedSettings = {
            freezeCol: columnKey
        };

        // Dispatch with updated state
        dispatch(updateSetting(updatedSettings));

        try {
            // Update the settings in the backend
            const response = await axios.put(
                `${HOST}/spreadsheet/${settings._id}`,
                { ...settings, ...updatedSettings }, // Merge existing settings with updates
                {
                    headers: {
                        authorization: "Bearer " + token,
                    },
                }
            );

            console.log("Settings updated successfully:", response.data);
            

            // Dispatch updated settings to Redux store
            dispatch(updateSetting(response.data));
            notifySuccess("Freeze column successfully");
            return response.data;
        } catch (error) {
            console.error("Error updating settings in DB:", error);
            notifyError("Error updating settings in DB:", error);
        }
    }, []);


    return (
        isEditMode &&
        (freezeCol.includes(columnKey) ? (
            <button title="Freezed Column" onClick={(e) => handleFreezeColumn(columnKey, "removeFreezeCol", e)}>
                <BsPinAngleFill />
            </button>
        ) : (
            <button title="Freeze Column" onClick={(e) => handleFreezeColumn(columnKey, "showInProfile", e)}>
                <BsPin />
            </button>
        ))
    )
}


export default memo(Freeze);