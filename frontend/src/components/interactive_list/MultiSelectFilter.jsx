import { useState, memo, useMemo, useCallback, useEffect } from "react";
import { Pagination, Input, Avatar, Popover, Checkbox, Space, Button, AutoComplete, Switch } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { IoSaveSharp, IoSearchOutline } from "react-icons/io5";

const MultiSelectFilter = ({ data, filteredData, setFilteredData, globalOption, setGlobalOption, columnKey, closePopover, index }) => {
    const [selectedValues, setSelectedValues] = useState([]);
    const [searchText, setSearchText] = useState("");
    console.log({ filteredData, data, columnKey, globalOption, selectedValues });


    // Step 1: Create initialData with unique labels and counts
    // const initialData = Object.values(
    //     filteredData.reduce((acc, data) => {
    //         const label = data[columnKey];
    //         const value = data[columnKey];

    //         if (acc[label]) {
    //             acc[label].count += 1; // Increment the count if the label already exists
    //         } else {
    //             acc[label] = { label, value, count: 1 }; // Add a new label with a count of 1
    //         }

    //         return acc;
    //     }, {})
    // ).map((item) => ({
    //     ...item,
    //     label: `${item.label} (${item.count})`, // Add the count to the label
    // }));

    const initialData = () => {
        return Object.values(
            filteredData.reduce((acc, data) => {
                const label = data[columnKey];
                const value = data[columnKey];

                if (acc[label]) {
                    acc[label].count += 1;
                } else {
                    acc[label] = { label, value, count: 1 };
                }

                return acc;
            }, {})
        ).map((item) => ({
            ...item,
            label: `${item.label} (${item.count})`,
        }));
    };



    // const initialData = useMemo(() => {
    //     return Object.values(
    //         filteredData.reduce((acc, data) => {
    //             const label = data[columnKey];
    //             const value = data[columnKey];

    //             if (acc[label]) {
    //                 acc[label].count += 1;
    //             } else {
    //                 acc[label] = { label, value, count: 1 };
    //             }

    //             return acc;
    //         }, {})
    //     ).map((item) => ({
    //         ...item,
    //         label: `${item.label} (${item.count})`,
    //     }));
    // }, [filteredData, columnKey]);


    const [options, setOptions] = useState(initialData);
    console.log({ options });

    const handleSelectAll = () => {
        let updatedOptions = globalOption[columnKey] || [];
        if (globalOption[columnKey].length === options.length || selectedValues.length === options.length) {
            setSelectedValues([]);
            setGlobalOption((prev) => ({ ...prev, [columnKey]: [] }));
            return;
        } else {
            setSelectedValues(options.map((option) => option.value));
            setGlobalOption((prev) => ({ ...prev, [columnKey]: options.map((option) => option.value) }));
        }
    };

    // const handleSelect = (value) => {
    //     console.log({ value, selectedValues, globalOption });
    //     let updatedOptions = globalOption[columnKey] || [];
    //     if (globalOption[columnKey]?.includes(value) || selectedValues.includes(value)) {
    //         setSelectedValues((prev) => {
    //             let updatedOption = prev.filter((item) => item !== value);
    //             updatedOptions = [...updatedOptions, ...updatedOption];
    //             return prev.filter((item) => item !== value);
    //         });
    //     } else {
    //         setSelectedValues((prev) => {
    //             let updatedOption = [...prev, value];
    //             updatedOptions = [...updatedOptions, ...updatedOption];
    //             return [...prev, value]
    //         });
    //     }
    //     setGlobalOption((prev) => ({ ...prev, [columnKey]: updatedOptions }));
    // };

    const handleSelect = (value) => {
        console.log({ value, selectedValues, globalOption });

        setSelectedValues((prev) => {
            let updatedValues;

            if (prev.includes(value)) {
                // Remove unchecked value from selectedValues
                updatedValues = prev.filter((item) => item !== value);
            } else {
                // Add new checked value to selectedValues
                updatedValues = [...prev, value];
            }

            // Update globalOption with unique values
            setGlobalOption((prevGlobal) => ({
                ...prevGlobal,
                [columnKey]: [...new Set(updatedValues)]
            }));

            return updatedValues;
        });
    };


    // const handleSearch = useCallback((searchText) => {
    //     if (searchText) {
    //         const filteredOptions = initialData.filter(option =>
    //             option.label?.toLowerCase().includes(searchText.toLowerCase())
    //         );
    //         setOptions(filteredOptions);
    //     } else {
    //         setOptions(initialData);
    //     }
    // }, [initialData]);

    // const handleSearch = (searchText) => {
    //     console.log({ searchText, initialData });
    //     if (searchText.trim()) {
    //         const filteredOptions = initialData.filter((option) =>
    //             option.label?.toLowerCase().includes(searchText.toLowerCase())
    //         );
    //         setOptions(filteredOptions);
    //     } else {
    //         setOptions([...initialData]); // Reset options when search is cleared
    //     }
    // };


    const handleSearch = (searchText) => {
        console.log({ searchText, initialData: initialData() });
        setSearchText(searchText);
    
        const initialOptions = initialData(); // Call the function to get the data
    
        if (searchText.trim()) {
            const filteredOptions = initialOptions.filter((option) =>
                option.label?.toLowerCase().includes(searchText.toLowerCase())
            );
            setOptions(filteredOptions);
        } else {
            setOptions([...initialOptions]); // Reset options when search is cleared
        }
    };
    

    // const handleMultiSearch = () => {
    //     if (selectedValues.length == 0 && globalOption[columnKey].length == 0) {
    //         setFilteredData(data);
    //         return;
    //     }

    //     const filteredDataTemp = filteredData.filter((item) => {
    //         return globalOption[columnKey].includes(item[columnKey]) || selectedValues.includes(item[columnKey])
    //     });
    //     setFilteredData(filteredDataTemp);
    //     // closePopover();
    // };

    const handleMultiSearch = () => {
        if (selectedValues.length === 0 && globalOption[columnKey].length === 0) {
            // Reapply filtering using all active globalOptions (excluding empty arrays)
            const updatedFilteredData = data.filter((item) => {
                return Object.keys(globalOption).every((key) => {
                    // If the globalOption array for a column is empty, ignore filtering that column
                    return globalOption[key].length === 0 || globalOption[key].includes(item[key]);
                });
            });
    
            setFilteredData(updatedFilteredData);
            return;
        }
    
        const filteredDataTemp = filteredData.filter((item) => 
            globalOption[columnKey].includes(item[columnKey]) || selectedValues.includes(item[columnKey])
        );
    
        setFilteredData(filteredDataTemp);
    };
    
    
    // const handleReset = useCallback(() => {
    //     setGlobalOption((prev) => ({ ...prev, [columnKey]: [] }));
    //     const globalColumn = Object.keys(globalOption).map((key) => {
    //         if (key == columnKey) {
    //             return null
    //         } else {
    //             return key;
    //         }
    //     })

    //     if (globalColumn.length == 0 || globalColumn.every((item) => item == null)) {
    //         setFilteredData(data);
    //         return;
    //     }

    //     let globalFilterData = [];
    //     globalColumn.map((key) => {
    //         let filteredDataTemp = data.filter((item) => {
    //             // console.log({ key, item });
    //             // console.log({ globalOption });
    //             if (key) {
    //                 return globalOption[key].includes(item[key]);
    //             }

    //         });
    //         globalFilterData = [...globalFilterData, ...filteredDataTemp];
    //     })
    //     // const filteredDataTemp = data.filter((item) => {

    //     // })
    //     // setSelectedValues([]);
    //     setFilteredData(globalFilterData);
    //     // closePopover();
    // }, [selectedValues, globalOption, columnKey]);

    // const handleReset = useCallback(() => {
    //     // Clear global options for the current columnKey
    //     setGlobalOption((prev) => ({ ...prev, [columnKey]: [] }));

    //     // Reset selected values
    //     setSelectedValues([]);

    //     // Reset options to the initial state
    //     setOptions(initialData);

    //     // Check if any other columns in globalOption have filters applied
    //     const globalColumn = Object.keys(globalOption).filter((key) => key !== columnKey && globalOption[key]?.length > 0);

    //     if (globalColumn.length === 0) {
    //         // If no other filters are applied, reset the table to the original data
    //         setFilteredData(data);
    //     } else {
    //         // Filter data based on remaining filters in globalOption
    //         let globalFilterData = [];
    //         globalColumn.forEach((key) => {
    //             const filteredDataTemp = data.filter((item) => globalOption[key].includes(item[key]));
    //             globalFilterData = [...globalFilterData, ...filteredDataTemp];
    //         });
    //         setFilteredData(globalFilterData);
    //     }
    // }, [data, globalOption, columnKey, initialData]);

    // const handleReset = () => {
    //     setGlobalOption((prev) => ({ ...prev, [columnKey]: [] }));
    //     setSelectedValues([]);
    //     setSearchText(""); // Clear input field
    //     setOptions([...initialData()]); // Reset dropdown options
    //     setFilteredData(data); // Reset table
    //     closePopover(); // Optionally close the dropdown
    // };

    const handleReset = () => {
        // Reset only for the specific column key
        setGlobalOption((prev) => ({ ...prev, [columnKey]: [] }));

        // Filter and reset `selectedValues` based on the specific column key
        setSelectedValues((prev) => prev.filter((value) => !globalOption[columnKey]?.includes(value)));

        // Clear search text and reset options for the specific column
        setSearchText("");
        setOptions([...initialData()]); // Reset dropdown options

        // Reset table data by applying filtered conditions if needed
        const filtered = data.filter(item => {
            return !globalOption[columnKey]?.includes(item[columnKey]);
        });

        setFilteredData(filtered.length ? filtered : data);

        // Optionally close the dropdown
        closePopover();
    };


    const [dropdownOpen, setDropdownOpen] = useState(false);



    // const handleReset = () => {
    //     console.log({ globalOption, columnKey, selectedValues });
    //     setGlobalOption((prev) => ({ ...prev, [columnKey]: [] }));
    //     const globalColumn = Object.keys(globalOption).map((key) => {
    //         if (key == columnKey) {
    //             return null
    //         } else {
    //             return key;
    //         }
    //     })

    //     if (globalColumn.length == 0 || globalColumn.every((item) => item == null)) {
    //         setFilteredData(data);
    //         return;
    //     }

    //     let globalFilterData = [];
    //     globalColumn.map((key) => {
    //         let filteredDataTemp = data.filter((item) => {
    //             // console.log({ key, item });
    //             // console.log({ globalOption });
    //             if (key) {
    //                 return globalOption[key].includes(item[key]);
    //             }

    //         });
    //         globalFilterData = [...globalFilterData, ...filteredDataTemp];
    //     })
    //     // const filteredDataTemp = data.filter((item) => {

    //     // })
    //     // setSelectedValues([]);
    //     console.log(globalFilterData)
    //     setFilteredData(globalFilterData);
    //     // closePopover();
    // };



    return (
        <div className="flex-row justify-between items-center" style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <div className="flex justify-between">
                <Button
                    type="primary"
                    onClick={() => handleMultiSearch()}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 80 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => {
                        handleReset();
                    }}
                    size="small"
                    style={{ width: 80 }}
                >
                    Reset
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        closePopover();
                    }}
                >
                    Close
                </Button>
            </div>
            <div className="pt-2">
                <Checkbox
                    className="mr-2 text-primary rounded-md"
                    style={{
                        transform: "scale(1.4)", // Scale up the size of the checkbox
                    }}
                    onChange={handleSelectAll}
                    checked={
                        (globalOption[columnKey]?.length === options.length ||
                            selectedValues.length === options.length) &&
                        options.length > 0
                    }
                    value="all"
                />

                {/* <AutoComplete
                    style={{
                        // paddingTop: 8,
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
                        <AutoComplete.Option key={option.value}><Checkbox onChange={(e) => {
                            handleSelect(option.value);
                        }} checked={globalOption[columnKey]?.includes(option.value) || selectedValues.includes(option.value)} value={option.value} title={option.label}>{option.label}</Checkbox></AutoComplete.Option>
                    ))}
                </AutoComplete> */}

                {/* <AutoComplete
                    style={{ width: 200 }}
                    placeholder="Search here"
                    filterOption={false}
                    onSearch={(value) => {
                        setSearchText(value);
                        handleSearch(value);
                    }}
                    value={searchText} // Reset input on clear
                >
                    {options.map((option) => (
                        <AutoComplete.Option key={option.value} mode="tags">
                            <Checkbox
                                onChange={(e) => handleSelect(option.value)}
                                checked={
                                    globalOption[columnKey]?.includes(option.value) || selectedValues.includes(option.value)
                                }
                                value={option.value}
                                title={option.label}
                                mode="tags"
                            >
                                {option.label}
                            </Checkbox>
                        </AutoComplete.Option>
                    ))}
                </AutoComplete> */}

                <AutoComplete
                    style={{ width: 200 }}
                    placeholder="Search here"
                    filterOption={false}
                    onSearch={handleSearch}
                    open={dropdownOpen}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)} // Optional delay to allow click events
                    onFocus={() => setDropdownOpen(true)}
                    value={searchText}
                    // dropdownMatchSelectWidth={false} // Prevents unwanted resizing
                    virtual // Enables virtual scrolling
                >
                    {options.map((option) => (
                        <AutoComplete.Option key={option.value}>
                            <Checkbox
                                onChange={(e) => handleSelect(option.value, e.target.checked)}
                                checked={selectedValues.includes(option.value)}
                            >
                                {option.label}
                            </Checkbox>
                        </AutoComplete.Option>
                    ))}
                </AutoComplete>
            </div>
        </div>
    )
};


export default MultiSelectFilter;