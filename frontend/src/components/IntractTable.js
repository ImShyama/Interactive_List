import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { HOST } from "../utils/constants";
import { Pagination, Input, Avatar, Popover, Checkbox, Space, Button, AutoComplete, Switch } from "antd";
import { BiSearch } from "react-icons/bi";
import { LuFilter } from "react-icons/lu";// added by me
import { CiCalendar } from "react-icons/ci";// added
import { Bs123 } from "react-icons/bs";//added
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { Delete, Edit, BackIcon, Cancel, Dots, Search, Reset, Add, BulkAdds, Sort, Filter, Label } from "../assets/svgIcons";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
// import { FilterOutlined, UserOutlined } from "@ant-design/icons";
import EditRow from "../components/EditRow";
import DeleteAlert from "../components/DeleteAlert";
import EditableSpreadsheetName from "../components/EditableSpreadsheetName";
import { notifySuccess, notifyError } from "../utils/notify";
import BulkAdd from '../components/BulkAdd';
import useDrivePicker from 'react-google-drive-picker';
import { CLIENTID, DEVELOPERKEY } from "../utils/constants.js";
import { useSelector, useDispatch } from "react-redux";
import { updateSetting } from "../utils/settingSlice";
import { BsPin, BsPinAngleFill, BsPinFill } from "react-icons/bs";
import { BiSolidHide } from "react-icons/bi";



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

