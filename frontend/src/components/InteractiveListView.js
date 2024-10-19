import React, { useRef, useState } from 'react';
import { SearchOutlined, BarsOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popover, Tooltip, Pagination, ConfigProvider } from 'antd';
import Highlighter from 'react-highlight-words';
import label from '../assets/label.svg'
import useDrivePicker from 'react-google-drive-picker';
import { CLIENTID, DEVELOPERKEY, HOST } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

// Function to check if a value is numeric
const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

const InteractiveListView = () => {
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

    const columns = headers.map((header) => ({
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
        // maxWidth: '10%',
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
                {/* Scrollable table container */}
                <div style={{ width: '100%', overflowX: 'auto', maxHeight: maxHeight, }}>
                    <div style={{ minWidth: '1500px' }}>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: '#FFA500', // Orange
                                },
                            }}
                        >
                            <Table
                                columns={columns}
                                dataSource={paginatedData}
                                pagination={false}
                                rowClassName="custom-row"
                                scroll={{ x: true }}
                            />
                        </ConfigProvider>
                    </div>
                </div>

                {/* Pagination outside the scroll */}
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '16px' }}>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#FFA500', // Orange
                            },
                        }}
                    >
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
                    </ConfigProvider>

                </div>
            </div>
        </div>
    )
};

export default InteractiveListView;
