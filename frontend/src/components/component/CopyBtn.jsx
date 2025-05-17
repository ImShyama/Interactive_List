import { IoCopyOutline } from "react-icons/io5";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Loader from "../Loader";
import axios from 'axios';
import { HOST } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../../utils/notify";

const CopyBtn = ({ appName, spreadSheetID, spreadSheetName }) => {
    const { token: userToken, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCopy = () => {
        setLoading(true);
        console.log({ appName, spreadSheetID, spreadSheetName });
        axios
            .post(
                `${HOST}/copySpreadsheet`,
                {
                    spreadSheetID: spreadSheetID,
                    spreadSheetName: spreadSheetName,
                    appName: appName,
                },
                {
                    headers: {
                        authorization: "Bearer " + userToken,
                    },
                }
            )
            .then(({ data: res, status }) => {
                if (status === 200 && !res.error) {
                    console.log("res data: ", res);

                    setUser(prev => ({
                        ...prev,
                        sheets: [...prev.sheets, res]
                    }));
                    // Redirect to edit page with the new spreadsheet ID
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
        <div className="flex">
            <button
                className="flex justify-center items-center w-[50px] h-[50px] bg-[#598931] border-none rounded-full cursor-pointer"
                title="Copy App"
                onClick={handleCopy}
            >
                <IoCopyOutline className="text-white w-[24px] h-[24px]" />
            </button>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75"
                    style={{ zIndex: 100, overflow: 'hidden' }}
                >
                    <Loader textToDisplay="Creating a copy..." />
                </div>
            )}
        </div>
    )
};

export default CopyBtn;