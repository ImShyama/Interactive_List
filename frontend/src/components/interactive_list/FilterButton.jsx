import { useState, memo, useCallback } from 'react';
import { LuFilter } from 'react-icons/lu';
import { CiCalendarDate } from 'react-icons/ci';
import { Bs123 } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';
import { Cancel } from "../../assets/svgIcons";


const FilterButton = ({ data }) => {

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isNumberDropdownOpen, setIsNumberDropdownOpen] = useState(false);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

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
            if (hasNumbers) {
                result.numberColumns.push(header);
            }
        });

        return result;
    }

    const [numberFilterColumn, setNumberFilterColumn] = useState(getHeadersWithDateAndNumbers(data).numberColumns);
    const [dateFilterColumn, setDateFilterColumn] = useState(getHeadersWithDateAndNumbers(data).dateColumns);


    const [selectedNumbers, setSelectedNumbers] = useState(
        JSON.parse(localStorage.getItem("selectedNumbers")) || []
    );
    const [selectedDates, setSelectedDates] = useState(
        JSON.parse(localStorage.getItem("selectedDates")) || []
    );
    const toggleNumberDropdown = useCallback(() => {
        setIsNumberDropdownOpen(!isNumberDropdownOpen);
        setIsDateDropdownOpen(false); // Close date dropdown
    }, [isNumberDropdownOpen, isDateDropdownOpen]);
    const toggleDateDropdown = useCallback(() => {
        setIsDateDropdownOpen(!isDateDropdownOpen);
        setIsNumberDropdownOpen(false); // Close number dropdown
    }, [isNumberDropdownOpen, isDateDropdownOpen]);

    const toggleFilterBox = useCallback(() => {
        setIsFilterOpen(!isFilterOpen);
        setIsNumberDropdownOpen(false);
        setIsDateDropdownOpen(false);
        setSelectedNumbers([]); // Clear selected number filters
        setSelectedDates([]); // Clear selected date filters
        localStorage.removeItem("selectedNumbers");
        localStorage.removeItem("selectedDates");
    }, [isFilterOpen, isNumberDropdownOpen, isDateDropdownOpen]);

    return (
        <>
            {!isFilterOpen ? (
                <button
                    onClick={toggleFilterBox}
                    className="bg-primary rounded-[4px] p-1 border-2 border-white text-white focus:outline-none"
                >
                    <LuFilter className="text-white" size={18} />
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
                    >
                        <Bs123 className="text-green-900" size={20} />
                    </button>

                    {/* Dropdown for Number */}
                    {isNumberDropdownOpen && (
                        <div className="absolute top-full left-[-50px] mt-1 max-w-[250px] bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50 overflow-auto"
                            style={{ zIndex: "999", width: "180px" }}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700 text-center w-full"
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                    }}
                                >
                                    Number Options
                                </p>
                                <button
                                    onClick={() => setIsNumberDropdownOpen(false)}
                                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                                >
                                    <ImCancelCircle />
                                </button>
                            </div>
                            {/* Render checkboxes dynamically */}
                            {numberFilterColumn.length > 0 ? (
                                numberFilterColumn.map((item, index) => {
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
                                                className="form-checkbox h-[13px] w-[13px] text-green-600 flex-shrink-0"
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
                                                className="text-gray-800 truncate font-medium"
                                                style={{
                                                    maxWidth: "250px",
                                                    display: "inline-block",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    fontSize: "14px",
                                                }}
                                                title={item.replace(/_/g, " ").toUpperCase()} // Full text displayed on hover
                                            >
                                                {item.replace(/_/g, " ").toUpperCase()}
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
                    >
                        <CiCalendarDate className="text-green-900" size={20} />
                    </button>

                    {/* Dropdown for Date */}
                    {isDateDropdownOpen && (
                        <div className="absolute top-full left-[-50px] mt-1 max-w-[250px] bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50 overflow-auto"
                        style={{ zIndex: "999", width: "180px" }}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700 text-center w-full"
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                    }}
                                >
                                    Date Options
                                </p>
                                <button
                                    onClick={() => setIsDateDropdownOpen(false)}
                                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                                >
                                    <ImCancelCircle />
                                </button>
                            </div>
                            {/* Render checkboxes dynamically */}
                            {dateFilterColumn.length > 0 ? (
                                dateFilterColumn.map((item, index) => {
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
                                                className="form-checkbox h-[13px] w-[13px] text-green-600 flex-shrink-0"
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
                                                className="text-gray-800 truncate font-medium"
                                                style={{
                                                    maxWidth: "250px",
                                                    display: "inline-block",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    fontSize: "14px",
                                                }}
                                                title={item.replace(/_/g, " ").toUpperCase()} // Full text displayed on hover
                                            >
                                                {item.replace(/_/g, " ").toUpperCase()}
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
            )
            }
        </>
    );
}

export default memo(FilterButton);