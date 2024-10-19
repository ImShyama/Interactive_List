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
import { useDispatch, useSelector } from "react-redux";
import { updateSetting } from "../utils/settingSlice";
import { HOST } from "../utils/constants.js";
import InteractiveList from "./InteractiveList.js";


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


  const dispatch = useDispatch();
  const settings = useSelector((state) => state.setting.settings); // Redux state for settings

  const [hasInitialized, setHasInitialized] = useState(false); // To track if settings were initialized

  // Function to add settings to the Redux store
  function handleAddSetting(sheetdetails) {
    dispatch(updateSetting(sheetdetails));
  }


  // Fetch table data using either settings or sheetdetails

  // Only set settings once on initial load
  useEffect(() => {
    if (!sheetdetails || !sheetdetails.spreadsheetId || !sheetdetails.firstTabDataRange) {
      return; // Do nothing if sheetdetails are incomplete
    }

    console.log("first useEffect")

    // Set initial settings in Redux only once
    if (!hasInitialized) {
      handleAddSetting(sheetdetails);
      setHasInitialized(true); // Ensure it's set only once
    }
  }, [sheetdetails, hasInitialized, dispatch]); // Only run once with `sheetdetails`

  useEffect(() => {
    if (!id ) return;

    console.log("second useEffect")

    // Fetch sheet data
    axios
      .post(
        `${HOST}/getSheetDataWithID`,
        {
          sheetID: id
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

        const [header, filterRow, ...dataRows] = res.rows;
        const permissions = res.permissions;
        console.log("permissions",permissions)
        if(permissions == "view") {
          navigate(`/${id}/view`);
        }
        setSheetData(res.rows);
        setTableHeader(header);
        setFilter(filterRow);
        setTableData(dataRows);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  }, [sheetdetails, settings.spreadsheetId, settings.firstTabDataRange, token, navigate]);

  // useEffect(() => {
  //   if (!sheetdetails || !settings.spreadsheetId || !settings.firstTabDataRange) return;

  //   console.log("second useEffect")

  //   // Fetch sheet data
  //   axios
  //     .post(
  //       `${HOST}/getSheetData`,
  //       {
  //         spreadSheetID: settings.spreadsheetId || sheetdetails.spreadsheetId,
  //         range: settings.firstTabDataRange || sheetdetails.firstTabDataRange,
  //       },
  //       {
  //         headers: {
  //           authorization: "Bearer " + token,
  //         },
  //       }
  //     )
  //     .then(({ data: res }) => {
  //       if (res.error) {
  //         alert(res.error);
  //         navigate("/");
  //         return;
  //       }

  //       const [header, filterRow, ...dataRows] = res;
  //       setSheetData(res);
  //       setTableHeader(header);
  //       setFilter(filterRow);
  //       setTableData(dataRows);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //       setLoading(false);
  //     });
  // }, [sheetdetails, settings.spreadsheetId, settings.firstTabDataRange, token, navigate]);

  console.log("sheetData",sheetData)
  console.log("tableHeader",tableHeader)
  console.log("tableData",tableData)


  return (
    <InteractiveList data={sheetData} headers={tableHeader} />
  );
};

export default Table;
