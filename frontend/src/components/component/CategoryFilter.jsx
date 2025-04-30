import React, { useState, useEffect } from "react";
import { Search, Filter, RefreshCcw, ChevronDown } from "lucide-react";
import Cancel from "../../assets/Cancel.svg";
import { TbFilterSearch } from "react-icons/tb";
const CatalogueFilter = ({ data, tempHeader, setFilteredData, filteredData }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [filterOptions, setFilterOptions] = useState(tempHeader.map((header) => header.replace(/_/g, ' ')));
    const [dropdownItems, setDropdownItems] = useState([]);
    const [filterOptions2, setFilterOptions2] = useState([]);
    const [filterOptions3, setFilterOptions3] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredItems = dropdownItems.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const isAllSelected = selectedItems?.[selectedFilter]?.length === filteredItems?.length && filteredItems?.length > 0;
    const isIndeterminate = selectedItems?.[selectedFilter]?.length > 0 && selectedItems?.[selectedFilter]?.length < filteredItems?.length;

    console.log({ data, tempHeader, selectedFilter, selectedItems, filterOptions });

    const updateDropdown = () => {
        if (!selectedFilter) {
            setDropdownItems([]);
            return;
        }

        const uniqueValues = Array.from(
            new Set(
                filteredData.map(item => {
                    // Clean up the selectedFilter key to match your object keys
                    const key = selectedFilter.toLowerCase().replace(/\s+/g, '_');
                    return item[key] || ""; // Handle missing fields gracefully
                }).filter(Boolean) // Remove empty strings if any
            )
        );

        setDropdownItems(uniqueValues);
    };

    useEffect(() => {
        updateDropdown();
    }, [selectedFilter]);

    const toggleFilterDropdown = (option) => {
        setSelectedFilter((prev) => (prev === option ? null : option));
        setSearchQuery("");
        setSelectAll(false); // 👈 Reset select all when changing filters
    };


    // const updateFilteredData = (selectedItemsInput) => {
    //     if (!selectedItemsInput || Object.keys(selectedItemsInput).length === 0) {
    //         setFilteredData(data);
    //         return;
    //     }

    //     const filteredSet = new Set();

    //     let hasActiveFilter = false;

    //     Object.entries(selectedItemsInput).forEach(([filterKey, filterValues]) => {
    //         if (!filterValues || filterValues.length === 0) return; // skip empty filters

    //         hasActiveFilter = true;

    //         const key = filterKey.toLowerCase().replace(/\s+/g, '_');

    //         data.forEach(item => {
    //             if (filterValues.includes(item[key])) {
    //                 filteredSet.add(item);
    //             }
    //         });
    //     });

    //     // If no filters actually applied, reset to full data
    //     if (!hasActiveFilter) {
    //         setFilteredData(data);
    //     } else {
    //         setFilteredData(Array.from(filteredSet));
    //     }
    // };


    const updateFilteredData = (selectedItemsInput) => {
        // If no filters selected, show full data
        if (!selectedItemsInput || Object.keys(selectedItemsInput).length === 0) {
            setFilteredData(data);
            return;
        }
    
        let updatedData = data;
    
        // Loop through each filter key and apply filtering
        Object.entries(selectedItemsInput).forEach(([filterKey, filterValues]) => {
            if (filterValues.length === 0) return;
    
            const key = filterKey.toLowerCase().replace(/\s+/g, '_');
    
            updatedData = updatedData.filter(item =>
                filterValues.includes(item[key])
            );
        });
    
        setFilteredData(updatedData);
    };
    
    
    const handleCheckboxChange = (item) => {
        setSelectedItems(prevSelectedItems => {
            const updatedSelectedItems = { ...prevSelectedItems };

            if (!updatedSelectedItems[selectedFilter]) {
                updatedSelectedItems[selectedFilter] = [];
            }

            if (updatedSelectedItems[selectedFilter].includes(item)) {
                updatedSelectedItems[selectedFilter] = updatedSelectedItems[selectedFilter].filter(i => i !== item);
            } else {
                updatedSelectedItems[selectedFilter] = [...updatedSelectedItems[selectedFilter], item];
            }

            updateFilteredData(updatedSelectedItems); // ✅ now uses the correct object

            return updatedSelectedItems;
        });
    };


    const handleSelectAll = () => {
        setSelectedItems(prevSelectedItems => {
            const updatedSelectedItems = { ...prevSelectedItems };

            const currentSelected = updatedSelectedItems[selectedFilter] || [];
            const allItemsSelected = currentSelected.length === filteredItems.length;

            updatedSelectedItems[selectedFilter] = allItemsSelected ? [] : filteredItems;

            updateFilteredData(updatedSelectedItems); // ✅ now uses the correct object

            return updatedSelectedItems;
        });
    };



    return (
        <>
            {/* Filter Button */}
            <div className="relative">
                <button
                    className="ml-2 flex items-center"
                    // className={`p-2 rounded-lg transition-colors ${showDropdown
                    //     ? "bg-[#598931]"
                    //     : "bg-[#F6FCF1] hover:bg-[#EAF7D6]"
                    //     }`}
                    onClick={() => {
                        setShowDropdown(!showDropdown)
                        setShowDropdown(!showDropdown);
                        setSelectedFilter(null);
                    }}
                    title="CategoryFilter"
                >
                    {/* <Filter
                        className={`transition-colors ${showDropdown ? "text-white" : "text-[#598931]"
                            }`}
                        size={20}
                    /> */}
                    <TbFilterSearch className="bg-primary text-white rounded-[4px] p-1" size={25} />
                </button>

                {/* Main Filter Dropdown */}
                <div className="absolute flex top-full right-[250px] gap-[250px] ">
                    <div>
                        {selectedFilter && (
                            <div className="absolute mt-12 min-w-[250px] max-w-[250px] bg-white border border-gray-300 rounded-lg shadow-md p-2 max-h-[250px] overflow-auto z-50">
                                <div className="flex justify-between items-center p-2 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            // ref={input => {
                                            //     if (input) input.indeterminate = isIndeterminate;
                                            // }}
                                            onChange={handleSelectAll}
                                            className="mr-2 w-5 h-5 accent-[#598931] cursor-pointer"
                                        />
                                        <Search size={16} className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full text-sm outline-none bg-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setSelectedFilter(null)}
                                        className="text-gray-500 hover:text-black"
                                    >
                                        <img
                                            src={Cancel}
                                            alt="Cancel"
                                            className="w-5 h-5 invert brightness-50"
                                        />
                                    </button>
                                </div>

                                <ul className="p-2 space-y-2">
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map((item, i) => (
                                            // <li
                                            //     key={i}
                                            //     className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg "
                                            // >
                                            //     <input
                                            //         type="checkbox"
                                            //         checked={selectedItems?.[selectedFilter]?.includes(item) || false}
                                            //         onChange={() => handleCheckboxChange(item)}
                                            //         className="w-4 h-4 accent-[#598931] cursor-pointer"
                                            //     />
                                            //     <span className="truncate">{item}</span>
                                            // </li>
                                            <li
                                                key={i}
                                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg py-1"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems?.[selectedFilter]?.includes(item) || false}
                                                    onChange={() => handleCheckboxChange(item)}
                                                    className="w-4 h-4 accent-[#598931] cursor-pointer"
                                                />
                                                <span className="truncate w-full text-sm leading-tight flex justify-start">{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 text-center py-2">
                                            No results found
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div>
                        {showDropdown && (
                            <div className="absolute mt-2 min-w-[300px] max-w-[400px] bg-white shadow-lg rounded-xl border border-gray-200 z-50 p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <button
                                        className="text-[#598931] font-medium"
                                        onClick={() => {
                                            setSelectedItems({});
                                            updateFilteredData({});
                                            setSelectAll(false);
                                        }}
                                    >
                                        <RefreshCcw />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            setSelectedFilter(null);
                                        }}
                                        className="text-gray-500 hover:text-black"
                                    >
                                        <img
                                            src={Cancel}
                                            alt="Cancel"
                                            className="w-5 h-5 invert brightness-50"
                                        />
                                    </button>
                                </div>
                                <ul className="space-y-3 text-[#598931] font-medium max-h-[250px] overflow-y-auto">
                                    {filterOptions.map((option, index) => (
                                        <li key={index} className="relative">
                                            <div
                                                className="flex justify-between items-center p-3 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
                                                onClick={() => toggleFilterDropdown(option)}
                                            >
                                                <span>{option}</span>
                                                <ChevronDown
                                                    className={`text-[#598931] transition-transform ${selectedFilter === option ? "rotate-180" : ""
                                                        }`}
                                                    size={18}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            {/* Sub-dropdown (Appears Beside Filter Box) */}

        </>
    )
}

export default CatalogueFilter;