import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const ProductCatalogueCard = ({
  title,
  subtitle,
  description,
  multipleimages = [],
  sheetlink,
  videolink,
  features,
}) => {
  const navigate = useNavigate(); // Initialize navigation function

  const handleClick = () => {
    navigate("/productCatalogueBiggerView", {
      state: { title, subtitle, description, multipleimages, sheetlink, videolink, features },
    });
  };
  return (
    <div className="bg-[#FFF] p-0 rounded-2xl shadow-lg max-w-[460px] w-full overflow-hidden">
      {/* First Child - Image Section */}
      <div className="w-full relative">
        <img
          src={multipleimages[0]}
          alt={title}
          className="w-full h-auto object-cover rounded-t-2xl"
        />
        <button
          onClick={handleClick}
          className="absolute bottom-[10px] right-[10px] bg-[#598931] p-3 rounded-full shadow-md"
        >
          <GoArrowUpRight className="text-white text-xl" />
        </button>
      </div>

      {/* Second Child - Content Section with #F6F8ED background */}
      <div className="bg-[#F6F8ED] flex flex-col items-start gap-[10px] h-full p-6 rounded-b-2xl">
        <div className="self-stretch text-[#060606] font-poppins text-[30.533px] font-semibold leading-normal">
          {title}
        </div>

        <div className="text-[#363636] font-poppins text-[13.249px] font-normal leading-normal">
          {subtitle}
        </div>

        <div className="self-stretch text-[#363636] font-poppins text-[15px] font-normal leading-normal">
          {description}
        </div>

        {/* Repeated Text Example */}
        <div className="mt-4 space-y-2">
          <div className="text-[#363636] font-poppins text-[13.249px] font-normal leading-normal">
            {subtitle}
          </div>
          <div className="text-[#363636] font-poppins text-[13.249px] font-normal leading-normal">
            {subtitle}
          </div>
          <div className="text-[#363636] font-poppins text-[13.249px] font-normal leading-normal">
            {subtitle}
          </div>
        </div>

        {/* Footer */}
        
        <div className="text-[#EE0505] font-poppins text-[14.249px] font-medium leading-normal">
          Medium
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogueCard;
