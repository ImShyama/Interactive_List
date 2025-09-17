import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDrivePicker from "react-google-drive-picker";
import Cookies from "js-cookie";
import AppCard from "./AppCard";
import axios from "axios";
import DashboardTable from "./DashboardTable";
import uparrow from "../assets/uparrow.svg";
import downarrow from "../assets/downarrow.svg";
import updownIcon from "../assets/updownIcon.svg";
import { CLIENTID, DEVELOPERKEY } from "../utils/constants";
import { Input, Select } from "antd";
import { BiSearch } from "react-icons/bi";
import { HOST } from "../utils/constants";
import { AutoComplete } from "antd";
import Loader from "./Loader";
import AdminBtn from "./component/AdminBtn";
import { fetchApps } from "../APIs";
const clientId = CLIENTID;
const developerKey = DEVELOPERKEY;

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const refreshToken = Cookies.get("refreshToken"); // Store the refresh token in cookies
  const [accessToken, setAccessToken] = useState(token);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedOption, setSelectedOption] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showAppCard, setShowAppCard] = useState(true);
  const [apps, setApps] = useState(null);
  const [originalApps, setOriginalApps] = useState(null); // Store original apps data
  const [isDisable, setIsDisable] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // To store the search query
  const [searchValue, setSearchValue] = useState(""); // To store the search query
  const [dropdownValue, setDropdownValue] = useState(""); // To store the dropdown value
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApps(token).then((res) => {
      setApps(res);
      setOriginalApps(res); // Store original data
    });
  }, [token]);

  // {
  //   console.log("app:", apps);
  //   apps.map((app) => {
  //     console.log(app.appName, app.description);
  //   });
  // }

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    console.log("Selected option:", e.target.value); // Handle the select value here
    if (e.target.value !== "") {
      setShowWarning(false);
    }
    setIsDisable(false);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    if (selectedOption == "") {
      setShowWarning(true);
      return;
    }
    openPicker({
      clientId,
      developerKey,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        } else if (data.action === "picked") {
          console.log({ openpicker: data });
          handleAddSheet(data);
        }
      },
    });
  };

  const handleAddSheet = (data) => {
    if (data.action === "picked") {
      console.log({ dataselected: data });
      setLoading(true);
      axios
        .post(
          `${HOST}/createNewSpreadsheet`,
          {
            url: data?.docs?.[0]?.url,
            spreadSheetID: data?.docs?.[0]?.id,
            sheetName: data?.docs?.[0]?.name,
            appName: selectedOption,
          },
          {
            headers: {
              authorization: "Bearer " + token,
            },
          }
        )
        .then(({ data: res, status }) => {
          if (status === 200 && !res.error) {
            console.log("res data: ", res);
            // Redirect to edit page with the new spreadsheet ID
            navigate(`/${res._id}/edit`);
          } else {
            alert(res.error);
          }
        })
        .catch((err) => {
          console.log({ err });
          console.log(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOption("");
    setIsDisable(true);
  };

  const onSearch = () => {
    console.log("onsearch");
  };



  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setSearchValue(query);

    if (!query) {
      // If input is cleared, reset to original apps
      setApps(originalApps);
      return;
    }

    const filteredData = (originalApps || []).filter((app) => {
      const appName = app.appName?.toLowerCase() || "";
      return appName.includes(query);
    });

    setApps(filteredData);
  };


  const handleSearchDropdown = (query) => {
    setDropdownValue(query);
    const searchQuery = query.toLowerCase();
    console.log({ query, apps });
    setSearchQuery(searchQuery);

    if (!searchQuery) {
      setApps(originalApps);
      return;
    }

    const filteredData = apps.filter((app) => {
      const appName = app.appName.toLowerCase();
      return appName.includes(searchQuery);
    });

    setApps(filteredData);
  };

  const handleClearDropdown = () => {
    setDropdownValue("");
    setSearchQuery("");
    // Reset apps to original data
    if (originalApps) {
      setApps(originalApps);
    }
  };

  return (
    <div className="mt-[80px]">
      <div className="flex justify-between px-[50px] py-[5px]">
        <div className="flex justify-start items-center gap-2">
          <button
            className="bg-primary rounded-[8px] p-[10px] text-white text-[14px] hover:bg-secondary"
            onClick={openModal}
          >
            <span className="text-[var(--white,#FFF)] font-poppins text-[14px] font-normal leading-normal">
              + Create App from zero
            </span>
          </button>
        </div>
        <div className="flex justify-between gap-2">
          {showAppCard && (
            <div className="flex w-2/6 gap-[10px] justify-between items-center">
              <div className="flex flex-1">
                <Input
                  prefix={<BiSearch />}
                  style={{ width: "200px", height: "44px" }}
                  className="min-w-[150px]"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearch}
                  allowClear
                />
              </div>
              <div className="flex items-center">
                <AutoComplete
                  style={{
                    width: 200,
                    height: 44,
                  }}
                  value={dropdownValue}
                  options={originalApps && Array.isArray(originalApps) ? originalApps.map((app) => ({
                    value: app.appName,
                    label: app.appName,
                  })) : []}
                  size="large"
                  filterOption={(inputValue, option) =>
                    option.value.toLowerCase().includes(inputValue.toLowerCase())
                  }
                  onChange={handleSearchDropdown}
                  onClear={handleClearDropdown}
                >
                  <Input style={{
                    width: 200,
                    height: 44,
                  }}
                    size="large"
                    placeholder="Select App Name"
                    allowClear
                    onClear={handleClearDropdown}
                  />
                </AutoComplete>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setShowAppCard(!showAppCard);
            }}
            className="w-[50px] h-[44px] flex justify-center items-center flex-shrink-0 rounded-[8px] bg-primary hover:bg-secondary"
          >
            <img src={showAppCard ? uparrow : downarrow} alt="Hide" />
          </button>
        </div>
      </div>

      {/* Modal component */}
      {isModalOpen && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-75 z-[999]">
          <div className="w-[482px] h-[258px] mt-[150px] ml-[50px] rounded-[60.516px] bg-white relative flex items-center justify-center">
            {/* <!-- Cross button positioned in the top-right --> */}
            <button
              className="absolute top-[25px] right-[25px] group"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 37 37"
                fill="none"
              >
                <path
                  d="M27.75 9.25L9.25 27.75"
                  stroke="black"
                  strokeWidth="3.08333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-red-500 transition-colors"
                />
                <path
                  d="M9.25 9.25L27.75 27.75"
                  stroke="black"
                  strokeWidth="3.08333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-red-500 transition-colors"
                />
              </svg>
            </button>
            {/* <!-- Inner div --> */}

            <div className="flex flex-col justify-center items-center text-center gap-[15px] w-[380px]">
              <select
                className="rounded-[17px] border-2 border-primary focus:outline-none focus:border-primary px-4 py-2 w-[380px]"
                value={selectedOption}
                onChange={handleSelectChange}
              >
                <option value="">Select App Name</option>
                {apps && Array.isArray(apps) ? apps.map((row) => {
                  return <option key={row.appName} value={row.appName}>{row.appName}</option>;
                }) : []}
              </select>

              <button
                className="rounded-[17px] bg-primary text-[white] px-4 py-2 w-[380px]"
                onClick={handleOpenPicker}
                disabled={isDisable}
              >
                Submit
              </button>
              {/* Warning message */}
              {showWarning && (
                <p className="text-red-300 mt-[-15px] mr-[30px]">
                  Please select App Name from the select app dropdown.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showAppCard && (
        <div className="flex flex-wrap justify-center mx-[100px]">
          {apps && Array.isArray(apps) ? apps.map((app, index) => (
            <div key={index} className="flex justify-center w-full sm:w-1/2 lg:w-1/3">
              <AppCard
                appName={app.appName}
                spreadSheetName={app.spreadSheetName}
                spreadSheetID={app.appID}
                appView={app.appView}
                appImg={app.appImg}
                description={app.description}
              />
            </div>
          )) : (
            // Shimmer loading for app cards - matching AppCard structure
            [...Array(6)].map((_, index) => (
              <div key={index} className="flex justify-center w-full sm:w-1/2 lg:w-1/3 mb-4">
                <div className="w-[350px] h-[400px] m-2 shadow-md flex flex-col rounded-[15.07px] bg-[#FFFCF8] p-6">
                  {/* Image shimmer */}
                  <div className="mb-4">
                    <div className="w-full h-[190px] rounded-[15.07px] shimmer"></div>
                  </div>

                  {/* App name shimmer */}
                  <div className="mb-3">
                    <div className="h-[22px] w-3/4 shimmer rounded"></div>
                  </div>

                  {/* Description shimmer */}
                  <div className="mb-4 flex-1">
                    <div className="h-[14px] w-full shimmer rounded mb-2"></div>
                    <div className="h-[14px] w-5/6 shimmer rounded mb-2"></div>
                    <div className="h-[14px] w-2/3 shimmer rounded"></div>
                  </div>

                  {/* Buttons shimmer */}
                  <div className="flex justify-between items-center gap-3">
                    <div className="h-[40px] w-[80px] shimmer rounded-[14px]"></div>
                    <div className="h-[40px] w-[120px] shimmer rounded-[14px]"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>



      )}



      <DashboardTable />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-[999]">
          <Loader textToDisplay="Creating a copy..." />
        </div>
      )}
      {/* <AdminBtn /> */}
    </div>
  );
};

export default Dashboard;
