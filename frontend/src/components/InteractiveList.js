import { React, useEffect, useRef, useState, useContext, useMemo } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popover, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';
import label from '../assets/label.svg'
import { BiSearch } from 'react-icons/bi';
import { useSelector } from "react-redux";
import EditableSpreadsheetName from "./EditableSpreadsheetName";
import DeleteAlert from './DeleteAlert';
import EditRow from './EditRow';
import axios from 'axios';
import { HOST } from '../utils/constants';
import { UserContext } from "../context/UserContext";
import { Resizable } from 'react-resizable';
import './table.css';
import bulkAdd from '../assets/bulkAdd.svg';
import add from '../assets/addButton.svg';
import reset from '../assets/reset.svg';
import search from '../assets/search.svg';
import cancel from '../assets/cancel.svg';
import BulkAdd from './BulkAdd';
import useDrivePicker from 'react-google-drive-picker';
import { CLIENTID, DEVELOPERKEY } from "../utils/constants.js";
import styled from 'styled-components';
import { notifySuccess, notifyError } from "../utils/notify";


// Styled component for the Ant Table
const StyledAntTable = styled(Table)`
  .ant-table-container .ant-table-content table thead.ant-table-thead .ant-table-cell {
    background-color: ${(props) => props.headerBgColor} !important;
    color: ${(props) => props.headerTextColor} !important;
    font-size: ${(props) => props.headerFontSize}px !important;
    font-family: ${(props) => props.headerFontFamily} !important;
  }

  .ant-table-container .ant-table-content table tbody.ant-table-tbody .ant-table-cell {
    background-color: ${(props) => props.bodyBgColor} !important;
    color: ${(props) => props.bodyTextColor} !important;
    font-size: ${(props) => props.bodyFontSize}px !important;
    font-family: ${(props) => props.bodyFontFamily} !important;
  }
`;

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

// const loadColumnWidthsFromCookies = () => {
//   // const cookiesName = settings?._id + settings?.firstSheetName;
//   // console.log("cookiesName", cookiesName);
//   const savedWidths = Cookies.get("cookiesName");
//   return savedWidths ? JSON.parse(savedWidths) : null;
// };

// const saveColumnWidthsToCookies = (columnWidths) => {
//   // const cookiesName = settings?._id + settings?.firstSheetName;
//   // console.log("cookiesName", cookiesName);
//   Cookies.set("cookiesName", JSON.stringify(columnWidths), { expires: 7 }); // Cookie expires in 7 days
// };

