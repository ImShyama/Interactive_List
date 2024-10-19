import { useState, useRef, useEffect } from 'react';

const EditableSpreadsheetName = ({ settings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(settings?.spreadsheetName || '');

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

  const handleBlur = () => {
    setIsEditing(false);
    setEditedName(spanRef.current.textContent); 
  };

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
              className="text-[#2A3C54] font-poppins text-[30px] font-medium w-full outline-none"
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
