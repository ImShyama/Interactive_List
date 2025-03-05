import { React, useState, useEffect, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../pagination/Pagination";
import InfoCard from "./InfoCard";
import CityBarGraph from "./CityBarChart";
import DeviceBarGraph from "./DeviceBarGraph";
import DeleteConformationModal from "./DeleteConformationModal";
import { IconButton, Box } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import linkContext from "../../context/links/linkContext";
import { Tooltip } from "antd";
import { FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const Users = (props) => {
  let host = "http://localhost:3000/api";
  if (document.location.href.includes("localhost")) {
    host = "http://localhost:3000/api";
  } else {
    host = "api";
  }

  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(linkContext);
  let { user, userDetails } = context;
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [approvedFilter, setApprovedFilter] = useState("all");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userId, setUserId] = useState("");
  // const [sortColumn, setSortColumn] = useState(null);
  // const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(localStorage.getItem("currentPage")) || 1;
  });
  const [pageSize, setPageSize] = useState(() => {
    return parseInt(localStorage.getItem("pageSize")) || 20;
  });

  useEffect(() => {
    userDetails();
  }, []);

  const handleClickSecurityIcon = () => navigate("/dashboard");

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);

  // useEffect(() => {
  //   if (localStorage.getItem("adminToken")) {
  //     usersData();
  //   } else {
  //     navigate("/login");
  //   }
  //   // eslint-disable-next-line
  // }, []);

  const handleOpenDeleteModal = (id) => {
    setUserId(id);
    setOpenDeleteModal(true);
  };

  const handleCancelModal = () => setOpenDeleteModal(false);

  const usersData = async () => {
    try {
      const response = await fetch(`${host}/auth/getalluser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setUsersCount(json.count);
      setUsers(json.clients);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    usersData();
  }, []);

  // Update user approval status
  const updateUserApproval = async (_id) => {
    const response = await fetch(`${host}/auth/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: _id }),
    });
    const json = await response.json();
    await usersData();
    setUsers(json.clients);
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${host}/auth/deleteuser/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      await usersData();
      setUsers(json.clients);
      props.showAlert("Deleted Sucessfully", "success");
      handleCancelModal();
      setUserId("");
    } catch (error) {
      console.log(error);
    }
  };

  // Update user role - user/admin
  const handleRole = (e, id) => {
    const role = e.target.value;
    updateRole(id, role);
  };

  const updateRole = async (id, role) => {
    const response = await fetch(`${host}/auth/updateRole/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ role: role }),
    });
    const json = await response.json();
    await usersData();
    setUsers(json.clients);
  };

  // Filter users based on search terms
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchName.toLowerCase()) &&
        user.email?.toLowerCase().includes(searchEmail.toLowerCase()) &&
        (approvedFilter === "all" ||
          (approvedFilter === "approved" && user.approved) ||
          (approvedFilter === "unapproved" && !user.approved))
    );
  }, [users, searchName, searchEmail, approvedFilter]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return filteredUsers.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredUsers, pageSize]);

  const handleReset = () => {
    setSearchName("");
    setSearchEmail("");
    setApprovedFilter("all");
    setCurrentPage(1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("pageSize", pageSize);
  }, [pageSize]);

  // Current date
  function formatDate() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentDate = new Date();
    const dayOfWeek = days[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    return `${dayOfWeek} ${dayOfMonth} ${month}, ${year}`;
  }

  // Format Date And Time
  function ExpressiveDateString(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Convert to IST (UTC+5:30)
    const istOffset = 5 * 60 + 30; // IST offset in minutes
    const istDate = new Date(date.getTime() + istOffset * 60 * 1000);

    // Define the month names
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the day of the month and determine the suffix (st, nd, rd, th)
    const day = istDate.getUTCDate();
    const daySuffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    // Get the month name
    const month = months[istDate.getUTCMonth()];

    // Get the year
    const year = istDate.getUTCFullYear();

    // Get the hours and minutes, and convert to 12-hour format
    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM

    // Format the minutes with leading zero if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Construct the formatted date string
    const formattedDate = `${day}${daySuffix} ${month} ${year}, ${hours}:${formattedMinutes} ${ampm}`;

    return formattedDate;
  }

  // const handleSort = (column) => {
  //   if (sortColumn === column) {
  //     // Toggle the sorting direction
  //     setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  //   } else {
  //     // Sort by the new column, default to ascending order
  //     setSortColumn(column);
  //     setSortDirection("asc");
  //   }
  // };

  // const sortedUsers = useMemo(() => {
  //   const sortedData = [...filteredUsers];

  //   if (sortColumn) {
  //     sortedData.sort((a, b) => {
  //       const valueA = a[sortColumn];
  //       const valueB = b[sortColumn];

  //       if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
  //       if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
  //       return 0;
  //     });
  //   }

  //   return sortedData;
  // }, [filteredUsers, sortColumn, sortDirection]);

  // const currentTableData = useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * pageSize;
  //   const lastPageIndex = firstPageIndex + pageSize;
  //   return sortedUsers.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage, filteredUsers, pageSize]);

  return (
    <div
      // className="container"
      style={{
        paddingBottom: "25px",
        width: "95%",
        margin: "20px auto auto auto",
        position: "relative",
      }}
    >
      {location.pathname === "/users" && (
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            position: "fixed",
            maxHeight: "100vh",
            bottom: "15px",
            right: "10px",
            zIndex: 100,
          }}
        >
          <Box>
            {" "}
            <Tooltip title={<span>Email : {user && user.email}</span>}>
              <IconButton
                sx={{
                  color: "#fff",
                  background: "#00bce0",
                  "&:hover": {
                    background: "#09b1c3",
                  },
                }}
              >
                <FaUserCircle />
              </IconButton>
            </Tooltip>
          </Box>

          <Box>
            <Tooltip title="User dashboard">
              <IconButton
                onClick={handleClickSecurityIcon}
                sx={{
                  color: "#fff",
                  background: "#00bce0",
                  "&:hover": {
                    background: "#09b1c3",
                  },
                }}
              >
                {/* <MdOutlineSecurity /> */}
                <MdAdminPanelSettings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
      <div
        className="mb-4"
        style={{
          width: "100%",
          margin: "auto",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div style={{ width: "50%" }}>
          <div
            style={{ color: "#808080", fontSize: "16px", fontWeight: "500" }}
          >
            Dashboard
          </div>
          <div style={{ fontSize: "14px", color: "#808080" }}>
            {formatDate()}
          </div>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => {
            setSearchEmail(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="form-select"
          value={approvedFilter}
          onChange={(e) => {
            setApprovedFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            border: "1px solid #ccc",
            outline: "1px solid transparent",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="unapproved">Unapproved</option>
        </select>
        <button
          className="btn btn-primary"
          style={{
            border: "1px solid #ccc",
            outline: "1px solid transparent",
            borderRadius: "5px",
            padding: "5px 20px",
            fontSize: "14px",
          }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <InfoCard users={users} usersCount={usersCount} />

      <div
        className="table-responsive"
        style={{
          background: "#fff",
        }}
      >
        <table
          style={{
            border: "1px solid #dddfe2",
          }}
          className="table table-bordered table-striped table-hover table-sm"
        >
          <thead style={{ background: "#f7f7f7" }}>
            <tr>
              <th scope="col">Sr No.</th>

              <th
                style={{ textAlign: "left" }}
                // onClick={() => handleSort("name")}
              >
                User Name
                {/* User Name{" "}
                {sortColumn === "name" &&
                  (sortDirection === "asc" ? "hi" : "hello")} */}
              </th>
              <th style={{ textAlign: "left" }}>Email</th>
              <th style={{ textAlign: "left" }}>Created At</th>
              <th style={{ textAlign: "left" }}>Trees Created</th>
              <th
                style={{
                  //  width: "80px",
                  textAlign: "center",
                }}
              >
                Role
              </th>
              <th
                // scope="col"
                style={{
                  // width: "110px",
                  textAlign: "center",
                }}
              >
                Approved
              </th>
              <th
                // scope="col"
                style={{
                  //  width: "50px",
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTableData?.map((user, index) => {
              const serialNumber = (currentPage - 1) * pageSize + index + 1;
              return (
                <tr
                  key={index}
                  style={{
                    background: index % 2 === 0 ? "#f7fcf5" : "#ffffff",
                  }}
                >
                  <th scope="row">{serialNumber}</th>
                  <td style={{ textAlign: "left" }}>{user.name}</td>
                  <td style={{ textAlign: "left" }}>{user.email}</td>
                  {/* {user.createdAt ? (
                    <td style={{ textAlign: "left" }}>
                      {ExpressiveDateString(user.createdAt)}
                    </td>
                  ) : (
                    <td style={{ textAlign: "left" }}>--</td>
                  )} */}
                  <td style={{ textAlign: "left" }}>
                    {user.createdAt
                      ? ExpressiveDateString(user.createdAt)
                      : user.date
                      ? ExpressiveDateString(user.date)
                      : "--"}
                  </td>
                  <td style={{ textAlign: "left" }}>{user?.userid.length}</td>

                  <td
                    style={{
                      width: "120px",
                      textAlign: "center",
                      padding: "0px",
                    }}
                  >
                    <select
                      className="form-select form-select-sm"
                      value={user.role}
                      style={{ margin: "0px", cursor: "pointer" }}
                      aria-label=".form-select-sm example"
                      onChange={(e) => handleRole(e, user._id)}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>

                  <td
                    style={{
                      // width: "50px",
                      textAlign: "center",
                    }}
                  >
                    <input
                      style={{ cursor: "pointer" }}
                      type="checkbox"
                      checked={user.approved}
                      onChange={() => updateUserApproval(user._id)}
                      className="form-check-input"
                    />
                  </td>
                  <td
                    style={{
                      // width: "50px",
                      textAlign: "center",
                    }}
                  >
                    <Tooltip title="Delete this user" arrow placement="top">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteModal(user._id)}
                      >
                        <MdDeleteOutline color="red" />
                      </IconButton>
                    </Tooltip>
                    {/* <i
                      className="fa-solid fa-trash-can mx-2"
                      style={{ color: "red" }}
                      onClick={() => {
                        deleteUser(user._id);
                        props.showAlert("Deleted Sucessfully", "success");
                      }}
                    ></i> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ marginRight: "10px" }}>Rows Per Page : </span>
            <select
              // className="form-select"
              style={{
                fontSize: "14px",
                outline: "none",
                border: "1px solid #ccc",
                padding: "5px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div>
            {" "}
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={users.length}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      <div className="bar-graph">
        <div>
          <h2>Top Cities</h2>
          <CityBarGraph />
        </div>

        <div>
          <h2>Top Devices</h2>
          <DeviceBarGraph />
        </div>
      </div>
      {/* Delete conformation modal */}
      <DeleteConformationModal
        openDeleteModal={openDeleteModal}
        handleCancel={handleCancelModal}
        deleteUser={deleteUser}
        userId={userId}
      />
    </div>
  );
};

export default Users;
