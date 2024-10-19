import deletealert from "../assets/deletealert.svg";


const DeleteAlert = ({ isOpen, onClose, onConfirm, sheetName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[999]">
      <div className="w-[458px] h-[292px] flex-shrink-0">
        <div className="flex justify-center items-center w-[458px] h-[292px] flex-shrink-0 rounded-[20px] bg-[var(--white,#FFF)] shadow-[20px_9px_71.3px_0px_rgba(149,161,184,0.26)]">
          <div className="inline-flex flex-col items-center gap-[46px]">
            <div className="flex flex-col justify-center items-center gap-[46px]">
              <div className="flex w-[323px] items-center gap-[18px]">
                <img src={deletealert} />
                <div className="flex w-[225px] flex-col items-start gap-[13px] flex-shrink-0">
                  <span className="text-[var(--black,#111)] font-poppins text-[20px] font-medium leading-normal">
                    Are You Sure?
                  </span>
                  <span className="w-[248px] text-[#2A3C54] font-poppins text-[14px] font-medium leading-normal">
                    Are you sure you want to delete {sheetName} permanently.
                  </span>
                </div>
              </div>
              <div className="flex w-[339px] justify-center items-start gap-[16px]">
                <button className="flex w-[148px] h-[46px] p-[10px] justify-center items-center gap-[10px] rounded-[82px] bg-[#F6F6F6] flex-shrink-0"
                  onClick={onClose}
                >
                  <span className="text-[var(--black,#111)] font-poppins text-[14px] font-medium leading-normal">
                    Cancel It
                  </span>
                </button>
                <button className="flex w-[148px] h-[46px] p-[10px] justify-center items-center gap-[10px] rounded-[82px] border-[1px] border-[var(--brand-color-2,#FFA500)] shadow-[6px_4px_24.5px_0px_rgba(134,138,156,0.25)] flex-shrink-0"
                  onClick={onConfirm}
                >
                  <span className="text-[var(--black,#111)] font-poppins text-[14px] font-medium leading-normal">
                    Yes ! Delete
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlert;
