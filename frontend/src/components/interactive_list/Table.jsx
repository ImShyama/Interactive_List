import { memo, useState, useEffect, useMemo } from "react";
import { Table as AntTable, Pagination, Checkbox } from "antd";
import { Delete, Edit } from "../../assets/svgIcons";
import { RxDividerVertical } from "react-icons/rx";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import ResizableHeader from "./ResizableHeader";
import _, { debounce } from "lodash";

const Table = ({ data, filteredData, setFilteredData, headers, settings, isedit, setIsedit, setFreezeCol, freezeCol,
    handleDelete, handleEdit, handleBulkDelete, ischecked, setIschecked, EditData, setEditData, headerBgColor, headerTextColor, headerFontSize, headerFontFamily,
    bodyTextColor, bodyFontSize, bodyFontFamily, isEditMode, minWidth, tempHeader
}) => {

    // const [ischecked, setIschecked] = useState([]);
    const [globalOption, setGlobalOption] = useState({});
    const [visiblePopover, setVisiblePopover] = useState({});
    // const [EditData, setEditData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
    const [columnWidths, setColumnWidths] = useState(
        headers.reduce((acc, header) => {
            acc[header] = header.toLowerCase() === 'picture' ? '80px' : '200px'; // Set 80px for "picture", 200px otherwise
            return acc;
        }, { actions: '125px' }) // Default action column width
    );


    const loadColumnWidthsFromCookies = () => {
        const storageKey = `${settings?._id}_${settings?.firstSheetName}`;
        const savedWidths = localStorage.getItem(storageKey);
        console.log("loading column width: ", JSON.parse(savedWidths));
        return savedWidths ? JSON.parse(savedWidths) : null;
    };

    // const handleCheckboxChange = async (columnKey, option, event) => {
    //     const isChecked = event.target.checked;

    //     let updatedSettings = {};  // Declare the updatedSettings variable

    //     if (option === 'showInCard') {
    //         setShowInCard((prevState) => {
    //             const updatedState = isChecked
    //                 ? [...prevState, columnKey] // Add columnKey if checked
    //                 : prevState.filter((item) => item !== columnKey); // Remove columnKey if unchecked

    //             updatedSettings = {
    //                 showInCard: updatedState,
    //                 showInProfile,  // Assuming this is being set somewhere else in your state
    //             };

    //             // Dispatch with updated state
    //             dispatch(updateSetting(updatedSettings));
    //             // console.log({ updatedSettings });

    //             return updatedState;
    //         });
    //     } else if (option === 'showInProfileView') {
    //         setShowInProfile((prevState) => {
    //             const updatedState = isChecked
    //                 ? [...prevState, columnKey] // Add columnKey if checked
    //                 : prevState.filter((item) => item !== columnKey); // Remove columnKey if unchecked

    //             updatedSettings = {
    //                 showInCard,  // Assuming this is being set somewhere else in your state
    //                 showInProfile: updatedState,
    //             };

    //             // Dispatch with updated state
    //             dispatch(updateSetting(updatedSettings));
    //             // console.log({ updatedSettings });

    //             return updatedState;
    //         });
    //     }

    //     // console.log({ updatedSettings });
    //     // // Now call handleSaveChanges with the updatedSettings
    //     // const response = await handleSaveChanges(settings, token, dispatch,updatedSettings);
    //     // console.log({ response });
    //     const response = await handleSaveChanges(updatedSettings);
    //     console.log({ response });
    // };

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

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setRowsPerPage(pageSize);
    };

    function getElementWidthById(elementId) {
        const element = document.getElementById(elementId);

        if (element) {
            return element.offsetWidth; // Returns the width of the element, including padding but excluding margins
        } else {
            console.warn(`Element with ID ${elementId} not found.`);
            return null; // Returns null if element is not found
        }
    }

    const handleStatusChanges = (checked, header) => {
        if (checked) {
            setIschecked([...ischecked, header.key_id]);
            setEditData((prev) => [...prev, header]);
        } else {
            setIschecked(ischecked.filter((item) => item !== header.key_id));
            setEditData((prev) => prev.filter((item) => item.key_id !== header.key_id));
        }
    }

    const handleDoubleClick = (key_id, header) => {
        setIschecked([...ischecked, key_id]);
        setEditData((prev) => [...prev, header]);
        setIsedit(true);
    }

    const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

    const calculateSum = (dataIndex) => {
        const sum = filteredData.reduce((total, record) => {
            const value = parseFloat(record[dataIndex]);
            if (!isNaN(value)) {
                return total + value;
            }
            return total;
        }, 0);

        return sum;
    };

    const calculateAverage = (dataIndex) => {
        const sum = calculateSum(dataIndex);
        const avg = sum / filteredData.filter((record) => isNumeric(record[dataIndex])).length;
        return avg.toFixed(2);
    };

    const calculateCount = () => {
        return filteredData.length;
    };

    const getAggregatePopoverContent = (dataIndex) => {
        const isNumberColumn = data.some((record) => isNumeric(record[dataIndex]));

        return (
            <div>
                <p>Σ Sum: {isNumberColumn ? calculateSum(dataIndex) : 'NA'}</p>
                <p>x̄ Average: {isNumberColumn ? calculateAverage(dataIndex) : 'NA'}</p>
                <p># Count: {calculateCount(dataIndex)}</p>
            </div>
        );
    };

    const saveColumnWidthsDebounced = _.debounce((columnWidths) => {
        saveColumnWidthsToCookies(columnWidths); // Save widths to localStorage
    }, 500);

    const handleResize = (column) =>
        _.throttle((e, { size }) => {
            setColumnWidths((prev) => {
                const updatedWidths = {
                    ...prev,
                    [column]: size.width,
                };

                // debounce(() => saveColumnWidthsToCookies(updatedWidths), 500); // Save after resizing stops
                saveColumnWidthsDebounced(updatedWidths);

                return updatedWidths;
            });
        }, 30); // Throttle updates to ensure responsiveness
   


    useEffect(() => {
        // Load saved widths from localStorage
        const savedColumnWidths = loadColumnWidthsFromCookies() || {};
    
        // Prepare an updated widths object
        let updatedWidths = { ...savedColumnWidths };
    
        headers.forEach((header, index) => {
            const elementId = `header${index}`; // Generate the ID for each column header
            
            // Skip calculating width if saved width already exists
            if (!updatedWidths[header]) {
                const actualWidth = getElementWidthById(elementId);
    
                if (actualWidth) {
                    // If actual width exists, update it
                    updatedWidths[header] = actualWidth;
                } else {
                    // If no saved width and actual width, set a default
                    updatedWidths[header] = 150; // Default column width
                }
            }
        });
    
        // Update column widths state
        setColumnWidths(updatedWidths);
    
        // Save the merged widths back to localStorage
        saveColumnWidthsToCookies(updatedWidths);
    }, [headers]); // Runs whenever headers change
    

    useEffect(() => {
        if (ischecked?.length < 1) {
            setIsedit(false);
        }
    }, [ischecked])

    // const renderedHeaders = useMemo(() => (
    //     headers.map((header, index) => (
    //         <ResizableHeader
    //             key={header}
    //             data={data}
    //             headers={headers}
    //             index={index}
    //             getAggregatePopoverContent={getAggregatePopoverContent}
    //             setFreezeCol={setFreezeCol}
    //             freezeCol={freezeCol}
    //             filteredData={filteredData}
    //             setFilteredData={setFilteredData}
    //             columnKey={header}
    //             columnWidths={columnWidths}
    //             isEditMode={isEditMode}
    //             settings={settings}
    //             handleResize={handleResize}
    //             globalOption={globalOption}
    //             setGlobalOption={setGlobalOption}
    //             visiblePopover={visiblePopover}
    //             setVisiblePopover={setVisiblePopover}
    //             headerFontFamily={headerFontFamily}
    //             headerFontSize={headerFontSize}
    //             headerTextColor={headerTextColor}
    //             headerBgColor={headerBgColor}
    //         />
    //     ))
    // ), [
    //     headers,
    //     data,
    //     columnWidths,
    //     isEditMode,
    //     settings,
    //     filteredData,
    //     globalOption,
    //     visiblePopover
    // ]);

    const renderedHeaders = useMemo(() => (
        tempHeader.map((header, index) => (
            <ResizableHeader
                key={header}
                data={data}
                headers={headers}
                index={index}
                getAggregatePopoverContent={getAggregatePopoverContent}
                setFreezeCol={setFreezeCol}
                freezeCol={freezeCol}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                columnKey={header}
                columnWidths={columnWidths}
                isEditMode={isEditMode}
                settings={settings}
                handleResize={handleResize}
                globalOption={globalOption}
                setGlobalOption={setGlobalOption}
                visiblePopover={visiblePopover}
                setVisiblePopover={setVisiblePopover}
                headerFontFamily={headerFontFamily} // Ensure latest font family is used
                headerFontSize={headerFontSize}     // Ensure latest font size is used
                headerTextColor={headerTextColor}   // Ensure latest text color is used
                headerBgColor={headerBgColor}       // Ensure latest background color is used
            />
        ))
    ), [
        headers,
        data,
        columnWidths,
        isEditMode,
        settings,
        filteredData,
        globalOption,
        visiblePopover,
        headerFontFamily, 
        headerFontSize,   
        headerTextColor,  
        headerBgColor  
    ]);
    

    const renderedRows = useMemo(() => (
        paginatedData.map((item) => (
            <tr key={item.key_id} className="hover:bg-gray-50">
                {isEditMode && (
                    <td
                        className="px-4 py-2 border-y border-gray-300"
                        style={{
                            width: `${columnWidths.actions}px`,
                            position: "sticky",
                            left: 0,
                            background: "#fff",
                            zIndex: 5,
                        }}
                    >
                        <div className="flex gap-[10px] align-center">
                            <Checkbox
                                checked={ischecked.includes(item.key_id)}
                                onChange={(e) => handleStatusChanges(e.target.checked, item)}
                                value={item.key_id}
                            />
                            <button
                                className="rounded-full bg-[#DDDCDB] flex w-[28px] h-[28px] justify-center items-center"
                                onClick={() => {
                                    if (ischecked.length > 0 && isEditMode) {
                                        handleDoubleClick(item.key_id, item);
                                    } else {
                                        handleEdit(item.key_id);
                                    }
                                }}
                            >
                                <Edit />
                            </button>
                            <button
                                className="rounded-full bg-[#DDDCDB] flex w-[28px] h-[28px] justify-center items-center"
                                onClick={() => {
                                    if (ischecked.length > 0 && isEditMode) {
                                        handleBulkDelete();
                                    } else {
                                        handleDelete(item.key_id);
                                    }
                                }}
                            >
                                <Delete />
                            </button>
                        </div>
                    </td>
                )}
                {headers.map((header, index) => {
                    const isPinned = headers.slice(0, headers.indexOf(freezeCol) + 1).includes(header);
                    const firstColWidth = isEditMode ? 125 : 0;
                    const leftOffset = (index === 0 ? firstColWidth : firstColWidth) + headers.slice(0, index).reduce((sum, key) => {
                        const width = parseInt(columnWidths[key], 10); // Parse columnWidths[key] as an integer
                        return sum + (isNaN(width) ? 0 : width); // Handle non-numeric widths gracefully
                    }, 0);

                    
                    return (
                        <td
                            key={header}
                            className="px-4 py-2 border-b border-gray-300"
                            style={{
                                width: `${columnWidths[header]}px`,
                                minWidth: `${columnWidths[header]}px`,
                                zIndex: isPinned ? 10 : "inherit",
                                position: isPinned ? "sticky" : "relative",
                                left: isPinned ? `${leftOffset}px` : "auto",
                                color: bodyTextColor,
                                whiteSpace: "nowrap",
                                fontFamily: bodyFontFamily,
                                fontSize: `${bodyFontSize}px`,
                                boxShadow: isPinned ? "3px 0px 5px rgba(0, 0, 0, 0.1)" : "none",
                            }}
                        >
                            {isedit && ischecked.includes(item.key_id) ? (
                                <div
                                className="tableTD w-full h-full flex items-center"
                                style={{
                                    zIndex: isPinned ? 10 : "inherit",
                                    position: "relative",
                                }}
                            >
                                <input
                                    className="w-full h-full border-b-2 border-gray-300 border-primary"
                                    value={EditData.find((data) => data.key_id === item.key_id)?.[header] || ""}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setEditData((prev) =>
                                            prev.map((data) =>
                                                data.key_id === item.key_id
                                                    ? { ...data, [header]: newValue }
                                                    : data
                                            )
                                        );
                                    }}
                                />
                                </div>
                            ) : (
                                <div
                                    className="tableTD w-full h-full flex items-center"
                                    style={{
                                        zIndex: isPinned ? 10 : "inherit",
                                        position: "relative",
                                    }}
                                    onDoubleClick={(e) => isEditMode && handleDoubleClick(item.key_id, item)}
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
                                        <spna style={{ fontFamily: bodyFontFamily, fontSize: `${bodyFontSize}px` }}>{item[header] || "N/A"}</spna>
                                    )}
                                </div>
                            )}
                        </td>
                    );
                })}
            </tr>
        ))
    ), [paginatedData, headers, columnWidths, isEditMode, bodyTextColor, bodyFontFamily, bodyFontSize, freezeCol, isedit, ischecked]);


    return (
        <div className="px-[50px] py-[10px]">
            <div className="overflow-x-auto">
                <div
                    className="min-w-full relative border border-gray-300 rounded-t-lg bg-white"
                    style={{
                        maxHeight: "75vh",
                        overflowY: "auto",
                    }}
                >
                    <table
                        className="border border-gray-300 rounded-t-lg bg-white"
                        style={{
                            tableLayout: "auto",
                            minWidth: { minWidth },
                            width: "100%",
                            border: "1px solid #ccc",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead className="sticky top-0 bg-gray-100 z-20">
                            <tr className="text-gray-700 text-left"
                                style={{ backgroundColor: headerBgColor, color: headerTextColor }}>
                                {isEditMode &&
                                    <th
                                        className="px-4 py-4 border-b border-gray-300"
                                        style={{
                                            width: `${columnWidths.actions}px`,
                                            position: "sticky",
                                            left: 0,
                                            zIndex: 10,
                                            background: "#fff",
                                            // borderRight: "1px solid #ccc",
                                            backgroundColor: headerBgColor || "#f1f1f1",
                                            color: headerTextColor,
                                            whiteSpace: "nowrap",
                                            fontFamily: headerFontFamily,
                                            fontSize: `${headerFontSize}px`,
                                        }}
                                    >
                                        Actions
                                    </th>
                                }
                                {renderedHeaders}
                            </tr>
                        </thead>
                        <tbody className="people_table">
                            {renderedRows}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div>
                    <span>Total Rows: </span>
                    <span>{filteredData.length}</span>
                </div>

                <Pagination
                    current={currentPage}
                    total={filteredData.length}
                    pageSize={rowsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={true}
                />
            </div>
        </div>
    )
}

export default memo(Table);