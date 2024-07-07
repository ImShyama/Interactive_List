import AppCard from "./AppCard";

const Dashboard = () => {
    return (
        <div>
        <div className="flex justify-between px-[50px] py-[25px]">
            <div>
                <button className="bg-[#FFA500] rounded-[8px] p-[10px] text-white text-[14px]">+ Create app from zero</button>
            </div>
            <div>
                <button className="bg-[#FFA500] rounded-[8px] p-[10px] text-white text-[14px]">More apps</button>
            </div>
        </div>
        <div className="flex flex-wrap justify-center">
        <AppCard />
        <AppCard />
        <AppCard />
        <AppCard />
        </div>
        </div>
    )
}

export default Dashboard;