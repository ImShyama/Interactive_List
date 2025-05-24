
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const OverviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(UserContext);
  const { appName, multipleImage, standOut, appView, overview } =
    location.state || {};

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? multipleImage.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === multipleImage.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-[#FFF]">
      {/* above Section */}
      <div className="self-stretch text-[#A0A0A0] font-poppins text-[16.705px] font-medium leading-normal">
        <span
          onClick={() => navigate("/products")}
          className="hover:text-main hover:underline cursor-pointer"
        >
          Products
        </span>
        <span className="mx-2">&gt;</span>
        <span>{appName}</span>
      </div>

      {/* Content Section */}
      <div className="flex-grow">
        <div className="self-stretch text-[#000] font-poppins text-[36.081px] font-medium leading-normal mb-4">
          {appName}
        </div>

        {/* Horizontal Separator */}
        <hr className="border-t-2 border-[#DADADA] mb-8" />
        {/* Overview Text Section */}

        <div className="text-[#A0A0A0] font-[Poppins] text-[20.705px] font-medium leading-normal mb-12">
          {overview || "No overview available."}
        </div>

        <div className="flex">
          {/* Image Section */}
          <div className="w-3/5 flex flex-col items-start">
            <img
              src={multipleImage?.[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="w-full aspect-[16/9] rounded-[16.813px] border-[1.121px] border-[#FBFBFB] bg-white 
             shadow-[3.363px_-3.363px_2.242px_0px_rgba(224,224,224,0.25),-3.363px_3.363px_2.242px_0px_rgba(224,224,224,0.25)] 
             object-cover"
            />

            <div className="flex justify-center w-full gap-4 mt-4">
              <button
                onClick={handlePrev}
                className="p-2 border-2 border-main text-main text-2xl rounded-full hover:bg-[#FFFFFF]"
              >
                <MdOutlineNavigateBefore />
              </button>

              <button
                onClick={handleNext}
                className="p-2 border-2 border-main text-main text-2xl rounded-full hover:bg-[#FFFFFF]"
              >
                <MdOutlineNavigateNext />
              </button>
            </div>
          </div>

          {/* Standout Section */}
          <div className="w-1/2 mt-4 space-y-2 pl-6">
            <div class="self-stretch text-black font-poppins text-[25.824px] font-medium leading-normal">
              What Makes Our Product Stand Out
            </div>

            {standOut?.map((item, index) => (
              <div key={index} className="flex items-start gap-8">
                <div className="flex items-center justify-center w-12.5 h-12.5 rounded-full bg-[rgba(150,255,63,0.08)] text-main font-bold text-lg mt-2">
                  {index + 1}.
                </div>
                <div>
                  <h3 className="text-xl font-[Poppins] font-semibold leading-normal text-main">
                    {Object.keys(item)[0]}
                  </h3>

                  <p className="text-[#B6B6B6] font-[Poppins] text-[13.5px] font-normal leading-normal mt-1">
                    {Object.values(item)[0] ||
                      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque eligendi facilis adipisci, ratione labore illo quod quasi explicabo aliquid aliquam totam amet, optio expedita vero, possimus sint incidunt nobis consequatur."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button Section - Always Stays at Bottom Center */}
      <div className="flex justify-center items-center pt-8">
        <button
          className="py-2 px-4 text-lg rounded-xl bg-main text-white"
          onClick={() => {
            if (token) {
              navigate(`/${appView}`); // Redirect to appView if user is signed in
            } else {
              navigate("/signin"); // Redirect to sign-in page if not signed in
            }
          }}
        >
          Try Template
        </button>
      </div>
    </div>
  );
};

export default OverviewPage;
