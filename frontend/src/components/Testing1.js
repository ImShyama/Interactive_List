import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popover, Tooltip, Pagination, ConfigProvider } from 'antd';
import Highlighter from 'react-highlight-words';
import label from '../assets/label.svg'
import useDrivePicker from 'react-google-drive-picker';
import { CLIENTID, DEVELOPERKEY, HOST } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Resizable } from 'react-resizable';
import './table.css';

const ResizableTitle = (props) => {
    const { onResize, width, ...restProps } = props;
    if (!width) {
        return <th {...restProps} />;
    }
    return (
        <Resizable
            width={width}
            height={0}
            handle={<span className="react-resizable-handle" onClick={(e) => e.stopPropagation()} />}
            onResize={onResize}
            draggableOpts={{
                enableUserSelectHack: false,
            }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

// Function to check if a value is numeric
const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

const Testing1 = () => {
    const [filterInfo, setfilterInfo] = useState({})
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Set your page size
    const [searchedColumns, setSearchedColumns] = useState([]);
    const searchInput = useRef(null);
    const navigate = useNavigate();



    // Utility functions to calculate aggregates dynamically
    const calculateSum = (dataIndex) => {
        const sum = data.reduce((total, record) => {
            // Convert the value to a number before summing
            const value = parseFloat(record[dataIndex]);

            // Check if the value is numeric and add it to the total
            if (!isNaN(value)) {
                return total + value;
            }
            return total;
        }, 0);

        return sum;
    };

    const headers = [
        "manager_name",
        "employee_name",
        "employee_e-mail_id",
        "feedback_month",
        "site_timings",
        "total_score_(in_100)",
        "year"
    ]

    const data = [
        {
            "key_id": "1",
            "manager_name": "Shubham Khanna",
            "employee_name": "Nisha",
            "employee_e-mail_id": "sus@tnspll.in",
            "feedback_month": "January",
            "site_timings": "7",
            "total_score_(in_100)": "69",
            "year": "2020"
        },
        {
            "key_id": "2",
            "manager_name": "Shubham Khanna",
            "employee_name": "Mukesh Prajapati",
            "employee_e-mail_id": "sus@tnspll.in",
            "feedback_month": "January",
            "site_timings": "3",
            "total_score_(in_100)": "34",
            "year": "2020"
        },
        {
            "key_id": "3",
            "manager_name": "Shubham Khanna",
            "employee_name": "Sushil",
            "employee_e-mail_id": "sus@tnspll.in",
            "feedback_month": "January",
            "site_timings": "3",
            "total_score_(in_100)": "48",
            "year": "2020"
        },
        {
            "key_id": "4",
            "manager_name": "Shubham Khanna",
            "employee_name": "Gaurav",
            "employee_e-mail_id": "kul@tnspll.in",
            "feedback_month": "January",
            "site_timings": "5",
            "total_score_(in_100)": "33",
            "year": "2020"
        },
        {
            "key_id": "5",
            "manager_name": "Shubham Khanna",
            "employee_name": "Kuldeep",
            "employee_e-mail_id": "kul@tnspll.in",
            "feedback_month": "January",
            "site_timings": "0",
            "total_score_(in_100)": "37",
            "year": "2020"
        },
        {
            "key_id": "6",
            "manager_name": "Shubham Khanna",
            "employee_name": "Phool Babu",
            "employee_e-mail_id": "pb@tnspll.in",
            "feedback_month": "January",
            "site_timings": "1",
            "total_score_(in_100)": "53",
            "year": "2020"
        },
        {
            "key_id": "7",
            "manager_name": "Shubham Khanna",
            "employee_name": "Avesh",
            "employee_e-mail_id": "av@tnspll.in",
            "feedback_month": "February",
            "site_timings": "5",
            "total_score_(in_100)": "70",
            "year": "2020"
        },
        {
            "key_id": "8",
            "manager_name": "Kusum",
            "employee_name": "Manoj",
            "employee_e-mail_id": "mn@tnspll.in",
            "feedback_month": "February",
            "site_timings": "8",
            "total_score_(in_100)": "77",
            "year": "2020"
        },
        {
            "key_id": "9",
            "manager_name": "Kusum",
            "employee_name": "Dharamveer",
            "employee_e-mail_id": "dh@tnspll.in",
            "feedback_month": "February",
            "site_timings": "2",
            "total_score_(in_100)": "53",
            "year": "2020"
        },
        {
            "key_id": "10",
            "manager_name": "Kusum",
            "employee_name": "Akhlesh",
            "employee_e-mail_id": "ak@tnspll.in",
            "feedback_month": "February",
            "site_timings": "5",
            "total_score_(in_100)": "50",
            "year": "2020"
        },
        {
            "key_id": "11",
            "manager_name": "Amit Sharma",
            "employee_name": "Dubey",
            "employee_e-mail_id": "du@tnspll.in",
            "feedback_month": "September",
            "site_timings": "7",
            "total_score_(in_100)": "42",
            "year": "2020"
        }
    ]

    const calculateAverage = (dataIndex) => {
        const sum = calculateSum(dataIndex);
        const avg = sum / data.filter((record) => isNumeric(record[dataIndex])).length;
        return avg.toFixed(2);
    };

    const calculateCount = (dataIndex) => {
        return data.length;
    };

    // Function to generate popover content for each column
    const getAggregatePopoverContent = (dataIndex) => {
        const isNumberColumn = data.some((record) => isNumeric(record[dataIndex]));

        return (
            <div>
                <p>Σ Sum: {isNumberColumn ? calculateSum(dataIndex) : 'NA'}</p>
                <p>% Average: {isNumberColumn ? calculateAverage(dataIndex) : 'NA'}</p>
                <p># Count: {calculateCount(dataIndex)}</p>
            </div>
        );
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearchedColumns((prev) => [...new Set([...prev, dataIndex])]);
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText('');
        setSearchedColumns((prev) => prev.filter(column => column !== dataIndex));
    };

    const handleGlobalReset = () => {
        setSearchGlobal(''); // Clear the search input
        setfilterInfo({})
        setFilteredData([...filteredData]);
        setSearchedColumns([]);
    };

    const handleGlobalSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchGlobal(value);

        // Filter the data globally across all columns
        const filteredData = data.filter((record) => {
            return Object.keys(record).some((key) =>
                record[key]?.toString().toLowerCase().includes(value)
            );
        });

        // You can then set this filtered data to a state if needed
        setFilteredData(filteredData);
    };


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (

            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>

                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters &&
                                handleReset(clearFilters, dataIndex);
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    {/* <Button
                        type="link"
                        size="small"
                        // style={{ color: '#FFA500' }}
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button> */}
                    <Button
                        type="link"
                        size="small"
                        // style={{ color: '#FFA500' }}
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#FFA500' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filteredValue: filterInfo && filterInfo[dataIndex] || "",
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => (searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
        ) : text),
    });

    // Helper function to check if data is a valid URL
    const isValidUrl = (data) => {
        try {
            new URL(data); // URL constructor throws if the URL is invalid
            return true;

        } catch (_) {
            return false;
        }
    };

    // Calculate maxHeight based on window height
    const maxHeight = window.innerHeight - 220;

    const [columns, setColumns] = useState(headers.map((header) => ({
        title: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {/* <span>{header.replace(/_/g, ' ').toUpperCase()}</span> */}
                <Tooltip title={header.replace(/_/g, ' ').toUpperCase()}>
                    <span
                        style={{
                            overflow: 'hidden',
                            whiteSpace: 'normal',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            maxWidth: 100, // Adjust the width to your preference

                        }}
                    >
                        {header.replace(/_/g, ' ').toUpperCase()}
                    </span>
                </Tooltip>
                <Popover content={getAggregatePopoverContent(header)} trigger="click" placement="bottom">
                    <img src={label} alt="label" style={{ marginLeft: 8, cursor: 'pointer', height: "18px" }} />
                    {/* <BarsOutlined style={{ marginLeft: 8, cursor: 'pointer' }} /> */}
                </Popover>

            </div>
        ),
        dataIndex: header,
        key: header,
        width: 200,
        ...getColumnSearchProps(header),

        sorter: (a, b) => {
            if (isNumeric(a[header]) && isNumeric(b[header])) {
                return a[header] - b[header];
            }
            return a[header].toString().localeCompare(b[header].toString());
        },
        render: (text) => {
            // Check if the email is a valid URL
            return isValidUrl(text) ? (
                <a href={text} target="_blank" rel="noopener noreferrer"
                    className="text-[#437FFF] font-poppins font-normal leading-[26.058px]"
                >
                    Click here
                </a>
            ) : (
                text
            );
        },
        onHeaderCell: () => ({
            style: {
                backgroundColor: searchedColumns.includes(header) ? 'rgb(216 216 216)' : 'transparent',  // Apply blue background to the entire header cell
                // color: searchedColumns.includes(header) ? '#fff' : '#000',
            }
        })
    })))

    const handleResize = (index) =>
        (_, { size }) => {
            const newColumns = [...columns];
            newColumns[index] = {
                ...newColumns[index],
                width: size.width,
            };
            setColumns(newColumns);
        };
    const mergedColumns = columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
            width: column.width,
            onResize: handleResize(index),
        }),
    }));

    // Function to handle pagination and slice the data
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const clientId = CLIENTID
    const developerKey = DEVELOPERKEY
    const token = Cookies.get('token');

    const handleAddSheet = (data) => {
        if (data.action === "picked") {
            console.log("data", data);

            axios
                .post(
                    `${HOST}/createNewSpreadsheet`,
                    {
                        url: data?.docs?.[0]?.url,
                        spreadSheetID: data?.docs?.[0]?.id,
                        sheetName: data?.docs?.[0]?.name,
                        appName: 'Interactive List'
                    },
                    {
                        headers: {
                            authorization: "Bearer " + token
                        },
                    }
                )
                .then(({ data: res, status }) => {
                    if (status === 200 && !res.error) {
                        console.log("res data: ", res);
                        // Redirect to edit page with the new spreadsheet ID
                        navigate(`/${res._id}/edit`);
                    } else {
                        alert(res.error);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };

    const [openPicker, authResponse] = useDrivePicker();

    const handleOpenPicker = () => {

        openPicker({
            clientId,
            developerKey,
            viewId: "DOCS",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button');
                }
                console.log(data);
                handleAddSheet(data);
            },
        });
    };

    return (
        <div>
            <div className='flex text-center justify-between px-[50px]'>
                <div><span className="text-[#2A3C54] font-poppins text-[30px] font-medium">Interactive List</span></div>
                <div>
                    <button className="flex w-[204px] h-[44px] p-[10px] justify-center items-center gap-[10px] flex-shrink-0 bg-[#FFB041] text-white rounded-md hover:bg-[#FFB041]"
                        onClick={handleOpenPicker}
                    >
                        <span className="text-white font-poppins text-[14px] font-bold leading-normal">+</span>
                        <span className="text-white font-poppins text-[14px] font-bold leading-normal">Create app from zero</span>
                        {/* + Create app from zero */}
                    </button>

                </div>
            </div>

            <div style={{ position: 'relative', zIndex: '10' }} className='relative z-10 px-[50px] py-[20px]'>
               
                <div style={{ width: '100%', overflowX: 'auto', maxHeight: maxHeight, }}>
                    <div style={{ minWidth: '1500px' }}>
                        <Table
                        bordered
                            components={{
                                header: {
                                    cell: ResizableTitle,
                                },
                            }}
                            columns={mergedColumns}
                            dataSource={paginatedData}
                            pagination={false}
                            rowClassName="custom-row"
                            scroll={{ x: true }}
                            // small
                            sticky
                        />
                    </div>
                </div>

                {/* Pagination outside the scroll */}
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '16px' }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={data.length}
                        showSizeChanger
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                    />
                </div>
            </div>
            {/* Dynamically Render Sliders for Selected Checkboxes */}
                                {selectedNumbers.length > 0 && (
                                    <div className="flex flex-wrap">
                                        {selectedNumbers.map((slider, index) => {
                                            const { min, max } = calculate_number_min_max(
                                                data,
                                                slider.column
                                            );
                                            console.log({ min, max });
                                            return (
                                                <div key={index} className="flex flex-col items-center mx-2">
                                                    {/* Column Label (Above Slider, Centered) */}
                                                    <span className="font-medium text-gray-700 mb-1">
                                                        {slider.column.split("_").join(" ").toUpperCase()}
                                                    </span>
            
                                                    {/* Range Slider with Values */}
                                                    <div className="flex flex-col items-center w-[200px] relative">
                                                        {/* Slider Component */}
                                                        <Slider
                                                            range
                                                            value={slider.range || [min, max]} // Use calculated min and max if range is not defined
                                                            onChange={(value) => {
                                                                // Update the range for the respective slider
                                                                setSelectedNumbers((prev) =>
                                                                    prev.map((s) =>
                                                                        s.column === slider.column
                                                                            ? { ...s, range: value }
                                                                            : s
                                                                    )
                                                                );
                                                                console.log({ value, slider, selectedNumbers });
                                                                console.log(slider.column, value);
                                                                updatefilterdata(slider.column, value);
                                                            }}
                                                            min={min} // Dynamically calculated min
                                                            max={max} // Dynamically calculated max
                                                            style={{
                                                                width: "100%", // Full width
                                                                height: "4px",
                                                            }}
                                                            trackStyle={{ height: "4px" }} // Uniform track height
                                                            handleStyle={{
                                                                height: "14px", // Same handle size as date slider
                                                                width: "14px",
                                                                border: "2px solid #598931",
                                                            }}
                                                        />
                                                        {/* Display Range Values (Below Slider, Centered) */}
                                                        <div className="flex justify-between w-full text-sm text-gray-700 mt-1">
                                                            <span>{slider.range ? slider.range[0] : min}</span>
                                                            <span>{slider.range ? slider.range[1] : max}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
            
                                {/* Dynamically Render Sliders for Selected Date Checkbox */}
                                {selectedDates.length > 0 && (
                                    <div className="flex flex-wrap">
                                        {selectedDates.map((slider, index) => {
                                            // Dynamically calculate min and max values for each slider
                                            const { min, max } = calculate_min_max(
                                                filteredData,
                                                slider.column
                                            );
                                            const minDate = min
                                                ? new Date(min).getTime()
                                                : new Date("2000-01-01").getTime();
                                            const maxDate = max
                                                ? new Date(max).getTime()
                                                : new Date().getTime();
            
                                            return (
                                                <div key={index} className="flex flex-col items-center mx-2">
                                                    {/* Column Label (Above Slider) */}
                                                    <span className="font-medium text-gray-700 mb-2">
                                                        {slider.column.split("_").join(" ").toUpperCase()}
                                                    </span>
            
                                                    {/* Range Slider */}
                                                    <div className="flex flex-col items-center w-[200px] relative">
                                                        {/* Slider Component */}
                                                        <Slider
                                                            range
                                                            value={
                                                                slider.range
                                                                    ? slider.range.map((date) =>
                                                                        new Date(date).getTime()
                                                                    )
                                                                    : [minDate, maxDate] // Default to dynamically calculated min and max
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
                                                                console.log({ value, slider, selectedDates });
                                                                console.log(slider.column, value);
                                                                // updateDateFilterData(slider.column, value);
                                                            }}
                                                            min={minDate} // Dynamically calculated min
                                                            max={maxDate} // Dynamically calculated max
                                                            step={24 * 60 * 60 * 1000} // Step is 1 day (in milliseconds)
                                                            style={{
                                                                width: "100%", // Full width
                                                                height: "4px", // Track height
                                                            }}
                                                            trackStyle={{ height: "4px" }} // Track height
                                                            handleStyle={{
                                                                height: "14px", // Handle size
                                                                width: "14px",
                                                                border: "2px solid #598931",
                                                            }}
                                                        />
                                                        {/* Display Range Values (Below Slider, Centered) */}
                                                        <div className="flex justify-between w-full text-sm text-gray-700 mt-1">
                                                            <span>
                                                                {slider.range
                                                                    ? new Date(slider.range[0]).toLocaleDateString(
                                                                        "en-GB"
                                                                    ) // Format as dd-mm-yyyy
                                                                    : min
                                                                        ? new Date(min).toLocaleDateString("en-GB") // Format as dd-mm-yyyy
                                                                        : ""}
                                                            </span>
                                                            <span>
                                                                {slider.range
                                                                    ? new Date(slider.range[1]).toLocaleDateString(
                                                                        "en-GB"
                                                                    ) // Format as dd-mm-yyyy
                                                                    : max
                                                                        ? new Date(max).toLocaleDateString("en-GB") // Format as dd-mm-yyyy
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
    )
};

export default Testing1;

