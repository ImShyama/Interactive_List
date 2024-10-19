import React, { useRef, useState } from 'react';
import { SearchOutlined, BarsOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popover, Tooltip, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';
import label from '../assets/label.svg'

const data = [
  {
    manager_name: "Shubham Khanna",
    employee_name: "Nisha",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "7",
    attendance_score_out_of_10: "8",
    behaviour_attitude_score_out_of_20: "16",
    working_skill_technique_score_out_of_15: "11",
    work_self_improvement_score_out_of_10: "5",
    planning_reporting_score_out_of_20: "12",
    customer_feedback_score_out_of_15: "10",
    total_score_in_100: "69",
    year: "2020",
    key: 1
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Mukesh Prajapati",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "3",
    attendance_score_out_of_10: "4",
    behaviour_attitude_score_out_of_20: "9",
    working_skill_technique_score_out_of_15: "11",
    work_self_improvement_score_out_of_10: "3",
    planning_reporting_score_out_of_20: "19",
    customer_feedback_score_out_of_15: "14",
    total_score_in_100: "63",
    year: "2020",
    key: 2
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Sushil",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "0",
    attendance_score_out_of_10: "7",
    behaviour_attitude_score_out_of_20: "20",
    working_skill_technique_score_out_of_15: "7",
    work_self_improvement_score_out_of_10: "8",
    planning_reporting_score_out_of_20: "4",
    customer_feedback_score_out_of_15: "12",
    total_score_in_100: "58",
    year: "2020",
    key: 3
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Gaurav",
    employee_email_id: "kul@tnspll.in",
    feedback_month: "January",
    site_timings: "2",
    attendance_score_out_of_10: "7",
    behaviour_attitude_score_out_of_20: "14",
    working_skill_technique_score_out_of_15: "3",
    work_self_improvement_score_out_of_10: "3",
    planning_reporting_score_out_of_20: "12",
    customer_feedback_score_out_of_15: "15",
    total_score_in_100: "56",
    year: "2020",
    key: 4
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Kuldeep",
    employee_email_id: "kul@tnspll.in",
    feedback_month: "January",
    site_timings: "8",
    attendance_score_out_of_10: "9",
    behaviour_attitude_score_out_of_20: "10",
    working_skill_technique_score_out_of_15: "9",
    work_self_improvement_score_out_of_10: "9",
    planning_reporting_score_out_of_20: "0",
    customer_feedback_score_out_of_15: "7",
    total_score_in_100: "52",
    year: "2020",
    key: 5
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Nisha",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "7",
    attendance_score_out_of_10: "8",
    behaviour_attitude_score_out_of_20: "16",
    working_skill_technique_score_out_of_15: "11",
    work_self_improvement_score_out_of_10: "5",
    planning_reporting_score_out_of_20: "12",
    customer_feedback_score_out_of_15: "10",
    total_score_in_100: "69",
    year: "2020",
    key: 1
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Mukesh Prajapati",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "3",
    attendance_score_out_of_10: "4",
    behaviour_attitude_score_out_of_20: "9",
    working_skill_technique_score_out_of_15: "11",
    work_self_improvement_score_out_of_10: "3",
    planning_reporting_score_out_of_20: "19",
    customer_feedback_score_out_of_15: "14",
    total_score_in_100: "63",
    year: "2020",
    key: 2
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Sushil",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "0",
    attendance_score_out_of_10: "7",
    behaviour_attitude_score_out_of_20: "20",
    working_skill_technique_score_out_of_15: "7",
    work_self_improvement_score_out_of_10: "8",
    planning_reporting_score_out_of_20: "4",
    customer_feedback_score_out_of_15: "12",
    total_score_in_100: "58",
    year: "2020",
    key: 3
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Gaurav",
    employee_email_id: "kul@tnspll.in",
    feedback_month: "January",
    site_timings: "2",
    attendance_score_out_of_10: "7",
    behaviour_attitude_score_out_of_20: "14",
    working_skill_technique_score_out_of_15: "3",
    work_self_improvement_score_out_of_10: "3",
    planning_reporting_score_out_of_20: "12",
    customer_feedback_score_out_of_15: "15",
    total_score_in_100: "56",
    year: "2020",
    key: 4
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Kuldeep",
    employee_email_id: "kul@tnspll.in",
    feedback_month: "January",
    site_timings: "8",
    attendance_score_out_of_10: "9",
    behaviour_attitude_score_out_of_20: "10",
    working_skill_technique_score_out_of_15: "9",
    work_self_improvement_score_out_of_10: "9",
    planning_reporting_score_out_of_20: "0",
    customer_feedback_score_out_of_15: "7",
    total_score_in_100: "52",
    year: "2020",
    key: 5
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Nisha",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "7",
    attendance_score_out_of_10: "8",
    behaviour_attitude_score_out_of_20: "16",
    working_skill_technique_score_out_of_15: "11",
    work_self_improvement_score_out_of_10: "5",
    planning_reporting_score_out_of_20: "12",
    customer_feedback_score_out_of_15: "10",
    total_score_in_100: "69",
    year: "2020",
    key: 1
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Mukesh Prajapati",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "3",
    attendance_score_out_of_10: "4",
    behaviour_attitude_score_out_of_20: "9",
    working_skill_technique_score_out_of_15: "11",
    work_self_improvement_score_out_of_10: "3",
    planning_reporting_score_out_of_20: "19",
    customer_feedback_score_out_of_15: "14",
    total_score_in_100: "63",
    year: "2020",
    key: 2
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Sushil",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "0",
    attendance_score_out_of_10: "7",
    behaviour_attitude_score_out_of_20: "20",
    working_skill_technique_score_out_of_15: "7",
    work_self_improvement_score_out_of_10: "8",
    planning_reporting_score_out_of_20: "4",
    customer_feedback_score_out_of_15: "12",
    total_score_in_100: "58",
    year: "2020",
    key: 3
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Gaurav",
    employee_email_id: "kul@tnspll.in",
    feedback_month: "January",
    site_timings: "2",
    attendance_score_out_of_10: "7",
    behaviour_attitude_score_out_of_20: "14",
    working_skill_technique_score_out_of_15: "3",
    work_self_improvement_score_out_of_10: "3",
    planning_reporting_score_out_of_20: "12",
    customer_feedback_score_out_of_15: "15",
    total_score_in_100: "56",
    year: "2020",
    key: 4
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Kuldeep",
    employee_email_id: "kul@tnspll.in",
    feedback_month: "January",
    site_timings: "8",
    attendance_score_out_of_10: "9",
    behaviour_attitude_score_out_of_20: "10",
    working_skill_technique_score_out_of_15: "9",
    work_self_improvement_score_out_of_10: "9",
    planning_reporting_score_out_of_20: "0",
    customer_feedback_score_out_of_15: "7",
    total_score_in_100: "52",
    year: "2020",
    key: 5
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Nisha",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "7",
    attendance_score_out_of_10: "8",
    behaviour_attitude_score_out_of_20: "16",
    working_skill_technique_score_out_of_15: "11",
    work_self_improvement_score_out_of_10: "5",
    planning_reporting_score_out_of_20: "12",
    customer_feedback_score_out_of_15: "10",
    total_score_in_100: "69",
    year: "2020",
    key: 1
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Mukesh Prajapati",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "3",
    attendance_score_out_of_10: "4",
    behaviour_attitude_score_out_of_20: "9",
    working_skill_technique_score_out_of_15: "11",
    work_self_improvement_score_out_of_10: "3",
    planning_reporting_score_out_of_20: "19",
    customer_feedback_score_out_of_15: "14",
    total_score_in_100: "63",
    year: "2020",
    key: 2
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Sushil",
    employee_email_id: "sus@tnspll.in",
    feedback_month: "January",
    site_timings: "0",
    attendance_score_out_of_10: "7",
    behaviour_attitude_score_out_of_20: "20",
    working_skill_technique_score_out_of_15: "7",
    work_self_improvement_score_out_of_10: "8",
    planning_reporting_score_out_of_20: "4",
    customer_feedback_score_out_of_15: "12",
    total_score_in_100: "58",
    year: "2020",
    key: 3
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Gaurav",
    employee_email_id: "kul@tnspll.in",
    feedback_month: "January",
    site_timings: "2",
    attendance_score_out_of_10: "7",
    behaviour_attitude_score_out_of_20: "14",
    working_skill_technique_score_out_of_15: "3",
    work_self_improvement_score_out_of_10: "3",
    planning_reporting_score_out_of_20: "12",
    customer_feedback_score_out_of_15: "15",
    total_score_in_100: "56",
    year: "2020",
    key: 4
  },
  {
    manager_name: "Shubham Khanna",
    employee_name: "Kuldeep",
    employee_email_id: "kul@tnspll.in",
    feedback_month: "January",
    site_timings: "8",
    attendance_score_out_of_10: "9",
    behaviour_attitude_score_out_of_20: "10",
    working_skill_technique_score_out_of_15: "9",
    work_self_improvement_score_out_of_10: "9",
    planning_reporting_score_out_of_20: "0",
    customer_feedback_score_out_of_15: "7",
    total_score_in_100: "52",
    year: "2020",
    key: 5
  },
];


// Function to check if a value is numeric
const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

const Testing = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Set your page size
  const searchInput = useRef(null);

  // Utility functions to calculate aggregates dynamically
  const calculateSum = (dataIndex) => {
    const sum = data.reduce((total, record) => {
      if (isNumeric(record[dataIndex])) {
        return total + (record[dataIndex] || 0);
      }
      return total;
    }, 0);
    return sum;
  };

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
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
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
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
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
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
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

  // Dynamic creation of columns based on headers array
  const headers = [
    'manager_name',
    'employee_name',
    'employee_email_id',
    'feedback_month',
    'site_timings',
    'attendance_score_out_of_10',
    'behaviour_attitude_score_out_of_20',
    'working_skill_technique_score_out_of_15',
    'work_self_improvement_score_out_of_10',
    'planning_reporting_score_out_of_20',
    'customer_feedback_score_out_of_15',
    'total_score_in_100',
    'year'
  ];

  // Calculate maxHeight based on window height
  const maxHeight = window.innerHeight - 200;

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
          <img src={label} alt="label" style={{ marginLeft: 8, cursor: 'pointer', height: "18px" }}/>
          {/* <BarsOutlined style={{ marginLeft: 8, cursor: 'pointer' }} /> */}
        </Popover>

      </div>
    ),
    dataIndex: header,
    key: header,
    width: '50%',
    ...getColumnSearchProps(header),
    // sorter: isNumeric(data[0][header]) ? (a, b) => a[header] - b[header] : null,
    sorter: (a, b) => {
      if (isNumeric(a[header]) && isNumeric(b[header])) {
        return a[header] - b[header];
      }
      return a[header].toString().localeCompare(b[header].toString());
    }
  }));

  // Function to handle pagination and slice the data
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ padding: '20px' }}>
      {/* Scrollable table container */}
      <div style={{ width: '100%', overflowX: 'auto', maxHeight: maxHeight,  }}>
        <div style={{ minWidth: '1500px' }}>
          <Table
            columns={columns}
            dataSource={paginatedData}  // Pass only the paginated data here
            pagination={false}          // Disable default table pagination
            // scroll={{ x: 'max-content', y: maxHeight }}
          // sticky 
          rowClassName="custom-row" // Apply custom row class for height adjustment
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
  )
};

export default Testing;
