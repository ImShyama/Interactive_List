import React from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import HeaderSection from "../product_catalogue_preview/HeaderSection";

const HeaderPopup = ({ isOpen, onClose, settings }) => {
  if (!isOpen) return null;
  console.log({ settings });

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="w-[100%] flex flex-col items-center justify-center">
        <div className="w-[100%] flex justify-end pr-[8%]">
          <button
            className="bg-gray-200 p-2 rounded-full z-[10000]"
            onClick={onClose}
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <div className="bg-white w-[80%]  max-h-[90vh] p-4 shadow-lg rounded-lg relative z-[10000] flex flex-col overflow-auto">
          {/* Render HeaderSection */}
          <div className="flex-1 overflow-auto">
            <HeaderSection isPopup={true} settings={settings} />
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default HeaderPopup;