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
import { APPS, APPSNAME, CLIENTID, DEVELOPERKEY } from "../utils/constants";
import { Input, Select } from "antd";
import { BiSearch } from "react-icons/bi";
import { HOST } from "../utils/constants";
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
  const [apps, setApps] = useState(APPS);
  const [isDisable, setIsDisable] = useState(true);

  {
    console.log("app:", apps);
    apps.map((app) => {
      console.log(app.appName, app.description);
    });
  }

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

  return (
    <div>
      <div className="flex justify-between px-[50px] py-[5px]">
        <div className="flex justify-start items-center gap-2">
          <button
            className="bg-primary rounded-[8px] p-[10px] text-white text-[14px] hover:bg-secondary"
            onClick={openModal}
          >
            <span className="text-[var(--white,#FFF)] font-poppins text-[14px] font-normal leading-normal">
              + Create app from zero
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
                />
              </div>
              <div className="flex">
                <Select
                  defaultValue={"Select App Name"}
                  style={{ width: "200px", height: "44px" }}
                  className="w-full"
                  size="large"
                  aria-required
                  options={[
                    { value: "", label: "Select App Name", disabled: true },
                    { value: "Interactive List", label: "Interactive List" },
                  ]}
                />
              </div>
              {/* <button className="flex gap-[10px] justify-center items-center flex-shrink-0 text-center bg-[#FFA500] rounded-[8px] p-[5px] text-white text-[14px] h-[44px]">
                <span className="text-[var(--white,#FFF)] font-poppins text-[14px] font-medium leading-normal">
                  More apps
                </span>
                <img src={updownIcon} className="w-[8px] h-[13px] flex-shrink-0" />
              </button> */}
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
                className="rounded-[17px] border-2 border-[#FFA500] focus:outline-none focus:border-[#FFA500] px-4 py-2 w-[380px]"
                value={selectedOption}
                onChange={handleSelectChange}
              >
                <option value="">Select App Name</option>
                {APPSNAME.map((row) => {
                  return <option value={row}>{row}</option>;
                })}
              </select>

              <button
                className="rounded-[17px] bg-[#FFA500] text-[white] px-4 py-2 w-[380px]"
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
          {/* <div className="bg-white p-6 rounded-md max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Create New App</h2>
            <p>Select a document to start:</p>
            <button
              className="bg-[#FFA500] rounded-[8px] p-[10px] text-white text-[14px] mt-4"
              onClick={handleOpenPicker}
            >
              Select Docs
            </button>
            <button
              className="bg-red-500 rounded-[8px] p-[10px] text-white text-[14px] mt-4 ml-4"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div> */}
        </div>
      )}

      {showAppCard && (
        <div className="flex flex-wrap justify-center">
          {APPS.map((app, index) => (
            <AppCard
              key={index}
              appName={app.appName}
              appView={app.appView}
              appImg={app.appImg}
              description={app.description}
            />
          ))}
        </div>
      )}

      <DashboardTable />
    </div>
  );
};

export default Dashboard;
