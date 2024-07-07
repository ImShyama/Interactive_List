import { useEffect, useContext, useState } from "react";
import axios from "axios";
import "./table.css";
import sort from "../assets/shortIcon.svg";
import edit from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import ColumnResizer from "react-table-column-resizer";
import { UserContext } from "../context/UserContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Table = () => {
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, setToken, setProfile, profile } = useContext(UserContext);

  useEffect(() => {
    axios
      .post(
        "http://localhost:4000/getSheetData",
        {
          spreadSheetLink:
            "https://docs.google.com/spreadsheets/d/1WGUEwH7oDjflqFMWh1RyRP1L2W__uv0jw0Y0MsDmL4M/edit#gid=0",
          spreadSheetName: "Sheet1",
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
          nav("/");
          return;
        }
        setSheetData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  }, [token]);

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
          {headers.map((header, index) => (
            <th key={index}>
              <div className="resize flex ">
                <span className="tdText">{header}</span>
                <img className="shortIcon icon" src={sort} alt="Sort" />
              </div>
            </th>
          ))}
          <th>
            <div className="resize flex ">
              <span className="tdText">Action</span>
            </div>
          </th>
        </tr>
      </thead>
    );
  };


  const headers = getHeaders(sheetData);

  /** return (
    <div className="table-container">
      <table className="intractive-table column_resize_table">
        <TableHeader headers={headers} />
        <tbody>
           {loading ? Array(10)
                .fill("")
                .map((_, index) => renderSkeletonRows(index))
            : renderTableRows()} 
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="table-container">
      <table className="intractive-table column_resize_table">
        <TableHeader headers={headers} />
        <tbody>
          {sheetData.map((row, index) => (
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
  ) **/

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
        <table className="intractive-table column_resize_table">
          <TableHeader headers={headers} />
          <tbody>
            {sheetData.map((row, index) => (
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
      )}
    </div>
  );
};

export default Table;
