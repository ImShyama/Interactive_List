import React, { useRef, useState, useEffect } from "react";
import { PiStarFour } from "react-icons/pi";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
  FaListOl,
  FaLink,
} from "react-icons/fa";
import {
  MdFormatSize,
  MdFormatColorText,
  MdFormatColorFill,
} from "react-icons/md";
import { PiBracketsCurlyBold } from "react-icons/pi";
import { CgFormatJustify } from "react-icons/cg";
import { Modal, Input } from "antd";
import { notifyError } from "../../../utils/notify";

const BoxViewPreview = ({ text, value, onClose, onSave, tableHeader }) => {
  const contentRef = useRef(null);
  const [activeStyles, setActiveStyles] = useState({});
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);
  const [isTagLinkDropdownOpen, setIsTagLinkDropdownOpen] = useState(false);

  const applyStyle = (command) => {
    if (document.getSelection().toString()) {
      document.execCommand(command, false, null);
      setActiveStyles((prev) => ({
        ...prev,
        [command]: !prev[command],
      }));
    }
  };

  const applyListStyle = (command) => {
    const selection = document.getSelection();
    if (!selection.rangeCount) return; // Ensure selection exists
    document.execCommand(command, false, null);
    setActiveStyles((prev) => ({
      ...prev,
      [command]: !prev[command],
    }));
  };

  const toggleFontSize = () => {
    if (document.getSelection().toString()) {
      const isLarge = activeStyles["fontSize"];
      document.execCommand("fontSize", false, isLarge ? "3" : "5");
      setActiveStyles((prev) => ({ ...prev, fontSize: !isLarge }));
    }
  };

  const toggleTextColor = () => {
    if (document.getSelection().toString()) {
      const isColored = activeStyles["foreColor"];
      document.execCommand("foreColor", false, isColored ? "black" : "#598931");
      setActiveStyles((prev) => ({ ...prev, foreColor: !isColored }));
    }
  };

  const toggleBackgroundColor = () => {
    if (document.getSelection().toString()) {
      const isBgColored = activeStyles["hiliteColor"];
      document.execCommand(
        "hiliteColor",
        false,
        isBgColored ? "transparent" : "#E6F4D7"
      );
      setActiveStyles((prev) => ({ ...prev, hiliteColor: !isBgColored }));
    }
  };

  const [savedSelection, setSavedSelection] = useState(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0));
    }
  };

  const handleInsertLink = () => {
    if (savedSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelection);

      document.execCommand("createLink", false, linkURL);

      setIsLinkModalVisible(false);
      setLinkURL("");
    }
  };

  // const insertLink = () => {
    
  //   if (document.getSelection().toString()) {
  //     saveSelection();
     
  //     setIsLinkDropdownOpen(true);
  //   } else {
      
  //     notifyError("Please select text to hyperlink.");
  //   }
  // };


  const insertLink = () => {
    // If dropdown is already open, close it
    if (isLinkDropdownOpen) {
      setIsLinkDropdownOpen(false);
    }
    
    // If dropdown is closed, check for selection and open if text is selected
    if (document.getSelection().toString()) {
      saveSelection();
      setIsLinkDropdownOpen(true);
    } else {
      notifyError("Please select text to hyperlink.");
    }
  };

  // const insertTagLink = () => {
    
  //     saveSelection();
  //     setIsTagLinkDropdownOpen(true);
   
  // };

  const insertTagLink = () => {
    // Toggle dropdown - if open, close it; if closed, open it
    if (isTagLinkDropdownOpen) {
      setIsTagLinkDropdownOpen(false);
    } else {
      saveSelection();
      setIsTagLinkDropdownOpen(true);
    }
  };

  const handleHeadingSelect = (heading) => {
    if (savedSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelection);

      // Create link with heading name as href
      const headingHref = `{${heading}}`;
      document.execCommand("createLink", false, headingHref);

      setIsLinkDropdownOpen(false);
    }
  };

  // const handleTagHeadingSelect = (heading) => {
  //   if (savedSelection) {
  //     const sel = window.getSelection();
  //     sel.removeAllRanges();
  //     sel.addRange(savedSelection);

  //     // Create link with heading name as href
  //     const headingHref = `{${heading}}`;
  //     document.execCommand("createLink", false, headingHref);

  //     setIsLinkDropdownOpen(false);
  //   }
  // };

  const handleTagHeadingSelect = (heading) => {
    if (savedSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelection);
  
      // Create a div element with the heading text
      const divElement = document.createElement('div');
      divElement.textContent = `{${heading}}`;
      
      // Insert the div at the current selection
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(divElement);
      
      // Clear selection and close dropdown
      sel.removeAllRanges();
      setIsLinkDropdownOpen(false);
    }
  };

  const handleCustomLink = () => {
    setIsLinkDropdownOpen(false);
    setIsLinkModalVisible(true);
  };

  // Create headings list from tableHeader
  const headings = tableHeader ? tableHeader.map((header, index) => ({
    key: index,
    value: header.replace(/_/g, " ")
  })) : [];

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown
      const dropdown = document.querySelector('.link-dropdown');
      if (isLinkDropdownOpen && dropdown && !dropdown.contains(event.target)) {
        setIsLinkDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLinkDropdownOpen]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative h-[500px] flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Info List */}
        <ul className="absolute top-3 right-12 list-disc list-inside text-[#598931] font-medium">
          <li>HTML tags can be added</li>
        </ul>

        {/* Formatting Buttons */}
        <div className="absolute top-8 right-4 flex gap-3 mt-2">
          <button
            className={`p-1 ${activeStyles["bold"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={() => applyStyle("bold")}
            title="Bold"
          >
            <FaBold />    
          </button>
          <button
            className={`p-1 ${activeStyles["italic"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={() => applyStyle("italic")}
            title="Italic"
          >
            <FaItalic />
          </button>
          <button
            className={`p-1 ${activeStyles["underline"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={() => applyStyle("underline")}
            title="Underline"
          >
            <FaUnderline />
          </button>
          <button
            className={`p-1 ${activeStyles["justifyLeft"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={() => applyStyle("justifyLeft")}
            title="Align Left"
          >
            <FaAlignLeft />
          </button>
          <button
            className={`p-1 ${activeStyles["justifyCenter"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={() => applyStyle("justifyCenter")}
            title="Align Center"
          >
            <FaAlignCenter />
          </button>
          <button
            className={`p-1 ${activeStyles["justifyRight"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={() => applyStyle("justifyRight")}
            title="Align Right"
          >
            <FaAlignRight />
          </button>
          <button
            className={`p-1 ${activeStyles["justifyFull"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={() => applyStyle("justifyFull")}
            title="Align Full"
          >
            <CgFormatJustify />
          </button>
          <button
            className={`p-1 ${activeStyles["insertUnorderedList"] ? "text-[#598931]" : "text-gray-600"}`}
            onClick={() => applyListStyle("insertUnorderedList")}
            title="Unordered List"
          >
            <FaListUl />
          </button>
          <button
            className={`p-1 ${activeStyles["insertOrderedList"] ? "text-[#598931]" : "text-gray-600"}`}
            onClick={() => applyListStyle("insertOrderedList")}
            title="Ordered List"
          >
            <FaListOl />
          </button>

          <button
            className={`p-1 ${activeStyles["fontSize"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={toggleFontSize}
            title="Font Size"
          >
            <MdFormatSize />
          </button>
          <button
            className={`p-1 ${activeStyles["foreColor"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={toggleTextColor}
            title="Text Color"
          >
            <MdFormatColorText />
          </button>
          <button
            className={`p-1 ${activeStyles["hiliteColor"] ? "text-[#598931]" : "text-gray-600"
              }`}
            onClick={toggleBackgroundColor}
            title="Background Color"
          >
            <MdFormatColorFill />
          </button>

          {/* Link Button with Dropdown */}
          <div className="relative">
            <button 
              className="p-1 text-gray-600 hover:text-[#598931]" 
              onClick={insertLink}
              title="Link"
            >
              <FaLink />
            </button>
            
            {/* Link Dropdown */}
            {isLinkDropdownOpen && (
              <div className="link-dropdown absolute top-8 left-0 bg-white shadow-lg rounded-lg w-64 p-3 border overflow-hidden z-50">
                <div className="flex items-center justify-between p-2 mt-[-10px] border-b">
                  <span className="text-sm font-medium text-gray-700">Select Heading</span>
                  <button
                    onClick={() => setIsLinkDropdownOpen(false)}
                    className="text-gray-500 hover:text-[#598931]"
                  >
                    ✖
                  </button>
                </div>
                
                <ul className="max-h-60 overflow-y-auto mt-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {/* Custom Link Option */}
                  <li
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer border-b border-gray-200"
                    onClick={handleCustomLink}
                  >
                    <span className="text-[#598931] font-medium">🔗 Custom Link</span>
                  </li>
                  
                  {/* Headings */}
                  {headings.map((heading, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => handleHeadingSelect(heading.value)}
                    >
                      <span>{heading.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tag Button with Dropdown */}
          <div className="relative">
            <button 
              className="p-1 text-gray-600 hover:text-[#598931]" 
              onClick={insertTagLink}
              title="Tag"
            >
              <PiBracketsCurlyBold />
            </button>
            
            {/* Link Dropdown */}
            {isTagLinkDropdownOpen && (
              <div className="link-dropdown absolute top-8 left-0 bg-white shadow-lg rounded-lg w-64 p-3 border overflow-hidden z-50">
                <div className="flex items-center justify-between p-2 mt-[-10px] border-b">
                  <span className="text-sm font-medium text-gray-700">Select Heading</span>
                  <button
                    onClick={() => setIsTagLinkDropdownOpen(false)}
                    className="text-gray-500 hover:text-[#598931]"
                  >
                    ✖
                  </button>
                </div>
                
                <ul className="max-h-60 overflow-y-auto mt-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {/* Custom Link Option */}
                  {/* <li
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer border-b border-gray-200"
                    onClick={handleCustomLink}
                  >
                    <span className="text-[#598931] font-medium">🔗 Custom Link</span>
                  </li> */}
                  
                  {/* Headings */}
                  {headings.map((heading, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => handleTagHeadingSelect(heading.value)}
                    >
                      <span>{heading.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* PiStar + Text Button */}
        <div className="flex justify-start mt-2">
          <button className="px-4 py-2 flex items-center gap-2 bg-[#E6F4D7] text-[#598931] border border-gray-300 rounded-[8px]">
            <span className="text-[#598931] text-xl">
              <PiStarFour />
            </span>
            {text}
          </button>
        </div>

        {/* Main content + Save Button wrapper */}
        <div className="flex flex-col flex-grow overflow-hidden mt-4">
          {/* Scrollable Content */}
          <div
            ref={contentRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            className="text-gray-800 overflow-y-auto flex-grow outline-none border-none focus:ring-0 focus:outline-none pr-2 editable-content"
            onClick={(e) => {
              if (e.target.tagName === "A") {
                e.preventDefault();
                window.open(e.target.href, "_blank");
              }
            }}
            dangerouslySetInnerHTML={{ __html: value }}
          >
          </div>

          {/* Link Modal */}
          <Modal
            title="Insert Custom Link"
            open={isLinkModalVisible}
            onOk={handleInsertLink}
            onCancel={() => setIsLinkModalVisible(false)}
            okText="Insert"
            cancelText="Cancel"
          >
            <Input
              placeholder="Enter URL"
              value={linkURL}
              onChange={(e) => setLinkURL(e.target.value)}
            />
          </Modal>

          {/* Save Button */}
          <div className="pt-3 pr-4 flex justify-end">
            <button
              className="px-4 py-2 bg-[#598931] text-white rounded-md shadow-md hover:bg-[#4A7326] transition-colors"
              onClick={() => {
                const content = contentRef.current.innerHTML;
                if (typeof onSave === "function") {
                  onSave(content);
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxViewPreview;
