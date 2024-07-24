import React, { useState, useContext  } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logoutIcon from "../assets/logoutIcon.svg"
import { UserContext } from "../context/UserContext";

const Profile = ({ name, email, closeProfile }) => {
  const { setToken, setProfile } = useContext(UserContext);
  const Navigate = useNavigate();

  const handleLogout = () => {
    console.log("logout clicked")
    // Clear cookies
    Cookies.remove("token");
    Cookies.remove("profile");

    // Clear user context
    setToken(null);
    setProfile(null);
    closeProfile();

    // Redirect to login page
    Navigate("/");
  };

  
    return (
      <>
      <div className="rounded-[11px] bg-[var(--white,#FFF)] shadow-[9px_4px_17px_0px_rgba(152,151,168,0.25)] flex w-[200px] px-[18px] flex-col justify-center items-start gap-[1px] flex-shrink-0">
        <span className="text-[var(--black,#111)] font-poppins text-[14px] font-medium leading-normal pt-4">
          {name}
        </span>
        <span className="text-[#787D89] font-poppins text-[12px] font-normal leading-normal pb-2">
          {email}
        </span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="160"
            height="2"
            viewBox="0 0 472 2"
            fill="none"
          >
            <path d="M0 1.21265H621" stroke="#EDEEF3" />
          </svg>
        <span className="text-[var(--black,#111)] font-poppins text-[14px] font-medium leading-normal py-2 cursor-pointer" onClick={(e)=>{
          e.stopPropagation()
          Navigate("/dashboard");
          closeProfile();
        }}>Dashboard</span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="160"
            height="2"
            viewBox="0 0 472 2"
            fill="none"
          >
            <path d="M0 1.21265H621" stroke="#EDEEF3" />
          </svg>
          <div className="flex justify-start gap-[10px] pt-2 pb-4 cursor-pointer" onClick={()=>{handleLogout()}}
            >
            <span className="text-[var(--black,#111)] font-poppins text-[14px] font-medium leading-normal ">Logout </span> <img className="icon" src={logoutIcon} />
          </div>
        
      </div>
      
      </>
    );
  };

  export default Profile;