import React, { useState, useRef, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { HOST } from "../../utils/constants";
import { Pagination, Input, Avatar, Popover, Checkbox, Space, Button, AutoComplete, Switch } from "antd";
import { BiSearch } from "react-icons/bi";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { Delete, Edit, BackIcon, Cancel, Dots, Search, Reset, Add, BulkAdds, Sort, Filter, Label } from "../../assets/svgIcons";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import EditRow from "../../components/EditRow";
import DeleteAlert from "../../components/DeleteAlert";
import EditableSpreadsheetName from "../../components/EditableSpreadsheetName";
import { notifySuccess, notifyError } from "../../utils/notify";
import BulkAdd from '../../components/BulkAdd';
import useDrivePicker from 'react-google-drive-picker';
import { CLIENTID, DEVELOPERKEY } from "../../utils/constants.jsx";
import { useSelector, useDispatch } from "react-redux";
import { updateSetting } from "../../utils/settingSlice";
import { BsPin, BsPinAngleFill, BsPinFill } from "react-icons/bs";
import { BiSolidHide } from "react-icons/bi";
import { MdEdit, MdDelete, MdOutlineLabel } from "react-icons/md";
import { IoSaveSharp, IoSearchOutline } from "react-icons/io5";
import { FaForumbee, FaSort } from "react-icons/fa";
import { editMultipleRows, deleteMultiple } from "../../APIs/index";
import { LuFilter } from "react-icons/lu"; // added by me`
import { CiCalendarDate } from "react-icons/ci"; // added
import { Bs123 } from "react-icons/bs"; //added
import { ImCancelCircle } from "react-icons/im";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import slider styles
import { RxDividerVertical } from "react-icons/rx";
import _, { debounce } from "lodash";
import GlobalSearch from "../interactive_list/GlobalSearch.jsx";
import Table from "../interactive_list/Table.jsx";
import Loader from "../Loader.jsx";
import ProductCatalogueView from "./ProductCatalogueView.jsx";
import CatalogueFilter from "../component/CategoryFilter.jsx";
import numberFilter from "../../assets/numberFilter.svg";


const convertArrayToJSON = (data) => {
    // The first array contains the keys
    const keys = data[0];

    // Map the rest of the arrays to JSON objects
    const jsonData = data.slice(1).map((item, index) => {
        const jsonObject = {};
        keys.forEach((key, i) => {
            jsonObject[key.replace(/\s+/g, '_').toLowerCase()] = item[i]; // Replace spaces with underscores and make keys lowercase
        });
        return { key_id: (index + 1).toString(), ...jsonObject }; // Add key_id
    });

    return jsonData;
};

const ProductCatalogueTable = ({ data, headers, settings, tempHeader, freezeIndex, formulaData, unhideHeader, setShowTable }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmBulkAddModalOpen, setConfirmBulkAddModalOpen] = useState(false);
    const [confirmAddModalOpen, setConfirmAddModalOpen] = useState(false);
    const [selectSpreadsheet, setSelectSpreadsheet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchGlobal, setSearchGlobal] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filteredData, setFilteredData] = useState([]);
    const [showInCard, setShowInCard] = useState(settings?.showInCard || []);
    const [showInProfile, setShowInProfile] = useState(settings?.showInProfile || []);
    const [freezeCol, setFreezeCol] = useState(settings?.freezeCol || "");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const navigate = useNavigate();
    const { token, setIsPCTSettings } = useContext(UserContext);
    const dispatch = useDispatch();
    const tableSettings = settings?.tableSettings?.length > 0 ? settings.tableSettings[0] : null;
    const tableRef = useRef(null);
    const [headerBgColor, setHeaderBgColor] = useState(tableSettings?.headerBgColor || '#F3F4F6'); // Default header background color
    const [headerTextColor, setHeaderTextColor] = useState(tableSettings?.headerTextColor || '#ffffff'); // Default header text color
    const [headerFontSize, setHeaderFontSize] = useState(tableSettings?.headerFontSize || 14); // Default header font size
    const [headerFontFamily, setHeaderFontFamily] = useState(tableSettings?.headerFontStyle || 'Poppins'); // Default header font family
    const [bodyTextColor, setBodyTextColor] = useState(tableSettings?.bodyTextColor || '#000000'); // Default body text color
    const [bodyFontSize, setBodyFontSize] = useState(tableSettings?.bodyFontSize || 12); // Default body font size
    const [bodyFontFamily, setBodyFontFamily] = useState(tableSettings?.bodyFontStyle || 'Poppins'); // Default body font family
    const [globalOption, setGlobalOption] = useState({});
    const [ischecked, setIschecked] = useState([]);
    const [EditData, setEditData] = useState([]);
    const isEditMode = window.location.pathname.endsWith('/edit');
    const [isedit, setIsedit] = useState(false);
    const [globalCheckboxChecked, setGlobalCheckboxChecked] = useState(false);
    const [columnWidths, setColumnWidths] = useState(
        headers?.reduce((acc, header) => {
            acc[header] = header.toLowerCase() === 'picture' ? '80px' : '200px'; // Set 80px for "picture", 200px otherwise
            return acc;
        }, { actions: '125px' }) // Default action column width
    );


    const loadColumnWidthsFromCookies = () => {
        const storageKey = `${settings._id}_${settings.firstSheetName}`;
        const savedWidths = localStorage.getItem(storageKey);
        console.log("loading column width: ", JSON.parse(savedWidths));
        return savedWidths ? JSON.parse(savedWidths) : null;

    };

    const saveColumnWidthsToCookies = (columnWidthsTemp) => {
        if (!settings || !settings._id || !settings.firstSheetName) {
            console.warn("Missing settings for generating the storage key.");
            return;
        }

        const storageKey = `${settings._id}_${settings.firstSheetName}`; // Construct the storage key
        try {
            const WidthJSON = JSON.stringify(columnWidthsTemp);
            localStorage.setItem(storageKey, WidthJSON); // Save to localStorage
            console.log(`Column widths saved under key: ${storageKey}`, columnWidthsTemp);
        } catch (error) {
            console.error("Error saving column widths to localStorage:", error);
        }
    };

    const isNumber = (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };

    const isDate = (value) => {
        if (!value || typeof value !== 'string') return false;

        // Match common date patterns (YYYY-MM-DD, DD/MM/YYYY, etc.)
        const datePatterns = [
            /^\d{4}-\d{2}-\d{2}$/,             // YYYY-MM-DD
            /^\d{2}\/\d{2}\/\d{4}$/,           // DD/MM/YYYY or MM/DD/YYYY
            /^\d{2}-\d{2}-\d{4}$/,             // DD-MM-YYYY
            /^\d{4}\/\d{2}\/\d{2}$/            // YYYY/MM/DD
        ];

        // Check if any pattern matches
        if (datePatterns.some((pattern) => pattern.test(value))) {
            const parsedDate = new Date(value);
            return !isNaN(parsedDate.getTime());
        }

        return false;
    };

    function getHeadersWithDateAndNumbers(dataset) {

        if (!Array.isArray(dataset) || dataset.length === 0) {
            return { dateColumns: [], numberColumns: [] };
        }

        const headers = Object.keys(dataset[0]);
        const result = {
            dateColumns: [],
            numberColumns: []
        };

        headers.forEach((header) => {
            const columnValues = dataset.map((row) => row[header]);

            // Check for dates
            const hasDates = columnValues.some((value) => isDate(value));
            if (hasDates) {
                result.dateColumns.push(header);
            }

            // Check for numbers
            const hasNumbers = columnValues.some((value) => isNumber(value));
            if (hasNumbers && header !== "key_id") {
                result.numberColumns.push(header);
            }
        });

        // Filter and map results back to original `unhideHeader` case
        result.dateColumns = unhideHeader?.filter((header) =>
            result.dateColumns.some((col) => col.toLowerCase() === header.toLowerCase().split(" ").join("_"))
        );

        result.numberColumns = unhideHeader?.filter((header) =>
            result.numberColumns.some((col) => col.toLowerCase() === header.toLowerCase().split(" ").join("_"))
        );

        return result;
    }



    const handlePopoverVisibility = (key, isVisible) => {
        setVisiblePopover((prev) => ({
            ...prev,
            [key]: isVisible,
        }));
    };

    const closePopover = (key) => {
        setVisiblePopover((prev) => ({
            ...prev,
            [key]: false,
        }));
    };

    const handleSaveChanges = async (updatedSettings) => {
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
            return response.data;
            // setIsLoading(false);
            // setIsSaveChanges(false);
            // notifySuccess("Settings updated successfully");
            // closeDrawer();
        } catch (error) {
            console.error("Error updating settings in DB:", error);
            notifyError("Error updating settings in DB:", error);
            // setIsLoading(false);
            // setIsSaveChanges(false);
        }
    };

    useEffect(() => {
        const tableSettings = settings?.tableSettings?.length > 0 ? settings.tableSettings[0] : null;
        setHeaderBgColor(tableSettings?.headerBgColor); // Default header background color
        setHeaderTextColor(tableSettings?.headerTextColor); // Default header text color
        setHeaderFontSize(tableSettings?.headerFontSize); // Default header font size
        setHeaderFontFamily(tableSettings?.headerFontStyle); // Default header font family
        setBodyTextColor(tableSettings?.bodyTextColor || '#000000'); // Default body text color
        setBodyFontSize(tableSettings?.bodyFontSize || 12); // Default body font size
        setBodyFontFamily(tableSettings?.bodyFontStyle || 'Poppins'); // Default body font family
    }, [settings]);

    const measureColumnWidths = () => {
        if (tableRef.current) {
            const headers = tableRef.current.querySelectorAll("th");
            const newWidths = { ...columnWidths };

            headers.forEach((header, index) => {
                const actualWidth = header.getBoundingClientRect().width;
                const columnKey = headersList[index]; // Ensure headersList matches your order of headers

                if (actualWidth > newWidths[columnKey]) {
                    newWidths[columnKey] = Math.ceil(actualWidth); // Update width if actual is larger
                }
            });

            console.log({ newWidths });
            setColumnWidths(newWidths); // Update the columnWidths state
        }
    };

    // Calculate minWidth dynamically based on columnWidths
    // const minWidth = Object?.values(columnWidths)?.reduce((sum, width) => sum + width, 0);

    useEffect(() => {
        if (data) {
            setFilteredData(data);
        }
    }, [data])

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);


    const handleResize = (column) =>
        _.throttle((e, { size }) => {
            setColumnWidths((prev) => {
                const updatedWidths = {
                    ...prev,
                    [column]: size.width,
                };

                debounce(() => saveColumnWidthsToCookies(updatedWidths), 500); // Save after resizing stops

                return updatedWidths;
            });
        }, 10); // Throttle updates to ensure responsiveness


    // Function to handle row edit
    const handleEdit = (record) => {
        const editRow = filteredData.find((row) => row.key_id == record);
        setRowToEdit(editRow);
        setConfirmEditModalOpen(true);
    }

    const handleEditCancel = () => {
        setConfirmEditModalOpen(false);
    };

    const handleSaveAPI = async (updatedRow, rowIndex) => {
        const spreadSheetID = settings.spreadsheetId;
        const sheetName = settings.firstSheetName;
        // const newData = Object.values(updatedRow);  // Convert the row object to an array for newData
        const newData = Object.entries(updatedRow)
            .filter(([key]) => key !== 'key_id')  // Filter out the key_id field
            .map(([, value]) => value);  // Map to get only the values
        try {
            const response = await axios.post(`${HOST}/editRow`, {
                spreadSheetID, sheetName, rowIndex, newData,
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,  // Assuming you have the token for auth
                    },
                });
            // Handle successful response (e.g., show success notification)
            const updatedSheetData = convertArrayToJSON(response.data?.updatedSheetData?.values);

            setFilteredData(updatedSheetData);
            notifySuccess("Edited row successfuly!");
        } catch (error) {
            console.error('Error editing row:', error);
            // Handle error response (e.g., show error notification)
        }
    };

    const handleEditRow = async (updatedRow) => {
        try {
            setLoading(true);
            // Call the backend API to update rows in Google Sheets
            const spreadSheetID = settings.spreadsheetId;
            const sheetName = settings.firstSheetName;
            const updatedSheetData = await editMultipleRows(spreadSheetID, sheetName, [updatedRow], formulaData);

            setFilteredData((prev) => {
                return prev.map((item) => {
                    if (item.key_id == updatedRow.key_id) {
                        return [updatedRow].find((editItem) => editItem.key_id === item.key_id);
                    }
                    return item;
                });
            })
            notifySuccess("Rows updated successfully!");

        } catch (err) {
            console.error("Error updating rows:", err.message);
            notifyError(err.message);
        } finally {
            setLoading(false);
            setConfirmEditModalOpen(false);
        }
    };

    // Function to handle the delete action
    const handleDelete = (record) => {
        console.log(`Delete clicked for user with ID: ${record}`);
        setRowToDelete(record);
        setConfirmModalOpen(true);
    }

    const handleDeleteCancel = () => {
        setConfirmModalOpen(false);
    };

    const handleDeleteRow = () => {
        const status = deleteRow(settings.spreadsheetId, settings.firstSheetName, rowToDelete)
        setConfirmModalOpen(false);
        console.log({ status })
        if (status) {
            notifySuccess("Deleted row successfuly!");
        }
    };

    async function deleteRow(spreadSheetID, sheetName, rowIndex) {
        try {
            console.log({ spreadSheetID, sheetName, rowIndex });
            // Make the API call to your backend
            const response = await axios.post(
                `${HOST}/deleteRow`,
                {
                    spreadSheetID,
                    sheetName,
                    rowIndex,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,  // Assuming you have the token for auth
                    },
                }
            );

            // Handle success response
            const updatedData = filteredData.filter((row) => row.key_id != rowIndex - 1);
            setFilteredData(updatedData);
            return response.data;
        } catch (error) {
            // Handle errors
            console.error('Failed to delete row:', error.response?.data?.error || error.message);
            throw error;
        }
    }


    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleAdd = () => {
        const obj = headers.reduce((acc, curr) => {
            acc[curr] = "";
            return acc;
        }, {});
        setRowToEdit(obj);
        setConfirmAddModalOpen(true);
    }

    const handleAddCancel = () => {
        setConfirmAddModalOpen(false);
    };

    const handleAddAPI = async (updatedRow) => {
        const spreadSheetID = settings.spreadsheetId;
        const sheetName = settings.firstSheetName;

        let rowData = updatedRow
        for (let key in formulaData) {
            if (formulaData?.[key] == false) {
                delete rowData[key]
            }
        }


        try {
            const response = await axios.post(`${HOST}/addRow`, {
                spreadSheetID,
                sheetName,
                rowData,
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,  // Assuming you have the token for auth
                    },
                });

            // Handle successful response (e.g., show success notification)
            const updatedSheetData = convertArrayToJSON(response.data?.updatedSheetData?.values);

            setFilteredData(updatedSheetData);
            notifySuccess("Added row successfuly!");
        } catch (error) {
            console.error('Error editing row:', error);
            // Handle error response (e.g., show error notification)
        }
    };

    const handleAddRow = async (updatedRow) => {
        setLoading(true);
        try {
            // Call the API with the updated row data and rowIndex
            await handleAddAPI(updatedRow);

            setConfirmAddModalOpen(false);
        } catch (error) {
            console.error('Error saving row:', error);
        }
        setLoading(false);
    };

    const handleAddBukl = () => {
        setConfirmBulkAddModalOpen(true);
    }

    const handleBulkAddCancel = () => {
        setConfirmBulkAddModalOpen(false);
        setSelectSpreadsheet(null);
    }

    const handleBuldData = (data) => {
        setFilteredData(convertArrayToJSON(data));
        setConfirmBulkAddModalOpen(false);
        setSelectSpreadsheet(null);
    }

    const [openPicker, authResponse] = useDrivePicker();

    // Function to trigger the Google Drive Picker
    const handleOpenPicker = () => {
        openPicker({
            clientId: CLIENTID,
            developerKey: DEVELOPERKEY,
            viewId: "DOCS",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false, // Single file picker for spreadsheet
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button');
                } else if (data.action === 'picked') {
                    const spreadSheetID = data.docs[0].id; // Extract Spreadsheet ID
                    getSpreadsheetDetails(spreadSheetID); // Call the API to get sheet details
                }
            },
        });
    };

    // Function to make an API call to your backend to fetch spreadsheet details
    const getSpreadsheetDetails = async (spreadSheetID) => {

        try {
            const response = await axios.post(`${HOST}/getSpreadsheetDetails`,
                { spreadSheetID },  // Request body
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,  // Assuming you have the token for auth
                    },
                }
            );

            setSelectSpreadsheet(response.data.data);

            // You can now use the spreadsheet details (name, sheet names, URL)
            const { spreadsheetName, sheetNames, sheetUrl } = response.data.data;
        } catch (error) {
            console.error('Error fetching spreadsheet details:', error);
        }
    };

    const [hiddenCol, setHiddenCol] = useState(settings?.hiddenCol || []);

    const handleHeaderSwitch = async (checked, header) => {
        console.log({ checked, header, hiddenCol });
        header = header.toLowerCase()
        let updatedHiddenCol = [];

        // Update the hiddenCol state using its previous value
        setHiddenCol((prevHiddenCol) => {
            if (checked) {
                updatedHiddenCol = [...prevHiddenCol, header]; // Add header if checked
            } else {
                updatedHiddenCol = prevHiddenCol.filter((col) => col !== header); // Remove header if unchecked
            }
            console.log("Inside setHiddenCol Callback:", updatedHiddenCol);
            return updatedHiddenCol; // Return the new array for state update
        });

        // Delay usage of updatedHiddenCol to ensure state updates
        setTimeout(async () => {
            console.log("Updated Hidden Columns after state change:", updatedHiddenCol);

            const updatedSettings = {
                hiddenCol: updatedHiddenCol,
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
                notifySuccess("Hidden Column updated successfully, please refresh the page");
                return response.data;
            } catch (error) {
                console.error("Error updating settings in DB:", error);
                notifyError("Error updating settings in DB:", error);
            }
        }, 0);
    };

    const HeaderSwitch = () => {
        console.log({ unhideHeader, hiddenCol });
        return (
            <div className="flex-row max-h-[300px] overflow-auto px-2">
                {unhideHeader.map((header, index) => {
                    let tempHeader = header.toLowerCase().split(" ").join("_");
                    return (
                        <div className="flex justify-between items-center gap-1">
                            <span>{header}</span>
                            <Switch onChange={(checked) => handleHeaderSwitch(checked, tempHeader)} checked={hiddenCol.includes(tempHeader)} size="small" key={index} label={header} />
                        </div>
                    )
                })}
            </div>
        )
    }




    {/* Dynamically Render Sliders for Selected Checkboxes */ }
    // const [isSearchOpen, setIsSearchOpen] = useState(false);
    // const [isFilterOpen, setIsFilterOpen] = useState(false);
    // const toggleFilterBox = () => {
    //     setIsFilterOpen(!isFilterOpen);
    //     setIsNumberDropdownOpen(false);
    //     setIsDateDropdownOpen(false);
    //     setSelectedNumbers([]); // Clear selected number filters
    //     setSelectedDates([]); // Clear selected date filters
    //     localStorage.removeItem("selectedNumbers");
    //     localStorage.removeItem("selectedDates");
    // };

    //added latest
    const [selectedNumbers, setSelectedNumbers] = useState(
        JSON.parse(localStorage.getItem("selectedNumbers")) || []
    );
    const [selectedDates, setSelectedDates] = useState(
        JSON.parse(localStorage.getItem("selectedDates")) || []
    );
    const toggleNumberDropdown = () => {
        setIsNumberDropdownOpen(!isNumberDropdownOpen);
        setIsDateDropdownOpen(false); // Close date dropdown
    };
    const toggleDateDropdown = () => {
        setIsDateDropdownOpen(!isDateDropdownOpen);
        setIsNumberDropdownOpen(false); // Close number dropdown
    };


    const [isNumberDropdownOpen, setIsNumberDropdownOpen] = useState(false);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

    const [numberFilterColumn, setNumberFilterColumn] = useState(getHeadersWithDateAndNumbers(data).numberColumns);
    const [dateFilterColumn, setDateFilterColumn] = useState(getHeadersWithDateAndNumbers(data).dateColumns);

    const toggleFilterBox = useCallback(() => {
        setIsFilterOpen(!isFilterOpen);
        setIsNumberDropdownOpen(false);
        setIsDateDropdownOpen(false);
        setSelectedNumbers([]); // Clear selected number filters
        setSelectedDates([]); // Clear selected date filters
        localStorage.removeItem("selectedNumbers");
        localStorage.removeItem("selectedDates");
    }, [isFilterOpen, isNumberDropdownOpen, isDateDropdownOpen]);


    const calculate_number_min_max = (data, key) => {
        if (!data || data.length === 0) {
            return { min: null, max: null };
        }

        let min = null;
        let max = null;

        data.forEach((item) => {
            const value = parseFloat(item[key]); // Ensure the value is a number
            if (!isNaN(value)) {
                if (min === null || value < min) min = value;
                if (max === null || value > max) max = value;
            }
        });

        return {
            min: min !== null ? min : 0,
            max: max !== null ? max : 1000,
        };
    };
    const calculate_min_max = (data, key) => {
        console.log({ data, key });
        if (!data || data.length === 0) {
            return { min: null, max: null };
        }

        let min = null;
        let max = null;

        data.forEach((item) => {
            const value = new Date(item[key]).getTime(); // Convert value to timestamp
            if (!isNaN(value)) {
                // Check if it's a valid date
                if (min === null || value < min) min = value;
                if (max === null || value > max) max = value;
            }
        });

        // Return min and max in ISO string format for better use
        return {
            min: min ? new Date(min).toISOString() : null,
            max: max ? new Date(max).toISOString() : null,
        };
    };

    const updatefilterdata = (column, range) => {
        const filteredDatatemp = data.filter((item) => {
            const itemValue = item[column];
            if (itemValue !== null && itemValue !== undefined) {
                return itemValue >= range[0] && itemValue <= range[1];
            }
            return true;
        });
        setFilteredData(filteredDatatemp);
    };

    const updateDateFilterData = (column, value) => {
        // Convert timestamp values back to ISO date strings
        const [startDateTimestamp, endDateTimestamp] = value;
        const startDate = new Date(startDateTimestamp).toISOString();
        const endDate = new Date(endDateTimestamp).toISOString();

        // Create the updated range object
        const range = {
            min: startDate,
            max: endDate,
        };

        // Now call the updatefilterdata function with the updated range (converted back to date strings)
        updatefilterdata(column, range);
    };

    const handleBulkEdit = () => {
        // if(globalCheckboxChecked){
        //     notifyError("Select all works only for delete option");
        //     return;
        // }
        if (ischecked.length > 0) {
            if (isedit) {
                setIsedit(!isedit);
            } else {
                setIsedit(!isedit);
            }
        } else {
            notifyError("Please select at least one row to edit");
        }
    }

    const handleBulkSave = async () => {

        try {

            // if(globalCheckboxChecked){
            //     notifyError("Select all works only for delete option");
            //     return;  
            // }
            // Call the backend API to update rows in Google Sheets
            const spreadSheetID = settings.spreadsheetId;
            const sheetName = settings.firstSheetName;
            const updatedSheetData = await editMultipleRows(spreadSheetID, sheetName, EditData, formulaData);

            console.log("Updated sheet data:", updatedSheetData);

            // Update the filtered data in the frontend after successful API call
            setFilteredData((prev) => {
                return prev.map((item) => {
                    if (ischecked.includes(item.key_id)) {
                        return EditData.find((editItem) => editItem.key_id === item.key_id);
                    }
                    return item;
                });
            });

            notifySuccess("Rows updated successfully!");

        } catch (err) {
            console.error("Error updating rows:", err.message);
            notifyError(err.message);
        } finally {
            // Reset edit and selection state
            setIsedit(!isedit);
            setIschecked([]);
            setEditData([]);
            setGlobalCheckboxChecked(false);
        }
    };

    const handleBulkDelete = () => {
        if (ischecked.length > 0) {
            setConfirmModalOpen(true); // Show confirmation modal
        } else {
            notifyError("Please select at least one row to delete");
        }
    };

    const handleConfirmDelete = async () => {
        try {
            // Close the confirmation modal
            setLoading(true);
            setConfirmModalOpen(false);

            const spreadSheetID = settings.spreadsheetId;
            const sheetName = settings.firstSheetName;
            // Prepare payload for API
            const rowsToDelete = EditData.map((key_id) => ({ key_id: key_id.key_id }));

            if (rowToDelete && EditData.length === 0) {
                const rowsToDelete = [{ key_id: rowToDelete.toString() }];
                console.log({ rowsToDelete });
                const response = await deleteMultiple(spreadSheetID, sheetName, rowsToDelete);
                console.log({ response });

                // Update the filtered data in the frontend after successful API call
                setFilteredData((prev) => {
                    return prev.filter((item) => !(item.key_id == rowToDelete.toString()));
                });
            } else {

                // Call the API
                const response = await deleteMultiple(spreadSheetID, sheetName, rowsToDelete);

                // Update the filtered data in the frontend after successful API call
                setFilteredData((prev) => {
                    return prev.filter((item) => !ischecked.includes(item.key_id));
                });
            }

            // Handle success
            notifySuccess("Rows deleted successfully");
            setIschecked([]);
            setEditData([]);
            setGlobalCheckboxChecked(false);
        } catch (error) {
            // Handle error
            console.error("Error during bulk delete:", error);
            notifyError(error.message || "An error occurred while deleting rows");
        }
        finally {
            setLoading(false);
        }
    };



    return (
        <div>
            <div className="flex text-center justify-between items-center px-[50px]">
                <div className="flex align-center gap-[10px]">
                    <button onClick={() => { setShowTable(false); setIsPCTSettings(false) }} title="Back">
                        <BackIcon />
                    </button>
                    {settings && <EditableSpreadsheetName settings={settings} />}
                </div>
                <div className="flex ">
                    {selectedNumbers.length > 0 && (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {selectedNumbers.map((slider, index) => {
                                const { min, max } = calculate_number_min_max(data, slider.column);
                                return (
                                    <div key={index} className="flex flex-col items-center w-[240px]">
                                        <span className="font-medium text-gray-700 mb-2 text-center text-[14px]">
                                            {slider.column.split("_").join(" ").toUpperCase()}
                                        </span>
                                        <div className="flex flex-col items-center w-full relative">
                                            <Slider
                                                range
                                                value={slider.range || [min, max]}
                                                onChange={(value) => {
                                                    setSelectedNumbers((prev) =>
                                                        prev.map((s) =>
                                                            s.column === slider.column
                                                                ? { ...s, range: value }
                                                                : s
                                                        )
                                                    );
                                                    updatefilterdata(slider.column, value);
                                                }}
                                                min={min}
                                                max={max}
                                                style={{ width: "100%" }}
                                                trackStyle={{ height: "4px" }}
                                                handleStyle={{
                                                    height: "14px",
                                                    width: "14px",
                                                    border: "2px solid #598931",
                                                }}
                                            />
                                            <div className="flex justify-between w-full text-sm text-gray-700 mt-1 ">
                                                <span className="text-[14px]">{slider.range ? slider.range[0] : min}</span>
                                                <span className="text-[14px]">{slider.range ? slider.range[1] : max}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {selectedDates.length > 0 && (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {selectedDates.map((slider, index) => {
                                const { min, max } = calculate_min_max(filteredData, slider.column);
                                const minDate = min
                                    ? new Date(min).getTime()
                                    : new Date("2000-01-01").getTime();
                                const maxDate = max
                                    ? new Date(max).getTime()
                                    : new Date().getTime();

                                return (
                                    <div key={index} className="flex flex-col items-center w-[240px]">
                                        <span className="font-medium text-gray-700 mb-2 text-center text-[14px]">
                                            {slider.column.split("_").join(" ").toUpperCase()}
                                        </span>
                                        <div className="flex flex-col items-center w-full relative">
                                            <Slider
                                                range
                                                value={
                                                    slider.range
                                                        ? slider.range.map((date) => new Date(date).getTime())
                                                        : [minDate, maxDate]
                                                }
                                                onChange={(value) => {
                                                    setSelectedDates((prev) =>
                                                        prev.map((s) =>
                                                            s.column === slider.column
                                                                ? {
                                                                    ...s,
                                                                    range: value.map((ts) =>
                                                                        new Date(ts).toISOString()
                                                                    ),
                                                                }
                                                                : s
                                                        )
                                                    );
                                                }}
                                                min={minDate}
                                                max={maxDate}
                                                step={24 * 60 * 60 * 1000}
                                                style={{ width: "100%" }}
                                                trackStyle={{ height: "4px" }}
                                                handleStyle={{
                                                    height: "14px",
                                                    width: "14px",
                                                    border: "2px solid #598931",
                                                }}
                                            />
                                            <div className="flex justify-between w-full text-sm text-gray-700 mt-1">
                                                <span className="text-[14px]">
                                                    {slider.range
                                                        ? new Date(slider.range[0]).toLocaleDateString("en-GB")
                                                        : min
                                                            ? new Date(min).toLocaleDateString("en-GB")
                                                            : ""}
                                                </span>
                                                <span className="text-[14px]">
                                                    {slider.range
                                                        ? new Date(slider.range[1]).toLocaleDateString("en-GB")
                                                        : max
                                                            ? new Date(max).toLocaleDateString("en-GB")
                                                            : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="flex justify-end items-center">

                    <CatalogueFilter data={data} settings={settings} tempHeader={tempHeader} filteredData={filteredData} setFilteredData={setFilteredData} />

                    {/* <FilterButton data={data} /> */}
                    {!isFilterOpen ? (
                        <button
                            onClick={toggleFilterBox}
                            className="bg-primary rounded-[4px] p-1 border-2 border-white text-white focus:outline-none ml-2"
                            title="Filter"
                        >
                            <img src={numberFilter} alt="Hide" height="16" width="17" />
                        </button>
                    ) : (
                        <div className="w-[115px] h-[41px] flex-shrink-0 rounded-[5.145px] bg-[#598931] border border-gray-300 shadow-lg flex items-center space-x-1 px-2 relative">
                            {/* Number Icon */}
                            <button
                                className="p-1 bg-[#F2FFE8] rounded-md hover:bg-green-200 flex items-center justify-center relative"
                                //  onClick={toggleNumberDropdown}
                                onClick={() => {
                                    toggleNumberDropdown();
                                    // setSelectedDates([]); // Clear date sliders
                                }}
                                title="Number Filter"
                            >
                                <Bs123 className="text-green-900" size={20} />
                            </button>

                            {/* Dropdown for Number */}
                            {isNumberDropdownOpen && (
                                <div className="absolute top-full left-[-50px] mt-1 max-w-[250px] bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50 overflow-auto">
                                    <div className="flex items-center justify-between gap-2 my-2">
                                        <p className="text-sm font-medium text-gray-700 text-center leading-none m-0">
                                            Number Options
                                        </p>
                                        <button
                                            onClick={() => setIsNumberDropdownOpen(false)}
                                            className="text-gray-500 hover:text-gray-800 focus:outline-none"
                                            title="Close"
                                        >
                                            <ImCancelCircle />
                                        </button>
                                    </div>
                                    {/* Render checkboxes dynamically */}
                                    {numberFilterColumn.length > 0 ? (
                                        numberFilterColumn.map((item, index) => {
                                            let tempItem = item
                                            item = item.toLowerCase().split(" ").join("_");

                                            // Determine if the current item is already selected
                                            const isChecked = selectedNumbers.some(
                                                (slider) => slider.column === item
                                            );

                                            return (
                                                <label
                                                    key={index}
                                                    className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                                                >
                                                    {/* Checkbox to toggle range slider */}
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-green-600 flex-shrink-0"
                                                        checked={isChecked} // Bind the checkbox state to the selectedNumbers
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                // Add the item with dynamically calculated range
                                                                const { min, max } = calculate_number_min_max(
                                                                    data,
                                                                    item
                                                                );
                                                                setSelectedNumbers((prev) => [
                                                                    ...prev,
                                                                    { column: item, range: [min, max] },
                                                                ]);
                                                            } else {
                                                                // Remove the item when unchecked
                                                                setSelectedNumbers((prev) =>
                                                                    prev.filter(
                                                                        (slider) => slider.column !== item
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    {/* <span className="text-gray-800 ">{item.replace(/_/g, " ").toUpperCase()}</span> */}
                                                    <span
                                                        className="text-gray-800 truncate"
                                                        style={{
                                                            maxWidth: "250px",
                                                            display: "inline-block",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                        title={tempItem} // Full text displayed on hover
                                                    >
                                                        {tempItem}
                                                    </span>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500">No options available</p>
                                    )}
                                </div>
                            )}

                            {/* Date Icon */}
                            <button
                                className="p-1 bg-[#F2FFE8] rounded-md hover:bg-green-200 flex items-center justify-center relative"
                                onClick={() => {
                                    toggleDateDropdown();
                                    // setSelectedNumbers([]); // Clear number sliders
                                }}
                                title="Date Filter"
                            >
                                <CiCalendarDate className="text-green-900" size={20} />
                            </button>

                            {/* Dropdown for Date */}
                            {isDateDropdownOpen && (
                                <div className="absolute top-full left-[-50px] mt-1 max-w-[250px] bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50 overflow-auto">
                                    <div className="flex items-center justify-between gap-2 my-2">
                                        <p className="text-sm font-medium text-gray-700 text-center leading-none m-0">
                                            Date Options
                                        </p>
                                        <button
                                            onClick={() => setIsDateDropdownOpen(false)}
                                            className="text-gray-500 hover:text-gray-800 focus:outline-none"
                                            title="Close"
                                        >
                                            <ImCancelCircle />
                                        </button>
                                    </div>
                                    {/* Render checkboxes dynamically */}
                                    {dateFilterColumn.length > 0 ? (
                                        dateFilterColumn.map((item, index) => {

                                            let tempItem = item
                                            item = item.toLowerCase().split(" ").join("_");

                                            const isChecked = selectedDates.some(
                                                (slider) => slider.column === item
                                            );

                                            return (
                                                <label
                                                    key={index}
                                                    className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                                                >
                                                    {/* Checkbox to toggle range sliders for dates */}
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-green-600 flex-shrink-0"
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                // Add the item with dynamically calculated range
                                                                const { min, max } = calculate_min_max(
                                                                    filteredData,
                                                                    item
                                                                );
                                                                setSelectedDates((prev) => [
                                                                    ...prev,
                                                                    { column: item, range: [min, max] },
                                                                ]);
                                                            } else {
                                                                // Remove the item when unchecked
                                                                setSelectedDates((prev) =>
                                                                    prev.filter(
                                                                        (slider) => slider.column !== item
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    {/* <span className="text-gray-800">{item.replace(/_/g, " ").toUpperCase()}</span> */}
                                                    <span
                                                        className="text-gray-800 truncate"
                                                        style={{
                                                            maxWidth: "250px",
                                                            display: "inline-block",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                        title={tempItem} // Full text displayed on hover
                                                    >
                                                        {tempItem}
                                                    </span>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500">No options available</p>
                                    )}
                                </div>
                            )}

                            {/* Cancel Icon */}
                            <button
                                onClick={toggleFilterBox}
                                className="p-1 bg-[#598931] rounded-md hover:bg-[#598931] flex items-center justify-center absolute right-2"
                            >
                                <Cancel className="text-green-900" size={20} />
                            </button>
                        </div>
                    )}

                    <GlobalSearch data={data} setFilteredData={setFilteredData} />

                    {isEditMode && <div className="flex items-center">
                        <button onClick={handleAdd} className="mx-2" title="Add Row">
                            <Add />
                        </button>
                        <button className="mr-2" onClick={handleAddBukl} title="Import Data">
                            <BulkAdds />
                        </button>

                        {/* {isedit ?
                            <button onClick={handleBulkSave} className="bg-primary rounded-[4px] p-1 mx-2" title="Save">
                                <IoSaveSharp color="white" />
                            </button>
                            :
                            <button onClick={handleBulkEdit} className="bg-primary rounded-[4px] p-1 mx-2" title="Edit">
                                <MdEdit color="white" />
                            </button>} */}
                        {/* <button onClick={handleBulkDelete} className="bg-primary rounded-[4px] p-[5px]" title="Delete">
                            <MdDelete color="white" />
                        </button> */}

                        <Popover content={<HeaderSwitch />} title="Hide Columns" trigger="click" placement="bottomRight">
                            <button className="mr-1" title="Hide Columns">
                                <div className="bg-primary rounded-[4px] p-1">
                                    <BiSolidHide color="white" size={18} />
                                </div>
                            </button>
                        </Popover>
                    </div>}
                </div>
            </div>

            {/* <DataGrid
                columnResizeMode="onChange"
                rows={data}
                columns={headers.map((col) => {
                    return {
                        field: col,
                        header: col,
                        width: 200,
                    };

                })}
            /> */}

            {!isEditMode ?
                <div>
                    <ProductCatalogueView data={filteredData} headers={headers} settings={settings} tempHeader={tempHeader} />

                    <Table
                        data={data}
                        headers={headers}
                        filteredData={filteredData}
                        setFilteredData={setFilteredData}
                        paginatedData={paginatedData}
                        loading={loading}
                        isEditMode={isEditMode}
                        isedit={isedit}
                        setIsedit={setIsedit}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        settings={settings}
                        freezeCol={freezeCol}
                        setFreezeCol={setFreezeCol}
                        globalOption={globalOption}
                        setGlobalOption={setGlobalOption}
                        ischecked={ischecked}
                        setIschecked={setIschecked}
                        EditData={EditData}
                        setEditData={setEditData}
                        handleBulkDelete={handleBulkDelete}
                        headerBgColor={headerBgColor}
                        headerTextColor={headerTextColor}
                        headerFontSize={headerFontSize}
                        headerFontFamily={headerFontFamily}
                        bodyTextColor={bodyTextColor}
                        bodyFontSize={bodyFontSize}
                        bodyFontFamily={bodyFontFamily}
                        tempHeader={tempHeader}
                        formulaData={formulaData}
                        handleBulkSave={handleBulkSave}
                        globalCheckboxChecked={globalCheckboxChecked}
                        setGlobalCheckboxChecked={setGlobalCheckboxChecked}
                    />
                </div>
                : <Table
                    data={data}
                    headers={headers}
                    filteredData={filteredData}
                    setFilteredData={setFilteredData}
                    paginatedData={paginatedData}
                    loading={loading}
                    isEditMode={isEditMode}
                    isedit={isedit}
                    setIsedit={setIsedit}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    settings={settings}
                    freezeCol={freezeCol}
                    setFreezeCol={setFreezeCol}
                    globalOption={globalOption}
                    setGlobalOption={setGlobalOption}
                    ischecked={ischecked}
                    setIschecked={setIschecked}
                    EditData={EditData}
                    setEditData={setEditData}
                    handleBulkDelete={handleBulkDelete}
                    headerBgColor={headerBgColor}
                    headerTextColor={headerTextColor}
                    headerFontSize={headerFontSize}
                    headerFontFamily={headerFontFamily}
                    bodyTextColor={bodyTextColor}
                    bodyFontSize={bodyFontSize}
                    bodyFontFamily={bodyFontFamily}
                    tempHeader={tempHeader}
                    formulaData={formulaData}
                    handleBulkSave={handleBulkSave}
                    globalCheckboxChecked={globalCheckboxChecked}
                    setGlobalCheckboxChecked={setGlobalCheckboxChecked}
                />

            }
            <EditRow
                isOpen={confirmEditModalOpen}
                onClose={handleEditCancel}
                onConfirm={handleEditRow}
                modelName="Edit Row"
                row={rowToEdit}
                loading={loading}
                formulaData={formulaData}
            />

            {/* <DeleteAlert
                isOpen={confirmModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteRow}
                sheetName={"Are you sure you want to delete this row permanently. "}
            /> */}

            {/* Confirmation modal */}
            <DeleteAlert
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                sheetName={"Are you sure you want to delete selected rows permanently."} // Optional: Provide a dynamic name
            />
            <EditRow
                isOpen={confirmAddModalOpen}
                onClose={handleAddCancel}
                onConfirm={handleAddRow}
                modelName="Add Row"
                row={rowToEdit}
                loading={loading}
                formulaData={formulaData}
            />

            <BulkAdd
                isOpen={confirmBulkAddModalOpen}
                onClose={handleBulkAddCancel}
                openPicker={handleOpenPicker}
                spreadSheetData={selectSpreadsheet}
                handleBuldData={handleBuldData}
            />
        </div>
    );
};

export default ProductCatalogueTable;



// import React from "react";

// const ProductCatalogueTable = () => {
//   console.log("ProductCatalogueTable rendered!");
//   return <div>Product Catalogue Table is now visible!</div>;
// };

// export default ProductCatalogueTable;
