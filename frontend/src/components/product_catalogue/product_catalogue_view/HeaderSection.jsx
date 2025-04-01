import { Search, Filter, RefreshCcw } from "lucide-react";

const HeaderSection = () => {
  return (
    <div className="flex justify-between items-center mx-8">
      {/* Left Icons */}
      <div className="flex gap-4">
        <button className="p-2 rounded-lg bg-[#F6FCF1] hover:bg-[#F6FCF1]">
          <Search className="text-[#598931]" size={20} />
        </button>
        <button className="p-2 rounded-lg bg-[#F6FCF1] hover:bg-[#F6FCF1]">
          <Filter className="text-[#598931]" size={20} />
        </button>
        <button className="p-2 rounded-lg bg-[#F6FCF1] hover:bg-[#F6FCF1]">
          <RefreshCcw className="text-[#598931]" size={20} />
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;
