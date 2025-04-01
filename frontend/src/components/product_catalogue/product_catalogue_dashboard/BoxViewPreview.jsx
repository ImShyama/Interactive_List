import React, { useRef, useState } from "react";
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
import { CgFormatJustify } from "react-icons/cg";
import { Modal, Input } from "antd";

const BoxViewPreview = ({ text, value, onClose }) => {
  const contentRef = useRef(null);
  const [activeStyles, setActiveStyles] = useState({});
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkURL, setLinkURL] = useState("");

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
  

  const insertLink = () => {
    if (document.getSelection().toString()) {
      saveSelection();
      setIsLinkModalVisible(true);
    } else {
      alert("Please select text to hyperlink.");
    }
  };
  
  
  
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
        <div className="absolute top-8 right-12 flex gap-3 mt-2">
          <button
            className={`p-1 ${
              activeStyles["bold"] ? "text-black" : "text-gray-600"
            }`}
            onClick={() => applyStyle("bold")}
          >
            <FaBold />
          </button>
          <button
            className={`p-1 ${
              activeStyles["italic"] ? "text-black" : "text-gray-600"
            }`}
            onClick={() => applyStyle("italic")}
          >
            <FaItalic />
          </button>
          <button
            className={`p-1 ${
              activeStyles["underline"] ? "text-black" : "text-gray-600"
            }`}
            onClick={() => applyStyle("underline")}
          >
            <FaUnderline />
          </button>
          <button
            className={`p-1 ${
              activeStyles["justifyLeft"] ? "text-black" : "text-gray-600"
            }`}
            onClick={() => applyStyle("justifyLeft")}
          >
            <FaAlignLeft />
          </button>
          <button
            className={`p-1 ${
              activeStyles["justifyCenter"] ? "text-black" : "text-gray-600"
            }`}
            onClick={() => applyStyle("justifyCenter")}
          >
            <FaAlignCenter />
          </button>
          <button
            className={`p-1 ${
              activeStyles["justifyRight"] ? "text-black" : "text-gray-600"
            }`}
            onClick={() => applyStyle("justifyRight")}
          >
            <FaAlignRight />
          </button>
          <button
            className={`p-1 ${
              activeStyles["justifyFull"] ? "text-black" : "text-gray-600"
            }`}
            onClick={() => applyStyle("justifyFull")}
          >
            <CgFormatJustify />
          </button>
          {/* <button
            className={`p-1 ${
              activeStyles["insertUnorderedList"]
                ? "text-black"
                : "text-gray-600"
            }`}
            onClick={() => applyStyle("insertUnorderedList")}
          >
            <FaListUl />
          </button>
          <button
            className={`p-1 ${
              activeStyles["insertOrderedList"] ? "text-black" : "text-gray-600"
            }`}
            onClick={() => applyStyle("insertOrderedList")}
          >
            <FaListOl />
          </button> */}
          <button
  className={`p-1 ${activeStyles["insertUnorderedList"] ? "text-black" : "text-gray-600"}`}
  onClick={() => applyListStyle("insertUnorderedList")}
>
  <FaListUl />
</button>
<button
  className={`p-1 ${activeStyles["insertOrderedList"] ? "text-black" : "text-gray-600"}`}
  onClick={() => applyListStyle("insertOrderedList")}
>
  <FaListOl />
</button>
          
          <button
            className={`p-1 ${
              activeStyles["fontSize"] ? "text-black" : "text-gray-600"
            }`}
            onClick={toggleFontSize}
          >
            <MdFormatSize />
          </button>
          <button
            className={`p-1 ${
              activeStyles["foreColor"] ? "text-black" : "text-gray-600"
            }`}
            onClick={toggleTextColor}
          >
            <MdFormatColorText />
          </button>
          <button
            className={`p-1 ${
              activeStyles["hiliteColor"] ? "text-black" : "text-gray-600"
            }`}
            onClick={toggleBackgroundColor}
          >
            <MdFormatColorFill />
          </button>

          <button className="p-1 text-gray-600" onClick={() => insertLink()}>
            <FaLink />
          </button>
        </div>

        {/* Button with text */}
        {/* <button className="px-4 py-2 flex items-center gap-2 bg-[#E6F4D7] text-[#598931] border border-gray-300 rounded-[8px] mt-2">
          <span className="text-[#598931] text-xl">
            <PiStarFour />
          </span>
          {text}
        </button> */}
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
          <Modal
            title="Insert Link"
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
                console.log("Saved Content: ", content);
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
