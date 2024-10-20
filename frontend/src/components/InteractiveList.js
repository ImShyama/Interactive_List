import {React, useEffect, useRef, useState, useContext } from 'react';
import { SearchOutlined, BarsOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popover, Tooltip, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';
import label from '../assets/label.svg'
import { BiSearch } from 'react-icons/bi';
import { useDispatch, useSelector } from "react-redux";
import EditableSpreadsheetName from "./EditableSpreadsheetName";
import DeleteAlert from './DeleteAlert';
import axios from 'axios';  // Assuming you're using axios for API calls
import { HOST } from '../utils/constants';  // Assuming you have HOST defined somewhere
import { UserContext } from "../context/UserContext";


// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//   },
//   {
//     key: '2',
//     name: 'Joe Black',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//   },
//   {
//     key: '3',
//     name: 'Jim Green',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//   },
//   {
//     key: '4',
//     name: 'Jim Red',
//     age: 32,
//     address: 'London No. 2 Lake Park',
//   },
// ];



// Function to check if a value is numeric
const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);
const convertArrayToJSON = (data) => {
  // The first array contains the keys
  const keys = data[0];

  // Map the rest of the arrays to JSON objects
  const jsonData = data.slice(1).map((item, index) => {
    const jsonObject = {};
    keys.forEach((key, i) => {
      jsonObject[key.replace(/\s+/g, '_').toLowerCase()] = item[i]; // Replace spaces with underscores and make keys lowercase
    });
    return { key_id: (index + 1).toString(), ...jsonObject }; // Add key_id
  });

  return jsonData;
};

