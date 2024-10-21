

// const EditRow = ({ isOpen, onClose, onConfirm, modelName,row }) => {
//     if (!isOpen) return null;
//     console.log(row);

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[999]">
//             <div className="w-[600px] flex-shrink-0">
//                 <div className="flex justify-center w-[600px] flex-shrink-0 rounded-[20px] bg-[var(--white,#FFF)] shadow-[20px_9px_71.3px_0px_rgba(149,161,184,0.26)]">
//                     <div className="flex flex-col p-6">
//                         <div className="flex w-[600px] px-6 mb-3 justify-between">
//                             <div className="flex justify-start items-center">
//                                 <h2>{modelName}</h2>
//                             </div>
//                             <div className="flex justify-end items-center">
//                                 <button
//                                     className="text-red-500 font-poppins font-normal leading-[26.058px]"
//                                     onClick={onClose}
//                                 >
//                                     X
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="flex w-[560px] max-h-[60vh] mx-[auto] overflow-y-auto px-[8px] flex-wrap">
//                             <div className=" w-1/2 mb-4">
//                                 <div>
//                                     <label className="text-[#111] font-poppins text-[14px] px-[2px] font-medium leading-normal">
//                                         Name
//                                     </label>

//                                 </div>
//                                 <div>
//                                     <input
//                                         className="flex p-[10px] px-[16px] flex-col justify-center items-start gap-[27px] rounded-[8px] bg-[#F6F6F6] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500]"
//                                         type="text"
//                                         placeholder="Your Input"
//                                     />

//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex justify-center">
//                             <button
//                                 className="flex w-[148px] h-[46px] p-[10px] justify-center items-center gap-[10px] rounded-[82px] bg-[#FFA500] text-white flex-shrink-0"
//                                 onClick={onConfirm}
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditRow;


import { useState, useEffect } from 'react';

const EditRow = ({ isOpen, onClose, onConfirm, modelName, row }) => {
  const [editedRow, setEditedRow] = useState({});

  // Initialize the state with the row data on mount
  useEffect(() => {
    if (row) {
      setEditedRow({ ...row });
    }
  }, [row]);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setEditedRow((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  if (!isOpen) return null;

  // Filter out `key_id` and map through the rest of the row properties
  const fields = Object.keys(editedRow).filter((key) => key !== 'key_id');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[999]">
      <div className="w-[600px] flex-shrink-0">
        <div className="flex justify-center w-[600px] flex-shrink-0 rounded-[20px] bg-white shadow-lg">
          <div className="flex flex-col p-6">
            <div className="flex w-[600px] px-6 mb-3 justify-between">
              <div className="flex justify-start items-center">
                <h2>{modelName}</h2>
              </div>
              <div className="flex justify-end items-center">
                <button
                  className="text-red-500 font-poppins font-normal leading-[26.058px]"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="flex w-[560px] max-h-[60vh] mx-[auto] overflow-y-auto px-[8px] flex-wrap">
              {fields.map((field, index) => (
                <div key={index} className="w-1/2 mb-4">
                  <div>
                    <label className="text-[#111] font-poppins text-[14px] px-[2px] font-medium leading-normal">
                      {field.replace(/_/g, ' ').replace(/\(.*?\)/, '')}  {/* Clean up field name for label */}
                    </label>
                  </div>
                  <div>
                    <input
                      className="flex p-[10px] px-[16px] flex-col justify-center items-start gap-[27px] rounded-[8px] bg-[#F6F6F6] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500]"
                      type="text"
                      value={editedRow[field] || ''}  // Populate the input with the corresponding row value
                      onChange={(e) => handleInputChange(field, e.target.value)}  // Update state on change
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                className="flex w-[148px] h-[46px] p-[10px] justify-center items-center gap-[10px] rounded-[82px] bg-[#FFA500] text-white flex-shrink-0"
                onClick={() => onConfirm(editedRow)}  // Pass the edited row data back on confirm
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRow;
