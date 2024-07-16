import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HOST } from "../utils/constants";
import useToken from "../utils/useToken";

const DashboardTable = () => {
  const [spreadsheet, setSpreadSheet] = useState([]);
  const token = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(
        `${HOST}/getSpreadSheets`,
        {},
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
        setSpreadSheet(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  console.log("tableData: ", spreadsheet);

  const handleEdit = (id) => {
    navigate(`/interactivelist/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${HOST}/deleteSpreadsheet/${id}`, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then(({ data }) => {
        if (data.error) {
          alert(data.error);
          return;
        }
        setSpreadSheet((prevSpreadsheets) =>
          prevSpreadsheets.filter((sheet) => sheet._id !== id)
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="flex flex-col m-4 rounded-[10.423px] border border-[1.303px] bg-[#FEFBF7]">
      <div className="flex justify-between px-[31px] py-[25px]">
        <span className="text-[24px] font-[600] leading-[23px]">
          Previous 30 Days
        </span>
        {/* <div className="flex justify-around"> */}
        <span className="text-[20px] text-[#667085] font-[600] leading-[23px]">
          Access
        </span>
        <span className="text-[20px] text-[#667085] font-[600] leading-[23px]">
          Last Update
        </span>
        <div></div>
      </div>
      {spreadsheet.map((sheet, index) => {
        return (
          <div className="flex justify-between px-4" key={sheet._id}>
            <span>{sheet.spreadsheetName || sheet.firstSheetName}</span>
            <span>Owner</span>
            <span>{Date.now()}</span>
            <span>
              <button onClick={() => handleEdit(sheet._id)}>Edit</button>
              <button onClick={() => handleDelete(sheet._id)}>Delete</button>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardTable;
