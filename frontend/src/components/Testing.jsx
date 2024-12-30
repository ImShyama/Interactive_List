// import React, { useState } from 'react';
// import './table.css';
// import { Table } from 'antd';
// import { Resizable } from 'react-resizable';
// const ResizableTitle = (props) => {
//   const { onResize, width, ...restProps } = props;
//   if (!width) {
//     return <th {...restProps} />;
//   }
//   return (
//     <Resizable
//       width={width}
//       height={0}
//       handle={<span className="react-resizable-handle" onClick={(e) => e.stopPropagation()} />}
//       onResize={onResize}
//       draggableOpts={{
//         enableUserSelectHack: false,
//       }}
//     >
//       <th {...restProps} />
//     </Resizable>
//   );
// };
// const data = [
//   {
//     key: 0,
//     date: '2018-02-11',
//     amount: 120,
//     type: 'income',
//     note: 'transfer',
//   },
//   {
//     key: 1,
//     date: '2018-03-11',
//     amount: 243,
//     type: 'income',
//     note: 'transfer',
//   },
//   {
//     key: 2,
//     date: '2018-04-11',
//     amount: 98,
//     type: 'income',
//     note: 'transfer',
//   },
// ];
// const App = () => {
//   const [columns, setColumns] = useState([
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       width: 200,
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount',
//       width: 100,
//       sorter: (a, b) => a.amount - b.amount,
//     },
//     {
//       title: 'Type',
//       dataIndex: 'type',
//       width: 100,
//     },
//     {
//       title: 'Note',
//       dataIndex: 'note',
//       width: 100,
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: () => <a>Delete</a>,
//     },
//     {
//     onHeaderCell: () => ({
//       style: {
//           backgroundColor: '#1677ff', // Header background color
//           color: '#ffffff',            // Header text color
//           fontSize: '16px',           // Header font size
//           fontFamily: 'Arial, sans-serif', // Header font family
//       },
//     })}
//   ],
// );
//   const handleResize =(index) =>
//     (_, { size }) => {
//       const newColumns = [...columns];
//       newColumns[index] = {
//         ...newColumns[index],
//         width: size.width,
//       };
//       setColumns(newColumns);
//     };
//   const mergedColumns = columns.map((col, index) => ({
//     ...col,
//     onHeaderCell: (column) => ({
//       width: column.width,
//       onResize: handleResize(index),
//     }),
//   }));

  
//   return (
//     <Table
//       bordered
//       components={{
//         header: {
//           cell: ResizableTitle,
//         },
//       }}
//       columns={mergedColumns}
//       dataSource={data}
//     />
//   );
// };
// export default App;
import React, { useState } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import styled from 'styled-components';

// Styled component for the Ant Table
const StyledAntTable = styled(Table)`
  .ant-table-container .ant-table-content table thead.ant-table-thead .ant-table-cell {
    background-color: ${(props) => props.headerBgColor};
    color: ${(props) => props.headerTextColor};
    font-size: ${(props) => props.headerFontSize}px;
    font-family: ${(props) => props.headerFontFamily};
  }

  .ant-table-container .ant-table-content table tbody.ant-table-tbody .ant-table-cell {
    background-color: ${(props) => props.bodyBgColor};
    color: ${(props) => props.bodyTextColor};
    font-size: ${(props) => props.bodyFontSize}px;
    font-family: ${(props) => props.bodyFontFamily};
  }
`;

// Resizable title component for table headers
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

// Sample data for the table
const data = [
  {
    key: 0,
    date: '2018-02-11',
    amount: 120,
    type: 'income',
    note: 'transfer',
  },
  {
    key: 1,
    date: '2018-03-11',
    amount: 243,
    type: 'income',
    note: 'transfer',
  },
  {
    key: 2,
    date: '2018-04-11',
    amount: 98,
    type: 'income',
    note: 'transfer',
  },
];

const App = () => {
  // State variables for styling
  const [headerBgColor, setHeaderBgColor] = useState('#1677ff'); // Default header background color
  const [headerTextColor, setHeaderTextColor] = useState('#ffffff'); // Default header text color
  const [headerFontSize, setHeaderFontSize] = useState(16); // Default header font size
  const [headerFontFamily, setHeaderFontFamily] = useState('Arial, sans-serif'); // Default header font family

  const [bodyBgColor, setBodyBgColor] = useState('#ffffff'); // Default body background color
  const [bodyTextColor, setBodyTextColor] = useState('#000000'); // Default body text color
  const [bodyFontSize, setBodyFontSize] = useState(14); // Default body font size
  const [bodyFontFamily, setBodyFontFamily] = useState('Arial, sans-serif'); // Default body font family

  const [columns, setColumns] = useState([
    {
      title: 'Date',
      dataIndex: 'date',
      width: 200,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 100,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      width: 100,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <a>Delete</a>,
    },
  ]);

  const handleResize = (index) => (_, { size }) => {
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

  return (
    <div>
      {/* Here you can add inputs to change styles dynamically if needed */}
      <StyledAntTable
        bordered
        headerBgColor={headerBgColor}
        headerTextColor={headerTextColor}
        headerFontSize={headerFontSize}
        headerFontFamily={headerFontFamily}
        bodyBgColor={bodyBgColor}
        bodyTextColor={bodyTextColor}
        bodyFontSize={bodyFontSize}
        bodyFontFamily={bodyFontFamily}
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        columns={mergedColumns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default App;