const InteractiveList = ({ data, headers, settings }) => {

  console.log({ data, headers, settings });

  const [filterInfo, setfilterInfo] = useState({})
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumns, setSearchedColumns] = useState([]);
  const [searchGLobal, setSearchGlobal] = useState();
  const searchInput = useRef(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
  const [confirmAddModalOpen, setConfirmAddModalOpen] = useState(false);
  const [confirmBulkAddModalOpen, setConfirmBulkAddModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [selectSpreadsheet, setSelectSpreadsheet] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // headers = headers.map((r) => { return r.replace(/ /g, '_').toLowerCase() })
  // data = convertArrayToJSON(data);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) {
      // headers = headers.map((r) => { return r.replace(/ /g, '_').toLowerCase() })
      data = convertArrayToJSON(data);
      setFilteredData(data);
    }

  }, [data])

  console.log({ filteredData, headers })
  const { token } = useContext(UserContext);
  const clientId = CLIENTID
  const developerKey = DEVELOPERKEY
  const isEditMode = window.location.pathname.endsWith('/edit');
  // const settings = useSelector((state) => state?.setting?.settings);

  const loadColumnWidthsFromCookies = () => {
    const storageKey = settings?._id + settings?.firstSheetName;
    const savedWidths = localStorage.getItem(storageKey);
    return savedWidths ? JSON.parse(savedWidths) : null;
  };

  const saveColumnWidthsToCookies = (columnWidths) => {
    const storageKey = settings?._id + settings?.firstSheetName;
    localStorage.setItem(storageKey, JSON.stringify(columnWidths));
  };


  const tableSettings = settings?.tableSettings?.length > 0 ? settings.tableSettings[0] : null;

  const [headerBgColor, setHeaderBgColor] = useState(tableSettings?.headerBgColor || '#000000'); // Default header background color
  const [headerTextColor, setHeaderTextColor] = useState(tableSettings?.headerTextColor || '#ffffff'); // Default header text color
  const [headerFontSize, setHeaderFontSize] = useState(tableSettings?.headerFontSize || 14); // Default header font size
  const [headerFontFamily, setHeaderFontFamily] = useState(tableSettings?.headerFontStyle || 'Poppins'); // Default header font family

  // const [bodyBgColor, setBodyBgColor] = useState(tableSettings?.bodyBgColor || '#ffffff'); // Default body background color
  const [bodyTextColor, setBodyTextColor] = useState(tableSettings?.bodyTextColor || '#000000'); // Default body text color
  const [bodyFontSize, setBodyFontSize] = useState(tableSettings?.bodyFontSize || 12); // Default body font size
  const [bodyFontFamily, setBodyFontFamily] = useState(tableSettings?.bodyFontStyle || 'Poppins'); // Default body font family


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
    const tableSettings = settings?.tableSettings?.length > 0 ? settings.tableSettings[0] : null;

    setHeaderBgColor(tableSettings?.headerBgColor); // Default header background color
    setHeaderTextColor(tableSettings?.headerTextColor); // Default header text color
    setHeaderFontSize(tableSettings?.headerFontSize); // Default header font size
    setHeaderFontFamily(tableSettings?.headerFontStyle); // Default header font family

    // setBodyBgColor(tableSettings?.bodyBgColor || '#ffffff'); // Default body background color
    setBodyTextColor(tableSettings?.bodyTextColor || '#000000'); // Default body text color
    setBodyFontSize(tableSettings?.bodyFontSize || 12); // Default body font size
    setBodyFontFamily(tableSettings?.bodyFontStyle || 'Poppins'); // Default body font family
  }, [settings]);


  // useEffect(() => {
  //   // Only set filteredData if it's not already set or if data has changed
  //   if (data && data.length > 0 && filteredData.length === 0) {
  //     setFilteredData(data);
  //   }
  // }, [data, filteredData]);


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

  const handleGlobalReset = () => {
    setSearchGlobal('');
    setSearchText('');
    setFilteredData(data);
    setSearchedColumns([]);
    setfilterInfo({});
    setCurrentPage(1);
    setIsSearchOpen(false);
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

  const handleDeleteClick = (record) => {
    setRowToDelete(+record.key_id + 1);
    setConfirmModalOpen(true);
  }

  const handleDeleteCancel = () => {
    setConfirmModalOpen(false);
  };

  const handleDeleteRow = () => {
    const status = deleteRow(settings.spreadsheetId, settings.firstSheetName, rowToDelete)
    setConfirmModalOpen(false);
    if (status) {
      notifySuccess("Deleted row successfuly!");
    }
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
      const updatedData = filteredData.filter((row) => row.key_id != rowIndex - 1);
      setFilteredData(updatedData);
      return response.data;
    } catch (error) {
      // Handle errors
      console.error('Failed to delete row:', error.response?.data?.error || error.message);
      throw error;
    }
  }

  const handleEdit = (record) => {
    setRowToEdit(record);
    setConfirmEditModalOpen(true);
  }

  const handleEditCancel = () => {
    setConfirmEditModalOpen(false);
  };

  const handleSaveAPI = async (updatedRow, rowIndex) => {
    const spreadSheetID = settings.spreadsheetId;
    const sheetName = settings.firstSheetName;
    // const newData = Object.values(updatedRow);  // Convert the row object to an array for newData
    const newData = Object.entries(updatedRow)
      .filter(([key]) => key !== 'key_id')  // Filter out the key_id field
      .map(([, value]) => value);  // Map to get only the values


    try {
      const response = await axios.post(`${HOST}/editRow`, {
        spreadSheetID,
        sheetName,
        rowIndex,
        newData,
      },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,  // Assuming you have the token for auth
          },
        });
      // Handle successful response (e.g., show success notification)
      const updatedSheetData = convertArrayToJSON(response.data?.updatedSheetData?.values);

      setFilteredData(updatedSheetData);
      notifySuccess("Edited row successfuly!");
    } catch (error) {
      console.error('Error editing row:', error);
      // Handle error response (e.g., show error notification)
    }
  };

  const handleEditRow = async (updatedRow) => {
    setLoading(true);
    const rowIndex = +updatedRow.key_id + 1;  // Assuming key_id is the 0-based index, add 1 to get 1-based index for the sheet

    try {
      // Call the API with the updated row data and rowIndex
      await handleSaveAPI(updatedRow, rowIndex);

      setConfirmEditModalOpen(false);
    } catch (error) {
      console.error('Error saving row:', error);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    const obj = headers.reduce((acc, curr) => {
      acc[curr] = "";
      return acc;
    }, {});
    setRowToEdit(obj);
    setConfirmAddModalOpen(true);
  }

  const handleAddCancel = () => {
    setConfirmAddModalOpen(false);
  };

  const handleAddAPI = async (updatedRow) => {
    const spreadSheetID = settings.spreadsheetId;
    const sheetName = settings.firstSheetName;
    // const newData = Object.values(updatedRow);  // Convert the row object to an array for newData
    const rowData = Object.entries(updatedRow)
      .filter(([key]) => key !== 'key_id')  // Filter out the key_id field
      .map(([, value]) => value);  // Map to get only the values


    try {
      const response = await axios.post(`${HOST}/addRow`, {
        spreadSheetID,
        sheetName,
        rowData,
      },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,  // Assuming you have the token for auth
          },
        });

      // Handle successful response (e.g., show success notification)
      const updatedSheetData = convertArrayToJSON(response.data?.updatedSheetData?.values);

      setFilteredData(updatedSheetData);
      notifySuccess("Added row successfuly!");
    } catch (error) {
      console.error('Error editing row:', error);
      // Handle error response (e.g., show error notification)
    }
  };

  const handleAddRow = async (updatedRow) => {
    setLoading(true);
    try {
      // Call the API with the updated row data and rowIndex
      await handleAddAPI(updatedRow);

      setConfirmAddModalOpen(false);
    } catch (error) {
      console.error('Error saving row:', error);
    }
    setLoading(false);
  };

  const handleAddBukl = () => {
    setConfirmBulkAddModalOpen(true);
  }

  const handleBulkAddCancel = () => {
    setConfirmBulkAddModalOpen(false);
    setSelectSpreadsheet(null);
  }

  const handleBuldData = (data) => {
    setFilteredData(convertArrayToJSON(data));
    setConfirmBulkAddModalOpen(false);
    setSelectSpreadsheet(null);
  }

  const handleAddSheet = (data) => {
    if (data.action === "picked") {

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

  // Function to trigger the Google Drive Picker
  const handleOpenPicker = () => {
    openPicker({
      clientId,
      developerKey,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false, // Single file picker for spreadsheet
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button');
        } else if (data.action === 'picked') {
          const spreadSheetID = data.docs[0].id; // Extract Spreadsheet ID
          console.log(`Spreadsheet ID: ${spreadSheetID}`);
          getSpreadsheetDetails(spreadSheetID); // Call the API to get sheet details
        }
      },
    });
  };

  // Function to make an API call to your backend to fetch spreadsheet details
  const getSpreadsheetDetails = async (spreadSheetID) => {

    try {
      const response = await axios.post(`${HOST}/getSpreadsheetDetails`,
        { spreadSheetID },  // Request body
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,  // Assuming you have the token for auth
          },
        }
      );

      setSelectSpreadsheet(response.data.data);

      // You can now use the spreadsheet details (name, sheet names, URL)
      const { spreadsheetName, sheetNames, sheetUrl } = response.data.data;
    } catch (error) {
      console.error('Error fetching spreadsheet details:', error);
    }
  };

  // const getColumnSearchProps = (dataIndex) => ({
  //   renderFilterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
  //     <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{ marginBottom: 8, display: 'block' }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() => handleReset(clearFilters, dataIndex)}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Reset
  //         </Button>
  //         <Button type="link" size="small" onClick={close}>
  //           Close
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#FFA500' : undefined }} />,
  //   onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  //   onFilterDropdownOpenChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  //   render: (text) => (searchedColumn === dataIndex ? (
  //     <Highlighter
  //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
  //       searchWords={[searchText]}
  //       autoEscape
  //       textToHighlight={text ? text.toString() : ''}
  //     />
  //   ) : text),
  // });

  // const ColumnFilter = ({ dataIndex, confirm, clearFilters, close }) => {
  //   const searchInput = useRef(null);

  //   return (
  //     <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Search ${dataIndex}`}
  //         onPressEnter={() => confirm()}
  //         style={{ marginBottom: 8, display: 'block' }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => confirm()}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Search
  //         </Button>
  //         <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
  //           Reset
  //         </Button>
  //         <Button type="link" size="small" onClick={() => close()}>
  //           Close
  //         </Button>
  //       </Space>
  //     </div>
  //   );
  // };


  // Calculate maxHeight based on window height
  const maxHeight = window.innerHeight - 220;

  const [columns, setColumns] = useState([
    ...headers.map((header, index) => ({
      title: (
        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
            <img src={label} alt="label" style={{ marginLeft: 8, cursor: 'pointer', height: '18px' }} />
          </Popover>
        </div>
      ),
      dataIndex: header,
      key: header,
      width: 200,
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
      // Styling for the body cells
      onCell: (record) => ({
        style: {
          // backgroundColor: bodyBgColor, // Body background color
          color: bodyTextColor, // Body text color
          fontFamily: bodyFontFamily, // Body font family
          fontSize: `${bodyFontSize}px`, // Body font size
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

            </div>
          ),
        },
      ]
      : []),
  ]);
  

  useEffect(()=>{
    setColumns( [
      ...headers.map((header, index) => ({
        title: (
          <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
              <img src={label} alt="label" style={{ marginLeft: 8, cursor: 'pointer', height: '18px' }} />
            </Popover>
          </div>
        ),
        dataIndex: header,
        key: header,
        width: 200,
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
        // Styling for the body cells
        onCell: (record) => ({
          style: {
            // backgroundColor: bodyBgColor, // Body background color
            color: bodyTextColor, // Body text color
            fontFamily: bodyFontFamily, // Body font family
            fontSize: `${bodyFontSize}px`, // Body font size
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
  
              </div>
            ),
          },
        ]
        : []),
    ])
  },[headers])

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
      // style: {
      //   backgroundColor: searchedColumns.includes(column.dataIndex) ? 'rgb(216 216 216)' : headerBgColor,  // Apply blue background to the entire header cell
      //   color: headerTextColor,

      //   // color: searchedColumns.includes(header) ? '#fff' : '#000',
      // }
      style: {
        backgroundColor: searchedColumns.includes(column.dataIndex) ? 'rgb(216 216 216)' : headerBgColor,  // Background color logic
        color: headerTextColor, // Text color logic
        fontFamily: headerFontFamily, // Add the font family
        fontSize: `${headerFontSize}px`, // Add the font size and ensure it's in 'px' or another unit

        // Additional styles can go here...
      }

    }),
    // Styling for the body cells
    onCell: (record) => ({
      style: {
        // backgroundColor: bodyBgColor, // Body background color
        color: bodyTextColor, // Body text color
        fontFamily: bodyFontFamily, // Body font family
        fontSize: `${bodyFontSize}px`, // Body font size
      },
    }),
  }));


  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    handleGlobalReset();
  };



  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // useEffect(() => {
  //   // Function to handle pagination and slice the data
  //   setPaginatedData(filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize))
  // }, [filteredData]);

  return (
    <div>
      <div className='flex text-center justify-between items-center px-[50px]'>

        {settings && <EditableSpreadsheetName settings={settings} />}
        {/* <div><span className="text-[#2A3C54] font-poppins text-[30px] font-medium">{settings.spreadsheetName}</span></div> */}
        <div className='flex justify-end items-center'>

          {isSearchOpen && <Input
            prefix={<BiSearch />}
            value={searchGLobal}
            onChange={handleGlobalSearch}
            style={{ width: "200px" }}
            className="min-w-[150px] px-4 py-1 mx-2"
            placeholder="Search"
          />}


          {isSearchOpen && <button
            onClick={closeSearch}
            className="bg-[#FFA500] rounded-[4px] p-1 mr-2"
          // className="border border-[#FFA500] text-[#FFA500] px-4 py-1 rounded-md hover:bg-[#FFA500] hover:text-white transition-colors duration-200"
          >
            {/* <span>Reset</span> */}
            <img src={cancel} alt="search" className="w-[18px] h-[18px]" />
          </button>}



          {!isSearchOpen && <button
            onClick={openSearch}
            className="bg-[#FFA500] rounded-[4px] p-1 mx-2"
          // className="border border-[#FFA500] text-[#FFA500] px-4 py-1 rounded-md hover:bg-[#FFA500] hover:text-white transition-colors duration-200"
          >
            {/* <span>Reset</span> */}
            <img src={search} alt="search" className="w-[18px] h-[18px]" />
          </button>}


          <button
            onClick={handleGlobalReset}
            className="bg-[#FFA500] rounded-[4px] p-1"
          // className="border border-[#FFA500] text-[#FFA500] px-4 py-1 rounded-md hover:bg-[#FFA500] hover:text-white transition-colors duration-200"
          >
            {/* <span>Reset</span> */}
            <img src={reset} alt="reset" className="w-[18px] h-[18px]" />
          </button>

          {isEditMode && (
            <button
              onClick={handleAdd}
              className='mx-2'
            // className="border border-[#FFA500] px-4 py-1 rounded-md bg-[#FFA500] text-white transition-colors duration-200"
            >
              <img src={add} alt="add" className="w-[26px] h-[26px]" />
              {/* <span>ADD +</span> */}
            </button>



          )}

          {isEditMode && (
            <button
              onClick={handleAddBukl}


            // className="border border-[#FFA500] px-2 py-1 mx-2 rounded-md bg-[#FFA500] text-white transition-colors duration-200"
            >
              {/* <span>Bulk +</span> */}
              <img src={bulkAdd} alt="bulk" className="w-[30px] h-[30px]" />
            </button>
          )}




        </div>
      </div>

      <div style={{ position: 'relative', zIndex: '10' }} className='relative z-10 px-[50px] py-[10px]'>
        <div style={{ width: '100%', overflowX: 'auto', maxHeight: maxHeight, }}>
          <div style={{}}>
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
              scroll={{ x: "max-content" }}
              sticky
              size="small"
            />
          </div>
        </div>

        {/* Pagination outside the scroll */}
        <div style={{ display: 'flex', justifyContent: 'right', marginTop: '10px' }}>
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

      <EditRow
        isOpen={confirmAddModalOpen}
        onClose={handleAddCancel}
        onConfirm={handleAddRow}
        modelName="Add Row"
        row={rowToEdit}
        loading={loading}
      />
      <EditRow
        isOpen={confirmEditModalOpen}
        onClose={handleEditCancel}
        onConfirm={handleEditRow}
        modelName="Edit Row"
        row={rowToEdit}
        loading={loading}
      />
      <BulkAdd
        isOpen={confirmBulkAddModalOpen}
        onClose={handleBulkAddCancel}
        openPicker={handleOpenPicker}
        spreadSheetData={selectSpreadsheet}
        handleBuldData={handleBuldData}
      />
    </div>
  )
};

export default InteractiveList;
