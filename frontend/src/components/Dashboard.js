import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import AppCard from "./AppCard";
import DashboardTable from "./DashboardTable";
import updownIcon from "../assets/updownIcon.svg";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <div className="flex justify-between px-[50px] py-[5px]">
        <div>
          <button className="bg-[#FFA500] rounded-[8px] p-[10px] text-white text-[14px]">
          <span className="text-[var(--white,#FFF)] font-poppins text-[14px] font-normal leading-normal">+ Create app from zero</span>
          </button>
        </div>
        <div>
          <button className="flex gap-[10px] justify-center items-center flex-shrink-0 text-center bg-[#FFA500] rounded-[8px] p-[10px] text-white text-[14px]">
          <span className="text-[var(--white,#FFF)] font-poppins text-[14px] font-medium leading-normal">More apps</span> <img src={updownIcon} className="w-[8px] h-[13px] flex-shrink-0" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <AppCard />
        <AppCard />
        <AppCard />
        <AppCard />
      </div>
      <DashboardTable />
    </div>
  );
};

export default Dashboard;
