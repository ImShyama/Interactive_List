import InteractiveListPreview from "./InteractiveListPreview"
import { useState, useEffect, useContext } from "react";
import { HOST } from "../utils/constants";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader";

const Preview = ({ closeModal, sheetdetails }) => {

    const [sheetData, setSheetData] = useState("");
    const [tableHeader, setTableHeader] = useState("");
    const [Loading, setLoading] = useState(true);
    console.log("sheetData: ", sheetdetails);
    const sheetName = sheetdetails.spreadsheetName;
    console.log(sheetName)
    const { token } = useContext(UserContext);

    useEffect(() => {
        // if (!sheetdetails || !settings.spreadsheetId || !settings.firstTabDataRange) return;

        // Fetch sheet data
        axios
            .post(
                `${HOST}/getSheetData`,
                {
                    spreadSheetID: sheetdetails.spreadsheetId,
                    range: sheetdetails.firstTabDataRange,
                },
                {
                    headers: {
                        authorization: "Bearer " + token,
                    },
                }
            )
            .then(({ data: res }) => {
                if (res.error) {
                    alert(res.error);
                    navigate("/");
                    return;
                }

                const [header, ...dataRows] = res;
                setSheetData(res);
                setTableHeader(header);
                setTableData(dataRows);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.message);
                setLoading(false);
            });
    }, [sheetdetails]);

    console.log("Data: ", sheetData)
    console.log("tableHeader: ", tableHeader)
    return (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#F5F6F7] w-full max-w-[90%] h-[90%] relative rounded-lg px-[25px] py-[10px]">
                <div className="h-full">
                    <div className='flex text-center justify-between '>
                        <div className='p-2'><span className="text-[#2A3C54] font-poppins text-[24px] font-medium">{sheetName}</span></div>
                        <div className='pr-6 pt-2'>
                            <button
                                onClick={closeModal}
                                className="absolute w-[25px] h-[25px] text-gray-400 hover:text-red-600"
                            >
                                <span className="cursor-pointer">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </span>

                            </button>
                        </div>
                    </div>
                    <div className="h-full">
                        {/* Conditional rendering for InteractiveListPreview */}
                        {!Loading && sheetData && tableHeader ? (
                            <div>
                                <InteractiveListPreview data={sheetData} headers={tableHeader} />
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <Loader textToDisplay={"Loading..."} />
                            </div> 
                         )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Preview;