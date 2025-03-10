import { useEffect, useState, useContext } from "react";
import { FRONTENDHOST, HOST } from "../utils/constants";
import { UserContext } from "../context/UserContext";
import { Input, Select, Space } from 'antd';
import { notifyError, notifySuccess } from "../utils/notify";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch, useSelector} from "react-redux";
import { updateSetting } from "../utils/settingSlice";
import GeneralAccess from "./component/GeneralAccess";
import useSpreadSheetDetails from "../utils/useSpreadSheetDetails";

const ShareModal = ({ isOpen, onClose, spreadsheetId, sharedWith, updateSharedWith, settings }) => {
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState("View");
  const setting = useSpreadSheetDetails(spreadsheetId);
  const [emails, setEmails] = useState(setting?.sharedWith);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState("");
  const [saveTooltip, setSaveTooltip] = useState("");
  const { token } = useContext(UserContext);
  const dispatch = useDispatch();
  
  
  console.log({settings, sharedWith});

  useEffect(() => {
      setEmails(sharedWith);
  }, [settings]);

  async function addEmails(emails, message) {
    try {
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
        notifySuccess(message);
        if(message == "Emails saved successfully!") {
          onClose();
        }
      } else {
        console.error('Error:', data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Request failed:', error);
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
    // Add the email and permission to the list
    setEmails([...emails, { email: email, permission: access }]);
    setEmail(''); // Clear the input field after adding
    setAccess("View");
    setError(''); // Clear any previous error
  };

  const updateAccess = (emailToUpdate, newAccess) => {
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
      label: <CiEdit size={22} color="#FFA500" />,
    },
    {
      value: 'View',
      label: <IoEyeOutline size={20} color="#FFA500" />,
    },
  ];

  if (!isOpen) return null;

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
          {/* Input field */}
          {/* <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className={`border px-2 py-1 w-full rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
          /> */}

          <Input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '80%' }} />
          <Select defaultValue="View" options={options} onChange={(value) => setAccess(value)} style={{ width: '25%' }} />

          {/* Error message */}

          {/* <button
            onClick={addEmail}
            className="bg-[#FFA500] text-white rounded-lg px-4 py-1">
            Add
          </button> */}

          <button
            className={`rounded-lg px-4 py-1 ${email == ""
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

        <div className="max-h-[200px] my-2 flex flex-wrap overflow-y-scroll">
          {emails?.map((entry, index) => (
            <div key={index} className="flex justify-between bg-orange-50 w-[100%] p-1 m-[2px] rounded-lg px-2 items-center">
              <div className="">
                <span>{entry.email}</span>
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="Frame">
                        <path id="Vector" d="M3 6H21" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path id="Vector_2" d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path id="Vector_3" d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path id="Vector_4" d="M10 11V17" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path id="Vector_5" d="M14 11V17" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </svg>

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
          <button
            className={`rounded-lg px-4 py-2 ${emails?.length === 0
              ? 'bg-gray-200 cursor-not-allowed'  // Gray background and not-allowed cursor when disabled
              : 'bg-primary text-white'         // Default orange background when enabled
              }`}
            onClick={() => addEmails(emails,"Emails saved successfully!")}
            disabled={emails?.length === 0}
          >
            Save
          </button>
          {saveTooltip && (
            <span className="absolute bg-[#fed17c] text-white text-xs rounded py-1 px-2 right-[100px] mt-1">
              {saveTooltip}
            </span>
          )}

        </div>

      </div>
    </div>
  );
};

export default ShareModal;
