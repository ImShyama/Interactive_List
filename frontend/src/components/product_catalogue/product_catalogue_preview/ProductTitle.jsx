import { useState, useRef, useEffect } from "react";
import { Search, Filter, RefreshCcw, ChevronDown } from "lucide-react";
import Cancel from "../../../assets/Cancel.svg";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import CopyBtn from "../../component/CopyBtn";
import { APPS } from "../../../utils/constants";
import { notifyError } from "../../../utils/notify";

const ProductTitle = ({ searchQuery = "", onSearchChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false); // NEW STATE

  let appDetails = APPS.filter((app) => {
    return app.appName == "Product Catalogue"
  })
  let { appName, appID, spreadSheetName } = appDetails[0]


  const navigate = useNavigate();
  const searchBoxRef = useRef(null); // REF for detecting outside click

  const toggleFilterDropdown = (option) => {
    // Disable filter functionality in preview mode
    notifyError("Not available in Preview");
    return;
  };

  const filterOptions = [
    "Product Title",
    "Alumni No.",
    "Priority",
    "Department",
    "Product Heading",
  ];

  const dropdownItems = [
    "CBX Notes",
    "CBX Start",
    "Perplexity AI",
    "Crew AI",
    "Chat Base",
    "WhatsApp WIZ CRM",
    "Microsoft Designer",
  ];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const filteredItems = dropdownItems.filter((item) =>
    item.toLowerCase().includes(filterSearch.toLowerCase())
  );

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
    <div className="flex flex-col items-center relative mx-8">
      {/* Top Icons */}
      <div className="flex justify-between w-full items-center relative mt-6">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate(-1)}
            className=" bg-[#598931] p-2 rounded-full shadow-md"
          >
            <IoArrowBack className="text-white text-3xl" />
          </button>

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

          {/* Filter Button */}
          <div className="relative">
            <button
              className="p-2 rounded-lg bg-[#F6FCF1] hover:bg-[#EAF7D6]"
              onClick={() => notifyError("Not available in Preview")}
              title="Filter not available in Preview mode"
            >
              <Filter
                className="text-[#598931]"
                size={20}
              />
            </button>
            {/* Filter dropdown disabled in preview mode */}
          </div>

          {/* Refresh Button */}
          {/* <button className="p-2 rounded-lg bg-[#F6FCF1] hover:bg-[#EAF7D6]">
            <RefreshCcw className="text-[#598931]" size={20} />
          </button> */}
        </div>
      </div>

      {/* Filter sub-dropdown disabled in preview mode */}
      <div className="fixed bottom-6 right-20 z-50 mr-2">
        {/* <CopyBtn
          appName={"Product Catalogue"}
          spreadSheetID={"YOUR_SPREADSHEET_ID"}
          spreadSheetName={"YOUR_SPREADSHEET_NAME"}
        /> */}
        <CopyBtn
          appName={appName}
          spreadSheetID={appID}
          spreadSheetName={spreadSheetName}
        />
      </div>
    </div>
  );
};

export default ProductTitle;
