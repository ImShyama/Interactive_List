import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./table.css";
import { useDispatch, useSelector } from "react-redux";
import { updateSetting } from "../utils/settingSlice";
import { HOST } from "../utils/constants.jsx";
import Loader from "./Loader.jsx";
import InteractiveList from "./InteractiveList.jsx";
import IntractTable from "./IntractTable.jsx";
import PeopleTable from "./people_directory/PeopleTable.jsx";
import useSpreadSheetDetails from "../utils/useSpreadSheetDetails";
import { UserContext } from "../context/UserContext";
import { set } from "lodash";
import VideoTable from "./video_gallary/VideoTable.jsx";
import PhotoTable from "./photo_gallery/PhotoTable.jsx";
import IntractMapTable from "./interactive_map/IntractMapTable.jsx";
import { notifyError } from "../utils/notify.jsx";
import ProductCatalogueDashboard from "./product_catalogue/product_catalogue_dashboard/ProductCatalogueDashboard.jsx";

const Table = () => {
  const [sheetData, setSheetData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [filterHeader, setFilterHeader] = useState([]);
  const [unhideHeader, setUnhideHeader] = useState([]);
  const [formulaData, setFormulaData] = useState({});
  const [loading, setLoading] = useState(true);
  const [freezeIndex, setFreezeIndex] = useState(0);
  const { token, categoryHeader, setCategoryHeader } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch spreadsheet details using custom hook
  const sheetdetails = useSpreadSheetDetails(id);

  // Redux setup
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.setting.settings);

  // Track if settings are initialized
  const [hasInitialized, setHasInitialized] = useState(false);

  // Add settings to Redux store
  const handleAddSetting = (details) => {
    console.log("Dispatching settings:", details); // Debugging log
    dispatch(updateSetting(details));
  };

  // Fetch and initialize settings from sheetdetails
  useEffect(() => {
    if (!sheetdetails || !sheetdetails.spreadsheetId || !sheetdetails.firstTabDataRange) {
      return; // Skip if details are incomplete
    }

    if (!hasInitialized) {
      handleAddSetting(sheetdetails);
      setHasInitialized(true); // Ensure settings are initialized only once
    }
  }, [sheetdetails, hasInitialized]);

  // Fetch sheet data
  useEffect(() => {
    if (!id) return;

    axios
      .post(
        `${HOST}/getSheetDataWithID`,
        { sheetID: id },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(({ data: res }) => {
        if (res.error) {
          console.error("Error:", res.error);
          return;
        }

        console.log({ res });
        if (!res.permissions && (res.settings?.userId !== res.user?._id)) {
          notifyError("You don't have permission to view this tool");
          navigate("/dashboard");
          return;
        }


        console.log({permissions:res?.permissions?.toLowerCase(), sheetUserID:res.settings?.userId, userID:res.user?._id})
        
        // Redirect to view mode if permissions are restricted
        if (res?.permissions?.toLowerCase() === "view" && (res.settings?.userId !== res.user?._id)) {
          console.log("redirected")
          navigate(`/${id}/view`);
          // return;
        }

        // Process sheet data
        const [header, ...dataRows] = res.rows;
        const normalHeader = header.map((col) => col.replace(/ /g, "_"));
        const normalizedHeader1 = normalHeader.filter((col) => !res.hiddenCol?.includes(col.toLowerCase()));
        const normalizedHeader = header.map((col) => col.replace(/ /g, "_").toLowerCase());
        const filteredHeader = normalizedHeader.filter((col) => !res.hiddenCol?.includes(col));
        const resSettings = res.settings;
        console.log({ resSettings });
        dispatch(updateSetting(resSettings));

        setSheetData(res.jsonData || []);
        setTableHeader(normalizedHeader1);
        setFilterHeader(filteredHeader);
        setCategoryHeader(normalizedHeader1);
        setFreezeIndex(res.freezeIndex || 0);
        setFormulaData(res.formulaData);
        setUnhideHeader(header);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sheet data:", err);
        setLoading(false);
        if (err.response.status === 403) {
          notifyError("You don't have permission to view this tool.");
          navigate("/signin");
        }
      });
  }, [id, token, navigate]);

  console.log({ sheetData, tableHeader, filterHeader })

  // Render the appropriate table based on appName in settings
  const renderTable = () => {
    if (loading) {
      return <Loader textToDisplay="Loading..." />;
    }



    switch (settings.appName) {
      case "Interactive List":
        return (
          <IntractTable
            data={sheetData}
            tableHeader={tableHeader}
            headers={filterHeader}
            settings={settings}
            freezeIndex={freezeIndex}
            tempHeader={tableHeader}
            formulaData={formulaData}
            unhideHeader={unhideHeader}
          />
        );
      case "People Directory":
        return (
          <PeopleTable
            data={sheetData}
            tableHeader={tableHeader}
            headers={filterHeader}
            settings={settings}
            freezeIndex={freezeIndex}
            tempHeader={tableHeader}
            formulaData={formulaData}
            unhideHeader={unhideHeader}
          />
        );
      case "Video Gallery":
        return (
          <VideoTable
            data={sheetData}
            tableHeader={tableHeader}
            headers={filterHeader}
            settings={settings}
            freezeIndex={freezeIndex}
            tempHeader={tableHeader}
            formulaData={formulaData}
            unhideHeader={unhideHeader}
          />
        );
      case "Photo Gallery":
        return (
          <PhotoTable
            data={sheetData}
            tableHeader={tableHeader}
            headers={filterHeader}
            settings={settings}
            freezeIndex={freezeIndex}
            tempHeader={tableHeader}
            formulaData={formulaData}
            unhideHeader={unhideHeader}
          />
        );
      case "Interactive Map":
        return (
          <IntractMapTable
            data={sheetData}
            tableHeader={tableHeader}
            headers={filterHeader}
            settings={settings}
            freezeIndex={freezeIndex}
            tempHeader={tableHeader}
            formulaData={formulaData}
            unhideHeader={unhideHeader}
          />
        );
      case "Product Catalogue":
        return (
          <ProductCatalogueDashboard
            data={sheetData}
            tableHeader={tableHeader}
            headers={filterHeader}
            settings={settings}
            freezeIndex={freezeIndex}
            tempHeader={tableHeader}
            formulaData={formulaData}
            unhideHeader={unhideHeader}
          />
        );
      default:
        return <div>Invalid configuration. Please check your settings.</div>;
    }
  };

  return (
    <div className="mt-[80px]">
      {renderTable()}
    </div>
  );
};

export default Table;
