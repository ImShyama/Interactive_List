import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import "./Table.css"
import { DynamicPagination } from './Pagination';
import { Checkbox } from '../ui/checkbox';
import { ArrowDownUp, Pin } from 'lucide-react';
import { Input } from '../ui/input';
import toast from 'react-hot-toast';
// import { AutoComplete } from '../AutoComplete/AutoComplete';


function SortIcon({ order, className, ...props }) {
    return <ArrowDownUp {...props} className={`${order} ${className}`} />
}




function getNestedValue(obj, keyPath) {
    // If the keyPath doesn't contain a dot, return the value directly
    if (!keyPath.includes('.')) {
        return obj[keyPath];
    }

    // Split the keyPath by dots to handle nested keys
    const keys = keyPath.split('.');

    // Use reduce to traverse the object using the keys
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function formatToDateString(input, dateType) {
    // Allowed data types: "date" and "datetime-local"
    if (dateType !== "date" && dateType !== "datetime-local") {
        return input; // Return input as it is for unsupported data types
    }

    // Check if input is a valid Date object
    if (input instanceof Date) {
        if (dateType === "date") {
            return input.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
        } else if (dateType === "datetime-local") {
            return input.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:MM'
        }
    }

    // Check if input is a valid ISO date string
    if (typeof input === "string") {
        const date = new Date(input);
        if (!isNaN(date.getTime())) { // Check if the string is a valid date
            if (dateType === "date") {
                return date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
            } else if (dateType === "datetime-local") {
                return date.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:MM'
            }
        }
    }

    // If not a valid Date or ISO string, return input as it is
    return input;
}


function formatColumn(arr, savedWidthData, disableCheckboxSelection) {
    let temp = [...arr].sort((a, b) => {
        return Number(b.pinned || false) - Number(a.pinned || false)
    })

    let cumulativeWidth = disableCheckboxSelection ? 0 : 40;
    for (let i = 0; i < temp.length; i++) {
        if (!temp[i].pinned) {
            if (temp[i - 1]) {
                temp[i - 1].lastPin = true;
            }
            break
        };
        temp[i].cw = cumulativeWidth;

        cumulativeWidth += savedWidthData?.[temp[i].field]?.width || temp[i].width;
    }
    return temp;
}

const defaultFilters = { global: "", fields: {} };

/**
 * A customizable data grid component with features like column pinning, sorting, filtering, row selection, and more.
 *
 * @param {Object} props The component props
 * @param {Array} props.columns The columns configuration
 * @param {Array} props.rows The data rows
 * @param {String} [props.filters.global] The global filter string
 * @param {Object} [props.filters.fields] The field-specific filters
 * @param {String} [props.tableID] The ID of the table for local storage of column widths
 * @param {Boolean} [props.saveTableCache] Whether to save the column widths in local storage
 * @param {Function} [props.onColumnPinChange] The callback function when a column is pinned or unpinned
 * @param {Function} [props.onRowClick] The callback function when a row is clicked
 * @param {Function} [props.onRowSelectionModelChange] The callback function when the row selection model changes
 * @param {String} [props.rowID] The ID of the row
 * @param {Function} [props.onRowContextMenu] The callback function when the context menu is opened on a row
 * @param {Function} [props.rowStyle] The callback function to style a row
 * @param {Boolean} [props.autoRowHeight] Whether to automatically calculate the row height
 * @param {Number} [props.rowPerPage] The number of rows to display per page
 * @param {Boolean} [props.rowsPerPageOptionsEnabled] Whether to enable the rows per page options
 * @param {Function} [props.onRowEdit] The callback function when a row is edited
 * @param {Object} [props.rowSelectionObject] The object containing the row selection model
 * @param {Function} [props.setRowSelectionObject] The callback function to set the row selection model
 *
 * @example
 * import { DataGrid } from 'react-table'
 *
 * const columns = [
 *   { header: 'Name', field: 'name' },
 *   { header: 'Age', field: 'age', dataType: 'number' },
 * ]
 *
 * const rows = [
 *   { name: 'John Doe', age: 25 },
 *   { name: 'Jane Doe', age: 30 },
 * ]
 *
 * const App = () => {
 *   return (
 *     <DataGrid
 *       columns={columns}
 *       rows={rows}
 *       filters={{ global: '', fields: {} }}
 *       tableID="myTable"
 *       saveTableCache
 *       onColumnPinChange={(pinned, field) => console.log(`${field} is now ${pinned ? 'pinned' : 'unpinned'}`)}
 *     />
 *   )
 * }
 */
function DataGrid({ rows, columnResizeMode, loading, columns, filters = defaultFilters, onRowClick = () => { }, onRowSelectionModelChange = () => { }, rowID, onResize, tableID, disableCheckboxSelection,
    onRowContextMenu, rowStyle, hightlightRow, saveTableCache = false, onColumnPinChange = () => { }, autoRowHeight, rowPerPage, rowsPerPageOptionsEnabled, onRowEdit, rowSelectionObject, setRowSelectionObject }) {
    let savedWidthData = localStorage.getItem(tableID) || JSON.stringify({});
    savedWidthData = JSON.parse(savedWidthData);
    const [sortData, setSortData] = useState({ sortedField: "", order: "default" });
    const [dynamicColumns, setDynamicColumns] = useState(
        formatColumn(columns, savedWidthData, disableCheckboxSelection)
    )

    const [rowSelectionModal, setRowSelectionModal] = useState({});

    // const [allRowIDs] = useState(new Set(rows.map(item => item?.[rowID])));
    const [allRowIDs] = useState(rows.reduce((acc, item) => {
        return { ...acc, [item?.[rowID]]: { editing: false } }
    }, {}));
    const [pagination, setPagination] = useState({
        page: 1,
        rowsPerPage: (Number(rowPerPage)) || 10
    });

    const elementsRef = React.useRef({});
    elementsRef.current = {};


    const { noOfFilteredRows, newRows } = useMemo(() => {
        // Helper function to check for matches with the global filter
        const matchGlobalFilter = (row) => {
            const globalFilter = filters.global?.toLowerCase() || '';
            if (!globalFilter) return true; // No global filter, always return true

            return dynamicColumns.some(j => {
                const fieldVal = j.renderCell ? (`${j.value ? j.value(row) : ""}`).toLowerCase() : String(getNestedValue(row, j.field) || "").toLowerCase();
                // const fieldVal = j.renderCell ? (j.value ? j.value({ row }) : (row[j.field] || "")).toLowerCase() : String(row[j.field] || "").toLowerCase();
                return fieldVal.includes(globalFilter);
            });
        };

        // Helper function to check if a row matches the field-specific filters
        const matchFieldFilters = (row) => {
            // Loop through tempdynamicColumns and apply field-specific filters
            return dynamicColumns.every(j => {
                const fieldFilter = (filters.fields[j.field] && filters.fields[j.field] !== 'None')
                    ? filters.fields[j.field].toLowerCase()
                    : ''; // If 'None', we should ignore that field filter

                if (!fieldFilter) return true; // No filter for this field, so pass

                const fieldVal = j.renderCell ? (`${j.value ? j.value(row) : ""}`).toLowerCase() : String(getNestedValue(row, j.field) || "").toLowerCase();
                // const fieldVal = j.renderCell ? (j.value ? j.value({ row }) : (row[j.field] || "")).toLowerCase() : String(row[j.field] || "").toLowerCase();

                return fieldVal.includes(fieldFilter);
            });
        };

        let filteredRows = [];

        // Apply filters to rows
        for (let i of rows) {
            // First check if the row matches the global filter
            let rowPassedFilter = matchGlobalFilter(i);

            // Then check if it matches all field-specific filters
            if (rowPassedFilter && matchFieldFilters(i)) {
                filteredRows.push(i);
            }
        }

        // Sort the filtered rows if sorting is enabled
        if (sortData.sortedField && sortData.order) {
            const col = dynamicColumns.find(col => col.field === sortData.sortedField);
            const sortedField = sortData.sortedField;
            const order = sortData.order === 'ASC' ? 1 : -1;
            filteredRows.sort((a, b) => {
                const x = col.value ? col.value(a) : getNestedValue(a, sortedField);
                const y = col.value ? col.value(b) : getNestedValue(b, sortedField);
                // const x = a?.[sortedField];
                // const y = b?.[sortedField];

                // Check if both values are numbers

                if (col.dataType === "number") {
                    return order * (x - y); // Numeric comparison
                }

                // Handle date comparison
                if (col.dataType === "date") {
                    const dateX = x ? new Date(x).getTime() : 0; // Convert to timestamp or fallback to 0
                    const dateY = y ? new Date(y).getTime() : 0;
                    return order * (dateX - dateY);
                }

                // Fallback to string comparison
                const xStr = (x || "").toString().toLowerCase();
                const yStr = (y || "").toString().toLowerCase();
                return order * xStr.localeCompare(yStr);
            });
        }

        // Apply pagination
        const startIndex = (pagination.page - 1) * pagination.rowsPerPage; // Start index for the page
        const endIndex = startIndex + pagination.rowsPerPage; // End index for the page

        return {
            noOfFilteredRows: filteredRows.length,
            newRows: filteredRows.slice(startIndex, endIndex),
        };
    }, [rows, dynamicColumns, sortData, filters, pagination]);

    const handleSaveInLocalStorage = (field, width) => {
        let prevData = localStorage.getItem(tableID) || JSON.stringify({});
        prevData = JSON.parse(prevData);
        const newVal = { field: field, width: width };
        prevData[newVal.field] = {
            width: newVal.width
        };
        localStorage.setItem(tableID, JSON.stringify(prevData));
    }

    const isEditing = useMemo(() => {
        if (!rowSelectionObject) return null;
        let temp = false;
        for (let i in rowSelectionObject) {
            if (rowSelectionObject[i]?.editable) {
                temp = true;
                break;
            }
        }
        return temp;
    }, [rowSelectionModal, rowSelectionObject]);

    useEffect(() => {
        setDynamicColumns([...columns].sort((a, b) => {
            return Number(b.pinned || false) - Number(a.pinned || false)
        }))
    }, [columns])

    return (
        <div className='mx-[50px]'>
            <div className={`customTable mb-3`} style={{ maxHeight: "70vh" }}>
                <Header saveTableCache={saveTableCache} tableID={tableID} onColumnPinChange={onColumnPinChange} handleSaveInLocalStorage={handleSaveInLocalStorage} columns={columns} setDynamicColumns={setDynamicColumns} disableCheckboxSelection={disableCheckboxSelection} sortData={sortData} isEditing={isEditing} setSortData={setSortData} onRowSelectionModelChange={onRowSelectionModelChange} rowSelectionModal={rowSelectionObject ? rowSelectionObject : rowSelectionModal} setRowSelectionModal={rowSelectionObject ? setRowSelectionObject : setRowSelectionModal} allRowIDs={allRowIDs} columnResizeMode={columnResizeMode} savedWidthData={savedWidthData} dynamicColumns={dynamicColumns} elementsRef={elementsRef} onResize={onResize} />
                <div>
                    {
                        newRows.map((item, _) => {
                            return <Row key={`row_${item?.[rowID]}`} disableCheckboxSelection={disableCheckboxSelection} isEditing={isEditing} onRowEdit={onRowEdit} onRowSelectionModelChange={onRowSelectionModelChange} rowID={rowID} rowSelectionModal={rowSelectionObject ? rowSelectionObject : rowSelectionModal} setRowSelectionModal={rowSelectionObject ? setRowSelectionObject : setRowSelectionModal} rowStyle={rowStyle} savedWidthData={savedWidthData} onRowContextMenu={onRowContextMenu} onRowClick={onRowClick} elementsRef={elementsRef} row={item} dynamicColumns={dynamicColumns} />
                        })
                    }
                </div>
            </div>
            <div className='flex justify-end gap-3'>
                <Select value={String(pagination.rowsPerPage)} onValueChange={(val) => {
                    setPagination({ ...pagination, rowsPerPage: Number(val) })
                }}>
                    <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Rows Per Page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Rows Per Page</SelectLabel>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <DynamicPagination currentPage={pagination.page} totalPages={Math.ceil(rows.length / pagination.rowsPerPage)} onPageChange={(e) => { setPagination({ ...pagination, page: e }) }} />
            </div>
        </div>
    )
}


/**
 * Renders a table row with columns that can be edited inline.
 * 
 * @param {Object} props - The properties passed to the Row component.
 * @param {boolean} [props.disableCheckboxSelection=false] - Whether to disable the checkbox selection or not.
 * @param {boolean} [props.isEditing=false] - Whether the row should be editable or not.
 * @param {Object} props.row - The row data.
 * @param {Array<TableColumnInterface>} props.dynamicColumns - An array of column definitions for rendering the cells.
 * @param {Function} [props.onRowEdit] - Callback function to handle row edits.
 * @param {Function} [props.onRowSelectionModelChange] - Callback function to handle row selection model changes.
 * @param {Object} props.elementsRef - Reference object to store cell element references by column field.
 * @param {Function} [props.onRowClick] - Callback function to handle row clicks.
 * @param {Function} [props.onRowContextMenu] - Callback function to handle row context menu.
 * @param {Object} [props.savedWidthData] - Object containing saved width data for each column, used for styling cells.
 * @param {Function} [props.rowStyle] - Function to compute custom row styles.
 * @param {Function} [props.setRowSelectionModal] - Function to set the row selection modal.
 * @param {string} [props.rowID] - The column field to use as the row ID.
 * @param {Object} [props.rowSelectionModal] - The current row selection modal.
 */
function Row({ disableCheckboxSelection, isEditing, row, dynamicColumns, onRowEdit, onRowSelectionModelChange, elementsRef, onRowClick, onRowContextMenu, savedWidthData, rowStyle = (_) => { }, setRowSelectionModal, rowID, rowSelectionModal }) {
    const computedRowStyles = rowStyle(row);

    const handleSelectRow = () => {
        if (isEditing == null) return
        setRowSelectionModal((p) => {
            let temp = { ...p };
            if (row?.[rowID] in temp) {
                if (isEditing) {
                    toast.error('Cannot deselect while editing')
                    return temp
                }
                delete temp[row?.[rowID]]
            }
            else {
                temp[row?.[rowID]] = { editable: isEditing ? true : false, editedData: {} }
            }
            onRowSelectionModelChange(temp)
            return temp;
        })
    }

    const handleMakeRowEditable = () => {
        if (isEditing == null) return
        // if (isEditing) return
        setRowSelectionModal((p) => {
            if (p[row?.[rowID]]?.editable) return p;
            let temp = { ...p };
            temp[row?.[rowID]] = { editable: true }
            onRowSelectionModelChange(temp)
            return temp;
        })
    }

    const handleEditRow = (key, value) => {
        if (onRowEdit) onRowEdit({ rowID: row?.[rowID], key, value })
    }

    const renderCellContent = (row, column, rowSelectionModal, rowID, handleEditRow, getNestedValue, formatToDateString) => {
        if (rowSelectionModal?.[row?.[rowID]]?.editable && column.editable) {
            // if (column.options) {
            //     // return (
            //     //     <AutoComplete className="autoCompleteTableDropdown"
            //     //         searchText={column.value ? column.value(row) : getNestedValue(row, column.field)}
            //     //         renderLabel={({ value, label, data }) => <>{label}</>}
            //     //         options={column.options}
            //     //         value={column.value ? column.value(row) : getNestedValue(row, column.field)}
            //     //         onChangeValue={(val) => handleEditRow(column.field, val.value)}
            //     //     />
            //     // );
            // } else if (column.dataType === "date") {
            //     return (
            //         <DateTimePickerForm
            //             value={column.value ? column.value(row) : getNestedValue(row, column.field)}
            //             onChange={(val) => handleEditRow(column.field, val.toISOString())}
            //         />
            //     );
            // } else {
                return (
                    <Input
                        type={column.dataType || "text"}
                        className={'min-h-0 translate-x-[-5px]'}
                        defaultValue={formatToDateString(column.value ? column.value(row) : getNestedValue(row, column.field))}
                        onChange={(e) => handleEditRow(column.field, e.target.value)}
                    />
                );
            // }
        } else if (column.renderCell) {
            return column.renderCell(row);
        } else {
            return getNestedValue(row, column.field);
        }
    };


    return <div className='tr' onClick={onRowClick} onContextMenu={onRowContextMenu}>
        {!disableCheckboxSelection && <div className={`td sticky w-[40px] z-50 left-0 top-0`} >
            <Checkbox checked={!!rowSelectionModal?.[(row?.[rowID])]} onClick={handleSelectRow} />
        </div>}

        {
            dynamicColumns.map((column,  index) => {
                return (
                    <div key={`${row?.[rowID]}-${column.field}`} ref={(el) => {
                        if (elementsRef.current[column.field]) {
                            elementsRef.current[column.field].push(el)
                        }
                        else {
                            elementsRef.current[column.field] = [el]
                        }
                    }}

                        onDoubleClick={handleMakeRowEditable}
                        className={`td ${column.pinned ? `sticky  top-0` : ""}`} style={{ zIndex: dynamicColumns.length - index, width: `${savedWidthData?.[column.field]?.width || column.width}px`, left: column.pinned ? `${column.cw}px` : "", borderRight: column.lastPin && column.pinned ? `2px solid #ededed` : "" }}>

                        {renderCellContent(row, column, rowSelectionModal, rowID, handleEditRow, getNestedValue, formatToDateString)}
                    </div>
                )
            })
        }
    </div>
}

/**
 * Renders the table header with columns that can be resized and sorted.
 * Also includes a checkbox for selecting all rows.
 * @param {Object} props - The properties passed to the Header component.
 * @param {TableColumnInterface[]} props.columns - An array of column definitions for rendering the cells.
 * @param {Function} props.setDynamicColumns - Function to update the dynamic columns state.
 * @param {string} props.tableID - The ID of the table, used for storing the table cache.
 * @param {Function} props.handleSaveInLocalStorage - Function to handle saving the table cache in local storage.
 * @param {Function} props.onColumnPinChange - Callback function to handle column pin changes.
 * @param {boolean} props.saveTableCache - Whether to enable saving the table cache or not.
 * @param {boolean} props.disableCheckboxSelection - Whether to disable the checkbox selection or not.
 * @param {Object} props.sortData - The current sort data.
 * @param {Function} props.setSortData - Function to update the sort data.
 * @param {Function} props.onRowSelectionModelChange - Callback function to handle row selection model changes.
 * @param {TableColumnInterface[]} props.dynamicColumns - An array of dynamic column definitions for rendering the cells.
 * @param {Object} props.elementsRef - Reference object to store cell element references by column field.
 * @param {Function} [props.onResize] - Callback function to handle column resizes.
 * @param {Object} [props.savedWidthData] - Object containing saved width data for each column, used for styling cells.
 * @param {string} [props.columnResizeMode] - The column resize mode, either "onChange" or "onEnd".
 * @param {Object} props.allRowIDs - The row IDs of all rows in the table.
 * @param {Object} props.rowSelectionModal - The current row selection modal.
 * @param {Function} props.setRowSelectionModal - Function to update the row selection modal.
 *
 * @returns {JSX.Element} The rendered Header component.
 */

function Header({ columns, setDynamicColumns, tableID, handleSaveInLocalStorage, onColumnPinChange, saveTableCache, disableCheckboxSelection, sortData, isEditing, setSortData, onRowSelectionModelChange, dynamicColumns, elementsRef, onResize, savedWidthData, columnResizeMode, allRowIDs, rowSelectionModal, setRowSelectionModal }) {
    const onSelectAll = () => {
        if (isEditing) return toast.error('Cannot deselect while editing')
        setRowSelectionModal(p => {
            if (isEditing) return toast.error('Cannot select or deselect while editing')
            if (Object.keys(p).length > 0) {
                onRowSelectionModelChange([])
                return {}
            }
            else {
                onRowSelectionModelChange({ ...allRowIDs })
                return allRowIDs
            }
        })
    }

    return <div className='tr thead' style={{ zIndex: "50" }}>
        {!disableCheckboxSelection && <div className={`th w-[40px] sticky left-0`} style={{ zIndex: "100" }}>
            <Checkbox checked={Object.keys(rowSelectionModal).length == Object.keys(allRowIDs).length} onClick={onSelectAll} />
        </div>}
        {
            dynamicColumns.map((column, index) => {
                return (
                    <ResizableHeader index={index} tableID={tableID} disableCheckboxSelection={disableCheckboxSelection} onColumnPinChange={onColumnPinChange} saveTableCache={saveTableCache} handleSaveInLocalStorage={handleSaveInLocalStorage} columns={columns} savedWidthData={savedWidthData} setDynamicColumns={setDynamicColumns} key={`head${column.field}`} sortData={sortData} setSortData={setSortData} columnResizeMode={columnResizeMode} onResize={onResize} column={column} elementsRef={elementsRef} />
                )
            })
        }
    </div>
}



/**
 * Renders a single table header cell with a resizer and sorting controls.
 * @param {Object} props - The properties passed to the ResizableHeader component.
 * @param {TableColumnInterface[]} props.columns - An array of column definitions for rendering the cells.
 * @param {number} props.index - The index of the column in the dynamicColumns array.
 * @param {Function} props.handleSaveInLocalStorage - Function to handle saving the table cache in local storage.
 * @param {boolean} props.disableCheckboxSelection - Whether to disable the checkbox selection or not.
 * @param {Function} props.onColumnPinChange - Callback function to handle column pin changes.
 * @param {string} props.tableID - The ID of the table, used for storing the table cache.
 * @param {boolean} props.saveTableCache - Whether to enable saving the table cache or not.
 * @param {Function} props.setDynamicColumns - Function to update the dynamic columns state.
 * @param {Object} props.sortData - The current sort data.
 * @param {TableColumnInterface} props.column - The current column definition.
 * @param {Function} [props.onResize] - Callback function to handle column resizes.
 * @param {Object} props.elementsRef - Reference object to store cell element references by column field.
 * @param {Object} props.savedWidthData - Object containing saved width data for each column, used for styling cells.
 * @param {string} [props.columnResizeMode] - The column resize mode, either "onChange" or "onEnd".
 * @param {Function} props.setSortData - Function to update the sort data.
 *
 * @returns {JSX.Element} The rendered ResizableHeader component.
 */
function ResizableHeader({ columns, index, handleSaveInLocalStorage, disableCheckboxSelection, onColumnPinChange, tableID, saveTableCache, setDynamicColumns, sortData, column, onResize = (..._) => { }, elementsRef, savedWidthData, columnResizeMode, setSortData }) {
    const ref = useRef(null);
    const [startX, setStartX] = useState(null);
    const [startWidth, setStartWidth] = useState(null);
    const [resizing, setResizing] = useState(false);
    const handleMouseDown = (event) => {
        setStartX(event.clientX);
        setStartWidth(ref.current.offsetWidth);
        setResizing(true);
    };

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (resizing) {
                const mouseMoved = event.clientX - startX;
                const newWidth = startWidth + mouseMoved;
                ref.current.style.width = `${newWidth}px`;
                if (columnResizeMode == "onChange") {
                    for (let i of elementsRef.current[column.field] || []) {
                        if (!i) continue
                        i.style.width = `${newWidth}px`;
                    }
                }
                if (saveTableCache) handleSaveInLocalStorage(column.field, newWidth)
            }
        };

        const handleMouseUp = (event) => {
            setResizing(false);
            const mouseMoved = event.clientX - startX;
            const newWidth = startWidth + mouseMoved;
            if (onResize) {
                onResize({ field: column.field, width: newWidth })
            }
            for (let i of elementsRef.current[column.field] || []) {
                if (!i) continue
                i.style.width = `${newWidth}px`;
            }
            if (saveTableCache) handleSaveInLocalStorage(column.field, newWidth);

            let savedWidthData = localStorage.getItem(tableID) || JSON.stringify({});
            savedWidthData = JSON.parse(savedWidthData);


            setDynamicColumns((p) => {
                return formatColumn([...p], savedWidthData, disableCheckboxSelection)
            })
        };

        if (resizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing, startX, startWidth]);

    return <div ref={ref} key={`head-${column.field}`} className={`th relative ${column.pinned ? `sticky top-0` : ""}`} style={{ width: `${savedWidthData?.[column.field]?.width || column.width}px`, left: column.pinned ? `${column.cw}px` : "", zIndex: columns.length - index }}>
        {column.header}
        <div className='actions absolute right-[5px] h-full top-[50%] translate-y-[-50%] bg-[--scrollbar-color] items-center'>
            <Pin onClick={() => {
                onColumnPinChange({ pinned: !column.pinned, field: column.field })
                if (saveTableCache) {
                    let prevData = localStorage.getItem(tableID) || JSON.stringify({});
                    prevData = JSON.parse(prevData);

                    prevData[column.field] = {
                        ...prevData[column.field],
                        pinned: !column.pinned
                    };
                    localStorage.setItem(tableID, JSON.stringify(prevData));
                }

                setDynamicColumns(p => {

                    let tempMap = {};
                    for (let i of p) {
                        tempMap[i.field] = {
                            dataType: i.dataType,
                            editable: i.editable,
                            field: i.field,
                            header: i.header,
                            options: i.options,
                            pinned: i.pinned,
                            sortable: i.sortable,
                            width: i.width,
                            renderCell: i.renderCell,
                            value: i.value,
                            renderStyles: i.renderStyles,
                            
                        };
                    }
                            
                    tempMap[column.field] = { ...tempMap[column.field], pinned: !column.pinned }
                    let temp = columns.map((col) => {
                        return tempMap[col.field];
                    })

                    return formatColumn(temp, savedWidthData, disableCheckboxSelection)
                })
            }}
                size={12.5} strokeWidth={1.5} className={`cursor-pointer ${column.pinned ? "pinActive" : "pinInactive"} pinIcon`} />
            <SortIcon order={`${sortData.sortedField === column.field ? sortData.order : ""} default`} onClick={() => {
                setSortData((prevSortData) => {
                    let newOrder =
                        prevSortData.sortedField === column.field &&
                            prevSortData.order === "ASC"
                            ? "DESC"
                            : "ASC";
                    if (
                        prevSortData.sortedField === column.field &&
                        prevSortData.order === "DESC"
                    ) {
                        return { sortedField: "", order: "default" };
                    }
                    return { sortedField: column.field, order: newOrder };
                });
            }}
                size={15} strokeWidth={1.5} className='cursor-pointer' />
        </div>
        <div onError={(e) => { e.preventDefault() }} draggable={false}
            onMouseDown={handleMouseDown}
            className="resize-handle absolute h-[15px] w-[5px] right-[0px]" style={{ top: "50%", transform: "translateY(-50%)", borderRight: "2px solid var(--text-color)", cursor: "col-resize" }} />
    </div>
}

export default DataGrid;