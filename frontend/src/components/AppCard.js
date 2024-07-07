const AppCard = () => {
  return (
    <div className="w-[408.91px] h-[473.48px] m-4 shadow-md flex flex-col items-start rounded-[15.07px] bg-[#FFFCF8]">
      <div className="m-[25px]">
        <img
          className="w-[355.11px] h-[238.89px] rounded-[15.07px]"
          src="https://s3-alpha-sig.figma.com/img/a323/c892/d59a0fe83ebe5e87ededc1756d6154a8?Expires=1721001600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Qt4HTKyPFrNt-ZFB4kBYlJslvM9kHgTLI1TY0BbgNs8NK18EqjSWz3oqFVz4i~gpQ3EvRqCFz4zm8zEqs04ns4pe-rEl7TT9wd4IRko~Gyz7kk98Nwz4Cp214oMoEcj5eiKNP0DuF0grX2ZeZ4NXN0AiiRQMh9kKfVXx0ID6I3CdU7luPo7sq5u0ui8RuMwdOYqvF9gnnCs4Uu0IjKeLZp4M~wA~GA9nktR0PC3mR7bEIevQhfzoLpWc7CBvJbD6BfwKC05Rve2CL7aDJ2XisX5dApAPmTBPj4z1uquRHxvYRVnhtaKf4UO9U1AXTrwgMhPGzZR441d0lSCVLJA-wQ__"
        />
      </div>

      <div className="flex justify-start mx-[25px]">
        <span className="text-[21.52px]">People Directory with Map</span>
      </div>
      <div className="mx-[25px] my-2">
        <span className="text-[14.4px]">
          List all employees working remotely on a map with filters.
        </span>
      </div>
      <div className="mx-[25px] flex flex-row-reverse ">
        <button className="border border-[#FFA500] rounded-[13.99px] py-[10px] px-[15px] text-[15.07px]">
          Copy
        </button>
      </div>
    </div>
  );
};

export default AppCard;
