import { RxDividerVertical } from "react-icons/rx";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { FaSort } from "react-icons/fa";
import { MdOutlineLabel } from "react-icons/md";
import { Popover } from "antd";
import Freeze from "./Freeze";
import MultiSelectFilter from "./MultiSelectFilter";
import { IoSearchOutline } from "react-icons/io5";
import PeopleDirectoryThreeDot from "../people_directory/PeopleDirectoryThreeDot";
import VideoGalleryThreeDot from "../video_gallary/VideoGallaryThreeDot";
import PhotoGalleryThreeDot from "../photo_gallery/PhotoGalleryThreeDot";
import InteractiveMapThreeDot from "../interactive_map/InteractiveMapThreeDot";
// import { Resizable } from 're-resizable';

const ResizableHeader = React.memo(({ data, filteredData, setFilteredData, setFreezeCol, freezeCol, columnKey, index, headers, columnWidths, headerBgColor, headerTextColor, headerFontFamily, headerFontSize, isEditMode, handleResize,
    settings, getAggregatePopoverContent, globalOption, setGlobalOption, title
}) => {

    title = title.replace(/_/g, " ");
    const firstRowData = data[0];

    const [sortColumn, setSortColumn] = useState(null);
    const [visiblePopover, setVisiblePopover] = useState({});
    const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
    // const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [openPopoverId, setOpenPopoverId] = useState(null);
    // Store selections as an object with column keys
    const [checkboxSelections, setCheckboxSelections] = useState({
        showInCard: {},
        showInProfile: {},
    });
    const [sortOrder, setSortOrder] = useState('asc');
    // const title = columnKey.replace(/_/g, " ");
    // const isPinned = headers.slice(0, headers.indexOf(freezeCol) + 1).includes(columnKey); // Check if the column is within the pinned range
    const pinnedHeaders = headers.slice(0, headers.indexOf(freezeCol) + 1);
    const isPinned = pinnedHeaders.includes(columnKey);
    const isLastPinned = isPinned && columnKey === pinnedHeaders[pinnedHeaders.length - 1];
    const firstColWidth = isEditMode ? 125 : 0; // Adjust the first column width if in edit mode

    const leftOffset = useMemo(() => {
        return (
            (index === 0 ? firstColWidth : firstColWidth) +
            headers.slice(0, index).reduce((sum, key) => {
                const width = parseInt(columnWidths[key], 10);
                return sum + (isNaN(width) ? 0 : width);
            }, 0)
        );
    }, [index, firstColWidth, headers, columnWidths]);


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

    const handleSort = useCallback((columnKey) => {
        console.log({ columnKey, filteredData });
        const newSortOrder =
            sortColumn === columnKey ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

        setSortColumn(columnKey);
        setSortOrder(newSortOrder);

        const sorted = [...filteredData].sort((a, b) => {
            const valueA = a[columnKey];
            const valueB = b[columnKey];

            // Handle empty/null/undefined values
            if (valueA == null || valueB == null) {
                return valueA == null ? 1 : -1; // Null/undefined values go to the end
            }

            // Check if both values are numbers
            const isNumericA = typeof valueA === 'number' || !isNaN(Number(valueA));
            const isNumericB = typeof valueB === 'number' || !isNaN(Number(valueB));

            if (isNumericA && isNumericB) {
                return newSortOrder === 'asc'
                    ? Number(valueA) - Number(valueB)
                    : Number(valueB) - Number(valueA);
            }

            // Check if values are dates
            const dateA = new Date(valueA);
            const dateB = new Date(valueB);
            const isDateA = !isNaN(dateA.getTime());
            const isDateB = !isNaN(dateB.getTime());

            if (isDateA && isDateB) {
                return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Check if both values are alphanumeric
            const alphanumericRegex = /\d+/;
            const isAlphaNumericA = typeof valueA === 'string' && alphanumericRegex.test(valueA);
            const isAlphaNumericB = typeof valueB === 'string' && alphanumericRegex.test(valueB);

            if (isAlphaNumericA && isAlphaNumericB) {
                // Extract the numeric part from alphanumeric strings
                const numericA = parseInt(valueA.match(alphanumericRegex)?.[0] || '0', 10);
                const numericB = parseInt(valueB.match(alphanumericRegex)?.[0] || '0', 10);

                return newSortOrder === 'asc' ? numericA - numericB : numericB - numericA;
            }

            // Fallback: String comparison
            const strA = valueA?.toString() || '';
            const strB = valueB?.toString() || '';
            return newSortOrder === 'asc'
                ? strA.localeCompare(strB, undefined, { sensitivity: 'base' })
                : strB.localeCompare(strA, undefined, { sensitivity: 'base' });
        });

        setFilteredData(sorted);
    }, [filteredData, sortColumn, sortOrder]);

    const updateSelection = (type, columnName, checked) => {
        setCheckboxSelections((prevSelections) => {
            const updatedType = { ...prevSelections[type] };
            if (checked) {
                updatedType[columnName] = { columnName, order: Object.keys(updatedType).length + 1 };
            } else {
                delete updatedType[columnName];
            }
            return { ...prevSelections, [type]: updatedType };
        });
    };

    useEffect(() => {
        console.log("Current Selections:", checkboxSelections);
    }, [checkboxSelections]);


    return (
        <Resizable
            className="truncate ResizeTH"
            width={columnWidths[columnKey]}
            height={0}
            onResize={handleResize(columnKey)} // Immediate DOM updates
            draggableOpts={{ enableUserSelectHack: false }}
            handle={
                <div
                    className="resizeActions"
                    style={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        cursor: "col-resize", // Keeps the resizing cursor
                        zIndex: 5, // Ensure it stays above other elements
                        display: "flex", // Allows icon alignment
                        alignItems: "center",
                        justifyContent: "center",
                        width: "15px", // Adjust based on the size of your icon
                        height: "100%",
                        marginRight: "5px",
                        backgroundColor: headerBgColor || "#f1f1f1",
                    }}
                >
                    <RxDividerVertical style={{ color: "gray", fontSize: "32px" }} /> {/* Replace with your preferred icon */}
                </div>
            }
            style={{
                backgroundColor: headerBgColor || "#f1f1f1", // Solid background for pinned headers
                zIndex: isPinned ? 10 : "inherit",
            }}
        >
            <th
                className="px-4 py-4 border-b border-gray-300 truncate"
                id={`header${index}`}
                style={{
                    width: `${columnWidths[columnKey]}px`,
                    minWidth: `${columnWidths[columnKey]}px`,
                    zIndex: isPinned ? 10 : "inherit", // Adjust z-index for proper stacking
                    position: isPinned ? "sticky" : "relative", // Sticky only if pinned
                    left: isPinned ? `${leftOffset}px` : "auto", // Offset only if pinned
                    top: 0,
                    backgroundColor: headerBgColor || "#f1f1f1", // Solid background for pinned headers
                    color: headerTextColor, // Text color
                    whiteSpace: "nowrap",
                    fontFamily: headerFontFamily, // Font family
                    fontSize: `${headerFontSize}px`, // Font size
                    // borderRight: isPinned && `4px solid #bed900`,
                    maxWidth: `${columnWidths[columnKey]}px`,
                }}
            >
                {isLastPinned && (
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: "4px ",
                            minWidth: "4px ",
                            backgroundColor: "#ccc",
                            zIndex: 15, // Ensure it stays above other elements
                        }}
                    />
                )}
                <div
                    className="flex justify-between items-center gap-3 truncate"
                    style={{
                        zIndex: isPinned ? 1000 : "inherit", // Ensure child elements respect z-index
                        position: "relative", // Keep elements aligned
                    }}
                >
                    <div title={title}>
                        <span className="truncate" style={{ fontFamily: headerFontFamily, fontSize: `${headerFontSize}px` }}>
                            {title}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 ResizeTH"
                        style={{
                            position: "absolute",
                            right: 5,
                            bottom: 0,
                            cursor: "col-resize", // Keeps the resizing cursor
                            zIndex: 5, // Ensure it stays above other elements
                            backgroundColor: "transparent", // Default transparent
                            transition: "background-color 0.2s ease-in-out",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = headerBgColor || "#f1f1f1")} // Hover applies background
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")} // Ensures background disappears properly
                    >
                        <button
                            onClick={() => {
                                handleSort(columnKey);
                            }}
                            title="Sort"
                            className="resizeActions"
                        // style={{
                        //     backgroundColor: headerBgColor || "#f1f1f1",
                        // }}
                        >
                            <FaSort />
                        </button>
                        {/* <MultiSelectFilter
                            data={data}
                            filteredData={filteredData}
                            setFilteredData={setFilteredData}
                            globalOption={globalOption}
                            setGlobalOption={setGlobalOption}
                            columnKey={columnKey}
                            closePopover={() => closePopover(index)}
                            index={index}
                        /> */}
                        <Popover
                            content={
                                <MultiSelectFilter
                                    data={data}
                                    filteredData={filteredData}
                                    setFilteredData={setFilteredData}
                                    globalOption={globalOption}
                                    setGlobalOption={setGlobalOption}
                                    columnKey={columnKey}
                                    closePopover={() => closePopover(index)}
                                    visiblePopover={visiblePopover}

                                />
                            }

                            trigger="click"
                            placement="bottom"
                            visible={visiblePopover[index] || false}
                            onVisibleChange={(isVisible) => handlePopoverVisibility(index, isVisible)}
                        >
                            <button className="resizeActions"

                            >
                                <IoSearchOutline />
                            </button>
                        </Popover>
                        <Popover content={getAggregatePopoverContent(columnKey)} trigger="click" placement="bottom">
                            <button title="Labels" className="resizeActions">
                                <MdOutlineLabel />
                            </button>
                        </Popover>

                        {/* {isEditMode &&
                            (freezeCol.includes(columnKey) ? (
                                <button title="Freezed Column" onClick={(e) => handleFreezeColumn(columnKey, "removeFreezeCol", e)}>
                                    <BsPinAngleFill />
                                </button>
                            ) : (
                                <button title="Freeze Column" onClick={(e) => handleFreezeColumn(columnKey, "showInProfile", e)}>
                                    <BsPin />
                                </button>
                            ))
                        } */}
                        <div className="resizeActions">
                            <Freeze columnKey={columnKey} isEditMode={isEditMode} setFreezeCol={setFreezeCol} freezeCol={freezeCol} settings={settings} />
                        </div>

                        {(settings?.appName == "People Directory" || settings?.appName == "Video Gallery" || settings?.appName == "Photo Gallery" || settings?.appName == "Interactive Map") &&
                            <div className={isEditBoxOpen ? " " : "resizeActions"} >
                                {isEditMode && settings.appName == "People Directory" &&
                                    <PeopleDirectoryThreeDot
                                        headerId={columnKey}
                                        columnKey={title}
                                        openPopoverId={openPopoverId}
                                        setOpenPopoverId={setOpenPopoverId}
                                        // checkboxSelections={checkboxSelections}
                                        // updateSelection={updateSelection}
                                        settings={settings}

                                    />
                                }
                                {isEditMode && settings.appName == "Video Gallery" &&
                                    <VideoGalleryThreeDot
                                        headerId={columnKey}
                                        columnKey={title}
                                        openPopoverId={openPopoverId}
                                        setOpenPopoverId={setOpenPopoverId}
                                        // checkboxSelections={checkboxSelections}
                                        // updateSelection={updateSelection}
                                        settings={settings}
                                        firstRowData={firstRowData}
                                        isEditBoxOpen={isEditBoxOpen}
                                        setIsEditBoxOpen={setIsEditBoxOpen}
                                    />
                                }
                                {isEditMode && settings.appName == "Photo Gallery" &&
                                    <PhotoGalleryThreeDot
                                        headerId={columnKey}
                                        columnKey={title}
                                        openPopoverId={openPopoverId}
                                        setOpenPopoverId={setOpenPopoverId}
                                        // checkboxSelections={checkboxSelections}
                                        // updateSelection={updateSelection}
                                        settings={settings}
                                        firstRowData={firstRowData}
                                        isEditBoxOpen={isEditBoxOpen}
                                        setIsEditBoxOpen={setIsEditBoxOpen}
                                    />
                                }
                                {isEditMode && settings.appName == "Interactive Map" &&
                                    <InteractiveMapThreeDot
                                        headerId={columnKey}
                                        columnKey={title}
                                        openPopoverId={openPopoverId}
                                        setOpenPopoverId={setOpenPopoverId}
                                        // checkboxSelections={checkboxSelections}
                                        // updateSelection={updateSelection}
                                        settings={settings}
                                        firstRowData={firstRowData}
                                        isEditBoxOpen={isEditBoxOpen}
                                        setIsEditBoxOpen={setIsEditBoxOpen}
                                    />
                                }
                            </div>}
                    </div>
                </div>
            </th>
        </Resizable>
    )
})

export default ResizableHeader;