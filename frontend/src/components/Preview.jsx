import InteractiveListPreview from "./InteractiveListPreview"
import { useState, useEffect, useContext } from "react";
import { HOST } from "../utils/constants";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader";
import Table from "./interactive_list/Table";

const Preview = ({ closeModal, sheetdetails }) => {

    const [sheetData, setSheetData] = useState("");
    const [tableHeader, setTableHeader] = useState("");
    const [Loading, setLoading] = useState(true);
    const sheetName = sheetdetails.spreadsheetName;
    const { token } = useContext(UserContext);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (sheetData) {
            setFilteredData(sheetData);
        }
    }, [sheetData])

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);


    useEffect(() => {
        // if (!sheetdetails || !settings.spreadsheetId || !settings.firstTabDataRange) return;

        // Fetch sheet data
        axios
            .post(
                `${HOST}/getSheetDataWithID`,
                {
                    sheetID: sheetdetails._id,
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

                // Process sheet data
                const [header, ...dataRows] = res.rows;
                const normalizedHeader = header.map((col) => col.replace(/ /g, "_").toLowerCase());
                const filteredHeader = normalizedHeader.filter((col) => !res.hiddenCol?.includes(col));
                const {jsonData} = res;
                setSheetData(jsonData);
                setTableHeader(filteredHeader);
                setTableData(jsonData);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.message);
                setLoading(false);
            });
    }, [sheetdetails]);

    // console.log("Data: ", sheetData)
    // console.log("tableHeader: ", tableHeader)
    return (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex justify-center items-center">
            {
                 !Loading && sheetData && tableHeader ? (
                
                <div className="bg-[#F5F6F7] w-full max-w-[90%] max-h-[100%] relative rounded-lg px-[25px] py-[10px]">
                <div className="py-[20px]">
                    <div className='flex text-center justify-between px-[50px]'>
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
                                {/* <InteractiveListPreview data={sheetData} headers={tableHeader} /> */}

                                <Table
                                    data={sheetData}
                                    headers={tableHeader}
                                    tempHeader={tableHeader}
                                    filteredData={filteredData}
                                    setFilteredData={setFilteredData}
                                    paginatedData={paginatedData}
                                // loading={loading}
                                // isEditMode={isEditMode}
                                // isedit={isedit}
                                // setIsedit={setIsedit}
                                // handleEdit={handleEdit}
                                // handleDelete={handleDelete}
                                // settings={settings}
                                // freezeCol={freezeCol}
                                // setFreezeCol={setFreezeCol}
                                // globalOption={globalOption}
                                // setGlobalOption={setGlobalOption}
                                // ischecked={ischecked}
                                // setIschecked={setIschecked}
                                // EditData={EditData}
                                // setEditData={setEditData}
                                // handleBulkDelete={handleBulkDelete}
                                // headerBgColor={headerBgColor}
                                // headerTextColor={headerTextColor}
                                // headerFontSize={headerFontSize}
                                // headerFontFamily={headerFontFamily}
                                // bodyTextColor={bodyTextColor}
                                // bodyFontSize={bodyFontSize}
                                // bodyFontFamily={bodyFontFamily}
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <Loader textToDisplay={"Loading..."} />
                            </div>
                        )}
                    </div>
                </div>
            </div>) : (
                    <div className="flex justify-center items-center h-full">
                        <Loader textToDisplay={"Loading..."} />
                    </div>
                )
            }
        </div>
    )
}

export default Preview;