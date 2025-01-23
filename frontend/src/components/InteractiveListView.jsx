import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Popover, Tooltip, Pagination, ConfigProvider } from 'antd';
import Highlighter from 'react-highlight-words';
import label from '../assets/label.svg'
import useDrivePicker from 'react-google-drive-picker';
import { CLIENTID, DEVELOPERKEY, HOST } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Resizable } from 'react-resizable';
import './table.css';
import { BackIcon } from '../assets/svgIcons';
import { headers, data } from '../utils/InetractiveList_DumyData';
import Table from './interactive_list/Table';
import TitleBarPreview from './TitleBarPreview';

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

const filterHeader = [
    "country",
    "region",
    "population",
    "gdp_(usd_billions)",
    "gdp_per_capita",
    "life_expectancy",
    "literacy_rate",
    "internet_users_%",
    "urbanization_%",
    "co2_emissions_(tons)",
    "renewable_energy_%",
    "trade_balance_(usd_m)",
    "fdi_inflow_(usd_m)",
    "tourism_revenue_(usd_m)",
    "healthcare_spending_%",
    "r&d_investment_%",
    "youth_population_%",
    "export_value_(usd_m)",
    "import_value_(usd_m)",
    "education_spending_%"
]

const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

const maxHeight = window.innerHeight - 220;

const loadColumnWidthsFromCookies = () => {
    const savedWidths = Cookies.get('InteractiveListSavedColumnWidths');
    return savedWidths ? JSON.parse(savedWidths) : null;
};

const saveColumnWidthsToCookies = (columnWidths) => {
    Cookies.set('InteractiveListSavedColumnWidths', JSON.stringify(columnWidths), { expires: 7 }); // Cookie expires in 7 days
};

const InteractiveListView = () => {
    const [filterInfo, setfilterInfo] = useState({})
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Set your page size
    const [searchedColumns, setSearchedColumns] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
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

    // Set filtered data to the full data initially
    useEffect(() => {
        setFilteredData(data);
    }, [data]);

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

        // Filter the full data and update the filteredData state
        const newFilteredData = data.filter((record) =>
            record[dataIndex].toString().toLowerCase().includes(selectedKeys[0].toLowerCase())
        );
        setFilteredData(newFilteredData);
        setCurrentPage(1); // Reset to the first page after filtering
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText('');
        setSearchedColumns((prev) => prev.filter(column => column !== dataIndex));
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
        // filteredValue: filterInfo && filterInfo[dataIndex] || "",
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

    useEffect(() => {
        const savedColumnWidths = loadColumnWidthsFromCookies();

        if (savedColumnWidths) {
            const newColumns = columns.map((col, index) => ({
                ...col,
                width: savedColumnWidths[index] || col.width, // Use saved width or fallback to default width
            }));

            setColumns(newColumns);
        }
    }, []);

    const handleResize = (index) => (_, { size }) => {
        const newColumns = [...columns];
        newColumns[index] = {
            ...newColumns[index],
            width: size.width,
        };
        setColumns(newColumns);

        // Get current column widths and save to cookies
        const columnWidths = newColumns.map((col) => col.width);
        saveColumnWidthsToCookies(columnWidths);
    };

    const mergedColumns = columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
            width: column.width,
            onResize: handleResize(index),
            style: {
                backgroundColor: searchedColumns.includes(column.dataIndex) ? 'rgb(216 216 216)' : 'transparent',  // Apply blue background to the entire header cell
                // color: searchedColumns.includes(header) ? '#fff' : '#000',
            }
        }),
    }));

    // Function to handle pagination and slice the data
    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
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
            <div className='w-full px-[30px]'>
            <TitleBarPreview 
            appName={"Interactive List"} 
            spreadSheetID={"1Mp4Fnw22ukZyZaWtP-apjcHCUeuWswqCYGHX9xEhTbQ"} 
            spreadSheetName={"Data"} 
            />
            </div>

            <Table
                data={data}
                tempHeader={headers}
                headers={filterHeader}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                paginatedData={paginatedData}
                // loading={loading}
                // isEditMode={isEditMode}
                // isedit={isedit}
                // setIsedit={setIsedit}
                // handleEdit={handleEdit}
                // handleDelete={handleDelete}
                // settings={settings}
                // freezeCol={freezeCol}
                // setFreezeCol={setFreezeCol}
                // globalOption={globalOption}
                // setGlobalOption={setGlobalOption}
                // ischecked={ischecked}
                // setIschecked={setIschecked}
                // EditData={EditData}
                // setEditData={setEditData}
                // handleBulkDelete={handleBulkDelete}
                // headerBgColor={headerBgColor}
                // headerTextColor={headerTextColor}
                // headerFontSize={headerFontSize}
                // headerFontFamily={headerFontFamily}
                // bodyTextColor={bodyTextColor}
                // bodyFontSize={bodyFontSize}
                // bodyFontFamily={bodyFontFamily}
            />
        </div>
    )
};

export default InteractiveListView;