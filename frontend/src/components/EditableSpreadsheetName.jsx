// import { useState, useRef, useEffect, useContext } from 'react';
// import { UserContext } from "../context/UserContext";
// import { HOST } from '../utils/constants';
// import { useSelector, useDispatch } from "react-redux";
// import { updateSetting } from "../utils/settingSlice";
// import { notifySuccess } from '../utils/notify';
// import { IoSaveOutline } from "react-icons/io5";

// const EditableSpreadsheetName = ({ settings }) => {

//   const dispatch = useDispatch();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedName, setEditedName] = useState(settings?.spreadsheetName || '');
//   const { token } = useContext(UserContext);

//   const isEditMode = window.location.pathname.endsWith('/edit');
//   const spanRef = useRef(null);

  

//   useEffect(() => {
//     // Update the content if the settings change externally
//     if (settings?.spreadsheetName) {
//       setEditedName(settings.spreadsheetName);
//       if (isEditMode) {
//         spanRef.current.textContent = settings.spreadsheetName; // Direct DOM update
//       }

//     }
//   }, [settings]);


//   const handleBlur = async () => {
//     const newname = spanRef.current.textContent; // Get the updated name
//     const sheetId = settings.spreadsheetId; // Assuming spreadsheetId is available in your component
  
//     try {
//       // Call your backend API to update the spreadsheet name
//       const response = await fetch(`${HOST}/renameSpreadsheet/${sheetId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           authorization: "Bearer " + token, // Assuming you have token from context
//         },
//         body: JSON.stringify({ newname }), // Send the updated name in the body
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         setEditedName(newname); // Update state with new name
//         // Dispatch action to update settings in Redux
//         dispatch(updateSetting(data.updatedSettings));
//         notifySuccess('Spreadsheet name updated successfully');
//       } else {
//         console.error('Error:', data.message || 'An error occurred');
//         // Handle the error, e.g., show an error message
//       }
//     } catch (error) {
//       console.error('Request failed:', error);
//       // Handle network errors or any other issues
//     } finally {
//       setIsEditing(false); // Exit editing mode
//     }
//   };
  
//   // handleKeyDown function remains unchanged
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       spanRef.current.blur(); // Trigger blur to finish editing on Enter
//     }
//   };

//   const handleEditedNameChange = () => {
//     const newname = spanRef.current.textContent;
//     setEditedName(newname);
//   };

  
//   return (
//     <div>
//       {
//         isEditMode ? (
//           <div className='flex items-center justify-start'>
//           <div
//             className={`flex justify-start items-center border px-2 py-1 rounded-md ${isEditing ? 'border-[#598931]' : 'border-transparent hover:border-[#598931]'} `}
//             onClick={() => setIsEditing(true)}
//             style={{ transition: 'border-color 0.2s ease' }} // Smooth border transition
//             title='Rename'
//           >
//             <span
//               ref={spanRef}
//               contentEditable={isEditing}
//               suppressContentEditableWarning={true}
//               onChange={() => handleEditedNameChange()}
//               // onBlur={handleBlur}
//               // onKeyDown={handleKeyDown}
//               className="text-[#2A3C54] font-poppins text-[21px] font-medium w-full outline-none"
//               style={{ width: '100%', minWidth: '300px', whiteSpace: 'nowrap' }} // Ensure full width
//             >
//               {editedName}
//             </span>
//           </div>
//           { isEditing && <IoSaveOutline color="#598931" className="ml-2" onClick={handleBlur} />}
//           </div>
//         ) : (
//           <div
//             className={`flex justify-start items-center px-2 py-1  `}
//             title='Sheet Name'
//           >
//           <span className="text-[#2A3C54] font-poppins text-[21px] font-medium w-full" >
//             {editedName}
//           </span>
//           </div>
//         )
//       }
      
//     </div>
//   );
// };

// export default EditableSpreadsheetName;

import { useState, useContext, useEffect } from 'react';
import { UserContext } from "../context/UserContext";
import { HOST } from '../utils/constants';
import { useSelector, useDispatch } from "react-redux";
import { updateSetting } from "../utils/settingSlice";
import { notifySuccess } from '../utils/notify';
import { IoSaveOutline } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";

const EditableSpreadsheetName = ({ settings }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(settings?.spreadsheetName || '');
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(UserContext);

  const isEditMode = window.location.pathname.endsWith('/edit');

  useEffect(() => {
    // Update the content if the settings change externally
    if (settings?.spreadsheetName) {
      setEditedName(settings.spreadsheetName);
    }
  }, [settings]);

  const handleSave = async () => {
    const newname = editedName;
    const sheetId = settings.spreadsheetId; // Assuming spreadsheetId is available in your component

    setIsLoading(true);
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
        setIsChanged(false);
        // Dispatch action to update settings in Redux
        dispatch(updateSetting(data.updatedSettings));
        notifySuccess('Spreadsheet name updated successfully');
      } else {
        console.error('Error:', data.message || 'An error occurred');
        // Handle the error, e.g., show an error message
      }
    } catch (error) {
      console.error('Request failed:', error);
      // Handle network errors or any other issues
    } finally {
      setIsLoading(false);
      setIsEditing(false); // Exit editing mode
    }
  };

  const handleInputChange = (e) => {
    setEditedName(e.target.value);
    setIsChanged(true);
  };

  const handleBlur = () => {
    if (!isChanged) {
      setIsEditing(false);
    }
  };

  return (
    <div>
      {isEditMode ? (
        <div className='flex items-center justify-start'>
          {isEditing ? (
            <div className='flex items-center'>
              <input
                type="text"
                value={editedName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="border border-primary px-2 py-1 rounded-md outline-none w-full font-poppins text-[21px] font-medium text-[#2A3C54]"
                style={{ minWidth: '300px' }}
              />
              {isChanged && !isLoading && (
                <IoSaveOutline
                  color="#598931"
                  className="ml-2 cursor-pointer"
                  onClick={handleSave}
                  title="Save"
                />
              )}
              {isLoading && <ImSpinner2 className="ml-2 animate-spin" color="#598931" title="Saving..." />}
            </div>
          ) : (
            <div
            className="flex justify-start items-center px-2 py-1 rounded-md hover:border-[#598931] cursor-pointer"
            style={{ border: 'none', transition: 'border-color 0.2s ease' }}
            onClick={() => setIsEditing(true)}
            title='Rename'
          >
            <span
              className="text-[#2A3C54] font-poppins text-[21px] font-medium w-full"
              style={{ minWidth: '300px', whiteSpace: 'nowrap' }}
            >
              {editedName}
            </span>
          </div>
          )}
        </div>
      ) : (
        <div className='flex justify-start items-center px-2 py-1' title='Sheet Name'>
          <span className="text-[#2A3C54] font-poppins text-[21px] font-medium w-full">
            {editedName}
          </span>
        </div>
      )}
    </div>
  );
};

export default EditableSpreadsheetName;

