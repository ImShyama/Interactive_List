import React, { useRef, useState, useEffect } from "react";
import { PiStarFour } from "react-icons/pi";
import { AiOutlineInfoCircle } from "react-icons/ai";
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

const BoxViewPreview = ({ text, value, onClose, onSave, tableHeader, data }) => {
  const contentRef = useRef(null);
  const [activeStyles, setActiveStyles] = useState({});
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);
  const [isTagLinkDropdownOpen, setIsTagLinkDropdownOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isBgColorPickerOpen, setIsBgColorPickerOpen] = useState(false);
  const colorInputRef = useRef(null);
  const bgColorInputRef = useRef(null);

   // ✅ Auto focus on editor when component mounts
  //  useEffect(() => {
  //   if (contentRef.current) {
  //     contentRef.current.focus();
  //   }
  // }, []);

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      el.focus();
  
      // Move cursor to end of content
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false); // false => cursor at end
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, []);
  

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
  
      // Get the actual column content from data
      let columnContent = '';
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Try multiple column key formats to find the right match
        const possibleKeys = [
          heading.replace(/\s+/g, '_').toLowerCase(),
          heading.replace(/\s+/g, '_'),
          heading.toLowerCase(),
          heading
        ];
        
        // Find the first row that has content for this column
        const rowWithContent = data.find(row => {
          return possibleKeys.some(key => 
            row[key] && row[key].toString().trim() !== ''
          );
        });
        
        if (rowWithContent) {
          // Find the actual key that has content
          const actualKey = possibleKeys.find(key => 
            rowWithContent[key] && rowWithContent[key].toString().trim() !== ''
          );
          if (actualKey) {
            columnContent = rowWithContent[actualKey];
          }
        }
      }
      
      // If no content found, fallback to heading name
      if (!columnContent) {
        columnContent = heading;
      }
      
      // Create a div element with the actual column content
      const divElement = document.createElement('div');
      divElement.innerHTML = columnContent;
      
      // Insert the div at the current selection
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(divElement);
      
      // Move cursor to end of inserted content
      const newRange = document.createRange();
      newRange.setStartAfter(divElement);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      
      // Clear selection and close dropdown
      sel.removeAllRanges();
      setIsTagLinkDropdownOpen(false);
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
      const tagDropdown = document.querySelector('.tag-link-dropdown');
      if (isTagLinkDropdownOpen && tagDropdown && !tagDropdown.contains(event.target)) {
        setIsTagLinkDropdownOpen(false);
      }
      const fontDropdown = document.querySelector('.font-dropdown');
      if (isFontDropdownOpen && fontDropdown && !fontDropdown.contains(event.target)) {
        setIsFontDropdownOpen(false);
      }
      const colorDropdown = document.querySelector('.color-dropdown');
      if (isColorPickerOpen && colorDropdown && !colorDropdown.contains(event.target)) {
        setIsColorPickerOpen(false);
      }
      const bgColorDropdown = document.querySelector('.bg-color-dropdown');
      if (isBgColorPickerOpen && bgColorDropdown && !bgColorDropdown.contains(event.target)) {
        setIsBgColorPickerOpen(false);
      }
      const infoDropdown = document.querySelector('.info-popover');
      if (isInfoOpen && infoDropdown && !infoDropdown.contains(event.target)) {
        setIsInfoOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLinkDropdownOpen, isTagLinkDropdownOpen, isFontDropdownOpen, isColorPickerOpen, isBgColorPickerOpen, isInfoOpen]);

  // Font size map: display label -> execCommand size value (1-7)
  const FONT_SIZES = [
    {label: '8px', value: '1' },
    { label: '12px', value: '2' },
    { label: '14px', value: '3' },
    { label: '16px', value: '4' },
    { label: '18px', value: '5' },
    { label: '24px', value: '6' },
    { label: '32px', value: '7' }
  ];

  const openFontDropdown = () => {
    if (document.getSelection()) {
      saveSelection();
    }
    setIsFontDropdownOpen((prev) => !prev);
    setIsColorPickerOpen(false);
  };

  const handleFontSizeSelect = (sizeValue) => {
    if (savedSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelection);
    }
    document.execCommand("fontSize", false, sizeValue);
    setIsFontDropdownOpen(false);
  };

  const openColorPicker = () => {
    if (document.getSelection()) {
      saveSelection();
    }
    setIsColorPickerOpen((prev) => !prev);
    setIsFontDropdownOpen(false);
    setIsBgColorPickerOpen(false);
  };

  const handleTextColorPick = (color) => {
    if (savedSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelection);
    }
    document.execCommand("foreColor", false, color);
    setIsColorPickerOpen(false);
  };

  const openBgColorPicker = () => {
    if (document.getSelection()) {
      saveSelection();
    }
    setIsBgColorPickerOpen((prev) => !prev);
    setIsFontDropdownOpen(false);
    setIsColorPickerOpen(false);
  };

  const handleBackgroundColorPick = (color) => {
    if (savedSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelection);
    }
    document.execCommand("hiliteColor", false, color);
    setIsBgColorPickerOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-8 z-[9999]" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative h-[500px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Header Row: PiStar + Text and Info */}
        <div className="flex items-center justify-start mt-[-15px]">
          {/* PiStar + Text Button */}
          <div className="flex justify-center">
            <button className="px-4 py-2 flex items-center gap-2 bg-[#E6F4D7] text-[#598931] border border-gray-300 rounded-[8px]">
              <span className="text-[#598931] text-xl">
                <PiStarFour />
              </span>
              {text}
            </button>
          </div>

          {/* Info */}
          {/* <div className="relative justify-end">
            <button
              className="text-[#598931] hover:text-[#476e27] text-xl"
              title="Info"
              onClick={() => setIsInfoOpen((prev) => !prev)}
            >
              <AiOutlineInfoCircle />
            </button>
            {isInfoOpen && (
              <div className="info-popover absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg p-3 text-sm text-gray-700 z-50">
                You can add HTML tags in the editor below. Use toolbar to style text, insert links, and add tags.
              </div>
            )}
          </div> */}
        </div>

        {/* Editing Toolbar Box */}
        <div className="mt-3 border rounded-md p-2 flex flex-wrap gap-5 items-center justify-center">
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

          {/* Font Size with Dropdown */}
          <div className="relative">
            <button
              className={`p-1 ${isFontDropdownOpen ? "text-[#598931]" : "text-gray-600"}`}
              onClick={openFontDropdown}
              title="Font Size"
            >
              <MdFormatSize />
            </button>
            {isFontDropdownOpen && (
              <div className="font-dropdown absolute top-8 left-0 bg-white shadow-lg rounded-lg w-28 p-2 border overflow-hidden z-50">
                <ul className="max-h-60 overflow-y-auto">
                  {FONT_SIZES.map((s) => (
                    <li
                      key={s.value}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleFontSizeSelect(s.value)}
                    >
                      {s.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Text Color with Color Picker */}
          <div className="relative">
            <button
              className={`p-1 ${isColorPickerOpen ? "text-[#598931]" : "text-gray-600"}`}
              onClick={openColorPicker}
              title="Text Color"
            >
              <MdFormatColorText />
            </button>
            {isColorPickerOpen && (
              <div className="color-dropdown absolute top-8 left-0 bg-white shadow-lg rounded-lg p-2 border z-50">
                <input
                  ref={colorInputRef}
                  type="color"
                  className="w-8 h-8 cursor-pointer"
                  onChange={(e) => handleTextColorPick(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className={`p-1 ${isBgColorPickerOpen ? "text-[#598931]" : "text-gray-600"}`}
              onClick={openBgColorPicker}
              title="Background Color"
            >
              <MdFormatColorFill />
            </button>
            {isBgColorPickerOpen && (
              <div className="bg-color-dropdown absolute top-8 left-0 bg-white shadow-lg rounded-lg p-2 border z-50">
                <input
                  ref={bgColorInputRef}
                  type="color"
                  className="w-8 h-8 cursor-pointer"
                  onChange={(e) => handleBackgroundColorPick(e.target.value)}
                />
              </div>
            )}
          </div>

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
            
            {/* Tag Dropdown */}
            {isTagLinkDropdownOpen && (
              <div className="tag-link-dropdown absolute top-8 left-0 bg-white shadow-lg rounded-lg w-64 p-3 border overflow-hidden z-50">
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
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
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

        {/* Main content + Save Button wrapper */}
        <div className="flex flex-col flex-grow overflow-hidden mt-4">
          {/* Scrollable Content Box */}
          <div className="border rounded-md p-3 flex-grow overflow-hidden">
            <div
              ref={contentRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              className="text-gray-800 overflow-y-auto h-full outline-none border-none focus:ring-0 focus:outline-none pr-2 editable-content"
              onClick={(e) => {
                if (e.target.tagName === "A") {
                  e.preventDefault();
                  window.open(e.target.href, "_blank");
                }
              }}
              dangerouslySetInnerHTML={{ __html: value }}
            >
            </div>
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
