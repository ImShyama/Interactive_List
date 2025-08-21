import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { v4 as uuidv4 } from "uuid"; // for generating unique ids
import { handleSaveChanges } from "../../APIs";
import { updateSetting, updateFilterSettings } from "../../utils/settingSlice";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const AddFilter = ({ settingsData, dispatch, token }) => {
    const [selectedFilter, setSelectedFilter] = useState("");
    const [isAddDisable, setIsAddDisable] = useState(true);
    const [dropdown, setDropdown] = useState([]);
    const { categoryHeader, setCategoryHeader } = useContext(UserContext);

    const handleFilterChange = (event) => {
        const value = event.target.value;
        setSelectedFilter(value);
        setIsAddDisable(value === ""); // Disable if no filter is selected
    };

    const handleAddClick = () => {
        const newFilter = {
            id: uuidv4(),
            title: selectedFilter
        };

        const updatedSettings = {
            ...settingsData,
            filterSettings: {
                ...settingsData.filterSettings,
                filters: [
                    ...(settingsData?.filterSettings?.filters || []),
                    newFilter
                ]
            }
        };

        // Update only the filter settings using the new action
        dispatch(updateFilterSettings(updatedSettings.filterSettings));

        handleSaveChanges(settingsData, token, dispatch, updatedSettings);

        // Reset dropdown
        setSelectedFilter("");
        setIsAddDisable(true);

        // Debug log (can be removed)
        console.log("Updated filterSettings:", updatedSettings);
    };

    useEffect(() => {
        console.log("Updated filterSettings:", settingsData);
        console.log({ categoryHeader });
    
        const existingFilters = settingsData?.filterSettings?.filters?.map(f => f.title.toLowerCase()) || [];
    
        const availableFilters = categoryHeader?.filter(header =>
            !existingFilters.includes(header.replaceAll("_", " ").toLowerCase())
        );
    
        setDropdown(availableFilters);
    }, [settingsData, categoryHeader]);
    

    return (
        <div className="flex justify-between items-center ml-2">
            <div>
                <span className="text-[#111] font-poppins text-[16px] font-medium leading-normal">
                    Add Filter
                </span>
            </div>

            <div className="flex justify-end gap-2">
                <div className="sheet_data_select">
                    <select
                        className="add_input"
                        value={selectedFilter}
                        onChange={handleFilterChange}
                    >
                        <option value="">Select Filter</option>
                        {dropdown?.map((filter, index) => (
                            <option key={index} value={filter.replaceAll("_", " ")}>
                                {filter.replaceAll("_", " ")}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="bg-[#598931] text-white my-1 px-3 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50"
                    disabled={isAddDisable}
                    onClick={handleAddClick}
                >
                    <IoMdAddCircleOutline size={25} />
                </button>
            </div>
        </div>
    );
};

export default AddFilter;
