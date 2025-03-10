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
const convertArrayToJSON = (data) => {
    // The first array contains the keys
    const keys = data[0];

    // Map the rest of the arrays to JSON objects
    const jsonData = data.slice(2).map((item, index) => {
        const jsonObject = {};
        keys.forEach((key, i) => {
            jsonObject[key.replace(/\s+/g, '_').toLowerCase()] = item[i]; // Replace spaces with underscores and make keys lowercase
        });
        return { key_id: (index + 1).toString(), ...jsonObject }; // Add key_id
    });

    return jsonData;
};

const InteractiveListPreview = ({ data, headers }) => {

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


    headers = headers?.map((r) => { return r.replace(/ /g, '_').toLowerCase() })
    data = convertArrayToJSON(data);

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

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (

            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                {console.log("selectedKeys", dataIndex, selectedKeys)}
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
    const maxHeight = window.innerHeight - 185;

    const columns = headers.map((header) => ({
        title: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {/* <span>{header.replace(/_/g, ' ').toUpperCase()}</span> */}
                {/* <Tooltip title={header.replace(/_/g, ' ').toUpperCase()}> */}
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
                {/* </Tooltip> */}
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
        <div className=''>
            <div style={{ position: 'relative', zIndex: '10' }} className='relative z-10'>
                {/* Scrollable table container */}
                <div style={{ width: '100%', overflowX: 'auto', maxHeight: maxHeight, }}>
                    <div style={{}}>
                        <Table
                            columns={columns}
                            dataSource={paginatedData}
                            pagination={false}
                            rowClassName="custom-row"
                            size="small"
                            sticky
                            scroll={{ x: "max-content" }}
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
        </div>
    )
};

export default InteractiveListPreview;
