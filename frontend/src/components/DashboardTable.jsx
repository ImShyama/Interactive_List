import { useEffect, useState, useContext } from "react";
import { Table, Pagination, Input, Select, AutoComplete } from "antd";
import { BiSearch } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HOST } from "../utils/constants";
import useToken from "../utils/useToken";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import preview from "../assets/preview.svg";
import share from "../assets/share.svg";
import edit from "../assets/edit.svg";
import DeleteAlert from "./DeleteAlert";
import Preview from "./Preview";
import InteractiveListView from "./InteractiveListView";
import ShareModal from "./ShareModal";
import { FRONTENDHOST, OPTIONS } from "../utils/constants";
import { notifySuccess } from "../utils/notify";
import { MdOutlineContentCopy } from "react-icons/md";
import { UserContext } from "../context/UserContext";
const options = OPTIONS;

const DashboardTable = () => {
  const { token, user } = useContext(UserContext);
  const [spreadsheet, setSpreadSheet] = useState([]);
  const [filteredSheets, setFilteredSheets] = useState([]); // To store the filtered data
  const [searchQuery, setSearchQuery] = useState(""); // To store the search query
  const [searchValue, setSearchValue] = useState(""); // To store the search query
  const [loading, setLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [sheetToDelete, setSheetToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default page size
  // const token = useToken();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetData, setSheetData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [spreadsheetIdForShare, setSpreadsheetIdForShare] = useState(null);
  const [sheetSharedWith, setSheetSharedWith] = useState(null);
  const [settings, setSettings] = useState(null);


  useEffect(() => {
    if (!user) return;
    setFilteredSheets(user?.sheets);
    setSpreadSheet(user?.sheets);
  }, [user])


  console.log({ user, filteredSheets, spreadsheet });

  // useEffect(() => {
  //   axios
  //     .post(
  //       `${HOST}/getSpreadSheets`,
  //       {},
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
  //       setSpreadSheet(res);
  //       setFilteredSheets(res); // Initially, filteredSheets is the same as spreadsheet
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // }, []);

  const handleShare = (spreadsheetId, sharedWith, settings) => {
    setSpreadsheetIdForShare(spreadsheetId); // Set the selected spreadsheetId
    setShowModal(true); // Open the modal
    setSheetSharedWith(sharedWith);
    setSettings(settings);
  };

  const updateSharedWith = (emails, spreadsheetId) => {
    // Update the sharedWith array for the selected spreadsheetId
    const updatedSheets = filteredSheets.map((sheet) => {
      if (sheet._id === spreadsheetId) {
        return { ...sheet, sharedWith: emails };
      }
      return sheet;
    });

    setFilteredSheets(updatedSheets);
  };

  // Function to handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    console.log(query);
    setSearchQuery(query);
    setSearchValue(query);

    const filteredData = spreadsheet.filter((sheet) => {
      const sheetName = sheet.spreadsheetName || sheet.firstSheetName;
      return sheetName.toLowerCase().includes(query);
    });

    setFilteredSheets(filteredData);
  };

  const handleSearchDropdown = (query) => {
    const searchQuery = query.toLowerCase();
    console.log({ searchQuery, spreadsheet });
    setSearchQuery(searchQuery);

    const filteredData = spreadsheet.filter((sheet) => {
      const sheetName = sheet.appName;
      return sheetName.toLowerCase().includes(searchQuery);
    });

    setFilteredSheets(filteredData);
  };

  const handleEdit = (id, access) => {
    if (access == "view") {
      navigate(`/${id}/view`);
    } else {
      navigate(`/${id}/edit`);
    }
  };

  const handleCopy = (id, access) => {
    const url = `${FRONTENDHOST}/${id}/view`
    navigator.clipboard.writeText(url).then(() => {
      notifySuccess("Link copied successfully!");
    });
  }

  // Function to open the modal
  const openModal = (sheetData) => {
    setIsModalOpen(true);
    setSheetData(sheetData);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id, sheetName) => {
    setSheetToDelete({ id, sheetName });
    setConfirmModalOpen(true);
  };

  const handleDelete = () => {
    if (!sheetToDelete) return;

    axios
      .delete(`${HOST}/deleteSpreadsheet/${sheetToDelete.id}`, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then(({ data }) => {
        if (data.error) {
          alert(data.error);
          return;
        }
        setSpreadSheet((prevSpreadsheets) =>
          prevSpreadsheets.filter((sheet) => sheet._id !== sheetToDelete.id)
        );
        setFilteredSheets((prevFilteredSheets) =>
          prevFilteredSheets.filter((sheet) => sheet._id !== sheetToDelete.id)
        );
        setConfirmModalOpen(false);
        notifySuccess("Spreadsheet deleted successfully!");
      })
      .catch((err) => {
        console.log(err.message);
        setConfirmModalOpen(false);
      });
  };

  const handleDeleteCancel = () => {
    setConfirmModalOpen(false);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const tableData = filteredSheets
    ?.slice()
    .sort((a, b) => {
      const dateA = new Date(a.lastUpdatedDate);
      const dateB = new Date(b.lastUpdatedDate);

      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;

      return dateB - dateA;
    })
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);


  console.log({ filteredSheets, tableData });

  // Function to format date in dd/MM/YYYY hh:mm:ss format
  function formatLastUpdatedDate(dateInput) {
    // Check if dateInput is valid
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return "N/A"; // Return "N/A" if the date is invalid
    }

    // Format the date using toLocaleString with 'en-GB' options
    const formattedDate = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return formattedDate;
  }

  const handleCopyToClipboard = (sheet) => {
    const url = `${FRONTENDHOST}/${sheet._id}/view`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        notifySuccess("Link copied to clipboard!");
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <>
      <div className="overflow-x-auto m-4 rounded-[10.423px] border-[1.303px] border-[#FFF7EA] bg-[#FEFBF7] overflow-hidden">
        <div className="w-[100%] border-b-[1.303px]">
          <div className="flex gap-[10px]  p-4 relative z-[100]">
            {/* Search input */}
            <div className="flex">
              <Input
                prefix={<BiSearch />}
                value={searchValue}
                onChange={handleSearch}
                style={{ width: "200px" }}
                className="min-w-[150px]"
                placeholder="Search by Spreadsheet Name"
                allowClear
              />
            </div>
            {/* <div className="flex">
              <Select
                defaultValue={"Select App Name"}
                style={{ width: "200px" }}
                className="w-full"
                size="large"
                options={[
                  { value: "", label: "Select App Name", disabled: true },
                  { value: "Interactive List", label: "Interactive List" },
                ]}
              />
            </div> */}
            <div className="flex items-center">
              <AutoComplete
                style={{
                  width: 200,
                  height: 44,
                }}
                options={options}

                size="large"
                filterOption={(inputValue, option) =>
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
                onChange={handleSearchDropdown}
              >
                <Input
                  // onChange={handleSearch}
                  placeholder="Select App Name"
                  style={{
                    width: 200,
                    height: 44,
                  }} size="large"
                  allowClear
                />
              </AutoComplete>
            </div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-auto">
          <table className="min-w-full table-fixed">
            <thead className="sticky top-0 bg-[#FEFBF7] z-10">
              <tr className="border-b-[1.303px] border-[#EAECF0]">
                <th className="w-1/2 p-4 text-start text-[#101828] font-poppins text-[24px] font-semibold leading-[23.452px]">
                  Active Spreadsheet
                </th>
                <th className="w-1/6 p-4 text-start text-[#667085] font-poppins text-[20px] font-semibold leading-[23.452px]">
                  App Name
                </th>
                <th className="w-1/6 p-4 text-start text-[#667085] font-poppins text-[20px] font-semibold leading-[23.452px]">
                  Access
                </th>
                <th className="w-1/6 p-4 text-start text-[#667085] font-poppins text-[20px] font-semibold leading-[23.452px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData?.length === 0 ? (
                // Show animate-pulse skeleton rows when there's no data
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse border-b border-[#EAECF0]">
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-4">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                tableData?.map((sheet, index) => (
                  <tr
                    key={sheet._id}
                    className="border-b-[1.303px] border-[#EAECF0]"
                  >
                    <td className="px-4 py-2">
                      <a
                        onClick={() => handleEdit(sheet._id, sheet.access)}
                        className="text-[#437FFF] font-poppins text-[14px] font-normal leading-[26px] underline cursor-pointer"
                      >
                        {sheet.spreadsheetName || sheet.firstSheetName}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-[14px]">{sheet.appName}</td>
                    <td className="px-4 py-2 text-[14px]">
                      {(sheet.access && sheet.access.charAt(0).toUpperCase() + sheet.access.slice(1)) || "N/A"}
                    </td>

                    <td className="px-4 py-2 flex gap-[15px] justify-start items-center">
                      <button
                        onClick={() => openModal(sheet)}
                        className="relative"
                        title="Preview"
                      >
                        <div className="group">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="stroke-current group-hover:stroke-orange-500"
                          >
                            <path
                              d="M1.71615 10.2898C1.6467 10.1027 1.6467 9.89691 1.71615 9.70981C2.39257 8.06969 3.54075 6.66735 5.01513 5.68056C6.48951 4.69378 8.22369 4.16699 9.99782 4.16699C11.7719 4.16699 13.5061 4.69378 14.9805 5.68056C16.4549 6.66735 17.6031 8.06969 18.2795 9.70981C18.3489 9.89691 18.3489 10.1027 18.2795 10.2898C17.6031 11.9299 16.4549 13.3323 14.9805 14.3191C13.5061 15.3058 11.7719 15.8326 9.99782 15.8326C8.22369 15.8326 6.48951 15.3058 5.01513 14.3191C3.54075 13.3323 2.39257 11.9299 1.71615 10.2898Z"
                              stroke="#919191"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                              stroke="#919191"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </button>

                      {/* Copy button - always visible for all access types */}
                      <button
                        className="icons"
                        onClick={() => handleCopyToClipboard(sheet)}
                        title="Copy View Link"
                      >
                        <div className="group">
                          <MdOutlineContentCopy
                            className="cursor-pointer text-xl text-[#919191]"
                          />
                        </div>
                      </button>

                      {/* {sheet.access == "view" && (
                        <button
                          className="icons"
                          onClick={() => handleCopy(sheet._id, sheet.access)}
                        // disabled={sheet.access == "view"}
                        >
                          <div className="group">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="Frame">
                                <path
                                  id="Vector"
                                  d="M14.9567 6.31592H7.71525C6.91539 6.31592 6.26697 6.96434 6.26697 7.7642V15.0056C6.26697 15.8055 6.91539 16.4539 7.71525 16.4539H14.9567C15.7566 16.4539 16.405 15.8055 16.405 15.0056V7.7642C16.405 6.96434 15.7566 6.31592 14.9567 6.31592Z"
                                  stroke="#919191"
                                  strokeWidth="1.66667"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  id="Vector_2"
                                  d="M3.37041 12.1092C2.57385 12.1092 1.92212 11.4575 1.92212 10.6609V3.41948C1.92212 2.62292 2.57385 1.97119 3.37041 1.97119H10.6118C11.4084 1.97119 12.0601 2.62292 12.0601 3.41948"
                                  stroke="#919191"
                                  strokeWidth="1.66667"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>
                          </div>
                        </button>
                      )} */}

                      {sheet.access !== "view" && (
                        <button
                          className="icons"
                          onClick={() => handleEdit(sheet._id, sheet.access)}
                          disabled={sheet.access == "view"}
                          title="Edit"
                        >
                          <div className="group">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              className="group-hover:stroke-orange-500"
                            >
                              <g clipPath="url(#clip0_508_940)">
                                <path
                                  d="M17.6462 5.67633C18.0868 5.23585 18.3344 4.63839 18.3345 4.01538C18.3346 3.39237 18.0871 2.79484 17.6467 2.35425C17.2062 1.91366 16.6087 1.66609 15.9857 1.66602C15.3627 1.66594 14.7652 1.91335 14.3246 2.35383L3.20291 13.478C3.00943 13.6709 2.86634 13.9084 2.78625 14.1697L1.68541 17.7963C1.66388 17.8684 1.66225 17.945 1.68071 18.0179C1.69916 18.0908 1.73701 18.1574 1.79024 18.2105C1.84347 18.2636 1.9101 18.3014 1.98305 18.3197C2.05599 18.3381 2.13255 18.3363 2.20458 18.3147L5.83208 17.2147C6.09306 17.1353 6.33056 16.9931 6.52375 16.8005L17.6462 5.67633Z"
                                  stroke="#919191"
                                  strokeWidth="1.66667"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12.5 4.16602L15.8333 7.49935"
                                  stroke="#919191"
                                  strokeWidth="1.66667"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_508_940">
                                  <rect width="20" height="20" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </button>
                      )}

                      {sheet.access !== "view" && (
                        <button
                          className="icons"
                          onClick={() =>
                            handleDeleteClick(
                              sheet._id,
                              sheet.spreadsheetName || sheet.firstSheetName
                            )
                          }
                          disabled={sheet.access == "view"}
                          title="Delete"
                        >
                          <div className="group">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              className="group-hover:stroke-orange-500"
                            >
                              <path
                                d="M2.5 5H17.5"
                                stroke="#919191"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M15.8346 5V16.6667C15.8346 17.5 15.0013 18.3333 14.168 18.3333H5.83464C5.0013 18.3333 4.16797 17.5 4.16797 16.6667V5"
                                stroke="#919191"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6.66797 4.99935V3.33268C6.66797 2.49935 7.5013 1.66602 8.33464 1.66602H11.668C12.5013 1.66602 13.3346 2.49935 13.3346 3.33268V4.99935"
                                stroke="#919191"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8.33203 9.16602V14.166"
                                stroke="#919191"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M11.668 9.16602V14.166"
                                stroke="#919191"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </button>
                      )}

                      {sheet.access == "owner" && (
                        <button
                          className="icons"
                          onClick={() => handleShare(sheet._id, sheet.sharedWith, sheet)}
                          disabled={sheet.access == "view"}
                          title="Share"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            // className="group-hover:stroke-orange-500"
                            className={`group-hover:stroke-orange-500 ${sheet.access === "view" ? "disabled-svg" : ""
                              }`}
                          >
                            <path
                              d="M15 6.66602C16.3807 6.66602 17.5 5.54673 17.5 4.16602C17.5 2.7853 16.3807 1.66602 15 1.66602C13.6193 1.66602 12.5 2.7853 12.5 4.16602C12.5 5.54673 13.6193 6.66602 15 6.66602Z"
                              stroke="#919191"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5 12.5C6.38071 12.5 7.5 11.3807 7.5 10C7.5 8.61929 6.38071 7.5 5 7.5C3.61929 7.5 2.5 8.61929 2.5 10C2.5 11.3807 3.61929 12.5 5 12.5Z"
                              stroke="#919191"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 18.333C16.3807 18.333 17.5 17.2137 17.5 15.833C17.5 14.4523 16.3807 13.333 15 13.333C13.6193 13.333 12.5 14.4523 12.5 15.833C12.5 17.2137 13.6193 18.333 15 18.333Z"
                              stroke="#919191"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.15625 11.2578L12.8479 14.5745"
                              stroke="#919191"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.8396 5.4248L7.15625 8.74147"
                              stroke="#919191"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      // ) :
                      //   (
                      //   <div><button className="icons pt-1" title="Reset Table Styles"
                      //     onClick={() => handleCopyToClipboard(sheet)}
                      //   >
                      //     <MdOutlineContentCopy
                      //       className=" cursor-pointer text-xl text-[#919191]"
                      //       title={"Copy View Link"}
                      //     />
                      //   </button></div>
                        )
                      }
                    </td>
                  </tr>
                )))}
              <DeleteAlert
                isOpen={confirmModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDelete}
                sheetName={sheetToDelete?.sheetName}
              />
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <Preview closeModal={closeModal} sheetdetails={sheetData} />
        )}

        {showModal && (
          <ShareModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            spreadsheetId={spreadsheetIdForShare}
            sharedWith={sheetSharedWith}
            updateSharedWith={updateSharedWith}
            settings={settings}
          />
        )}

        <div className="p-4 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredSheets?.length}
            onChange={handlePageChange}
            showSizeChanger
          />
        </div>
      </div>
    </>
  );
};

export default DashboardTable;
