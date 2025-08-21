import axios from "axios";
import { HOST } from "../utils/constants";
import { notifyError } from "../utils/notify";
import { updateSetting, updateFilterSettings } from "../utils/settingSlice";

// export const handleSaveChanges = async (settingData, token, dispatch, updatedSettings) => {
//     try {
//         const response = await axios.put(
//             `${HOST}/spreadsheet/${settingData._id}`,
//             { ...settingData, ...updatedSettings }, 
//             {
//                 headers: {
//                     authorization: "Bearer " + token,
//                 },
//             }
//         );

//         console.log("Settings updated successfully:", response.data);

//         // Dispatch updated settings to Redux store
//         dispatch(updateSetting(response.data));

//         return response.data;
//     } catch (error) {
//         console.error("Error updating settings in DB:", error);
//         notifyError("Error updating settings in DB:", error);
//         // setIsSaveChanges(false);
//     }
// };

export const handleSaveChanges = async (settingData, token, dispatch, updatedSettings) => {
  if (!token) {
    notifyError("Authorization token is missing.");
    return null;
  }
  console.log({settingData, updatedSettings})

  try {
    const response = await axios.put(
      `${HOST}/spreadsheet/${settingData._id}`,
      { ...settingData, ...updatedSettings },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Settings updated successfully:", response.data);

    // Check if this update includes filterSettings and dispatch accordingly
    if (updatedSettings.filterSettings) {
      // If updating filter settings, use the specific action to replace them completely
      dispatch(updateFilterSettings(response.data.filterSettings || { filters: [] }));
    } else {
      // For other settings, use the regular merge action
      dispatch(updateSetting(response.data));
    }

    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error.message;
    console.error("Error updating settings in DB:", errorMessage);
    notifyError(errorMessage);
    return null; // Indicate failure
  }
};

export const editMultipleRows = async (spreadSheetID, sheetName, rowsToUpdate, formulaData) => {
  console.log({ spreadSheetID, sheetName, rowsToUpdate, formulaData });
  let tempRows = rowsToUpdate.map((row) => {
    let tempObj = { ...row };
    for (let key in formulaData) {
      if (formulaData?.[key] == false) {
        delete tempObj[key]
      }
    }
    return tempObj
  })
  console.log(tempRows)

  try {
    const response = await axios.post(
      `${HOST}/editMultipleRows`, // Replace HOST with your backend URL
      {
        spreadSheetID: spreadSheetID,
        sheetName: sheetName,
        rowsToUpdate: tempRows,
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


export const handleUpdateSettings = async (updatedSetting, token, dispatch) => {

  try {
    // Use the passed settings or fallback to the Redux state
    const settingsToSave = updatedSetting;

    const response = await axios.put(
      `${HOST}/spreadsheet/${updatedSetting._id}`,
      settingsToSave,
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    );

    console.log("Settings updated successfully:", response.data);
    dispatch(updateSetting(response.data));

    return response;
  } catch (error) {
    console.error("Error updating settings in DB:", error);
    return (error);
  }
};