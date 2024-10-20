import { useEffect, useState, useContext } from "react";
import { FRONTENDHOST, HOST } from "../utils/constants";
import { UserContext } from "../context/UserContext";

const ShareModal = ({ isOpen, onClose, spreadsheetId, sharedWith }) => {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]); 
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState("");
  const [saveTooltip, setSaveTooltip] = useState("");
  const { token } = useContext(UserContext);
  console.log(spreadsheetId, emails);

  useEffect(() => {
    if (isOpen) {
      setEmails(sharedWith);
    }
  }, [isOpen]);

  async function addEmails() {
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
        console.log('Emails added successfully:', data);
        setSaveTooltip("Saved!"); // Show tooltip
      setTimeout(() => setSaveTooltip(""), 2000);
        // You can update the UI or show a success message to the user here
      } else {
        console.error('Error:', data.message || 'An error occurred');
        // Handle the error response, show error message to the user
      }
    } catch (error) {
      console.error('Request failed:', error);
      // Handle the network or other errors
    }
  }

  const handleCopy = () => {
    const linkToCopy = `${FRONTENDHOST}/${spreadsheetId}/view`; // The link you want to copy
    navigator.clipboard.writeText(linkToCopy).then(() => {
      setTooltip("Copied!"); // Show tooltip
      setTimeout(() => setTooltip(""), 2000); // Hide tooltip after 2 seconds
    });
  };

  // Function to remove an email from the list
  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter(item => item.email !== emailToRemove));
  };
  const addEmail = () => {
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    // Check if email already exists in the list
    if (emails.some((entry) => entry.email === email)) {
      setError('This email is already in the list.');
      return;
    }
    // Add the email and permission to the list
    setEmails([...emails, { email: email, permission: "view" }]);
    setEmail(''); // Clear the input field after adding
    setError(''); // Clear any previous error
  };

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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className={`border px-2 py-1 w-full rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
          {/* Error message */}

          {/* <button
            onClick={addEmail}
            className="bg-[#FFA500] text-white rounded-lg px-4 py-1">
            Add
          </button> */}

          <button
            className={`rounded-lg px-4 py-1 ${email == ""
                ? 'bg-gray-200 cursor-not-allowed'  
                : 'bg-[#FFA500] text-white'     
              }`}
              onClick={addEmail}
            disabled={email == ""}
          >
            Add
          </button>

        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <div className="max-h-[200px] my-2 flex flex-wrap overflow-y-scroll">
          {emails.map((entry, index) => (
            <span key={index} className="bg-orange-100 p-1 m-[2px] rounded-lg px-2 flex items-center">
              {entry.email} {/* Access the 'email' property of the object */}
              <button onClick={() => removeEmail(entry.email)} className="ml-2 text-red-600 hover:text-red-800">
                <svg
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
                </svg>
              </button>
            </span>
          ))}
        </div>



        <div className="flex justify-between items-center">
          {/* Link section */}
          <button
            className="text-[#FFA500] underline cursor-pointer"
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
            className={`rounded-lg px-4 py-2 ${emails.length === 0
                ? 'bg-gray-200 cursor-not-allowed'  // Gray background and not-allowed cursor when disabled
                : 'bg-[#FFA500] text-white'         // Default orange background when enabled
              }`}
            onClick={() => addEmails()}
            disabled={emails.length === 0}
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
