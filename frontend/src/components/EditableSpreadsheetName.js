import { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from "../context/UserContext";
import { HOST } from '../utils/constants';
import { useSelector, useDispatch } from "react-redux";
import { updateSetting } from "../utils/settingSlice";

const EditableSpreadsheetName = ({ settings }) => {

  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(settings?.spreadsheetName || '');
  const { token } = useContext(UserContext);

  const isEditMode = window.location.pathname.endsWith('/edit');
  const spanRef = useRef(null);

  

  useEffect(() => {
    // Update the content if the settings change externally
    if (settings?.spreadsheetName) {
      setEditedName(settings.spreadsheetName);
      if (isEditMode) {
        spanRef.current.textContent = settings.spreadsheetName; // Direct DOM update
      }

    }
  }, [settings]);


  const handleBlur = async () => {
    const newname = spanRef.current.textContent; // Get the updated name
    const sheetId = settings.spreadsheetId; // Assuming spreadsheetId is available in your component
  
    try {
      // Call your backend API to update the spreadsheet name
      const response = await fetch(`${HOST}/renameSpreadsheet/${sheetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: "Bearer " + token, // Assuming you have token from context
        },
        body: JSON.stringify({ newname }), // Send the updated name in the body
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setEditedName(newname); // Update state with new name
        // Dispatch action to update settings in Redux
        dispatch(updateSetting(data.updatedSettings));
      } else {
        console.error('Error:', data.message || 'An error occurred');
        // Handle the error, e.g., show an error message
      }
    } catch (error) {
      console.error('Request failed:', error);
      // Handle network errors or any other issues
    } finally {
      setIsEditing(false); // Exit editing mode
    }
  };
  
  // handleKeyDown function remains unchanged
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      spanRef.current.blur(); // Trigger blur to finish editing on Enter
    }
  };

  
  return (
    <div>
      {
        isEditMode ? (
          <div
            className={`flex items-center border px-2 py-1 rounded-md ${isEditing ? 'border-[#FFA500]' : 'border-transparent hover:border-[#FFA500]'} `}
            onClick={() => setIsEditing(true)}
            style={{ transition: 'border-color 0.2s ease' }} // Smooth border transition
          >
            <span
              ref={spanRef}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-[#2A3C54] font-poppins text-[24px] font-medium w-full outline-none"
              style={{ width: '100%', minWidth: '300px', whiteSpace: 'nowrap' }} // Ensure full width
            >
              {editedName}
            </span>
          </div>
        ) : (
          <span className="text-[#2A3C54] font-poppins text-[30px] font-medium w-full">
            {editedName}
          </span>
        )
      }
    </div>
  );
};

export default EditableSpreadsheetName;
