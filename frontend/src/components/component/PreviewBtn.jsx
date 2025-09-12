import { LuFilter } from "react-icons/lu";
import { MdDelete, MdOutlineDriveFolderUpload, MdRefresh } from "react-icons/md";
import { BiSolidHide } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { notifyError } from "../../utils/notify";
import { FiEye } from "react-icons/fi";

const PreviewBtn = () => {
    const handleAlert = (e) => {
        e.preventDefault();
        notifyError("Not available in preview!");
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Filter" >
                <LuFilter className="text-white" size={18} />
            </button>
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Search">
                <IoSearchOutline color="white" size={18} />
            </button>
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Search">
                <MdRefresh color="white" size={18} />
            </button>
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Add Row">
                <IoMdAdd color="white" size={18} />
            </button>
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Import Data">
                <MdOutlineDriveFolderUpload color="white" size={18} />
            </button>
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Delete">
                <MdDelete color="white" size={18} />
            </button>
            {/* <button onClick={() => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Preview">
                <FiEye color="white" size={18} />
            </button> */}
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Hide Columns">
                <BiSolidHide color="white" size={18} />
            </button>
        </div>
    )
}

export default PreviewBtn;