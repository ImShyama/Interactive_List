import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader";
import { HOST } from "../utils/constants";
import { notifyError, notifySuccess } from "../utils/notify";

const AppCard = ({ appName, spreadSheetName, spreadSheetID, appView, appImg, description }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, user, setUser } = useContext(UserContext);
  console.log("appName", appName)




  const handleCopy = () => {
    setLoading(true);
    axios
      .post(
        `${HOST}/copySpreadsheet`,
        {
          spreadSheetID: spreadSheetID,
          // "1YW0WNJVnT4AU68wAmLbQjj5xbJluBwICMGLFAeY07Pc",
          // "1sMv_CvZMTaZo1u69xLxzrBrD54n2Ymykd3hvsgEe088",
          spreadSheetName: spreadSheetName,
          appName: appName
        },
        {
          headers: {
            authorization: "Bearer " + token
          },
        }
      )
      .then(({ data: res, status }) => {
        if (status === 200 && !res.error) {
          console.log("res data: ", res);
          // Update user.sheets and call setUser
          setUser(prev => ({
            ...prev,
            sheets: [...prev.sheets, res]
          }));
          navigate(`/${res._id}/edit`);
          setTimeout(() => {
            notifySuccess("Copied successfully!");
          }, 500);
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
        <img
          className="w-[325px] h-[190px] rounded-[15.07px]"
          src={appImg}
        />
      </div>

      <div className="flex justify-start mx-[25px]">
        <span className="text-[21.52px]">{appName}</span>
      </div>
      {/* <div className="flex justify-start mx-[25px] my-2">
        <span className="text-[14.4px]">
          {description}
        </span>
      </div> */}
      <div className="flex justify-start mx-[25px] my-2 relative group">
        <span className="text-[14.4px] line-clamp-3 min-h-[30px]  group-hover: whitespace-normal transition-all duration-300 ease-in-out cursor-pointer">
          {description}
        </span>
      </div>
      <div className="mx-[25px] flex justify-between items-center">
        <button className="py-[11px] px-[16px] text-[15.07px] rounded-[13.989px] bg-primary text-white hover:bg-secondary"
          onClick={() => navigate(`/${appView}`)}
        >
          Preview
        </button>

        {loading &&
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="flex flex-col items-center">
              <Loader textToDisplay={"Creating a copy..."} />
            </div>
          </div>
        }
        <button className="border border-primary rounded-[13.99px] py-[10px] px-[15px] text-[15.07px] text-primary" onClick={handleCopy}>
          Copy Template
        </button>
      </div>
    </div>
  );
};

export default AppCard;
