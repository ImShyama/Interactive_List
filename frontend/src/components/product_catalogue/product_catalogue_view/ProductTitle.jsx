import { useState, useRef, useEffect } from "react";
import { Search, RefreshCcw } from "lucide-react";
import Cancel from "../../../assets/Cancel.svg";
// import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
// import CopyBtn from "../../component/CopyBtn";
import { APPS } from "../../../utils/constants";
import CatalogueFilter from "../../component/CategoryFilter.jsx";

const ProductTitle = ({ searchQuery = "", onSearchChange, data, settings, filteredData, setFilteredData }) => {
  const [showSearchBox, setShowSearchBox] = useState(false); // NEW STATE

  let appDetails = APPS.filter((app) => {
    return app.appName == "Product Catalogue"
  })
  let { appName, appID, spreadSheetName } = appDetails[0]


  const navigate = useNavigate();
  const searchBoxRef = useRef(null); // REF for detecting outside click

  // Remove the outer click functionality
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       searchBoxRef.current &&
  //       !searchBoxRef.current.contains(event.target)
  //     ) {
  //       setShowSearchBox(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // Handle close button click - reset search and close search box
  const handleCloseSearch = () => {
    if (onSearchChange) {
      onSearchChange(""); // Reset search query
    }
    setShowSearchBox(false); // Close search box
  };

  return (
    <div className="flex flex-col items-center relative mx-6">
      {/* Top Icons */}
      <div className="flex justify-between w-full items-center relative">
        <div className="flex gap-4 items-center">
          {/* <button
            onClick={() => navigate(-1)}
            className=" bg-[#598931] p-2 rounded-full shadow-md"
          >
            <IoArrowBack className="text-white text-3xl" />
          </button> */}

          {/* Conditionally render Search Icon or Search Box */}
          {!showSearchBox ? (
            <button
              className="p-2 rounded-lg bg-[#F6FCF1] hover:bg-[#EAF7D6]"
              onClick={() => setShowSearchBox(true)}
            >
              <Search className="text-[#598931]" size={20} />
            </button>
          ) : (
            <div
              ref={searchBoxRef}
              className="flex items-center bg-[#F6FCF1] rounded-lg px-3 py-2 gap-2"
            >
              <Search className="text-[#598931]" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-sm"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              />
              <button onClick={handleCloseSearch}>
                <img
                  src={Cancel}
                  alt="Cancel"
                  className="w-4 h-4 invert brightness-50"
                />
              </button>
            </div>
          )}

          {/* Category Filter (replaces Filter icon) */}
          <CatalogueFilter
            data={data}
            settings={settings}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            buttonVariant="searchLike"
            useCataloguePosition={false}
          />

          {/* Refresh Button */}
          {/* <button className="p-2 rounded-lg bg-[#F6FCF1] hover:bg-[#EAF7D6]">
            <RefreshCcw className="text-[#598931]" size={20} />
          </button> */}
        </div>
      </div>

      {/* CategoryFilter handles its own dropdowns; removed legacy sub-dropdown UI */}
      {/* <div className="fixed bottom-6 right-20 z-50 mr-2">
      
        <CopyBtn
          appName={appName}
          spreadSheetID={appID}
          spreadSheetName={spreadSheetName}
        />
      </div> */}
    </div>
  );
};

export default ProductTitle;
