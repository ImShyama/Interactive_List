import { Select } from "antd";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { TiLockClosed } from "react-icons/ti";
import useSpreadSheetDetails from "../../utils/useSpreadSheetDetails";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { HOST } from "../../utils/constants";
import { UserContext } from "../../context/UserContext";


const GeneralAccess = ({ sheetId }) => {

    const setting = useSpreadSheetDetails(sheetId);
    const { token } = useContext(UserContext);
    const [generalAccess, setGeneralAccess] = useState(setting?.accessType?.type);

    useEffect(() => {
        setGeneralAccess(setting?.accessType?.type);
    },[setting])
    console.log({ generalAccess });

    const handleSaveChanges = async(e) => {
        console.log(e);
        setGeneralAccess(e);

        // try {
            // Use the passed settings or fallback to the Redux state
            const settingsToSave =  {...setting, accessType: {type: e}};
            console.log({ settingsToSave })
      
            const response = await axios.put(
              `${HOST}/spreadsheet/${settingsToSave._id}`,
              settingsToSave,
              {
                headers: {
                  authorization: "Bearer " + token,
                },
              }
            );
      
            console.log("Settings updated successfully:", response.data);
        //   } catch (error) {
        //     console.error("Error updating settings in DB:", error);
        //   }
        
    }

    return (
        <div>
            <span className="font-small text-[#1f1f1f] text-[14px]">General access</span>
            <div className="flex justify-between items-center bg-slate-100 p-2 my-2 rounded-md">
                <div className="flex items-center w-[75%] gap-2">
                    <div className="flex gap-2 bg-white p-1 rounded-full">
                        {generalAccess == "public" ? <BsGlobeCentralSouthAsia className="text-primary " /> : <TiLockClosed className="text-primary" />}
                    </div>
                    <div className="truncate mr-2">
                        {setting?.spreadsheetName}
                    </div>

                </div>

                <div className="w-[25%]">
                    <Select value={generalAccess}
                        options={[
                            { value: 'public', label: 'Public' },
                            { value: 'private', label: 'Private' }
                        ]}
                        onChange={(e) => handleSaveChanges(e)}
                    />
                </div>
            </div>
        </div>
    );
}

export default GeneralAccess