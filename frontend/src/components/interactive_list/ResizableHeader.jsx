import { RxDividerVertical } from "react-icons/rx";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import React ,{ memo, useCallback, useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
import { MdOutlineLabel } from "react-icons/md";
import { Popover } from "antd";
import Freeze from "./Freeze";
import MultiSelectFilter from "./MultiSelectFilter";
import { IoSearchOutline } from "react-icons/io5";

const ResizableHeader = React.memo(({ data, filteredData, setFilteredData, setFreezeCol, freezeCol, columnKey, index, headers, columnWidths, headerBgColor, headerTextColor, headerFontFamily, headerFontSize, isEditMode, handleResize,
    settings, getAggregatePopoverContent, globalOption, setGlobalOption
}) => {
    console.log({ freezeCol, headers, columnWidths, headerBgColor, headerTextColor, headerFontFamily, headerFontSize, isEditMode });

    const [sortColumn, setSortColumn] = useState(null);
    const [visiblePopover, setVisiblePopover] = useState({});
    const [sortOrder, setSortOrder] = useState('asc');
    const title = columnKey.replace(/_/g, " ");
    const isPinned = headers.slice(0, headers.indexOf(freezeCol) + 1).includes(columnKey); // Check if the column is within the pinned range
    const firstColWidth = isEditMode ? 125 : 0; // Adjust the first column width if in edit mode
    // const leftOffset =
    //     (index === 0 ? firstColWidth : firstColWidth) +
    //     headers
    //         .slice(0, index)
    //         .reduce((sum, key) => sum + columnWidths[key], 0);

    const leftOffset =
        (index === 0 ? firstColWidth : firstColWidth) +
        headers.slice(0, index).reduce((sum, key) => {
            const width = parseInt(columnWidths[key], 10); // Parse columnWidths[key] as an integer
            return sum + (isNaN(width) ? 0 : width); // Handle non-numeric widths gracefully
        }, 0);

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


    console.log({ columnKey, title, isPinned, firstColWidth, index, leftOffset });
    return (
        <Resizable
            width={columnWidths[columnKey]}
            height={0}
            onResize={handleResize(columnKey)} // Immediate DOM updates
            // onResizeStop={handleResizeStop(columnKey)} // Final state update
            draggableOpts={{ enableUserSelectHack: false }}
            handle={
                <div
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
                className="px-4 py-4 border-b border-gray-300"
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
                }}
            >
                <div
                    className="flex justify-between items-center gap-3"
                    style={{
                        zIndex: isPinned ? 1000 : "inherit", // Ensure child elements respect z-index
                        position: "relative", // Keep elements aligned
                    }}
                >
                    <div title={title.replace(/_/g, " ")}>
                        <span>{title.replace(/_/g, " ")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => {
                                const newSortOrder =
                                    sortColumn === columnKey ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

                                setSortColumn(columnKey);
                                setSortOrder(newSortOrder);

                                const sorted = Array.isArray(filteredData)
                                    ? [...filteredData].sort((a, b) => {
                                        const valueA = isNaN(a[columnKey]) ? a[columnKey]?.toString() : Number(a[columnKey]);
                                        const valueB = isNaN(b[columnKey]) ? b[columnKey]?.toString() : Number(b[columnKey]);

                                        if (typeof valueA === 'number' && typeof valueB === 'number') {
                                            // Numeric sorting
                                            return newSortOrder === 'asc'
                                                ? valueA - valueB
                                                : valueB - valueA;
                                        } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                                            // String sorting
                                            return newSortOrder === 'asc'
                                                ? valueA.localeCompare(valueB)
                                                : valueB.localeCompare(valueA);
                                        } else {
                                            // Fallback for mixed types (e.g., number vs. string)
                                            return 0;
                                        }
                                    })
                                    : [];

                                setFilteredData(sorted);
                            }}
                            title="Sort"
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
                            <button>
                                <IoSearchOutline />
                            </button>
                        </Popover>
                        <Popover content={getAggregatePopoverContent(columnKey)} trigger="click" placement="bottom">
                            <button title="Labels">
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

                        <Freeze columnKey={columnKey} isEditMode={isEditMode} setFreezeCol={setFreezeCol} freezeCol={freezeCol} settings={settings} />

                    </div>
                </div>
            </th>
        </Resizable>
    )
})

export default ResizableHeader;