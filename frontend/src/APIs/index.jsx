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

// export const fetchGroupNames = async () => {
//   try {
//     const response = await fetch("https://auth.ceoitbox.com/getGroupNames", {
//       "headers": {
//         "accept": "/",
//         "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,hi;q=0.6",
//         "if-none-match": "W/\"843-knNASCBVn2hshLI+FNzAUvhDWhc\"",
//         "priority": "u=1, i",
//         "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": "\"Windows\"",
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-site",
//         "Referer": "https://ai.ceoitbox.com/"
//       },
//       "body": null,
//       "method": "GET"
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching group names:", error);
//     throw error;
//   }
// };

export const fetchGroupNames = async () => {
  try {
    const response = await fetch("https://auth.ceoitbox.com/getGroupNames", {
      headers: {
        accept: "application/json",
        // remove if-none-match if you don't need caching
      },
      method: "GET"
    });

    if (response.status === 304) {
      console.log("Group names not modified. Use cached data.");
      return null; // Or return cached data if you have it
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching group names:", error);
    throw error;
  }
};

// ==================== APPS API FUNCTIONS ====================

// GET all apps for admin
export const fetchAppsAdmin = async (token) => {
  try {
    const response = await axios.get(`${HOST}/apps/admin`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching apps admin:", error);
    throw error;
  }
};

// GET all apps
export const fetchApps = async (token) => {
  try {
    const response = await axios.get(`${HOST}/apps`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching apps:", error);
    throw error;
  }
};

// GET single app by ID
export const fetchAppById = async (id, token) => {
  try {
    const response = await axios.get(`${HOST}/apps/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching app:", error);
    throw error;
  }
};

// POST create new app
export const createApp = async (appData, token) => {
  try {
    const response = await axios.post(`${HOST}/apps`, appData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating app:", error);
    throw error;
  }
};

// PUT update app by ID
export const updateApp = async (id, appData, token) => {
  try {
    const response = await axios.put(`${HOST}/apps/${id}`, appData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating app:", error);
    throw error;
  }
};

// PUT update app's allowed groups
export const updateAppGroups = async (id, allowedGroups, token) => {
  try {
    const response = await axios.put(`${HOST}/apps/${id}/groups`, { allowedGroups }, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating app groups:", error);
    throw error;
  }
};

// PUT toggle app visibility (show/hide)
export const toggleAppVisibility = async (id, token) => {
  try {
    const response = await axios.put(`${HOST}/apps/${id}/toggle`, {}, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling app visibility:", error);
    throw error;
  }
};

// POST seed initial apps data
export const seedApps = async (token) => {
  try {
    const response = await axios.post(`${HOST}/apps/seed`, {}, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error seeding apps:", error);
    throw error;
  }
};
