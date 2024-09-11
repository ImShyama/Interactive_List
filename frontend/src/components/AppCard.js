import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const AppCard = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token} = useContext(UserContext);

  const Loader = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
          <span className="text-lg font-semibold text-gray-700">Creating a copy...</span>
        </div>
      </div>
    );
  };
  

  const handleCopy = () => {

    setLoading(true);

    axios
      .post(
        "http://localhost:4000/copySpreadsheet",
        {
          spreadSheetID:
            "1YW0WNJVnT4AU68wAmLbQjj5xbJluBwICMGLFAeY07Pc",
          spreadSheetName: "Sheet1",
          appName: "InteractiveList"
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
          // Redirect to edit page with the new spreadsheet ID
          navigate(`/interactivelist/${res._id}`);
        } else {
          alert(res.error);
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false); // Hide the loader
      });
  };


  return (
    <div className="w-[350px] h-[400px] m-2 shadow-md flex flex-col items-start rounded-[15.07px] bg-[#FFFCF8]">
      <div className="m-[25px]">
        <img
          className="w-[325px] h-[190px] rounded-[15.07px]"
          src="https://i.ibb.co/8PBFyYg/image.png"
        />
      </div>

      <div className="flex justify-start mx-[25px]">
        <span className="text-[21.52px]">Interactive List</span>
      </div>
      <div className="mx-[25px] my-2">
        <span className="text-[14.4px]">
          List all employees attandance score.
        </span>
      </div>
      <div className="mx-[25px] flex justify-center items-center shrink-0 ">
      {loading && <Loader />}
        <button className="border border-[#FFA500] rounded-[13.99px] py-[10px] px-[15px] text-[15.07px]" onClick={handleCopy}>
          Copy
        </button>
      </div>
    </div>
  );
};

export default AppCard;
