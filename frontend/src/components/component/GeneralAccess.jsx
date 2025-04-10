import { Select } from "antd";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { TiLockClosed } from "react-icons/ti";
import useSpreadSheetDetails from "../../utils/useSpreadSheetDetails";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { HOST } from "../../utils/constants";
import { UserContext } from "../../context/UserContext";
import { Skeleton } from "antd";


const GeneralAccess = ({ sheetId }) => {

    const setting = useSpreadSheetDetails(sheetId);
    const { token } = useContext(UserContext);
    const [generalAccess, setGeneralAccess] = useState(setting?.accessType?.type);

    useEffect(() => {
        setGeneralAccess(setting?.accessType?.type);
    }, [setting])
    console.log({ generalAccess });

    const handleSaveChanges = async (e) => {
        console.log(e);
        setGeneralAccess(e);

        // try {
        // Use the passed settings or fallback to the Redux state
        const settingsToSave = { ...setting, accessType: { type: e } };
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

    // return (
    //     <>
    //         {setting &&
    //             (<div>
    //                 <span className="font-small text-gray-600 text-[13px]">General access</span>
    //                 <div className="flex justify-between items-center bg-slate-100 py-1 px-2 my-2 rounded-md">
    //                     <div className="flex items-center w-[75%] gap-2">
    //                         <div className="flex gap-2 bg-white p-1 rounded-full">
    //                             {generalAccess == "public" ? <BsGlobeCentralSouthAsia className="text-primary " /> : <TiLockClosed className="text-primary" />}
    //                         </div>
    //                         <div className="truncate mr-2">
    //                             <span className="font-small text-[#1f1f1f] text-[14px]">
    //                                 {setting?.spreadsheetName}
    //                             </span>
    //                         </div>

    //                     </div>

    //                     <div className="w-[25%] ">
    //                         <Select value={generalAccess}
    //                             options={[
    //                                 { value: 'public', label: 'Public' },
    //                                 { value: 'private', label: 'Private' }
    //                             ]}
    //                             onChange={(e) => handleSaveChanges(e)}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>)}
    //     </>
    // );

    return (
        <>
            {setting ? (
                <div>
                    <span className="text-gray-600 text-[13px]">General access</span>

                    <div className="flex justify-between items-center bg-slate-100 py-1 px-2 my-2 rounded-md">
                        <div className="flex items-center w-[75%] gap-2">
                            <div className="flex gap-2 bg-white p-1 rounded-full">
                                {generalAccess === "public" ? (
                                    <BsGlobeCentralSouthAsia className="text-primary" />
                                ) : (
                                    <TiLockClosed className="text-primary" />
                                )}
                            </div>

                            <div className="truncate mr-2">
                                <span className="text-[#1f1f1f] text-[14px]">
                                    {setting?.spreadsheetName}
                                </span>
                            </div>
                        </div>

                        <div className="w-[25%]">
                            <Select
                                value={generalAccess}
                                options={[
                                    { value: "public", label: "Public" },
                                    { value: "private", label: "Private" },
                                ]}
                                onChange={(value) => handleSaveChanges(value)}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <span className="text-gray-600 text-[13px]">General access</span>

                    <div className="flex justify-between items-center bg-slate-100 py-1 px-2 my-2 rounded-md">
                        <div className="flex items-center w-[75%] gap-2">
                            <div className="flex gap-2 bg-white p-1 rounded-full">
                                <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                            </div>

                            <div className="h-6 bg-gray-300 rounded w-36 animate-pulse mt-1" />
                        </div>

                        <div className="w-[25%]">
                            <div className="h-8 bg-gray-300 rounded animate-pulse w-full" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default GeneralAccess