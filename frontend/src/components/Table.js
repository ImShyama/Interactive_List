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
import Loader from "./Loader.js";

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

  useEffect(() => {
    if (
      !sheetdetails ||
      !sheetdetails.spreadsheetId ||
      !sheetdetails.firstTabDataRange
    ) {
      return; // Do nothing if sheetdetails are incomplete
    }

    // Set initial settings in Redux only once
    if (!hasInitialized) {
      handleAddSetting(sheetdetails);
      setHasInitialized(true); // Ensure it's set only once
    }
  }, [sheetdetails, hasInitialized, dispatch]);

  useEffect(() => {
    if (!id) {
      console.log("No ID provided");
      return};

    console.log({ settingsascsdvf: settings });
    // Fetch sheet data
    axios
      .post(
        `${HOST}/getSheetDataWithID`,
        {
          sheetID: id,
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
          console.log({ error: res.error });
          // navigate("/");
          return;
        }

        console.log({table_data:res.rows});
        let [header, ...dataRows] = res.rows;
        const permissions = res.permissions;

        console.log(res.permissions);
        if (permissions.toLowerCase() == "view") {
          navigate(`/${id}/view`);
        }
        header = header.map((r) => { return r.replace(/ /g, '_').toLowerCase() })
        setSheetData(res.rows);
        setTableHeader(header);
        setTableData(dataRows);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        // navigate(`/`);
        setLoading(false);
      });
  }, [
    sheetdetails,
    settings.spreadsheetId,
    settings.firstTabDataRange,
    token,
    navigate,
    settings
  ]);

  return (
    <div>
      {/* Conditional rendering for InteractiveListPreview */}
      {!loading && sheetData && tableHeader ? (
        <div>
          <div>
            {" "}
            {tableHeader.length > 1 && (
              <InteractiveList
                data={sheetData}
                headers={tableHeader}
                settings={settings}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Loader textToDisplay={"Loading..."} />
        </div>
      )}
      {/* <div> {tableHeader.length > 1 && <InteractiveList data={sheetData} headers={tableHeader} settings={sheetdetails} />}</div> */}
    </div>
  );
};

export default Table;
