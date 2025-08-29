import React, { useState, useRef, useEffect, useContext } from "react";
import BoxViewPreview from "./BoxViewPreview.jsx";
import { SixDots } from "../../../assets/svgIcons.jsx";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { PiStarFour } from "react-icons/pi";
import { FiSave } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { handleSaveChanges } from "../../../APIs/index.jsx";
import { UserContext } from "../../../context/UserContext.jsx";

const BoxView = ({ settings }) => {
  const [fields, setFields] = useState(settings?.showInBox || []); // Stores saved fields
  const [inputValue, setInputValue] = useState(""); // Temporary input value
  const [isInputVisible, setIsInputVisible] = useState(false); // Controls input visibility
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModel, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useContext(UserContext);
  const [savedSelections, setSavedSelections] = useState(settings?.showInProfile || []);
  const [selectedItems, setSelectedItems] = useState(() => {
    return settings?.showInProfile?.reduce((acc, item) => {
      acc[item.key] = true; // Default selection to `true`, change if needed
      return acc;
    }, {}) || {}; // Ensures it's always an object
  });
  const addField = () => {
    setIsInputVisible(true);
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter" && inputValue.trim() !== "") {
  //     setFields([...fields, { id: Date.now().toString(), text: inputValue }]); // Add id for drag
  //     setInputValue("");
  //     setIsInputVisible(false);
  //   }
  // };

  const handleDelete = (item) => {

    const newFileds = fields.filter((field) => field.id !== item.id)
    
      setFields(newFileds); // ✅ Update state correctly
      setInputValue("");
      setIsInputVisible(false);
  
      const showInBox = { showInBox: newFileds };
  
      // Log the updated state after a delay
      setTimeout(() => {
        console.log("Updated Saved Selections:", newFileds);
        handleSaveChanges(settings, token, dispatch, showInBox);
      }, 0);
  };

  const handleEdit = (item) => {
    console.log({item})
    setEditingItem(item.id); // Store ID instead of text
    setEditText(item.text);

    const updatedFields = fields.map((field) => 
      field.id === item.id 
        ? { ...field, text: item.text, value: item.value }
        : field
    );
    setFields(updatedFields)
    setIsInputVisible(false);
  
    const showInBox = { showInBox: updatedFields };

    // Log the updated state after a delay
    setTimeout(() => {
      console.log("Updated Saved Selections:", updatedFields);
      handleSaveChanges(settings, token, dispatch, showInBox);
    }, 0);

  };

  const handleEditSave = (e) => {
    if (
      e.type === "blur" ||
      (e.type === "keydown" && e.key === "Enter") ||
      e.type === "save-click"
    ) {
      
      const updateText = fields.map((field) =>
          field.id === editingItem ? { ...field, text: editText } : field
        )

        setFields(updateText);

      
      setEditingItem(null);

      
  
      const showInBox = { showInBox: updateText };
  
      // Log the updated state after a delay
      setTimeout(() => {
        console.log("Updated Saved Selections:", showInBox);
        handleSaveChanges(settings, token, dispatch, showInBox);
      }, 0);
    }
  };

  // const handleAddSave = () => {
  //   let BoxValue = fields;
  //   if (inputValue.trim() !== "") {
  //     BoxValue.push({ id: Date.now().toString(), text: inputValue });
  //     setFields(BoxValue);
  //     setInputValue("");
  //     setIsInputVisible(false);
  //   }
  //   const showInBox = { showInBox: BoxValue }
  //   // Log the updated state after a delay
  //   setTimeout(() => {
  //     console.log("Updated Saved Selections:", BoxValue);
  //     handleSaveChanges(settings, token, dispatch, showInBox)
  //   }, 0);
  // };

  const handleAddSave = () => {
    if (inputValue.trim() !== "") {
      let newBoxValue = [...fields, { id: Date.now().toString(), text: inputValue, value: `<h2 className="text-lg font-bold mb-2">Features</h2>` }];
  
      setFields(newBoxValue); // ✅ Update state correctly
      setInputValue("");
      setIsInputVisible(false);
  
      const showInBox = { showInBox: newBoxValue };
  
      // Log the updated state after a delay
      setTimeout(() => {
        console.log("Updated Saved Selections:", newBoxValue);
        handleSaveChanges(settings, token, dispatch, showInBox);
      }, 0);
    }
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(fields);
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);
    setFields(reorderedFields);

    const showInBox = { showInBox: reorderedFields };
    handleSaveChanges(settings, token, dispatch, showInBox)
  };

  // const handleDragEnd = (result) => {
  //   if (!result.destination) return;

  //   const items = Array.from(savedSelections);
  //   const [reorderedItem] = items.splice(result.source.index, 1);
  //   items.splice(result.destination.index, 0, reorderedItem);

  //   setSavedSelections(items);
  //   const showIncard = { showInCard: items };
  //   handleSaveChanges(settings, token, dispatch, showIncard)
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsInputVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 border-t">
      <div className="text-black font-[Poppins] text-[35px] font-medium leading-normal mb-4">
        Box View :
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="boxview" direction="horizontal">
          {(provided) => (
            <div
              className="flex items-center gap-4 flex-wrap"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative flex items-center bg-[#F2F2F2] border border-gray-300 rounded-[8px] text-black font-medium transition-all duration-200 hover:mr-10 hover:ml-10 hover:shadow-lg group ${snapshot.isDragging ? "shadow-xl" : ""
                        }`}
                    >
                      {/* Drag Icon - Left */}
                      <div className="absolute left-[-25px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move">
                        <SixDots className="text-[#598931]" />
                      </div>

                      {/* Icon + Text */}
                      {editingItem === field.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          // onBlur={handleEditSave}
                          onKeyDown={handleEditSave}
                          className="px-2 py-1 rounded border border-gray-300 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <button
                          className="px-4 py-2 flex items-center gap-2 bg-transparent transition-all duration-200 hover:bg-[#E6F4D7] hover:text-[#598931] rounded-[8px]"
                          onClick={() => {setSelectedItem(field); setShowModal(true);}}
                        >
                          <span className="transition-colors duration-200 text-[#9B9B9B] group-hover:text-[#598931] text-xl">
                            <PiStarFour />
                          </span>
                          {field.text}
                        </button>
                      )}

                      {/* Edit & Delete Icons */}
                      <div className="absolute right-[-50px] flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {editingItem === field.id ? (
                          <FiSave
                            className="text-xl text-[#598931] cursor-pointer"
                            onClick={() =>
                              handleEditSave({ type: "save-click" })
                            }
                          />
                        ) : (
                          <CiEdit
                            className="text-xl text-[#598931] cursor-pointer"
                            onClick={() => handleEdit(field)}
                          />
                        )}
                        <RiDeleteBinLine
                          className="text-xl text-[#598931] cursor-pointer"
                          onClick={() => handleDelete(field)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}


              {isInputVisible && (
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddSave();
                      }
                    }}
                    placeholder="Enter Text"
                    className=" border-[#598931] rounded-[8px] px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#598931]"
                    autoFocus
                  />
                  <button
                    onMouseDown={handleAddSave}
                    className="text-[#598931] p-2 rounded hover:bg-[#E6F4D7] transition"
                    title="Save"
                  >
                    <FiSave size={22} />
                  </button>
                </div>
              )}

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

      {showModel && (
        <BoxViewPreview
          text={selectedItem.text}
          value={selectedItem.value}
          onClose={() => setShowModal(false)}
          onSave={(newHtml) => {
            const updated = fields.map((f) =>
              f.id === selectedItem.id ? { ...f, value: newHtml } : f
            );
            setFields(updated);
            const showInBox = { showInBox: updated };
            handleSaveChanges(settings, token, dispatch, showInBox);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default BoxView;