const InteractiveList = ({ data, headers }) => {
  const [filterInfo, setfilterInfo] = useState({})
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumns, setSearchedColumns] = useState([]);
  const [searchGLobal, setSearchGlobal] = useState();
  const searchInput = useRef(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [rowToEdit, setRowToEdit] = useState(null);
  headers = headers.map((r) => { return r.replace(/ /g, '_').toLowerCase() })
  data = convertArrayToJSON(data);
  const [filteredData, setFilteredData] = useState(data);
  const { token } = useContext(UserContext);


  const tableChangehandler = (pagination, filters, sorter) => {
    setfilterInfo(filters)
  }
  // Check if the URL ends with /edit
  const isEditMode = window.location.pathname.endsWith('/edit');

  const settings = useSelector((state) => state.setting.settings);

  async function deleteRow(spreadSheetID, sheetName, rowIndex, token) {
    try {
      // Make the API call to your backend
      const response = await axios.post(
        `${HOST}/deleteRow`,
        {
          spreadSheetID,
          sheetName,
          rowIndex,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,  // Assuming you have the token for auth
          },
        }
      );
  
      // Handle success response
      console.log('Row deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      // Handle errors
      console.error('Failed to delete row:', error.response?.data?.error || error.message);
      throw error;
    }
  }


  useEffect(() => {
    // Only set filteredData if it's not already set or if data has changed
    if (data && data.length > 0 && filteredData.length === 0) {
      setFilteredData(data);
    }
  }, [data, filteredData]);


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


  const calculateSum = (dataIndex) => {
    const sum = filteredData.reduce((total, record) => {
      const value = parseFloat(record[dataIndex]);
      if (!isNaN(value)) {
        return total + value;
      }
      return total;
    }, 0);

    return sum;
  };



  // {header.replace(/_/g, ' ').toUpperCase()}
  const calculateAverage = (dataIndex) => {
    const sum = calculateSum(dataIndex);
    const avg = sum / filteredData.filter((record) => isNumeric(record[dataIndex])).length;
    return avg.toFixed(2);
  };

  const calculateCount = (dataIndex) => {
    return filteredData.length;
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
    setSearchedColumns((prev) => {
      return Array.isArray(prev) ? prev.filter(column => column !== dataIndex) : [];
    });
  };


  const handleGlobalReset = () => {
    setSearchGlobal(''); // Clear the search input
    setfilterInfo({})
    setFilteredData([...filteredData]);
    setSearchedColumns([]);
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


  const handleDeleteClick = (record) => {
    setRowToDelete(+record.key_id + 1);
    setConfirmModalOpen(true);
    console.log(+record.key_id + 1);
  }

  const handleDeleteCancel = () => {
    setConfirmModalOpen(false);
  };

  const handleDeleteRow = () => {
    console.log(rowToDelete)
    const status = deleteRow(settings.spreadsheetId, settings.firstSheetName, rowToDelete)
    setConfirmModalOpen(false);
  };

  async function deleteRow(spreadSheetID, sheetName, rowIndex) {
    try {
      // Make the API call to your backend
      const response = await axios.post(
        `${HOST}/deleteRow`,
        {
          spreadSheetID,
          sheetName,
          rowIndex,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,  // Assuming you have the token for auth
          },
        }
      );
  
      // Handle success response
      console.log('Row deleted successfully:', response.data);
      console.log('Filtered data:', filteredData);
      const updatedData = filteredData.filter((row) => row.key_id != rowIndex-1);
      setFilteredData(updatedData);
      return response.data;
    } catch (error) {
      // Handle errors
      console.error('Failed to delete row:', error.response?.data?.error || error.message);
      throw error;
    }
  }

  const handleEdit = (record) => {
    console.log(record)
  }

  // Calculate maxHeight based on window height
  const maxHeight = window.innerHeight - 220;



  const columns = [
    ...headers.map((header, index) => ({
      title: (
        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
            <img src={label} alt="label" style={{ marginLeft: 8, cursor: 'pointer', height: '18px' }} />
          </Popover>
        </div>
      ),
      dataIndex: header,
      key: header,
      // maxWidth: '10%',
      width: "200px",
      ellipsis: true,
      ...getColumnSearchProps(header),
      sorter: (a, b) => {
        if (isNumeric(a[header]) && isNumeric(b[header])) {
          return a[header] - b[header];
        }
        return a[header].toString().localeCompare(b[header].toString());
      },
      render: (text) => {
        return isValidUrl(text) ? (
          <a href={text} target="_blank" rel="noopener noreferrer" className="text-[#437FFF] font-poppins font-normal leading-[26.058px]">
            Click here
          </a>
        ) : (
          text
        );
      },
      onHeaderCell: () => ({
        style: {
          backgroundColor: searchedColumns.includes(header) ? 'rgb(216 216 216)' : 'transparent',
        },
      }),
    })),

    // Conditionally add the Action column if params includes 'edit'
    ...(isEditMode
      ? [
        {
          title: 'Action',
          key: 'operation',
          fixed: 'right', // Optional: This will fix the column on the right side of the table
          width: 100,
          render: (record) => (
            <div className='flex gap-2'>
              <button onClick={() => handleEdit(record)}>
                <div className="group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:stroke-orange-500">
                    <g clipPath="url(#clip0_508_940)">
                      <path d="M17.6462 5.67633C18.0868 5.23585 18.3344 4.63839 18.3345 4.01538C18.3346 3.39237 18.0871 2.79484 17.6467 2.35425C17.2062 1.91366 16.6087 1.66609 15.9857 1.66602C15.3627 1.66594 14.7652 1.91335 14.3246 2.35383L3.20291 13.478C3.00943 13.6709 2.86634 13.9084 2.78625 14.1697L1.68541 17.7963C1.66388 17.8684 1.66225 17.945 1.68071 18.0179C1.69916 18.0908 1.73701 18.1574 1.79024 18.2105C1.84347 18.2636 1.9101 18.3014 1.98305 18.3197C2.05599 18.3381 2.13255 18.3363 2.20458 18.3147L5.83208 17.2147C6.09306 17.1353 6.33056 16.9931 6.52375 16.8005L17.6462 5.67633Z" stroke="#919191" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12.5 4.16602L15.8333 7.49935" stroke="#919191" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_508_940">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </button>
              <button onClick={() => handleDeleteClick(record)}>
                <div className="group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:stroke-orange-500">
                    <path d="M2.5 5H17.5" stroke="#919191" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.8346 5V16.6667C15.8346 17.5 15.0013 18.3333 14.168 18.3333H5.83464C5.0013 18.3333 4.16797 17.5 4.16797 16.6667V5" stroke="#919191" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.66797 4.99935V3.33268C6.66797 2.49935 7.5013 1.66602 8.33464 1.66602H11.668C12.5013 1.66602 13.3346 2.49935 13.3346 3.33268V4.99935" stroke="#919191" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.33203 9.16602V14.166" stroke="#919191" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.668 9.16602V14.166" stroke="#919191" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
              {/* <a
                onClick={() => handleAction(record)}
                style={{ color: '#437FFF', cursor: 'pointer' }}
              >
                Action
              </a> */}

            </div>
          ),
        },
      ]
      : []),
  ];


  // Function to handle pagination and slice the data
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div className='flex text-center justify-between px-[50px]'>

        {settings && <EditableSpreadsheetName settings={settings} />}
        {/* <div><span className="text-[#2A3C54] font-poppins text-[30px] font-medium">{settings.spreadsheetName}</span></div> */}
        <div>
          <Input
            prefix={<BiSearch />}
            value={searchGLobal}
            onChange={handleGlobalSearch}
            style={{ width: "200px" }}
            className="min-w-[150px] px-4 py-2 mx-2"
            placeholder="Search"
          />
          <button
            onClick={handleGlobalReset}
            className="border border-[#FFA500] text-[#FFA500] px-4 py-2 rounded-md hover:bg-[#FFA500] hover:text-white transition-colors duration-200">
            <span>Reset</span>
          </button>

        </div>
      </div>

      <div style={{ position: 'relative', zIndex: '10' }} className='relative z-10 px-[50px] py-[20px]'>
        {/* Scrollable table container */}
        <div style={{ width: '100%' }}>
          {/* style={{ width: '100%', overflowX: 'auto', maxHeight: maxHeight, }} */}
          <div style={{}}>
            <Table
              onChange={tableChangehandler}
              columns={columns}
              dataSource={paginatedData}
              pagination={false}
              rowClassName="custom-row"
              scroll={{ x: "max-content" }}
              style={{ maxHeight: maxHeight, overflowY: 'auto', }}
              sticky
            />
          </div>
        </div>

        {/* Pagination outside the scroll */}
        <div style={{ display: 'flex', justifyContent: 'right', marginTop: '16px' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            showSizeChanger
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
          />

        </div>

      </div>
      <DeleteAlert
        isOpen={confirmModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteRow}
        sheetName="this row"
      />
    </div>
  )
};

export default InteractiveList;
