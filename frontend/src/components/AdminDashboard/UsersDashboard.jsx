import { React, useState, useEffect, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InfoCard from "./InfoCard";
import DeleteConformationModal from "./DeleteConformationModal";
import { IconButton, Box } from "@mui/material";
import { Input } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { Tooltip, Table, Select } from "antd";
import { FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import "./Dashboard.css";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { HOST } from "../../utils/constants";
import useToken from "../../utils/useToken";
import { notifyError, notifySuccess } from "../../utils/notify";

const UsersDashboard = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  const token = useToken();
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [approvedFilter, setApprovedFilter] = useState("all");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [spreadSheet, setSpreadSheet] = useState([]);
  const [filteredSheets, setFilteredSheets] = useState([]); 
  const handleClickSecurityIcon = () => navigate("/dashboard");
  const handleCancelModal = () => setOpenDeleteModal(false);

  useEffect(() => {
    axios
      .post(`${HOST}/getSpreadSheets`, {}, {
        headers: { authorization: "Bearer " + token, },
      })
      .then(({ data: res }) => {
        console.log({res});
        if (res.error) {
          notifyError(res.error);
          navigate("/");
          return;
        }
        setSpreadSheet(res);
        setFilteredSheets(res); // Initially, filteredSheets is the same as spreadsheet
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  

  const handleOpenDeleteModal = (id) => {
    setUserId(id);
    setOpenDeleteModal(true);
  };

  // useEffect(() => {
  //   axios.get(`${HOST}/getallusers`, {
  //     headers: { authorization: "Bearer " + token },
  //   })
  //   .then(({ data: res }) => {
  //     if (res.error) {
  //       notifyError(res.error);
  //       navigate("/");
  //       return;
  //     }
  //     console.log("getallusers API Response:", res); // Debug
  //     setUsers(res);
  //   })
  //   .catch((err) => console.log("API Error:", err.message));
  // }, []);
  
  useEffect(() => {
    axios
      .get(`${HOST}/getallusers`, {
        headers: { authorization: "Bearer " + token },
      })
      .then(({ data: res }) => {
        console.log("getallusers API Response:", res); // Debugging
        setUsers(res);
      })
      .catch((err) => {
        console.log("API Error:", err.message);
        if (err.response && err.response.status === 401) {
          notifyError("Unauthorized access");
          navigate("/");
        }
      });
  }, []);
  

  // Update user approval status
  const updateUserApproval = async (_id) => {
    console.log({ _id });
    const updatedUsers = users?.map((user) => {
      if (user._id === _id) {
        return { ...user, isApproved: !user.isApproved };
      }
      return user;
    });
    console.log({ updatedUsers });
    setUsers(updatedUsers);

    try {
      const { data } = await axios.put(`${HOST}/auth/approve`, { _id }, {
        headers: { authorization: "Bearer " + token },
      });
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === _id ? { ...user, approved: !user.approved } : user
        )
      );
      console.log("User approval updated:", data);
    } catch (error) {
      console.error("Approval Error:", error);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === _id ? { ...user, approved: !user.approved } : user
        )
      );
      props.showAlert("Error updating approval status", "error");
    }
  };

  // Delete user
  // const deleteUser = async (id) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${host}/auth/deleteuser/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "auth-token": localStorage.getItem("token"),
  //       },
  //     });
  //     const json = await response.json();
  //     await usersData();
  //     setUsers(json.clients);
  //     props.showAlert("Deleted Sucessfully", "success");
  //     handleCancelModal();
  //     setUserId("");
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${HOST}/auth/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token, // Consistency in authorization
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
  
      const json = await response.json();
      
      // Update UI by filtering out the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
  
      notifySuccess("User deleted successfully", "success");
      handleCancelModal(); // Close modal after success
      setUserId("");
    } catch (error) {
      console.error("Delete Error:", error);
      notifyError("Error deleting user", "error");
    } finally {
      setLoading(false);
    }
  };
  

  // Update user role - user/admin
  const handleRole = (id, role) => {
    updateRole(id, role);
  };

  const updateRole = async (id, role) => {
    const updatedUsers = users?.map((user) => {
      if (user._id === id) {
        return { ...user, role: role };
      }
      return user;
    });
    setUsers(updatedUsers);

    try {
      const { data } = await axios.put(
        `${HOST}/auth/updateRole/${id}`,
        { role },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
        }
      );
  
      setUsers(data.clients);
      console.log("User role updated:", data);
    } catch (error) {
      console.error("Role Update Error:", error);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, role: user.previousRole } : user
        )
      );
      notifyError("Error updating role", error);
    }
  };

  // Filter users based on search terms
  const filteredUsers = useMemo(() => {
    return users?.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchName.toLowerCase()) &&
        user.email?.toLowerCase().includes(searchEmail.toLowerCase()) &&
        (approvedFilter === "all" ||
          (approvedFilter === "approved" && user.approved) ||
          (approvedFilter === "unapproved" && !user.approved))
    );
  }, [users, searchName, searchEmail, approvedFilter]);

  console.log({ filteredUsers });

  const handleReset = () => {
    setSearchName("");
    setSearchEmail("");
    setApprovedFilter("all");
    setCurrentPage(1);
  };

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

  return (
    <div
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
                  background:
                    "linear-gradient(110deg, #00bce0 3.48%, #f52bff 81.52%)",
                  "&:hover": {
                    background:
                      "linear-gradient(110deg, #f52bff 3.48%, #00bce0 81.52%)",
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
                  background:
                    "linear-gradient(110deg, #00bce0 3.48%, #f52bff 81.52%)",
                  "&:hover": {
                    background:
                      "linear-gradient(110deg, #f52bff 3.48%, #00bce0 81.52%)",
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
        <Input
          type="text"
          className="form-control w-[300px]"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Input
          type="text"
          className="form-control w-[300px]"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => {
            setSearchEmail(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select
          className="form-select w-[160px]"
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
        </Select>
        <button
          className="bg-primary rounded-[4px] p-[5px] text-white"
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

      <InfoCard users={users} usersCount={usersCount} spreadSheet={spreadSheet} />

      <div
        style={{
          borderRadius: "21px",
          background: "#fff",
          overflow: "hidden",
          border: "1px solid #e5e9f0",
        }}
      >
        <Table
          className="admin-custom-table"
          loading={loading}
          bordered
          rowClassName={(record, index) =>
            index % 2 === 0 ? "even-row" : "odd-row"
          }
          dataSource={filteredUsers.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowKey="_id"
          pagination={{
            size: "small",
            current: currentPage,
            pageSize,
            total: filteredUsers.length,
            onChange: setCurrentPage,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onShowSizeChange: (current, size) => {
              setPageSize(size);
            },
            className: "custom-pagination",
          }}
          columns={[
            {
              title: "Sr No.",
              key: "srno",
              render: (_, __, index) =>
                (currentPage - 1) * pageSize + index + 1,
            },
            {
              title: <div className="headerName">Name</div>,
              dataIndex: "name",
              key: "name",
              render: (text) => <div className="headerCell">{text}</div>,
              sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
              title: <div className="headerName">Email</div>,
              dataIndex: "email",
              key: "email",
              width: 200,
              render: (text) => <div className="headerCell">{text}</div>,
              sorter: (a, b) => a.email.localeCompare(b.email),
            },
            {
              title: <div className="headerName">Created At</div>,
              dataIndex: "createdAt",
              key: "createdAt",
              width: 200,
              render: (text, record) => (
                <div className="headerCell" style={{ whiteSpace: "nowrap" }}>
                  {record.createdAt
                    ? ExpressiveDateString(record.createdAt)
                    : record.date
                      ? ExpressiveDateString(record.date)
                      : "N/A"}
                </div>
              ),
              sorter: (a, b) => {
                const dateA = a.createdAt || a.date || "";
                const dateB = b.createdAt || b.date || "";
                return dateA.localeCompare(dateB);
              },
            },
            {
              title: <div className="headerName">Apps Created</div>,
              dataIndex: "appsCount",
              key: "appsCount",
              render: (text) => (
                <div className="headerCell text-[18px]" style={{ textAlign: "center" }}>
                  {text || 0}
                </div>
              ),
              sorter: (a, b) =>
                (a.userid?.length || 0) - (b.userid?.length || 0),
            },

            {
              title: <div className="headerName">Role</div>,
              key: "role",
              render: (record) => (
                <div className="headerCell">
                  <Select
                    style={{ width: "100px" }}
                    value={record?.role}
                    onChange={(role) => handleRole(record._id, role)}
                    suffixIcon={<IoIosArrowDown size={15} color="#767a8f" />}
                  >
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                  </Select>
                </div>
              ),
              sorter: (a, b) => a.role.localeCompare(b.role),
            },
            {
              title: (
                <div className="headerName" style={{ textAlign: "center" }}>
                  Approved
                </div>
              ),
              key: "approved",
              render: (record) => (
                <div className="flex items-center justify-center custom-checkbox">
                  <input
                    type="checkbox"
                    checked={record.isApproved}
                    onChange={() => updateUserApproval(record._id)}
                  />
                </div>
              ),
              sorter: (a, b) => Number(a.approved) - Number(b.approved),
            },
            {
              title: (
                <div className="headerName" style={{ textAlign: "center" }}>
                  Actions
                </div>
              ),
              key: "actions",
              render: (record) => (
                <Tooltip title="Delete User">
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteModal(record._id)}
                  >
                    <MdDeleteOutline size={18} />
                  </IconButton>
                </Tooltip>
              ),
            },
          ]}
        />
      </div>

      {/* Delete conformation modal */}
      {openDeleteModal && (
        <DeleteConformationModal
          openDeleteModal={openDeleteModal}
          handleCancel={handleCancelModal}
          deleteUser={deleteUser}
          userId={userId}
          loading={loading}
        />
      )}
    </div>
  );
};

export default UsersDashboard;
