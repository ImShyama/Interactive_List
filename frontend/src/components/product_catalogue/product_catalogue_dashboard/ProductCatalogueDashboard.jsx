import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateSetting } from "../../../utils/settingSlice";
import { HOST } from "../../../utils/constants.jsx";
import { UserContext } from "../../../context/UserContext";
import useSpreadSheetDetails from "../../../utils/useSpreadSheetDetails";
import CardView from "./CardView";
import DetailedView from "./DetailedView";
import BoxView from "./BoxView";
import ProductCatalogueTable from "../ProductCatalogueTable";
import ProductCatalogueView from "../ProductCatalogueView.jsx";

const ProductCatalogueDashboard = ({ data,tableHeader, headers, settings, tempHeader, freezeIndex, formulaData, unhideHeader }) => {
  console.log({ data,tableHeader, headers, settings, tempHeader, freezeIndex, formulaData, unhideHeader })
  const [showTable, setShowTable] = useState(false);
  // const [sheetData, setSheetData] = useState([]);
  // const [tableHeader, setTableHeader] = useState([]);
  // const [filterHeader, setFilterHeader] = useState([]);
  // const [unhideHeader, setUnhideHeader] = useState([]);
  // const [formulaData, setFormulaData] = useState({});
  const [loading, setLoading] = useState(true);
  // const [freezeIndex, setFreezeIndex] = useState(0);
  const { token, setIsPCTSettings } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const sheetdetails = useSpreadSheetDetails(id);
  const dispatch = useDispatch();
  // const settings = useSelector((state) => state.setting.settings);
  const [hasInitialized, setHasInitialized] = useState(false);
  const isEditMode = window.location.pathname.endsWith('/edit');

  useEffect(() => {
    if (
      !sheetdetails ||
      !sheetdetails.spreadsheetId ||
      !sheetdetails.firstTabDataRange
    ) {
      return;
    }

    if (!hasInitialized) {
      dispatch(updateSetting(sheetdetails));
      setHasInitialized(true);
    }
  }, [sheetdetails, hasInitialized, dispatch]);

  // useEffect(() => {
  //   if (!id || !token) return;

  //   setLoading(true);
  //   axios
  //     .post(
  //       `${HOST}/getSheetDataWithID`,
  //       { sheetID: id },
  //       { headers: { authorization: `Bearer ${token}` } }
  //     )
  //     .then(({ data: res }) => {
  //       if (res.error) {
  //         console.error("Error:", res.error);

  //         return;
  //       }

  //       // if (res.permissions?.toLowerCase() === "view") {
  //       //   navigate(`/${id}/view`);
  //       //   return;
  //       // }

  //       if (!res.rows || res.rows.length === 0) {
  //         console.warn("No data found in the sheet");
  //         setSheetData([]);
  //         setLoading(false);
  //         return;
  //       }

  //       const [header, ...dataRows] = res.rows;
  //       const normalHeader = header.map((col) => col.replace(/ /g, "_"));
  //       const filteredHeader = normalHeader.filter(
  //         (col) => !res.hiddenCol?.includes(col.toLowerCase())
  //       );

  //       dispatch(updateSetting(res.settings));

  //       setSheetData(dataRows);
  //       setTableHeader(normalHeader);
  //       setFilterHeader(filteredHeader);
  //       setFreezeIndex(res.freezeIndex || 0);
  //       setFormulaData(res.formulaData || {});
  //       setUnhideHeader(header);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching sheet data:", err.message);
  //       setLoading(false);
  //     });
  // }, [id, token, navigate, dispatch]);

  return (
    <>
    {isEditMode ?
    <div className="min-h-screen bg-white p-6 space-y-6">
      {!showTable ? (
        <>
          <div className="pb-4">
            <CardView tableHeader={tableHeader} settings={settings} />
          </div>
          <div className="pb-4">
            <DetailedView tableHeader={tableHeader} settings={settings} />
          </div>
          <div className="pb-4">
            <BoxView settings={settings} tableHeader={tableHeader}/>
          </div>
          <button
            className="fixed bottom-20 right-60 px-4 py-2 text-white rounded-[8px] font-semibold text-lg"
            style={{ backgroundColor: "#598931" }}
           // open in new tab
            onClick={() => window.open(`/${id}/view`, '_blank')}
          >
            View Link
          </button>
          <button
            className="fixed bottom-20 right-20 px-4 py-2 text-white rounded-[8px] font-semibold text-lg"
            style={{ backgroundColor: "#598931" }}
            // onMouseOver={(e) => (e.target.style.backgroundColor = "#598931")}
            // onMouseOut={(e) => (e.target.style.backgroundColor = "#BFBFBF")}
            onClick={() => {setShowTable(true); setIsPCTSettings(true)}}
          >
            View Table
          </button>
        </>
      ) : (
        <ProductCatalogueTable
          data={data}
          tableHeader={tableHeader}
          headers={headers}
          settings={settings}
          freezeIndex={freezeIndex}
          tempHeader={tableHeader}
          formulaData={formulaData}
          unhideHeader={unhideHeader}
          setShowTable={setShowTable}
        />
      )}
    </div>
    :
    <ProductCatalogueView data={data} settings={settings} />
     }
    </>
  );
};

export default ProductCatalogueDashboard;
