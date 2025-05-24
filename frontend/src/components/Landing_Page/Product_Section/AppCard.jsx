import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import Loader from "../../Loader";
import { HOST } from "../../../utils/constants";

const AppCard = ({
  appName,
  spreadSheetName,
  spreadSheetID,
  appView,
  appImg,
  description,
  multipleImage,
  standOut,
  overview,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(UserContext);
  console.log({ appName, multipleImage, standOut, overview });

  const handleOverviewClick = () => {
    navigate(`/products/${appName}`, {
      state: { appName, appView, multipleImage, standOut, overview }, // Pass data as state
    });
  };
  const handleCopy = () => {
    // setLoading(true);
    console.log({ appName, spreadSheetID, spreadSheetName });
    axios
      .post(
        `${HOST}/copySpreadsheet`,
        {
          spreadSheetID: spreadSheetID,
          // "1YW0WNJVnT4AU68wAmLbQjj5xbJluBwICMGLFAeY07Pc",
          // "1sMv_CvZMTaZo1u69xLxzrBrD54n2Ymykd3hvsgEe088",
          spreadSheetName: spreadSheetName,
          appName: appName,
        },
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      )
      .then(({ data: res, status }) => {
        if (status === 200 && !res.error) {
          console.log("res data: ", res);
          // Redirect to edit page with the new spreadsheet ID
          navigate(`/${res._id}/edit`);
        } else {
          alert(res.error);
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-[350px] h-[400px] m-2 shadow-md flex flex-col  rounded-[15.07px] bg-[#FFFCF8]">
      <div className="m-[25px]">
        <img className="w-[325px] h-[190px] rounded-[15.07px]" src={appImg} />
      </div>

      <div className="flex justify-start mx-[25px]">
        <span className="text-[21.52px]">{appName}</span>
      </div>
      {/* <div className="flex justify-start mx-[25px] my-2">
        <span className="text-[14.4px]">{description}</span>
      </div> */}

      <div className="flex justify-start mx-[25px] my-2 relative group">
        <span className="text-[14.4px] line-clamp-3 min-h-[30px]  group-hover: whitespace-normal transition-all duration-300 ease-in-out cursor-pointer">
          {description}
        </span>
      </div>
      
      <div className="mx-[25px] flex justify-between items-center">
        {/* <button className="border border-main rounded-[10px] py-[10px] px-[15px] text-[15.07px] text-main"  onClick={() => navigate(`/${appView}`)}>
          Try Template
        </button> */}
        <button
          className="border border-main rounded-[10px] py-[10px] px-[15px] text-[15.07px] text-main"
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

        <button
          className="py-[11px] px-[16px] text-[15.07px] rounded-[10px] bg-main text-white hover:bg-green-700"
          onClick={handleOverviewClick}
        >
          See Overview
        </button>

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="flex flex-col items-center">
              <Loader textToDisplay={"loading..."} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AppCard;
