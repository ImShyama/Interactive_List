import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import sheetIcon from "../assets/sheetIcon.svg";
import openIcon from "../assets/openIcon.svg";
import "./setting.css";
import axios from "axios";
import { HOST } from "../utils/constants";
import { useSelector } from "react-redux";
import { notifyError, notifySuccess } from "../utils/notify";

const BulkAdd = ({ isOpen, onClose, openPicker, spreadSheetData, handleBuldData }) => {
    // State for selected sheet and data range
    const [selectedSheet, setSelectedSheet] = useState(spreadSheetData?.sheetDetails[0].name);
    const [dataRange, setDataRange] = useState("");
    const { token } = useContext(UserContext);
    const settings = useSelector((state) => state.setting.settings);
    const [loading, setLoading] = useState(false);
    const [isRangeEmpty, setIsRangeEmpty] = useState(false);
    const spreadsheetId = spreadSheetData?.sheetUrl?.match(/[-\w]{25,}/);

    useEffect(() => {
        setSelectedSheet(spreadSheetData?.sheetDetails[0].name);
        // setDataRange(spreadSheetData?.firstSheetDataRange);
    }, [spreadSheetData]);

    if (!isOpen) return null;

    // Update the state when sheet name changes
    const handleSheetChange = (e) => {
        setSelectedSheet(e.target.value);
    };

    const isValidRange = (range) => {
        // Regular expression to validate the range format (e.g., A1, A1:H10, A:H)
        const rangeRegex = /^[A-Z]+[1-9]\d*(?::[A-Z]+[1-9]\d*|:[A-Z]+)?$/i;
    
        if (!range || typeof range !== "string") {
            return false; // Return false if the range is empty or not a string
        }
    
        return rangeRegex.test(range); // Test the range against the regex
    };
    
    
    // Update the state when data range changes
    const handleRangeChange = (e) => {
        setDataRange(e.target.value);
        setIsRangeEmpty(false);
    };

    const bulkCopyFromAnotherSheet = async () => {
        try {
            const response = await axios.post(
                `${HOST}/bulkCopyFromAnotherSheet`,  // Your backend API endpoint
                {
                    originalSheetID: settings.spreadsheetId,     // Original sheet ID
                    originalSheetName: settings.firstSheetName,       // Original sheet name
                    bulkSheetID: spreadsheetId,             // Bulk sheet ID
                    bulkSheetName: selectedSheet,               // Bulk sheet name
                    bulkSheetRange: dataRange                   // Range from the bulk sheet to extract data
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // User's token for authorization
                    }
                }
            );

            handleBuldData(response.data.updatedData.values);
            notifySuccess("Data imported successfully!");
            return response.updatedData;  // Return the response from the backend
        } catch (error) {
            console.error('Error adding bulk data:', error.response?.updatedData || error.message);
            notifyError(error.response?.updatedData || error.message);
            throw error;
        }
    };

    // Function to handle the Save Changes button click
    const handleSaveChanges = async () => {
        if(dataRange === "") {
            setIsRangeEmpty(true);
            return notifyError("Please select a data range");
        }

        console.log(isValidRange(dataRange));
        if (!isValidRange(dataRange)) {
            return notifyError("Invalid range format. Please enter a valid range (e.g., A1:H10).");
        }
        setLoading(true);
        try {
            // Call the API to copy data from the bulk sheet to the original sheet
            const result = await bulkCopyFromAnotherSheet();
            console.log("Data successfully copied:", result);
        } catch (err) {
            console.error("Error copying data:", err);
        } finally {
            setLoading(false);
            setDataRange("")
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[999]">
            <div className="flex-shrink-0">
                <div className="flex justify-center flex-shrink-0 rounded-[20px] bg-white shadow-lg">
                    <div className="flex flex-col p-6">
                        <div className="flex px-6 mb-3 justify-between">
                            <div className="flex justify-start items-center">
                                <span className="text-xl font-medium font-poppins">Add From Spreadsheet</span>
                            </div>
                            <div className="flex justify-end items-center">
                                <div className="mr-6 mt-[-25px]">
                                    <button
                                        onClick={onClose}
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
                        </div>
                        <div className="flex justify-center gap-2 px-6 mb-3">
                            <div className="flex flex-col gap-2">
                                <div className="sheet_link">
                                    {spreadSheetData && (
                                        <div className="sheet_link_header">
                                            <img src={sheetIcon} alt="Sheet Icon" />
                                            <span className="sheet_title">{spreadSheetData?.spreadsheetName}</span>
                                        </div>
                                    )}
                                    <div className="sheet_btn">
                                        <button className="sheet_btn_select" onClick={openPicker}>
                                            <span className="sheet_btn_select_text">Select Spreadsheet</span>
                                        </button>
                                        {spreadSheetData && (
                                            <div>
                                                <a
                                                    className="sheet_btn_open"
                                                    target="_blank"
                                                    href={spreadSheetData?.sheetUrl}
                                                    rel="noreferrer"
                                                >
                                                    <img src={openIcon} alt="Open Icon" />
                                                    <span className="sheet_btn_open_text">Open</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {spreadSheetData && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="450"
                                        height="2"
                                        viewBox="0 0 450 2"
                                        fill="none"
                                    >
                                        <path d="M0 1H450" stroke="#E4E6EC" />
                                    </svg>
                                )}
                                {spreadSheetData && (
                                    <div className="sheet_data">
                                        <div className="sheet_data_tab">
                                            <div className="sheet_data_tabLabel">
                                                <span className="sheet_data_text">Select a Data Sheet</span>
                                            </div>
                                            <div className="sheet_data_select">
                                                <select
                                                    className="add_input"
                                                    value={selectedSheet}
                                                    onChange={handleSheetChange}
                                                >
                                                    {spreadSheetData?.sheetDetails?.map((sheet, index) => (
                                                        <option key={index} value={sheet.name}>
                                                            {sheet.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="sheet_range">
                                            <div className="sheet_data_tabLabel">
                                                <span className="sheet_data_text">Select a Data Range</span>
                                            </div>
                                            <div className="sheet_data_select">
                                                <input
                                                    className={`add_input ${isRangeEmpty ? "input-error" : ""}`} // Add error class if range is empty
                                                    placeholder="Ex-A1:H"
                                                    value={dataRange}
                                                    onChange={handleRangeChange}
                                                    style={{  }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-center">
                                    <button
                                        className="submit_btn w-[150px]"
                                        onClick={handleSaveChanges}
                                        disabled={!spreadSheetData || loading} // Disable button if spreadSheetData is null
                                    >
                                        {loading ? (
                                            <div className="loader" /> // Display loader during loading
                                        ) : (
                                            <span className="span_btn">Add Data</span>
                                        )}

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkAdd;
