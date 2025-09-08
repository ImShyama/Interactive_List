import React, { useState, useMemo, useEffect } from 'react';
import { IconButton, Box } from "@mui/material";
import { Input } from "antd";
import { Tooltip } from "antd";
import { notifySuccess, notifyError } from "../../utils/notify";
import SettingModel from "./SettingModel";
import { MdEdit, MdBlock, MdArrowBack } from "react-icons/md";
import { fetchApps, updateAppGroups, toggleAppVisibility } from "../../APIs/index.jsx";
import useToken from "../../utils/useToken";

const AppsList = ({ onBack }) => {
    const token = useToken();
    const [apps, setApps] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [openSettingsModal, setOpenSettingsModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch apps from backend
    useEffect(() => {
        const loadApps = async () => {
            try {
                setLoading(true);
                const appsData = await fetchApps(token);
                setApps(appsData);
            } catch (error) {
                console.error("Error loading apps:", error);
                notifyError("Failed to load apps");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadApps();
        }
    }, [token]);

    // Filter apps based on search
    const filteredApps = useMemo(() => {
        return apps?.filter((app) =>
            app.appName?.toLowerCase().includes(searchName.toLowerCase())
        );
    }, [apps, searchName]);

    // Handle app edit
    const handleEditApp = (app) => {
        setSelectedApp(app);
        setOpenSettingsModal(true);
    };

    // Handle app disable/enable
    const handleToggleApp = async (app) => {
        try {
            const updatedApp = await toggleAppVisibility(app._id, token);
            setApps((prevApps) => 
                prevApps.map(a => a._id === app._id ? updatedApp : a)
            );
            notifySuccess(`App ${app.show ? 'disabled' : 'enabled'} successfully`);
        } catch (error) {
            console.error("Error toggling app:", error);
            notifyError("Failed to toggle app status");
        }
    };

    const handleReset = () => {
        setSearchName("");
    };

    const handleSave = async (selectedGroups) => {
        if (selectedApp) {
            try {
                const updatedApp = await updateAppGroups(selectedApp._id, selectedGroups, token);
                setApps((prevApps) => 
                    prevApps.map(app => app._id === selectedApp._id ? updatedApp : app)
                );
                notifySuccess("App settings updated successfully");
            } catch (error) {
                console.error("Error updating app groups:", error);
                notifyError("Failed to update app settings");
            }
        }
        setOpenSettingsModal(false);
        setSelectedApp(null);
    };

    const handleCancel = () => {
        setOpenSettingsModal(false);
        setSelectedApp(null);
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

    return (
        <div
            style={{
                paddingBottom: "25px",
                width: "95%",
                margin: "20px auto auto auto",
                position: "relative",
            }}
        >
            {/* Header with back button */}
            <div
                style={{
                    width: "100%",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <div style={{ width: "50%" }}>
                    <div
                        style={{ color: "#808080", fontSize: "16px", fontWeight: "500" }}
                    >
                        Apps List
                    </div>
                    <div style={{ fontSize: "14px", color: "#808080" }}>
                        {formatDate()}
                    </div>
                </div>
                <div style={{ width: "50%", display: "flex", justifyContent: "right", alignItems: "center", gap: "20px" }}>
                    {/* Back Button */}
                    <Tooltip title="Back to Dashboard">
                        <IconButton
                            onClick={onBack}
                            sx={{
                                color: "#6b7280",
                                backgroundColor: "#f3f4f6",
                                "&:hover": {
                                    backgroundColor: "#e5e7eb",
                                    color: "#374151",
                                },
                            }}
                        >
                            <MdArrowBack size={20} />
                        </IconButton>
                    </Tooltip>

                    {/* Search Input */}
                    <Input
                        type="text"
                        className="form-control w-[300px]"
                        placeholder="Search by app name"
                        value={searchName}
                        onChange={(e) => {
                            setSearchName(e.target.value);
                        }}
                    />

                    {/* Reset Button */}
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

            </div>

            {/* Apps List */}
            <div
                style={{
                    borderRadius: "21px",
                    background: "#fff",
                    overflow: "hidden",
                    border: "1px solid #e5e9f0",
                    padding: "20px",
                }}
            >
                {loading ? (
                    <div className="text-center py-8">
                        <div className="text-gray-500">Loading apps...</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApps.map((app) => (
                        <div
                            key={app.appName}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-[100px] h-[100px] rounded-lg flex items-center justify-center">
                                    <img
                                        src={app.appImg}
                                        alt={app.appName}
                                        className="w-[100px] h-[100px] object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {app.appName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {app.description}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-1 text-xs rounded-full ${app.show
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {app.show ? 'Enabled' : 'Disabled'}
                                        </span>
                                        {app.allowedGroups.length > 0 && (
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                {app.allowedGroups.length} group(s) assigned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Tooltip title="Edit App Settings">
                                    <IconButton
                                        onClick={() => handleEditApp(app)}
                                        sx={{
                                            color: "#3b82f6",
                                            "&:hover": {
                                                backgroundColor: "#eff6ff",
                                            },
                                        }}
                                    >
                                        <MdEdit size={20} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={app.show ? "Disable App" : "Enable App"}>
                                    <IconButton
                                        onClick={() => handleToggleApp(app)}
                                        sx={{
                                            color: app.show ? "#ef4444" : "#10b981",
                                            "&:hover": {
                                                backgroundColor: app.show ? "#fef2f2" : "#f0fdf4",
                                            },
                                        }}
                                    >
                                        <MdBlock size={20} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Setting model */}
            {openSettingsModal && (
                <SettingModel
                    openSettingsModal={openSettingsModal}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    selectedApp={selectedApp}
                />
            )}
        </div>
    );
};

export default AppsList;
