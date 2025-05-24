import { useState, useRef, useEffect } from "react";
import { Search, Filter, RefreshCcw, ChevronDown } from "lucide-react";
import Cancel from "../../../assets/Cancel.svg";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import CopyBtn from "../../component/CopyBtn";
import { APPS } from "../../../utils/constants";

const ProductTitle = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false); // NEW STATE

  let appDetails = APPS.filter((app) => {
    return app.appName == "Product Catalogue"
  })
  let { appName, appID, spreadSheetName } = appDetails[0]


  const navigate = useNavigate();
  const searchBoxRef = useRef(null); // REF for detecting outside click

  const toggleFilterDropdown = (option) => {
    setSelectedFilter((prev) => (prev === option ? null : option));
    setSearchQuery("");
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
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close search box when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowSearchBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center relative mx-6">
      {/* Top Icons */}
      <div className="flex justify-between w-full items-center relative">
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
              />
              <button onClick={() => setShowSearchBox(false)}>
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
              className={`p-2 rounded-lg transition-colors ${showDropdown
                  ? "bg-[#598931]"
                  : "bg-[#F6FCF1] hover:bg-[#EAF7D6]"
                }`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Filter
                className={`transition-colors ${showDropdown ? "text-white" : "text-[#598931]"
                  }`}
                size={20}
              />
            </button>

            {/* Main Filter Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-[-50px] mt-2 min-w-[300px] max-w-[400px] bg-white shadow-lg rounded-xl border border-gray-200 z-50 p-4">
                <div className="flex justify-between items-center mb-4">
                  <button
                    className="text-[#598931] font-medium"
                    onClick={() => {
                      setSelectedItems([]);
                      setSelectAll(false);
                    }}
                  >
                    <RefreshCcw />
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setSelectedFilter(null);
                    }}
                    className="text-gray-500 hover:text-black"
                  >
                    <img
                      src={Cancel}
                      alt="Cancel"
                      className="w-5 h-5 invert brightness-50"
                    />
                  </button>
                </div>
                <ul className="space-y-3 text-[#598931] font-medium max-h-[250px] overflow-y-auto">
                  {filterOptions.map((option, index) => (
                    <li key={index} className="relative">
                      <div
                        className="flex justify-between items-center p-3 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
                        onClick={() => toggleFilterDropdown(option)}
                      >
                        <span>{option}</span>
                        <ChevronDown
                          className={`text-[#598931] transition-transform ${selectedFilter === option ? "rotate-180" : ""
                            }`}
                          size={18}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button className="p-2 rounded-lg bg-[#F6FCF1] hover:bg-[#EAF7D6]">
            <RefreshCcw className="text-[#598931]" size={20} />
          </button>
        </div>
      </div>

      {/* Sub-dropdown (Appears Beside Filter Box) */}
      {selectedFilter && (
        <div className="absolute top-[230%] left-[25.8%] min-w-[250px] bg-white border border-gray-300 rounded-lg shadow-md p-2 max-h-[250px] overflow-auto z-50">
          <div className="flex justify-between items-center p-2 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="mr-2 w-5 h-5 accent-[#598931] cursor-pointer"
              />
              <Search size={16} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none bg-transparent"
              />
            </div>
            <button
              onClick={() => setSelectedFilter(null)}
              className="text-gray-500 hover:text-black"
            >
              <img
                src={Cancel}
                alt="Cancel"
                className="w-5 h-5 invert brightness-50"
              />
            </button>
          </div>

          <ul className="p-2 space-y-2">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item)}
                    onChange={() => handleCheckboxChange(item)}
                    className="w-4 h-4 accent-[#598931] cursor-pointer"
                  />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-center py-2">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
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
