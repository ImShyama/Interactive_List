import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { getDriveThumbnail, handlePCImageError, RenderText, RenderTextPC } from "../../utils/globalFunctions";
import ImageNotFound from "../../assets/images/noPhoto.jpg";

const CardText = ({
  title1, title2, title3, title4, title5,
  cardSettings
}) => {
  const titleData = [title1, title2, title3, title4, title5];
  const titleKeys = ["Title_1", "Title_2", "Title_3", "Title_4", "Title_5"];

  return titleData.map((text, index) => {
    const key = titleKeys[index];
    const style = cardSettings?.titles[key];

    return (
      <div
        key={key}
        style={{
          fontFamily: style?.cardFont,
          color: style?.cardFontColor,
          fontSize: style?.cardFontSize,
          fontWeight: style?.fontWeight,
        }}
      >
        <RenderTextPC text={text} />
        {/* {text} */}
      </div>
    );
  });
}

const ProductCatalogueCard = ({
  multipleimages,
  title1,
  title2,
  title3,
  title4,
  title5,
  cardSettings,
  features
}) => {
  const navigate = useNavigate(); // Initialize navigation function
  const handleClick = () => {
    navigate("/productCatalogueBiggerView", {
      state: { title:title1, subtitle:title2, description:title3, multipleimages, sheetlink:title4, videolink:title5, features },
    });
  };
  // console.log({ "multipleimages" : multipleimages, title1, title2, title3, title4, title5, cardSettings, features})
  return (
    <div className="bg-[#FFF] p-0 rounded-2xl shadow-lg max-w-[460px] w-full overflow-hidden">
      {/* First Child - Image Section */}
      <div className="w-full relative">
        <img
          src={getDriveThumbnail(multipleimages[0]) || ImageNotFound}
          alt={title1}
          className="w-full h-[200px] object-cover rounded-t-2xl"
          // onError={(e) => { handlePCImageError(e) }}
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
          

        <CardText title1={title1} title2={title2} title3={title3} title4={title4} title5={title5} cardSettings={cardSettings} />
      </div>
    </div>
  );
};

export default ProductCatalogueCard;
