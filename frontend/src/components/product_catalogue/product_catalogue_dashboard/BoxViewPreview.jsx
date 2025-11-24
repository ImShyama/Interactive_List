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
import CirclePicker from "../../video_gallary/CirclePicker";

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
  const bgColorInputRef = useRef(null);
  const colorRef = useRef(null);

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

  const handleTagHeadingSelect = (heading) => {
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

  //     // Get the actual column content from data
  //     let columnContent = '';

  //     if (data && Array.isArray(data) && data.length > 0) {
  //       // Try multiple column key formats to find the right match
  //       const possibleKeys = [
  //         heading.replace(/\s+/g, '_').toLowerCase(),
  //         heading.replace(/\s+/g, '_'),
  //         heading.toLowerCase(),
  //         heading
  //       ];

  //       // Find the first row that has content for this column
  //       const rowWithContent = data.find(row => {
  //         return possibleKeys.some(key =>
  //           row[key] && row[key].toString().trim() !== ''
  //         );
  //       });

  //       if (rowWithContent) {
  //         // Find the actual key that has content
  //         const actualKey = possibleKeys.find(key =>
  //           rowWithContent[key] && rowWithContent[key].toString().trim() !== ''
  //         );
  //         if (actualKey) {
  //           columnContent = rowWithContent[actualKey];
  //         }
  //       }
  //     }

  //     // If no content found, fallback to heading name
  //     if (!columnContent) {
  //       columnContent = heading;
  //     }

  //     // Create a div element with the actual column content
  //     const divElement = document.createElement('div');
  //     divElement.innerHTML = columnContent;

  //     // Insert the div at the current selection
  //     const range = sel.getRangeAt(0);
  //     range.deleteContents();
  //     range.insertNode(divElement);

  //     // Move cursor to end of inserted content
  //     const newRange = document.createRange();
  //     newRange.setStartAfter(divElement);
  //     newRange.collapse(true);
  //     sel.removeAllRanges();
  //     sel.addRange(newRange);

  //     // Clear selection and close dropdown
  //     sel.removeAllRanges();
  //     setIsTagLinkDropdownOpen(false);
  //   }
  // };

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
    { label: '8px', value: '1' },
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

        {/* Tag Button and Editing Toolbar Box in same row */}
        <div className="mt-3 flex items-center gap-3">
          {/* Tag Button */}
          <div className="relative">
            {/* <button 
              className="p-1 text-gray-600 hover:text-[#598931]" 
              onClick={insertTagLink}
              title="Tag"
            >
              <PiBracketsCurlyBold />
            </button> */}

            <button
              onClick={insertTagLink}
              title="Tag"
              className="p-2 rounded-lg bg-[#598931] text-white transition-all duration-200 
             hover:bg-[#4A7028] active:scale-95 
             shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#598931]/40"
            >
              <PiBracketsCurlyBold className="w-5 h-5" />
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

          {/* Editing Toolbar Box */}
          <div className="border rounded-md p-2 flex flex-wrap gap-5 items-center justify-center flex-grow">
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
                    id="colorpickerinput"
                    type="color"
                    ref={colorRef}
                    style={{
                      visibility: "hidden",
                      position: "absolute",
                    }}
                    onChange={(e) => handleTextColorPick(e.target.value)}
                  />
                  <div
                    style={{
                      position: "relative",
                      zIndex: "10",
                      background: "#fff",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      padding: "10px",
                      minWidth: "250px",
                      maxHeight: "fit-content",
                      overflow: "auto",
                    }}
                  >
                    <CirclePicker
                      colorRef={colorRef}
                      applyColor={(color) => handleTextColorPick(color)}
                      colors={[
                        "#000000",
                        "#434343",
                        "#666666",
                        "#999999",
                        "#b7b7b7",
                        "#cccccc",
                        "#d9d9d9",
                        "#efefef",
                        "#f3f3f3",
                        "#ffffff",
                        "#980000",
                        "#ff0000",
                        "#ff9900",
                        "#ffff00",
                        "#00ff00",
                        "#00ffff",
                        "#4a86e8",
                        "#0000ff",
                        "#9900ff",
                        "#ff00ff",
                        "#e6b8af",
                        "#f4cccc",
                        "#fce5cd",
                        "#fff2cc",
                        "#d9ead3",
                        "#d0e0e3",
                        "#c9daf8",
                        "#cfe2f3",
                        "#d9d2e9",
                        "#ead1dc",
                        "#dd7e6b",
                        "#ea9999",
                        "#f9cb9c",
                        "#ffe599",
                        "#b6d7a8",
                        "#a2c4c9",
                        "#a4c2f4",
                        "#9fc5e8",
                        "#b4a7d6",
                        "#d5a6bd",
                        "#cc4125",
                        "#e06666",
                        "#f6b26b",
                        "#ffd966",
                        "#93c47d",
                        "#76a5af",
                        "#6d9eeb",
                        "#6fa8dc",
                        "#8e7cc3",
                        "#c27ba0",
                        "#a61c00",
                        "#cc0000",
                        "#e69138",
                        "#f1c232",
                        "#6aa84f",
                        "#45818e",
                        "#3c78d8",
                        "#3d85c6",
                        "#674ea7",
                        "#a64d79",
                        "#85200c",
                        "#990000",
                        "#b45f06",
                        "#bf9000",
                        "#38761d",
                        "#134f5c",
                        "#1155cc",
                        "#0b5394",
                        "#351c75",
                        "#741b47",
                        "#5b0f00",
                        "#660000",
                        "#783f04",
                        "#7f6000",
                        "#274e13",
                        "#0c343d",
                        "#1c4587",
                        "#073763",
                        "#20124d",
                        "#4c1130",
                      ]}
                    />
                  </div>
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
                    id="bgcolorpickerinput"
                    type="color"
                    ref={bgColorInputRef}
                    style={{
                      visibility: "hidden",
                      position: "absolute",
                    }}
                    onChange={(e) => handleBackgroundColorPick(e.target.value)}
                  />
                  <div
                    style={{
                      position: "relative",
                      zIndex: "10",
                      background: "#fff",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      padding: "10px",
                      maxWidth: "300px",
                      // maxHeight: "250px",
                      overflow: "auto",
                    }}
                  >
                    <CirclePicker
                      colorRef={bgColorInputRef}
                      applyColor={(color) => handleBackgroundColorPick(color)}
                      colors={[
                        "#000000",
                        "#434343",
                        "#666666",
                        "#999999",
                        "#b7b7b7",
                        "#cccccc",
                        "#d9d9d9",
                        "#efefef",
                        "#f3f3f3",
                        "#ffffff",
                        "#980000",
                        "#ff0000",
                        "#ff9900",
                        "#ffff00",
                        "#00ff00",
                        "#00ffff",
                        "#4a86e8",
                        "#0000ff",
                        "#9900ff",
                        "#ff00ff",
                        "#e6b8af",
                        "#f4cccc",
                        "#fce5cd",
                        "#fff2cc",
                        "#d9ead3",
                        "#d0e0e3",
                        "#c9daf8",
                        "#cfe2f3",
                        "#d9d2e9",
                        "#ead1dc",
                        "#dd7e6b",
                        "#ea9999",
                        "#f9cb9c",
                        "#ffe599",
                        "#b6d7a8",
                        "#a2c4c9",
                        "#a4c2f4",
                        "#9fc5e8",
                        "#b4a7d6",
                        "#d5a6bd",
                        "#cc4125",
                        "#e06666",
                        "#f6b26b",
                        "#ffd966",
                        "#93c47d",
                        "#76a5af",
                        "#6d9eeb",
                        "#6fa8dc",
                        "#8e7cc3",
                        "#c27ba0",
                        "#a61c00",
                        "#cc0000",
                        "#e69138",
                        "#f1c232",
                        "#6aa84f",
                        "#45818e",
                        "#3c78d8",
                        "#3d85c6",
                        "#674ea7",
                        "#a64d79",
                        "#85200c",
                        "#990000",
                        "#b45f06",
                        "#bf9000",
                        "#38761d",
                        "#134f5c",
                        "#1155cc",
                        "#0b5394",
                        "#351c75",
                        "#741b47",
                        "#5b0f00",
                        "#660000",
                        "#783f04",
                        "#7f6000",
                        "#274e13",
                        "#0c343d",
                        "#1c4587",
                        "#073763",
                        "#20124d",
                        "#4c1130",
                      ]}
                    />
                  </div>
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
