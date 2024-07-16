import AppCard from "./AppCard";
import DashboardTable from "./DashboardTable";

const Dashboard = () => {
  return (
    <div>
      <div className="flex justify-between px-[50px] py-[5px]">
        <div>
          <button className="bg-[#FFA500] rounded-[8px] p-[10px] text-white text-[14px]">
            + Create app from zero
          </button>
        </div>
        <div>
          <button className="bg-[#FFA500] rounded-[8px] p-[10px] text-white text-[14px]">
            More apps
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <AppCard />
      </div>
      <DashboardTable />
    </div>
  );
};

export default Dashboard;
