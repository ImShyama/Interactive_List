import React, { useState, useMemo, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { HOST } from "../../utils/constants";
import { Pagination, Input, Avatar, Popover, Checkbox } from "antd";
import { BiSearch } from "react-icons/bi";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { Delete, Edit, BackIcon, Cancel, Dots, Search, Reset, Add, BulkAdds, Sort } from "../../assets/svgIcons";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import EditRow from "../../components/EditRow";
import DeleteAlert from "../../components/DeleteAlert";
import EditableSpreadsheetName from "../../components/EditableSpreadsheetName";
import { notifySuccess, notifyError } from "../../utils/notify";
import BulkAdd from '../../components/BulkAdd';
import useDrivePicker from 'react-google-drive-picker';
import { CLIENTID, DEVELOPERKEY } from "../../utils/constants.jsx";
import { useSelector, useDispatch } from "react-redux";
import { updateSetting } from "../../utils/settingSlice";
import { handleSaveChanges } from "../../APIs/index.jsx";


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

const PeopleTable = ({ data, headers, settings }) => {
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
    const navigate = useNavigate();
    const { token } = useContext(UserContext);
    const dispatch = useDispatch();
    const tableSettings = settings?.tableSettings?.length > 0 ? settings.tableSettings[0] : null;

    const [headerBgColor, setHeaderBgColor] = useState(tableSettings?.headerBgColor || '#000000'); // Default header background color
    const [headerTextColor, setHeaderTextColor] = useState(tableSettings?.headerTextColor || '#ffffff'); // Default header text color
    const [headerFontSize, setHeaderFontSize] = useState(tableSettings?.headerFontSize || 14); // Default header font size
    const [headerFontFamily, setHeaderFontFamily] = useState(tableSettings?.headerFontStyle || 'Poppins'); // Default header font family
    const [bodyTextColor, setBodyTextColor] = useState(tableSettings?.bodyTextColor || '#000000'); // Default body text color
    const [bodyFontSize, setBodyFontSize] = useState(tableSettings?.bodyFontSize || 12); // Default body font size
    const [bodyFontFamily, setBodyFontFamily] = useState(tableSettings?.bodyFontStyle || 'Poppins'); // Default body font family


    // Handler for checkbox changes
    // const handleCheckboxChange = (columnKey, option, event) => {
    //     console.log(`Column Key: ${columnKey}, Option: ${option}, Checked: ${event.target.checked}`);
    //     // Add logic to update state or backend
    //     if(option == 'showInCard') {
    //         setShowInCard(prevState => {
    //             const updatedState = prevState.includes(columnKey) ? prevState.filter(item => item !== columnKey) : [...prevState, columnKey];
    //             return updatedState;
    //         });
    //     } else if(option == 'showInProfileView') {
    //         setShowInProfile(prevState => {
    //             const updatedState = prevState.includes(columnKey) ? prevState.filter(item => item !== columnKey) : [...prevState, columnKey];
    //             return updatedState;
    //         });
    //     }

    //     const updatedSettings = {
    //         showInCard: showInCard,
    //         showInProfile: showInProfile,
    //       };
    //       dispatch(updateSetting(updatedSettings));
    //       console.log({updatedSettings})
    //       console.log({ showInCard, showInProfile });
    //       console.log("Updated settings:", settings);
    // };

    // const handleCheckboxChange = async(columnKey, option, event) => {
    //     const isChecked = event.target.checked;

    //     console.log(`Column Key: ${columnKey}, Option: ${option}, Checked: ${isChecked}`);

    //     if (option === 'showInCard') {
    //         setShowInCard((prevState) => {
    //             const updatedState = isChecked
    //                 ? [...prevState, columnKey] // Add columnKey if checked
    //                 : prevState.filter((item) => item !== columnKey); // Remove columnKey if unchecked

    //             // Dispatch with updated state
    //             const updatedSettings = {
    //                 showInCard: updatedState,
    //                 showInProfile,
    //             };
    //             dispatch(updateSetting(updatedSettings));
    //             console.log({ updatedSettings });

    //             // await handleSaveChanges(updatedSettings);

    //             return updatedState;
    //         });
    //     } else if (option === 'showInProfileView') {
    //         setShowInProfile((prevState) => {
    //             const updatedState = isChecked
    //                 ? [...prevState, columnKey] // Add columnKey if checked
    //                 : prevState.filter((item) => item !== columnKey); // Remove columnKey if unchecked

    //             // Dispatch with updated state
    //             const updatedSettings = {
    //                 showInCard,
    //                 showInProfile: updatedState,
    //             };
    //             dispatch(updateSetting(updatedSettings));
    //             console.log({ updatedSettings });

    //             // await handleSaveChanges(updatedSettings);

    //             return updatedState;
    //         });
    //     }

    //     await handleSaveChanges(updatedSettings);
    // };

    

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

    const handleCheckboxChange = async (columnKey, option, event) => {
        const isChecked = event.target.checked;

        console.log(`Column Key: ${columnKey}, Option: ${option}, Checked: ${isChecked}`);

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
        console.log("Settings:", settings);
        const tableSettings = settings?.tableSettings?.length > 0 ? settings.tableSettings[0] : null;

        setHeaderBgColor(tableSettings?.headerBgColor); // Default header background color
        setHeaderTextColor(tableSettings?.headerTextColor); // Default header text color
        setHeaderFontSize(tableSettings?.headerFontSize); // Default header font size
        setHeaderFontFamily(tableSettings?.headerFontStyle); // Default header font family

        // setBodyBgColor(tableSettings?.bodyBgColor || '#ffffff'); // Default body background color
        setBodyTextColor(tableSettings?.bodyTextColor || '#000000'); // Default body text color
        setBodyFontSize(tableSettings?.bodyFontSize || 12); // Default body font size
        setBodyFontFamily(tableSettings?.bodyFontStyle || 'Poppins'); // Default body font family
    }, [settings]);


    const [columnWidths, setColumnWidths] = useState(
        headers.reduce((acc, header) => {
            acc[header] = header.toLowerCase() === 'picture' ? 80 : 200; // Set 80px for "picture", 200px otherwise
            return acc;
        }, { actions: 60 }) // Default action column width
    );


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
    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => {
        setIsSearchOpen(false);
        handleGlobalReset();
        setFilteredData(data);
    };

    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    // const handleSort = (columnKey) => {
    //     const newSortOrder = sortColumn === columnKey ? sortOrder === 'asc' ? 'desc' : 'asc' : 'asc';
    //     setSortColumn(columnKey);
    //     setSortOrder(newSortOrder);
    // };

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


    const renderResizableHeader = (title, columnKey) => (
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
                    whiteSpace: "nowrap",
                    backgroundColor: headerBgColor,  // Background color logic
                    color: headerTextColor, // Text color logic
                    fontFamily: headerFontFamily, // Add the font family
                    fontSize: `${headerFontSize}px`, // Add the font size and ensure it's in 'px' or another unit
                }}
            >
                <div className="flex justify-between items-center">
                    <div><span>{title.replace(/_/g, " ").toUpperCase()}</span></div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => handleSort(columnKey)}>
                            <Sort />
                        </button>

                        {/* Dots Button with Popover */}
                        <Popover content={
                            <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Checkbox checked={showInCard.includes(columnKey)} onChange={(e) => handleCheckboxChange(columnKey, 'showInCard', e)} />
                                    <span>Show in Card</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Checkbox checked={showInProfile.includes(columnKey)} onChange={(e) => handleCheckboxChange(columnKey, 'showInProfileView', e)} />
                                    <span>Show in Profile View</span>
                                </div>
                            </div>
                        } title="More Actions" trigger="hover" placement="bottom">
                            <button>
                                <Dots />
                            </button>
                        </Popover>
                    </div>


                </div>
                {/* <div className="flex justify-between items-center">
                    <span>{title.replace(/_/g, " ").toUpperCase()}</span>
                </div> */}
            </th>
        </Resizable>
    );

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

    return (
        <div >
            <div className="flex text-center justify-between items-center px-[50px]">
                <div className="flex align-center gap-[10px]">
                    <button onClick={() => navigate(-1)}>
                        <BackIcon />
                    </button>
                    {settings && <EditableSpreadsheetName settings={settings} />}
                </div>
                <div className="flex justify-end items-center">
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
                                minWidth: "5000px",
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
                                            zIndex: 10,
                                            backgroundColor: headerBgColor,  // Background color logic
                                            color: headerTextColor, // Text color logic
                                            fontFamily: headerFontFamily, // Add the font family
                                            fontSize: `${headerFontSize}px`, // Add the font size and ensure it's in 'px' or another unit
                                        }}
                                    >
                                        Actions
                                    </th>
                                    {headers.map((header) => renderResizableHeader(header, header))}
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
                                        {headers.map((header) => (
                                            <td
                                                key={header}
                                                className="px-4 py-2 border-r border-gray-300"
                                                style={{
                                                    width: `${columnWidths[header]}px`,
                                                    color: bodyTextColor, // Text color logic
                                                    fontFamily: bodyFontFamily, // Add the font family
                                                    fontSize: `${bodyFontSize}px`,
                                                }}
                                            >
                                                <div className="tableTD w-full h-full flex items-center">
                                                    {header.toLowerCase() == "picture" ? (
                                                        <div className="w-full h-full flex justify-center items-center">
                                                            {isValidUrl(item[header]) ? (
                                                                <img
                                                                    src={item[header]}
                                                                    alt="profile"
                                                                    className="w-12 h-12 rounded-full border-[1px] border-[#D3CBCB] object-cover"
                                                                />)
                                                                :
                                                                (<Avatar size={48} icon={<UserOutlined />} alt="User" />)
                                                            }
                                                        </div>
                                                    ) : (
                                                        item[header] || "N/A"
                                                    )}
                                                </div>
                                            </td>
                                        ))}
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

export default PeopleTable;
