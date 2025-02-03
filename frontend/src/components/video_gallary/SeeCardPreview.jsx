import React from "react";
import { Cancel } from "../../assets/svgIcons";
import { RxCross2 } from "react-icons/rx";
import VideoCard from "./VideoCard";

const SeeCardPreview = ({ onClose, settings, rowData }) => {
    return (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-0 z-[10] flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative ">
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="right-1 top-1 text-2xl text-gray-600 hover:text-gray-800"
                    >
                        <RxCross2 width={"30px"} height={"30px"} color={"#000000"} />
                    </button>
                </div>
                <div className="truncate">
                    <VideoCard rowData={rowData} settings={settings} />
                </div>
            </div>
        </div>
    );
};

export default SeeCardPreview;