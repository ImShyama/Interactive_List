import React, { useState, useRef, useEffect, useContext } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { SixDots } from "../../../assets/svgIcons.jsx";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { UserContext } from "../../../context/UserContext";
import { useDispatch } from "react-redux";
import { handleSaveChanges } from "../../../APIs/index.jsx";

const DetailedView = ({ tableHeader, settings }) => {
  const [fields, setFields] = useState([]); // Store added fields
  const [dropdownOpen, setDropdownOpen] = useState({}); // Track dropdown visibility
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [selectedItems, setSelectedItems] = useState(() => {
    return settings?.showInProfile?.reduce((acc, item) => {
      acc[item.key] = true; // Default selection to `true`, change if needed
      return acc;
    }, {}) || {}; // Ensures it's always an object
  });
  const [savedSelections, setSavedSelections] = useState(settings?.showInProfile || []);
  const [hoveredItem, setHoveredItem] = useState(null); // Track hover state
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState("");
  const containerRef = useRef(null); // Reference for the container
  const { token } = useContext(UserContext);
  const dispatch = useDispatch();


  const originalItems = tableHeader.map((header, index) => ({ key: index, value: header.replace(/_/g, " ") }))
  const [items, setItems] = useState(originalItems);

  // const handleSave = () => {
  //   const savedKey = new Set(
  //     Object.keys(selectedItems)
  //       .filter((item) => selectedItems[item])
  //       .map(Number) // Convert string keys to numbers
  //   );

  //   console.log("Saved Keys:", savedKey);

  //   const newSelections = items.filter((item) => savedKey.has(item.key));

  //   setSavedSelections(newSelections); // Asynchronous update

  //   setDropdownOpen({});
  //   const showInProfile = { showInProfile: newSelections }
  //   // Log the updated state after a delay
  //   setTimeout(() => {
  //     console.log("Updated Saved Selections:", newSelections);
  //     handleSaveChanges(settings, token, dispatch, showInProfile)
  //   }, 0);
  // };

  const handleSave = () => {
    // Instead of creating a new Set and filtering, use the current savedSelections
    // which already has the correct order
    const newSelections = savedSelections;

    setSavedSelections(newSelections);
    setDropdownOpen({});
    const showInProfile = { showInProfile: newSelections };

    // Log the updated state after a delay
    setTimeout(() => {
      console.log("Updated Saved Selections:", newSelections);
      handleSaveChanges(settings, token, dispatch, showInProfile)
    }, 0);
  };

  const handleDelete = (item) => {
    const newSelections = savedSelections.filter((i) => i !== item);
    setSavedSelections(newSelections);

    setSelectedItems((prev) => ({
      ...prev,
      [item.key]: false, // Mark the deleted item as false
    }));

    const showInProfile = { showInProfile: newSelections }
    // Log the updated state after a delay
    setTimeout(() => {
      console.log("Updated Saved Selections:", newSelections);
      handleSaveChanges(settings, token, dispatch, showInProfile)
    }, 0);
  };

  const addField = () => {
    if (fields.length === 0) {
      setFields([{ id: 1 }]);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // const handleSearch = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value == "") {
      setItems(originalItems)
    } else {
      setItems(items.filter((item) => item.value.toLowerCase().includes(event.target.value.toLowerCase())))
    }
  };


  // const handleCheckboxChange = (item) => {
  //   console.log(item);
  //   setSelectedItems((prev) => ({
  //     ...prev,
  //     [item.key]: !prev[item.key],
  //   }));
  // };
  // console.log({ selectedItems })

  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) => {
      const newSelectedItems = {
        ...prev,
        [item.key]: !prev[item.key],
      };

      // If the item is being selected (becoming true)
      if (!prev[item.key]) {
        // Add it to the end of savedSelections
        setSavedSelections(prev => [...prev, item]);
      } else {
        // If the item is being deselected, remove it from savedSelections
        setSavedSelections(prev => prev.filter(i => i.key !== item.key));
      }

      return newSelectedItems;
    });
  };
  console.log({ selectedItems })

  const handleSelectAll = () => {
    const isAllSelected = Object.values(selectedItems).every(Boolean);
    const newSelections = {};
    items.forEach((item) => {
      newSelections[item.key] = !isAllSelected;
    });
    setSelectedItems(newSelections);
  };

  // const handleSave = () => {
  //   const newSelections = Object.keys(selectedItems).filter(
  //     (item) => selectedItems[item]
  //   );
  //   setSavedSelections(newSelections);
  //   setDropdownOpen({});
  // };

  // const handleDelete = (item) => {
  //   setSavedSelections((prev) => prev.filter((i) => i !== item));
  // };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditText(item);
  };

  // const handleEditSave = (e) => {
  //   if (e.type === "blur" || (e.type === "keydown" && e.key === "Enter")) {
  //     setSavedSelections((prev) =>
  //       prev.map((item) => (item === editingItem ? editText : item))
  //     );
  //     setEditingItem(null);
  //   }
  // };

  const handleEditSave = (event) => {
    // Check if triggered by click OR blur OR Enter key
    if (
      event.type === "click" ||
      event.type === "blur" ||
      (event.type === "keydown" && event.key === "Enter")
    ) {
      // Validation for empty or whitespace-only text
      if (editText.trim() === "") {
        alert("Text cannot be empty!"); // Or use a toast notification here
        return;
      }

      // Save the edited item
      const updatedSelections = savedSelections.map((item) =>
        item === editingItem ? editText : item
      );
      setSavedSelections(updatedSelections);
      setEditingItem(null);
      setEditText("");
    }
  };

  // // Drag End Handler
  // const handleDragEnd = (result) => {
  //   if (!result.destination) return;

  //   const reordered = Array.from(savedSelections);
  //   const [removed] = reordered.splice(result.source.index, 1);
  //   reordered.splice(result.destination.index, 0, removed);
  //   setSavedSelections(reordered);
  // };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(savedSelections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSavedSelections(items);
    const showInProfile = { showInProfile: items };
    handleSaveChanges(settings, token, dispatch, showInProfile)
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setFields((prev) => prev.slice(0, -1));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 border-t">
      <div className="text-black font-[Poppins] text-[35px] font-medium leading-normal mb-4">
        Detailed View :
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="savedSelections" direction="horizontal">
          {(provided) => (
            <div
              className="flex items-center gap-4"
              ref={(ref) => {
                containerRef.current = ref;
                provided.innerRef(ref);
              }}
              {...provided.droppableProps}
            >
              {savedSelections.map((item, index) => (
                <Draggable key={item.key} draggableId={item.key.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative flex items-center bg-[#F2F2F2] border border-gray-300 rounded-[8px] text-black font-medium transition-all duration-200 hover:mr-10 hover:ml-10 hover:shadow-lg group ${snapshot.isDragging ? "shadow-xl" : "hover:shadow-lg"
                        } group`}
                    >
                      <div className="absolute left-[-25px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move">
                        <SixDots className="text-[#598931]" />
                      </div>

                      {editingItem === item ? (
                        <input
                          type="text"
                          value={editText.value}
                          onChange={(e) => setEditText(e.target.value)}
                          // onBlur={handleEditSave}
                          onKeyDown={handleEditSave}
                          className="px-2 py-1 rounded border border-gray-300 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="px-4 py-2">{item.value}</span>
                      )}

                      <div className="absolute right-[-25px] flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* {editingItem === item ? (
                          <FiSave
                            className="text-xl text-[#598931] cursor-pointer"
                            onClick={() => handleEditSave({ type: "click" })}
                          />
                        ) : (
                          <CiEdit
                            className="text-xl text-[#598931] cursor-pointer"
                            onClick={() => handleEdit(item)}
                          />
                        )} */}
                        <RiDeleteBinLine
                          className="text-xl text-[#598931] cursor-pointer"
                          onClick={() => handleDelete(item)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Dropdown UI */}
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="relative flex items-center border-2 border-[#598931] rounded-[8px] px-4 py-2"
                >
                  <button
                    onClick={() => toggleDropdown(field.id)}
                    className="flex items-center gap-2 hover:text-[#598931]"
                  >
                    <span className="text-[18px] font-medium font-[Poppins]">
                      Select From List
                    </span>
                    <FaChevronDown className="text-[#598931]" />
                  </button>

                  {/* <span className="text-[18px] font-medium font-[Poppins]">
                    Select From List
                  </span>
                  <button
                    onClick={() => toggleDropdown(field.id)}
                    className="ml-2 text-[#598931]"
                  >
                    <FaChevronDown />
                  </button> */}

                  {dropdownOpen[field.id] && (
                    // Existing dropdown content
                    <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-80 p-3 border overflow-hidden z-50">
                      {/* Search & Select All */}
                      <div className="flex items-center justify-between p-2 mt-[-10px] border-b">
                        {/* <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            items.length > 0 &&
                            Object.keys(selectedItems).length ===
                            items.length &&
                            Object.values(selectedItems).every(Boolean)
                          }
                          className="w-4 h-4 scale-150 accent-[#598931] cursor-pointer mr-2"
                        /> */}
                        <div className="relative">
                          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-300" />
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                            // className="w-full pl-8 pr-2 py-[6px] rounded-[13px] bg-[#F2FFE8] "
                            className="ml-1 w-full pl-8 pr-2 py-[6px] rounded-[13px] bg-[#F2FFE8] border border-transparent focus:border-[#598931] focus:outline-none"
                          />
                        </div>
                        {/* <button
                          onClick={handleSave}
                          className="ml-2 bg-[#598931] text-white px-2 py-2 rounded-[50px] flex items-center justify-center"
                          title="Save"
                        >
                          <FiSave size={20} />
                        </button> */}
                        <button
                          onClick={handleSave}
                          className="ml-1  text-[#598931] px-2 py-2 rounded-[50px] flex items-center justify-center"
                          title="Save"
                        >
                          <FiSave size={25} />
                        </button>
                        <button
                          onClick={() => toggleDropdown(field.id)}
                          className="text-gray-500 hover:text-[#598931] ml-2"
                        >
                          <IoClose size={30} />
                        </button>
                      </div>

                      {/* Dropdown List */}
                      <ul className="max-h-60 overflow-y-auto mt-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {items
                          // .filter((item) =>
                          //   item
                          //     .toLowerCase()
                          //     .includes(searchTerm.toLowerCase())
                          // )
                          .map((item, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 accent-[#598931] cursor-pointer"
                                checked={selectedItems[item.key] || false}
                                onChange={() => handleCheckboxChange(item)}
                              />
                              <span>{item?.value}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Field Button */}
              <button
                onClick={addField}
                className="inline-flex px-4 py-2 justify-center items-center gap-[18px] border-[3px] border-[#598931] rounded-[8px] text-[#598931] hover:bg-[#E6F4D7] transition"
              >
                <span className="text-[18px] font-medium font-[Poppins]">
                  +
                </span>
                <span className="text-[18px] font-medium font-[Poppins]">
                  Add Field
                </span>
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DetailedView;