const IntractTable = ({ data, headers, settings, tempHeader }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen]=useState(false);
    const toggleFilterBox = () => setIsFilterOpen(!isFilterOpen);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmBulkAddModalOpen, setConfirmBulkAddModalOpen] = useState(false);
    const [confirmAddModalOpen, setConfirmAddModalOpen] = useState(false);
    const [selectSpreadsheet, setSelectSpreadsheet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchGlobal, setSearchGlobal] = useState("");
    const [FilterGlobal, setFilterGlobal]=  useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filteredData, setFilteredData] = useState([]);
    const [showInCard, setShowInCard] = useState(settings?.showInCard || []);
    const [showInProfile, setShowInProfile] = useState(settings?.showInProfile || []);
    const [freezeCol, setFreezeCol] = useState(settings?.freezeCol || "");
    const navigate = useNavigate();
    const { token } = useContext(UserContext);
    const dispatch = useDispatch();
    const tableSettings = settings?.tableSettings?.length > 0 ? settings.tableSettings[0] : null;
    const tableRef = useRef(null);

    const [headerBgColor, setHeaderBgColor] = useState(tableSettings?.headerBgColor || '#000000'); // Default header background color
    const [headerTextColor, setHeaderTextColor] = useState(tableSettings?.headerTextColor || '#ffffff'); // Default header text color
    const [headerFontSize, setHeaderFontSize] = useState(tableSettings?.headerFontSize || 14); // Default header font size
    const [headerFontFamily, setHeaderFontFamily] = useState(tableSettings?.headerFontStyle || 'Poppins'); // Default header font family
    const [bodyTextColor, setBodyTextColor] = useState(tableSettings?.bodyTextColor || '#000000'); // Default body text color
    const [bodyFontSize, setBodyFontSize] = useState(tableSettings?.bodyFontSize || 12); // Default body font size
    const [bodyFontFamily, setBodyFontFamily] = useState(tableSettings?.bodyFontStyle || 'Poppins'); // Default body font family


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

    const handleFreezeColumn = async (columnKey, option, event) => {
        const isChecked = event.target.checked;

        setFreezeCol(columnKey);
        const updatedSettings = {
            freezeCol: columnKey
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
            notifySuccess("Freeze Column updated successfully");
            return response.data;
        } catch (error) {
            console.error("Error updating settings in DB:", error);
            notifyError("Error updating settings in DB:", error);
        }
    };

    const handleCheckboxChange = async (columnKey, option, event) => {
        const isChecked = event.target.checked;

        let updatedSettings = {};  // Declare the updatedSettings variable

        if (option === 'showInCard') {
            setShowInCard((prevState) => {
                const updatedState = isChecked
                    ? [...prevState, columnKey] // Add columnKey if checked
                    : prevState.filter((item) => item !== columnKey); // Remove columnKey if unchecked

                updatedSettings = {
                    showInCard: updatedState,
                    showInProfile,  // Assuming this is being set somewhere else in your state
                };

                // Dispatch with updated state
                dispatch(updateSetting(updatedSettings));
                // console.log({ updatedSettings });

                return updatedState;
            });
        } else if (option === 'showInProfileView') {
            setShowInProfile((prevState) => {
                const updatedState = isChecked
                    ? [...prevState, columnKey] // Add columnKey if checked
                    : prevState.filter((item) => item !== columnKey); // Remove columnKey if unchecked

                updatedSettings = {
                    showInCard,  // Assuming this is being set somewhere else in your state
                    showInProfile: updatedState,
                };

                // Dispatch with updated state
                dispatch(updateSetting(updatedSettings));
                // console.log({ updatedSettings });

                return updatedState;
            });
        }

        // console.log({ updatedSettings });
        // // Now call handleSaveChanges with the updatedSettings
        // const response = await handleSaveChanges(settings, token, dispatch,updatedSettings);
        // console.log({ response });
        const response = await handleSaveChanges(updatedSettings);
        console.log({ response });
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


    const [columnWidths, setColumnWidths] = useState(
        headers.reduce((acc, header) => {
            acc[header] = header.toLowerCase() === 'picture' ? 80 : 200; // Set 80px for "picture", 200px otherwise
            return acc;
        }, { actions: 100 }) // Default action column width
    );


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

    useEffect(() => {
        measureColumnWidths(); // Measure on mount
        window.addEventListener("resize", measureColumnWidths); // Re-measure on window resize

        return () => {
            window.removeEventListener("resize", measureColumnWidths);
        };
    }, []);

    // Calculate minWidth dynamically based on columnWidths
    const minWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);


    useEffect(() => {
        if (data) {
            setFilteredData(data);
        }
    }, [data])

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setRowsPerPage(pageSize);
    };

    const handleResize = (column) => (e, { size }) => {
        setColumnWidths((prev) => ({
            ...prev,
            [column]: size.width,
        }));
    };

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
        setLoading(true);
        const rowIndex = +updatedRow.key_id + 1;  // Assuming key_id is the 0-based index, add 1 to get 1-based index for the sheet

        try {
            // Call the API with the updated row data and rowIndex
            await handleSaveAPI(updatedRow, rowIndex);

            setConfirmEditModalOpen(false);
        } catch (error) {
            console.error('Error saving row:', error);
        }
        setLoading(false);
    };

    // Function to handle the delete action
    const handleDelete = (record) => {
        console.log(`Delete clicked for user with ID: ${record}`);
        setRowToDelete(+record + 1);
        setConfirmModalOpen(true);
    }

    const handleDeleteCancel = () => {
        setConfirmModalOpen(false);
    };

    const handleDeleteRow = () => {
        const status = deleteRow(settings.spreadsheetId, settings.firstSheetName, rowToDelete)
        setConfirmModalOpen(false);
        if (status) {
            notifySuccess("Deleted row successfuly!");
        }
    };

    async function deleteRow(spreadSheetID, sheetName, rowIndex) {
        try {
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


    // code added by naveen to add filter icon 
    const handleGlobalFilter = (e) => {
        const value = e.target.value.toLowerCase();
        setFilterGlobal(value);
        // data = convertArrayToJSON(data);

        // Filter the data globally across all columns
        const filteredData = data.filter((record) => {
            return Object.keys(record).some((key) =>
                record[key]?.toString().toLowerCase().includes(value)
            );
        });

        // You can then set this filtered data to a state if needed
        setFilteredData(filteredData);
    };

    const handleGlobalSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchGlobal(value);
        // data = convertArrayToJSON(data);

        // Filter the data globally across all columns
        const filteredData = data.filter((record) => {
            return Object.keys(record).some((key) =>
                record[key]?.toString().toLowerCase().includes(value)
            );
        });

        // You can then set this filtered data to a state if needed
        setFilteredData(filteredData);
    };



    const handleGlobalReset = () => {
        setSearchGlobal("");
        setIsSearchOpen(false);
        setFilteredData(data);
    };
    
   
    // i added
    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => {
        setIsFilterOpen(false);
        handleGlobalReset();
        setFilteredData(data);
    };
    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => {
        setIsSearchOpen(false);
        handleGlobalReset();
        setFilteredData(data);
    };

    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (columnKey) => {
        const newSortOrder =
            sortColumn === columnKey ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

        setSortColumn(columnKey);
        setSortOrder(newSortOrder);

        // Perform sorting
        const sorted = [...filteredData].sort((a, b) => {
            if (typeof a[columnKey] === 'number' && typeof b[columnKey] === 'number') {
                return newSortOrder === 'asc'
                    ? a[columnKey] - b[columnKey]
                    : b[columnKey] - a[columnKey];
            } else {
                return newSortOrder === 'asc'
                    ? a[columnKey]?.toString().localeCompare(b[columnKey]?.toString())
                    : b[columnKey]?.toString().localeCompare(a[columnKey]?.toString());
            }
        });

        setFilteredData(sorted);
    };


    const MultiSelectFilter = ({ columnKey }) => {
        const [selectedValues, setSelectedValues] = useState([]);
        const [searchText, setSearchText] = useState('');

        console.log({filteredData,columnKey});
        // const initialData = [
        //     { label: 'Option 1', value: '1' },
        //     { label: 'Option 2', value: '2' },
        //     { label: 'Option 3', value: '3' },
        //     { label: 'Option 4', value: '4' },
        // ]

        const initialData = filteredData.map((data) => ({
            label: data[columnKey], // The value for the label comes from the columnKey in filteredData
            value: data.key_id,     // Use key_id as the value for initialData
        }));
        
        console.log("Generated Initial Data:", initialData);

        const [options, setOptions] = useState(initialData);

        const handleSelectAll = () => {
            if (selectedValues.length === options.length) {
                setSelectedValues([]);
                return;
            } else {
                setSelectedValues(options.map((option) => option.value));
            }
            // const selectedOptions = options.map((option) => option.value);
            // setSelectedValues(selectedOptions);
        }

        const handleSelect = (value) => {
            if (selectedValues.includes(value)) {
                setSelectedValues(selectedValues.filter(item => item !== value));
            } else {
                setSelectedValues([...selectedValues, value]);
            }
        };

        // code added by naveen to handle filter 
        

        const handleSearch = (searchText) => {
            // setSearchText(searchText);
            console.log(options);
            if (searchText) {
                const filteredOptions = initialData.filter(option =>
                    option.label.toLowerCase().includes(searchText.toLowerCase())
                );
                setOptions(filteredOptions);
            } else {
                setOptions(initialData);
            }
        };

        return (
            <div className="flex-row justify-between items-center" style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <div className="flex justify-between">
                    
                    <Button
                        type="primary"
                        // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 80 }}
                    >
                        Search
                    </Button>
                    <Button
                        // onClick={() => {
                        //     handleReset(clearFilters, dataIndex);
                        //     confirm({ closeDropdown: false });
                        //     setSearchText(selectedKeys[0]);
                        //     setSearchedColumn(dataIndex);
                        // }}
                        size="small"
                        style={{ width: 80 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                    // onClick={() => {
                    //     close();
                    // }}
                    >
                        close
                    </Button>
                </div>
                <div className="">
                    <Checkbox className="mr-2 pl-1 border border-primary text-primary rounded-md" onChange={() => handleSelectAll()} checked={selectedValues.length === options.length} value="all">ALL</Checkbox>
                    <AutoComplete
                        style={{
                            paddingTop: 8,
                            width: 200,
                        }}
                        // onSearch={handleSearch}
                        placeholder="input here"
                        filterOption={false}
                        // onChange={handleSearch}
                        // value={searchText}
                        onSearch={handleSearch}
                    >
                        {options.map((option) => (
                            <AutoComplete.Option key={option.value}><Checkbox onChange={() => handleSelect(option.value)} checked={selectedValues.includes(option.value)} value={option.value}>{option.label}</Checkbox></AutoComplete.Option>
                        ))}
                    </AutoComplete>
                </div>
            </div>
        )
    };

    // const renderResizableHeader = (title, columnKey) => (
    //     <Resizable
    //         width={columnWidths[columnKey]}
    //         height={0}
    //         onResize={handleResize(columnKey)}
    //         draggableOpts={{ enableUserSelectHack: false }}
    //     >
    //         <th
    //             className="px-4 py-4 border-r border-gray-300"
    //             style={{
    //                 width: `${columnWidths[columnKey]}px`,
    //                 minWidth: `${columnWidths[columnKey]}px`,
    //                 zIndex: 10,
    //                 whiteSpace: "nowrap",
    //                 backgroundColor: headerBgColor,  // Background color logic
    //                 color: headerTextColor, // Text color logic
    //                 fontFamily: headerFontFamily, // Add the font family
    //                 fontSize: `${headerFontSize}px`, // Add the font size and ensure it's in 'px' or another unit

    //             }}
    //         >
    //             <div className="flex justify-between items-center gap-3">
    //                 <div><span>{title.replace(/_/g, " ").toUpperCase()}</span></div>
    //                 <div className="flex items-center gap-1">
    //                     <button onClick={() => handleSort(columnKey)}>
    //                         <Sort />
    //                     </button>

    //                     <button >
    //                         <Filter />
    //                     </button>

    //                     <button>
    //                         <Label />
    //                     </button>

    //                     {
    //                         freezeCol.includes(columnKey) ?
    //                             <button >
    //                                 <BsPinAngleFill />
    //                             </button>
    //                             :
    //                             <button onClick={(e) => handleFreezeColumn(columnKey, 'showInProfile', e)}>
    //                                 <BsPin />
    //                             </button>
    //                     }

    //                     {/* Dots Button with Popover */}
    //                     <Popover content={
    //                         <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    //                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    //                                 {freezeCol.includes(columnKey) ?
    //                                     <BsPinAngleFill />
    //                                     :
    //                                     <button onClick={(e) => handleFreezeColumn(columnKey, 'showInCard', e)}>
    //                                         <BsPin />
    //                                     </button>
    //                                     // <BsPin onChange={(e) => handleFreezeColumn(columnKey, 'showInCard', e)} />
    //                                 }


    //                                 {/* <Checkbox checked={showInCard.includes(columnKey)} onChange={(e) => handleFreezeColumn(columnKey,'showInCard', e)} /> */}
    //                                 <span>Freeze Column</span>
    //                             </div>
    //                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    //                                 <Checkbox checked={showInProfile.includes(columnKey)} onChange={(e) => handleCheckboxChange(columnKey, 'showInProfileView', e)} />
    //                                 <span>Hide Column</span>
    //                             </div>
    //                         </div>
    //                     } title="More Actions" trigger="click" placement="bottom">
    //                         <button>
    //                             <Dots />
    //                         </button>
    //                     </Popover>
    //                 </div>


    //             </div>
    //             {/* <div className="flex justify-between items-center">
    //                 <span>{title.replace(/_/g, " ").toUpperCase()}</span>
    //             </div> */}
    //         </th>
    //     </Resizable>
    // );

    // let leftOffset = 60
    const renderResizableHeader = (title, columnKey, index) => {
        const isPinned = headers.slice(0, headers.indexOf(freezeCol) + 1).includes(columnKey); // Check if the column is within the pinned range
        const leftOffset =
            (index === 0 ? 100 : 0) + // Add 60px only for the first column
            headers
                .slice(0, index) // Get all columns before the current one
                .reduce((sum, key) => sum + columnWidths[key], 0); // Sum the widths of previous columns

        return (
            <Resizable
                width={columnWidths[columnKey]}
                height={0}
                onResize={handleResize(columnKey)}
                draggableOpts={{ enableUserSelectHack: false }}
            >
                <th
                    className="px-4 py-4 border-r border-gray-300"
                    style={{
                        width: `${columnWidths[columnKey]}px`,
                        minWidth: `${columnWidths[columnKey]}px`,
                        zIndex: isPinned ? 100 : 10, // Adjust z-index for proper stacking
                        position: isPinned ? "sticky" : "relative", // Sticky only if pinned
                        left: isPinned ? `${leftOffset}px` : "auto", // Offset only if pinned
                        backgroundColor: isPinned ? "#fff" : headerBgColor, // Solid background for pinned headers
                        color: isPinned ? "#000" : headerTextColor, // Text color
                        whiteSpace: "nowrap",
                        fontFamily: headerFontFamily, // Font family
                        fontSize: `${headerFontSize}px`, // Font size
                    }}
                >
                    <div
                        className="flex justify-between items-center gap-3"
                        style={{
                            zIndex: isPinned ? 100 : "inherit", // Ensure child elements respect z-index
                            position: "relative", // Keep elements aligned
                        }}
                    >
                        <div>
                            <span>{title.replace(/_/g, " ").toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => handleSort(columnKey)}>
                                <Sort />
                            </button>

                            <Popover
                                content={
                                    <MultiSelectFilter columnKey={columnKey} />
                                }

                                trigger="click"
                                placement="bottom"
                            >
                                <button>
                                    <Filter className="text-white"/>
                                </button>
                            </Popover>
                            <button>
                                <Label />
                            </button>
                            {freezeCol.includes(columnKey) ? (
                                <button>
                                    <BsPinAngleFill />
                                </button>
                            ) : (
                                <button onClick={(e) => handleFreezeColumn(columnKey, "showInProfile", e)}>
                                    <BsPin />
                                </button>
                            )}
                            {/* <Popover
                                content={
                                    <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Checkbox
                                                checked={showInCard.includes(columnKey)}
                                                onChange={(e) => handleCheckboxChange(columnKey, "showInCard", e)}
                                            />
                                            <span>Show in Card</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Checkbox
                                                checked={showInProfile.includes(columnKey)}
                                                onChange={(e) => handleCheckboxChange(columnKey, "showInProfileView", e)}
                                            />
                                            <span>Show in Profile</span>
                                        </div>
                                    </div>
                                }
                                title="More Actions"
                                trigger="click"
                                placement="bottom"
                            >
                                <button>
                                    <Dots />
                                </button>
                            </Popover> */}
                        </div>
                    </div>
                </th>
            </Resizable>
        );
    };


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
        // const newData = Object.values(updatedRow);  // Convert the row object to an array for newData
        const rowData = Object.entries(updatedRow)
            .filter(([key]) => key !== 'key_id')  // Filter out the key_id field
            .map(([, value]) => value);  // Map to get only the values


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

    const [hiddenCol, setHiddenCol] = useState(settings.hiddenCol || []);

    // const handleHeaderSwitch = async(checked, header) => {
    //     if (checked) {
    //         setHiddenCol([...hiddenCol, header]);
    //     } else {
    //         setHiddenCol(hiddenCol.filter((col) => col !== header));
    //     }

    //     const updatedSettings = {
    //         hiddenCol: hiddenCol
    //     };

    //     // Dispatch with updated state
    //     dispatch(updateSetting(updatedSettings));

    //     try {
    //         // Update the settings in the backend
    //         const response = await axios.put(
    //             `${HOST}/spreadsheet/${settings._id}`,
    //             { ...settings, ...updatedSettings }, // Merge existing settings with updates
    //             {
    //                 headers: {
    //                     authorization: "Bearer " + token,
    //                 },
    //             }
    //         );

    //         console.log("Settings updated successfully:", response.data);

    //         // Dispatch updated settings to Redux store
    //         dispatch(updateSetting(response.data));
    //         notifySuccess("Hidden Column updated successfully");
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error updating settings in DB:", error);
    //         notifyError("Error updating settings in DB:", error);
    //     }
    // };

    const handleHeaderSwitch = async (checked, header) => {
        let updatedHiddenCol;
    
        // Update the hiddenCol state using its previous value
        setHiddenCol((prevHiddenCol) => {
            if (checked) {
                updatedHiddenCol = [...prevHiddenCol, header];
            } else {
                updatedHiddenCol = prevHiddenCol.filter((col) => col !== header);
            }
            return updatedHiddenCol;
        });
    
        // Use the updatedHiddenCol value to ensure consistency
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
            notifySuccess("Hidden Column updated successfully");
            return response.data;
        } catch (error) {
            console.error("Error updating settings in DB:", error);
            notifyError("Error updating settings in DB:", error);
        }
    };
    
    const HeaderSwitch = () => {
        return (
            <div className="flex-row max-h-[300px] overflow-auto">
                {tempHeader.map((header, index) => (
                    <div className="flex justify-between items-center gap-1">
                        <span>{header.split("_").join(" ").toUpperCase()}</span>
                        <Switch onChange={(checked) => handleHeaderSwitch(checked, header)} checked={hiddenCol.includes(header)} size="small" key={index} label={header} />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div>
            <div className="flex text-center justify-between items-center px-[50px]">
                <div className="flex align-center gap-[10px]">
                    
                    <button onClick={() => navigate(-1)}>
                        <BackIcon />
                    </button>
                    {settings && <EditableSpreadsheetName settings={settings} />}
                </div>
                
                  {/* Filter icon update */}

                    <div className="flex justify-end items-center relative ">
                    {/* Conditional Rendering of Filter Icon or Filter Box */}
                    {!isFilterOpen ? (
                        <button
                            onClick={toggleFilterBox}
                            className="bg-primary rounded-[4px] p-1 mx-2 border-2 border-white text-white focus:outline-none"
                        >
                            <LuFilter className="text-white" size={18} />  
                        </button>
                    ) : (
                        <div className="w-[155px] h-[41px] flex-shrink-0 rounded-[5.145px] bg-[#598931] border border-gray-300 shadow-lg flex items-center space-x-1  px-2 relative">
                            {/* Number Icon */}
                            <button className="p-1 bg-[#F2FFE8] rounded-md hover:bg-green-200 flex items-center justify-center">
                                <Bs123 className="text-green-900" size={20} />
                            </button>
                            {/* Calendar Icon */}
                            <button className="p-1 bg-[#F2FFE8] rounded-md hover:bg-green-200 flex items-center justify-center">
                                <CiCalendar className="text-green-900" size={20} />
                            </button>
                            {/* Cancel Icon */}
                            <button
                                onClick={toggleFilterBox}
                                className="p-1 bg-[#598931] rounded-md hover:bg-[#598931] flex items-center justify-center absolute right-2"
                            >
                                <Cancel className="text-green-900" size={20} />
                            </button>
                        </div>
                    )}

                    {isSearchOpen && (
                        <Input
                            prefix={<BiSearch />}
                            value={searchGlobal}
                            onChange={handleGlobalSearch}
                            style={{ width: "200px" }}
                            className="min-w-[150px] px-4 py-1 mx-2"
                            placeholder="Search"
                        />
                    )}
                    {isSearchOpen && (
                        <button onClick={closeSearch} className="bg-primary rounded-[4px] p-1 mr-2">
                            <Cancel />
                        </button>
                    )}
                    {!isSearchOpen && (
                        <button onClick={openSearch} className="bg-primary rounded-[4px] p-1 mx-2">
                            <Search />
                        </button>
                    )}
                    <button onClick={handleGlobalReset} className="bg-primary rounded-[4px] p-1">
                        <Reset />
                    </button>
                    
                    <button onClick={handleAdd} className="mx-2">
                        <Add />
                    </button>
                    <button onClick={handleAddBukl}>
                        <BulkAdds />
                    </button>

                    <Popover content={<HeaderSwitch />} title="Hide Columns" trigger="click" placement="bottomRight">
                        <button className="mx-2" >
                            <div className="bg-primary rounded-[4px] p-1">
                                <BiSolidHide color="white" size={17} />
                            </div>
                        </button>
                    </Popover>
                </div>
            </div>
            <div className="px-[50px] py-[10px]">
                <div className="overflow-x-auto">
                    <div
                        className="min-w-full relative"
                        style={{
                            maxHeight: "500px",
                            overflowY: "auto",
                        }}
                    >
                        <table
                            className="border border-gray-300 rounded-t-lg bg-white"
                            style={{
                                tableLayout: "auto",
                                minWidth: { minWidth },
                                width: "100%",
                            }}
                        >
                            <thead className="sticky top-0 bg-gray-100 z-20">
                                <tr className="text-gray-700 text-left">
                                    <th
                                        className="px-4 py-4 border-r border-gray-300"
                                        style={{
                                            width: `${columnWidths.actions}px`,
                                            position: "sticky",
                                            left: 0,
                                            background: "#fff",
                                            // width: `${columnWidths.actions}px`,
                                            // position: "sticky",
                                            // left: 0,
                                            // zIndex: 1000,
                                            // backgroundColor: headerBgColor,  // Background color logic
                                            // color: headerTextColor, // Text color logic
                                            // fontFamily: headerFontFamily, // Add the font family
                                            // fontSize: `${headerFontSize}px`, // Add the font size and ensure it's in 'px' or another unit
                                        }}
                                    >
                                        Actions
                                    </th>
                                    {headers.map((header, index) => renderResizableHeader(header, header, index))}
                                </tr>
                            </thead>
                            <tbody className="people_table">
                                {paginatedData.map((item) => (
                                    <tr key={item.key_id} className="hover:bg-gray-50">
                                        <td
                                            className="px-4 py-2 border-x border-gray-300"
                                            style={{
                                                width: `${columnWidths.actions}px`,
                                                position: "sticky",
                                                left: 0,
                                                background: "#fff",

                                            }}
                                        >
                                            <div className="flex gap-[10px] align-center">
                                                <button
                                                    className="rounded-full bg-[#DDDCDB] flex w-[28px] h-[28px] justify-center items-center"
                                                    onClick={() => handleEdit(item.key_id)}
                                                >
                                                    <Edit />
                                                </button>
                                                <button
                                                    className="rounded-full bg-[#DDDCDB] flex w-[28px] h-[28px] justify-center items-center"
                                                    onClick={() => handleDelete(item.key_id)}
                                                >
                                                    <Delete />
                                                </button>
                                            </div>
                                        </td>
                                        {headers.map((header, index) => {
                                            const isPinned = headers.slice(0, headers.indexOf(freezeCol) + 1).includes(header);
                                            // const isPinned = headers.slice(0, headers.indexOf(freezeCol) + 1).includes(columnKey); // Check if the column is within the pinned range
                                            const leftOffset =
                                                (index === 0 ? 100 : 0) + // Add 60px only for the first column
                                                headers
                                                    .slice(0, index) // Get all columns before the current one
                                                    .reduce((sum, key) => sum + columnWidths[key], 0); // Sum the widths of previous columns


                                            return (
                                                <td
                                                    key={header}
                                                    className="px-4 py-2 border-r border-gray-300"
                                                    style={{
                                                        // width: `${columnWidths[header]}px`,
                                                        // position: isPinned ? "sticky" : "relative",
                                                        // left: isPinned ? `${leftOffset}px` : "auto",
                                                        // background: isPinned ? "#fff" : "transparent", // Keep pinned columns white

                                                        width: `${columnWidths[header]}px`,
                                                        minWidth: `${columnWidths[header]}px`,
                                                        zIndex: isPinned ? 100 : 10, // Adjust z-index for proper stacking
                                                        position: isPinned ? "sticky" : "relative", // Sticky only if pinned
                                                        left: isPinned ? `${leftOffset}px` : "auto", // Offset only if pinned
                                                        backgroundColor: isPinned ? "#fff" : null, // Solid background for pinned headers
                                                        color: isPinned ? "#000" : bodyTextColor, // Text color
                                                        whiteSpace: "nowrap",
                                                        fontFamily: bodyFontFamily, // Font family
                                                        fontSize: `${headerFontSize}px`, // Font size
                                                    }}
                                                >
                                                    <div className="tableTD w-full h-full flex items-center"
                                                        style={{
                                                            zIndex: isPinned ? 100 : "inherit", // Ensure child elements respect z-index
                                                            position: "relative", // Keep elements aligned
                                                        }}
                                                    >
                                                        {header.toLowerCase() === "picture" ? (
                                                            <div className="w-full h-full flex justify-center items-center">
                                                                {isValidUrl(item[header]) ? (
                                                                    <img
                                                                        src={item[header]}
                                                                        alt="profile"
                                                                        className="w-12 h-12 rounded-full border-[1px] border-[#D3CBCB] object-cover"
                                                                    />
                                                                ) : (
                                                                    <Avatar size={48} icon={<UserOutlined />} alt="User" />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            item[header] || "N/A"
                                                        )}
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Pagination
                        current={currentPage}
                        total={filteredData.length}
                        pageSize={rowsPerPage}
                        onChange={handlePageChange}
                        showSizeChanger={true}
                    />
                </div>
            </div>
            <EditRow
                isOpen={confirmEditModalOpen}
                onClose={handleEditCancel}
                onConfirm={handleEditRow}
                modelName="Edit Row"
                row={rowToEdit}
                loading={loading}
            />
            <DeleteAlert
                isOpen={confirmModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteRow}
                sheetName="this row"
            />
            <EditRow
                isOpen={confirmAddModalOpen}
                onClose={handleAddCancel}
                onConfirm={handleAddRow}
                modelName="Add Row"
                row={rowToEdit}
                loading={loading}
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

export default IntractTable;
