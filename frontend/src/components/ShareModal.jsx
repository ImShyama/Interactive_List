import { useEffect, useState, useContext, useMemo } from "react";
import { FRONTENDHOST, HOST } from "../utils/constants";
import { UserContext } from "../context/UserContext";
import { Input, Select, Space } from 'antd';
import { notifyError, notifySuccess } from "../utils/notify";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { updateSetting } from "../utils/settingSlice";
import GeneralAccess from "./component/GeneralAccess";
import useSpreadSheetDetails from "../utils/useSpreadSheetDetails";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  Box,
  Typography,
  Modal,
  Button,
  CircularProgress,
} from "@mui/material";
import { generateAvatar } from "../utils/globalFunctions";
import { AutoComplete } from "antd";


const ShareModal = ({ isOpen, onClose, spreadsheetId, sharedWith, updateSharedWith, settings }) => {
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState("View");
  const setting = useSpreadSheetDetails(spreadsheetId);
  const [emails, setEmails] = useState(setting?.sharedWith);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState("");
  const [saveTooltip, setSaveTooltip] = useState("");
  const { token, user } = useContext(UserContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [sharedWithList, setSharedWithList] = useState(user?.suggestedUsers || []);
  const [filteredOptions, setFilteredOptions] = useState([]);



  console.log({ isOpen, onClose, spreadsheetId, sharedWith, updateSharedWith, settings });

  useEffect(() => {
    setEmails(sharedWith);
  }, [settings]);

  async function addEmails(emails, message) {
    
    try {
      if (message == "Emails saved successfully!") {
        setLoading(true);
      }

      const response = await fetch(`${HOST}/addEmails/${spreadsheetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({ emails }), // Send emails in the body
      });

      // Handle the response
      const data = await response.json();

      if (response.ok) {
        updateSharedWith(emails, spreadsheetId);
        notifySuccess("Saved Successfully");
        if (message == "Emails saved successfully!") {
          onClose();
        }
      } else {
        console.error('Error:', data.message || 'An error occurred');
      }

      setLoading(false);
    } catch (error) {
      console.error('Request failed:', error);
      setLoading(false);
    }
  }

  const handleCopy = () => {
    const linkToCopy = `${FRONTENDHOST}/${spreadsheetId}/view`;
    navigator.clipboard.writeText(linkToCopy).then(() => {
      notifySuccess("Link copied successfully!");
    });
  };

  // Function to remove an email from the list
  const removeEmail = (emailToRemove) => {
    const tempEmails = emails.filter(item => item.email !== emailToRemove)
    setEmails(tempEmails);
    const updatedSettings = {
      ...settings,
      sharedWith: tempEmails,
    };

    // Dispatch the updated settings locally
    dispatch(updateSetting(updatedSettings));
    addEmails(tempEmails, "Email removed successfully!");
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const addEmail = () => {

    if (!email || !isValidEmail(email)) {
      notifyError("Please enter a valid email address.");
      return;
    }
    // Check if email already exists in the list
    if (emails.some((entry) => entry.email === email)) {
      notifyError('This email is already in the list.');
      return;
    }

    // let tempEmail = filteredOptions.find(item => item.email === email);
    // if (!tempEmail) {
    //   tempEmail = { email: email, photo: "", permission: access, };
    // }

    let tempEmail = filteredOptions.find(item => item.email === email);
    if (!tempEmail) {
      // If user is not in suggestions, create new user object
      tempEmail = {
        email: email,
        photo: "",
        permission: access
      };
    } else {
      // If user is found in suggestions, use their photo but respect current access setting
      tempEmail = {
        email: tempEmail.email,
        photo: tempEmail.photo,
        permission: access  // Use current access state, not the previous permission
      };
    }
    console.log({ emails, email, tempEmail })

    // Add the email and permission to the list
    setEmails([...emails, tempEmail]);
    setEmail(''); // Clear the input field after adding
    setAccess("View");
    setError(''); // Clear any previous error
    setLoadingSave(true);
  };

  const updateAccess = (emailToUpdate, newAccess) => {
    setLoadingSave(true);
    setEmails(emails.map(entry => entry.email === emailToUpdate ? { ...entry, permission: newAccess } : entry));
  };

  const options = [
    {
      value: 'Edit',
      label: 'Edit',
    },
    {
      value: 'View',
      label: 'View',
    },
  ];




  const iconOptions = [
    {
      value: 'Edit',
      label: <CiEdit size={20} className="text-primary" />,
    },
    {
      value: 'View',
      label: <IoEyeOutline size={18} className="text-primary" />,
    },
  ];

  if (!isOpen) return null;
  console.log({ emails });



  useEffect(() => {
    const handler = setTimeout(() => {
      if (email.trim() === "") {
        setFilteredOptions([]);
      } else {
        const filtered = sharedWithList.filter(item =>
          item?.email.toLowerCase().includes(email.toLowerCase())
        );
        setFilteredOptions(filtered);
      }
    }, 300); // debounce delay in ms

    return () => clearTimeout(handler);
  }, [email]);





  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[400px]  rounded-lg p-[20px] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[10px] right-[10px] text-gray-400 hover:text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal content */}
        <h3 className="text-xl font-semibold mb-4">Share this file to:</h3>
        <div className="flex items-center gap-2">

          {/* <Input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '80%' }}
            className="border rounded placeholder:text-[12px]"
          /> */}

          {/* <Select
            showSearch
            value={email || null} // This makes placeholder visible when input is empty
            placeholder="Enter email address"
            style={{ width: '80%' }}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={setEmail}
            onChange={setEmail}
            notFoundContent={null}
            // options={filteredOptions.map(item => ({ value: item?.email }))}
            options={filteredOptions.map((item, index) => ({
              value: item?.email,
              label: (
                <div className="flex items-center gap-2">
                  <img
                    src={item?.photo || generateAvatar(item?.email, index)}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{item?.email}</span>
                </div>
              )
            }))}
            className="border rounded placeholder:text-[12px]"
          /> */}


          <AutoComplete
            value={email}
            onChange={setEmail} // updates while typing
            placeholder="Enter email address"
            style={{ width: "80%" }}
            options={filteredOptions.map((item, index) => ({
              value: item?.email,
              label: (
                <div className="flex items-center gap-2">
                  <img
                    src={item?.photo || generateAvatar(item?.email, index)}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{item?.email}</span>
                </div>
              )
            }))}
          />



          <Select
            value={access}
            options={options}
            onChange={(value) => setAccess(value)}
            style={{ width: '25%' }}
          />

          {/* Error message */}

          {/* <button
            onClick={addEmail}
            className="bg-[#FFA500] text-white rounded-lg px-4 py-1">
            Add
          </button> */}

          <button
            className={`rounded-lg px-4 py-[6px] ${email == ""
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-primary text-white'
              }`}
            onClick={addEmail}
            disabled={email == ""}
          >
            Add
          </button>

        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <div className="max-h-[40vh] my-2 flex flex-wrap overflow-y-scroll">
          {emails?.map((entry, index) => (
            <div key={index} className="flex justify-between bg-gray-100 w-[100%] m-[2px] rounded-lg px-2 items-center">
              {/* <div className="">
                <span className="text-[12px]">{entry.email}</span>
              </div> */}
              <div className="flex justify-start items-center gap-[6px]">
                <img
                  src={entry.photo || generateAvatar(entry.email, index)}
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover m-1"
                />

                <span className="text-[12px] text-center">{entry.email}</span>
              </div>
              <div className="flex gap-[10px] items-center">
                <div>
                  <Select defaultValue={entry.permission} options={iconOptions} onChange={(value) => updateAccess(entry.email, value)} bordered={false}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none'  // removes any default shadow if present
                    }}
                  />
                </div>
                <div className="cursor-pointer flex align-center">
                  <button onClick={() => removeEmail(entry.email)} className="text-red-600 hover:text-red-800">
                    <RiDeleteBinLine size={16} className="text-primary" />
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg> */}
                    {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="Frame">
                        <path id="Vector" d="M3 6H21" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path id="Vector_2" d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path id="Vector_3" d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path id="Vector_4" d="M10 11V17" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path id="Vector_5" d="M14 11V17" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </svg> */}

                  </button>
                </div>


              </div>
            </div>
          ))}
        </div>

        <GeneralAccess sheetId={spreadsheetId} />



        <div className="flex justify-between items-center">
          {/* Link section */}
          <button
            className="text-primary underline cursor-pointer"
            onClick={handleCopy}
          >
            Copy Link!
          </button>
          {tooltip && (
            <span className="absolute bg-[#fed17c] text-white text-xs rounded py-1 px-2 left-[110px] mt-1">
              {tooltip}
            </span>
          )}

          {/* Save button */}
          {loading ?

            <button
              className="rounded-lg px-4 py-2 bg-gray-200 cursor-not-allowed text-white"
              disabled={true}
            >
              <CircularProgress
                size={15}
                sx={{ color: "#fff", marginRight: "5px" }}
              />{" "}
              Saving...
            </button>
            : <button
              className={`rounded-lg px-4 py-2 ${!loadingSave
                ? 'bg-gray-200 cursor-not-allowed'  // Gray background and not-allowed cursor when disabled
                : 'bg-primary text-white'         // Default orange background when enabled
                }`}
              onClick={() => addEmails(emails, "Emails saved successfully!")}
              disabled={emails?.length === 0}
            >
              Save
            </button>}
          {/* {saveTooltip && (
            <span className="absolute bg-[#fed17c] text-white text-xs rounded py-1 px-2 right-[100px] mt-1">
              {saveTooltip}
            </span>
          )} */}

        </div>

      </div>
    </div >
  );
};

export default ShareModal;
