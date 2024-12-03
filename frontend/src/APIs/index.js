import axios from "axios";
import { HOST } from "../utils/constants";
import { notifyError } from "../utils/notify";
import { updateSetting } from "../utils/settingSlice";

export const handleSaveChanges = async (settingData,token,dispatch,updatedSettings) => {
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
