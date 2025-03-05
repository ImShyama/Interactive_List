import { MdAdminPanelSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AdminBtn = () => {
    const navigate = useNavigate();
    const handleAdminClick = () => {
        if(window.location.pathname !== "/admin") {
            navigate("/admin");
        }else{
            navigate(-1);
        }
    }
    return (
        <div className="adminBtn">
            <button className="flex justify-center items-center w-[50px] h-[50px] bg-[#598931] border-none rounded-full cursor-pointer"
             onClick={handleAdminClick}
            >
                <MdAdminPanelSettings color="#fff" className="text-white w-[24px] h-[24px]" />
            </button>
        </div>
    )
}

export default AdminBtn;