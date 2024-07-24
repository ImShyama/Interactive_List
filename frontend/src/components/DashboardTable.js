import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HOST } from "../utils/constants";
import useToken from "../utils/useToken";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import { XIcon } from '@heroicons/react/solid'; // or any other icon you prefer
import DeleteAlert from "./DeleteAlert";


const DashboardTable = () => {
  const [spreadsheet, setSpreadSheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [sheetToDelete, setSheetToDelete] = useState(null);
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

  const handleEdit = (id) => {
    navigate(`/interactivelist/${id}`);
  };

  const handleDeleteClick = (id, sheetName) => {
    setSheetToDelete({ id, sheetName });
    setConfirmModalOpen(true);
  };

  const handleDelete = () => {

    if (!sheetToDelete) return;

    axios
      .delete(`${HOST}/deleteSpreadsheet/${sheetToDelete.id}`, {
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
          prevSpreadsheets.filter((sheet) => sheet._id !== sheetToDelete.id)
        );
        setConfirmModalOpen(false);
      })
      .catch((err) => {
        console.log(err.message);
        setConfirmModalOpen(false);
      });
  };

  const handleDeleteCancel = () => {
    setConfirmModalOpen(false);
  };

  return (
    <>
      <div className="overflow-x-auto m-4 rounded-[10.423px] border-[1.303px] border-[#FFF7EA] bg-[#FEFBF7] overflow-hidden">
        <table className="min-w-full rounded-[10.423px] ">
          <thead>
            <tr className="border-b-[1.303px] border-[#EAECF0] bg-[#FEFBF7]">
              <th className="w-1/2  p-4 text-start text-[#101828] font-poppins text-[24px] font-semibold leading-[23.452px]">
                Active Spreadsheet
              </th>
              <th className="w-1/6  p-4 text-start text-[#667085] font-poppins text-[20px] font-semibold leading-[23.452px] ">
                Access
              </th>
              <th className="w-1/6  p-4 text-start text-[#667085] font-poppins text-[20px] font-semibold leading-[23.452px]">
                Last Update
              </th>
              <th className="w-1/6  p-4 text-start text-[#667085] font-poppins text-[20px] font-semibold leading-[23.452px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {spreadsheet.map((sheet, index) => {
              return (
                <tr
                  className="border-b-[1.303px] border-[#EAECF0] bg-[#FEFBF7]"
                  key={sheet._id}
                >
                  <td className=" px-4 py-2">
                    {sheet.spreadsheetName || sheet.firstSheetName}
                  </td>
                  <td className=" px-4 py-2">Owner</td>
                  <td className=" px-4 py-2">06/20/2024</td>
                  <td className=" px-4 py-2 flex gap-[15px] ">
                    <button onClick={() => handleEdit(sheet._id)}><img src={editIcon} alt="Edit" /> </button>
                    <button onClick={() => handleDeleteClick(sheet._id, sheet.spreadsheetName || sheet.firstSheetName)}>
                    <img src={deleteIcon} alt="Delete" />
                    </button>
                  </td>
                </tr>
              );
            })}
            <DeleteAlert
        isOpen={confirmModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDelete}
        sheetName={sheetToDelete?.sheetName}
      />
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardTable;
