import { useState, useEffect } from 'react';

const EditRow = ({ isOpen, onClose, onConfirm, modelName, row, loading, formulaData}) => {
  const [editedRow, setEditedRow] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  

  // Initialize the state with the row data on mount
  useEffect(() => {
    if (row) {
      setEditedRow({ ...row });
    }
  }, [row]);

  useEffect(() => {
    if (isOpen) {
      setIsDisabled(true);
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setEditedRow((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    setIsDisabled(false);
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
                <span className='text-xl font-medium font-poppins'>{modelName}</span>
              </div>
              <div className="flex justify-end items-center">
                <div className='mr-6 mt-[-25px]'>
                  <button
                    onClick={onClose}
                    className="absolute w-[25px] h-[25px] text-gray-400 hover:text-red-600"
                  >
                    <span className="cursor-pointer">
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
                    </span>

                  </button>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex w-[560px] max-h-[60vh] mx-[auto] overflow-y-auto px-[8px] flex-wrap">
              {fields.map((field, index) => {
                if(formulaData?.[field] == false) return <></>
              return(
                <div key={index} className="w-1/2 mb-4">
                  <div>
                    <label className="text-[#111] font-poppins text-[14px] px-[2px] font-medium leading-normal">
                      {field.replace(/_/g, ' ').replace(/\(.*?\)/, '').toUpperCase()}  {/* Clean up field name for label */}
                    </label>
                  </div>
                  <div>
                    <input
                      className="flex p-[10px] px-[16px] flex-col justify-center items-start gap-[27px] rounded-[8px] bg-[#F6F6F6] border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      type="text"
                      value={editedRow[field] || ''}  // Populate the input with the corresponding row value
                      onChange={(e) => handleInputChange(field, e.target.value)}  // Update state on change
                    />
                  </div>
                </div>
              )})}
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                className="flex w-[148px] h-[46px] p-[10px] justify-center items-center gap-[10px] rounded-[82px] bg-primary text-white flex-shrink-0"
                onClick={() => onConfirm(editedRow)}  // Pass the edited row data back on confirm
                disabled={isDisabled || loading}
              >
                {loading ? (
                  <div className="loader" /> // Display loader during loading
                ) : (
                  modelName === "Edit Row" ? "Edit" : "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRow;
