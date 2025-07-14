import React from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import FooterSection from "../product_catalogue_view/FooterSection";

const FooterPopup = ({ isOpen, onClose, settings }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white w-[80%]  max-h-[90vh] p-4 shadow-lg rounded-lg relative z-[10000] flex flex-col overflow-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full"
          onClick={onClose}
        >
          <IoClose className="text-xl" />
        </button>

        {/* Render FooterSection */}
        <div className="flex-1 overflow-auto">
          <FooterSection settingData={settings} />
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default FooterPopup;
