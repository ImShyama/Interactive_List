import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./table.css";
import sort from "../assets/shortIcon.svg";
import edit from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import ColumnResizer from "react-table-column-resizer";
import { UserContext } from "../context/UserContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useSpreadSheetDetails from "../utils/useSpreadSheetDetails";

const Table = () => {
  const [sheetData, setSheetData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [filter, setFilter] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const sheetdetails = useSpreadSheetDetails(id);
  console.log("sheetDetails: ",sheetdetails);
  // const {sheetdetails.spreadsheetUrl } = sheetdetails;
  useEffect(() => {

    if (!sheetdetails || !sheetdetails.spreadsheetId || !sheetdetails.firstTabDataRange) {
      return; // Do nothing if sheetdetails is null or undefined
    }

    axios
      .post(
        "http://localhost:4000/getSheetData",
        {
          spreadSheetID: sheetdetails.spreadsheetId,
          range: sheetdetails.firstTabDataRange, 
        },
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      )
      .then(({ data: res }) => {
        if (res.error) {
          alert(res.error);
          navigate("/");
          return;
        }
        const [header, filterRow, ...dataRows] = res;
        setSheetData(res);
        console.log("res: ",resizeBy)
        setTableHeader(header);
        setFilter(filterRow);
        setTableData(dataRows);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  }, [sheetdetails, token, navigate]);

  const renderSkeletonRows = () => {
    return (
      <tr>
        {Array(7)
          .fill("")
          .map((_, index) => (
            <td key={index}>
              <Skeleton height={20} />
            </td>
          ))}
      </tr>
    );
  };

  // Utility function to get headers from the data
  const getHeaders = (data) => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const TableHeader = ({ headers }) => {
    return (
      <thead>
        <tr>
          {tableHeader.map((header, index) => (
            <th key={index} style={{textWrap:'nowrap'}}>
              {/* <div className="resize flex "> */}
              <div className="flex gap-[10px] items-center">
                <span className="tdText">{header}</span>
                <img className="shortIcon icon" src={sort} alt="Sort" />
                </div>
              {/* </div> */}
            </th>
          ))}
          <th>
            {/* <div className="resize flex "> */}
              <span className="tdText">Action</span>
            {/* </div> */}
          </th>
        </tr>
      </thead>
    );
  };


  const headers = getHeaders(sheetData);


  return (
    <div className="table-container">
      {loading ? (
        <table className="intractive-table column_resize_table">
          <tbody>
            {Array(10)
              .fill("")
              .map((_, index) => renderSkeletonRows(index))}
          </tbody>
        </table>
      ) : (
        <div style={{overflowX:'auto', width:'100%', scrollbarWidth:'thin'}}>
        <table className="intractive-table column_resize_table">
          <TableHeader headers={headers} />
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {headers.map((header, i) => (
                  <td key={i}>{row[header]}</td>
                ))}
                <td className="tdcenter">
                  <div className="inline-flex gap-[8px] items-center">
                    <div className="flex w-[28px] h-[28px] justify-center items-center bg-[#F6F6F6] rounded-[380px]">
                      <img src={edit} alt="Edit" />
                    </div>
                    <div className="flex w-[28px] h-[28px] justify-center items-center bg-[#F6F6F6] rounded-[380px]">
                      <img src={deleteIcon} alt="Delete" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default Table;
