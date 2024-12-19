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
import IntractTable from "./IntractTable.js";
import PeopleTable from "./people_directory/PeopleTable.js";
import Loader from "./Loader.js";

const Table = () => {
  const [sheetData, setSheetData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [filterHeader, setFilterHeader] = useState([]);
  const [filter, setFilter] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [freezeIndex, setFreezeIndex] = useState(0);
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
    if (!id) { return };

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

        let [header, ...dataRows] = res.rows;
        const permissions = res.permissions;

        if (permissions.toLowerCase() == "view") {
          navigate(`/${id}/view`);
        }
        header = header.map((r) => { return r.replace(/ /g, '_').toLowerCase() })
<<<<<<< HEAD
        const filteredHeader = header.filter((col) => !res.hiddenCol.includes(col));
=======
        const filteredHeader = header.filter((col) => !res?.hiddenCol?.includes(col));
>>>>>>> c01412bd1a96d4b0e905869a64c9d45bf25f3d15
        console.log("data",res.jsonData);
        console.log("header",header);
        console.log("hiddenCol",res.hiddenCol);
        setSheetData(res.jsonData);
        setTableHeader(header);
        setFilterHeader(filteredHeader);
        setTableData(dataRows);
        setFreezeIndex(res.freezeIndex)
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
    <div className="mt-[80px]">
      {/* Conditional rendering for InteractiveListPreview */}
      {!loading && sheetData && tableHeader ? (
        <div>
          {/* <div>
            {tableHeader.length > 1 && (
              <InteractiveList
                data={sheetData}
                headers={tableHeader}
                settings={settings}
              />
            )}
          </div> */}
          <div>
            {tableHeader.length > 1 && (
              <>
                {(() => {
                  switch (settings.appName) {
                    case "Interactive List":
                      return (
                        <IntractTable
                        data={sheetData}
                        headers={filterHeader}
                        settings={settings}
                        freezeIndex={freezeIndex}
                        tempHeader={tableHeader}
                        />
                        // <InteractiveList
                        //   data={sheetData}
                        //   headers={tableHeader}
                        //   settings={settings}
                        //   freezeIndex={freezeIndex}
                        // />
                      );
                    case "People Directory":
                      return (
                        <PeopleTable
                          data={sheetData}
                          headers={filterHeader}
                          settings={settings}
                          freezeIndex={freezeIndex}
                          tempHeader={tableHeader}
                        />
                      );
                    default:
                      // navigate("/dashboard");
                      return null; // Optional: Handle default case
                  }
                })()}
              </>
            )}
          </div>

        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Loader textToDisplay={"Loading..."} />
        </div>
      )}
     </div>
  );
};

export default Table;
