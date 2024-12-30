import axios from "axios";
import { HOST } from "../utils/constants";
import { notifyError } from "../utils/notify";
import { updateSetting } from "../utils/settingSlice";

export const handleSaveChanges = async (settingData, token, dispatch, updatedSettings) => {
    try {
        // const settingData = useSelector((state) => state.setting.settings);
        // const { token } = useContext(UserContext);
        // const dispatch = useDispatch();
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

        return response.data;
    } catch (error) {
        console.error("Error updating settings in DB:", error);
        notifyError("Error updating settings in DB:", error);
        // setIsSaveChanges(false);
    }
};


export const editMultipleRows = async (spreadSheetID, sheetName, rowsToUpdate) => {
    try {
        const response = await axios.post(
            `${HOST}/editMultipleRows`, // Replace HOST with your backend URL
            {
                spreadSheetID: spreadSheetID,
                sheetName: sheetName,
                rowsToUpdate: rowsToUpdate,
            },
            {
                withCredentials: true, // Include cookies in the request if needed
            }
        );

        if (response.status === 200) {
            console.log("Rows updated successfully:", response.data.updatedSheetData);
            return response.data.updatedSheetData; // Return the updated sheet data
        } else {
            console.error("Failed to update rows. Server response:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Error updating rows:", error?.response?.data?.error || error.message);
        throw new Error(
            error?.response?.data?.error || "An unexpected error occurred while updating rows"
        );
    }
};

export const deleteMultiple = async (spreadSheetID, sheetName, rowsToDelete) => {
    try {
      const response = await axios.post(`${HOST}/deleteMultipleRows`, {
        spreadSheetID,
        sheetName,
        rowsToDelete,
      },
      {
        withCredentials: true, // Include cookies in the request if needed
      });
  
      return response.data; // Return the response data to the caller
    } catch (error) {
      console.error("Error deleting rows:", error);
      throw new Error(error.response?.data?.error || "Failed to delete rows");
    }
  };