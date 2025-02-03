// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import { dummyData } from "./PeopleDirectoryView"; // Adjust path if necessary
// import { HiOutlineEnvelope } from "react-icons/hi2";
// import { IoCallOutline } from "react-icons/io5";
// import { IoMdArrowBack } from "react-icons/io";
// import { useLocation } from "react-router-dom";

// const ProfilePage = () => {

//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [settings, setSettings] = useState(null);

//   useEffect(() => {
//     const storedData = localStorage.getItem(`profileData_${id}`);
//     const storedSettings = localStorage.getItem(`profileSettings_${id}`);

//     if (storedData) setData(JSON.parse(storedData));
//     if (storedSettings) setSettings(JSON.parse(storedSettings));
//   }, [id]);

//   if (!data || !settings) return <p>Loading...</p>;

//   // const { id } = useParams();
//   // const [profile, setProfile] = useState(null);
//   // const navigate = useNavigate(); // Move it inside here

//   // const location = useLocation();
//   // const data = location.state?.data[0] || [];
//   // const settings = location.state?.settings || {};

//   const showInCard = settings?.showInCard || [];
//   const showInProfile = settings?.showInProfile || [];

//   console.log({ data, settings, showInCard, showInProfile });

//   useEffect(() => {
//     const selectedProfile = dummyData.find(
//       (person) => person.id === parseInt(id)
//     );
//     setProfile(selectedProfile);
//   }, [id]);

//   // if (!profile) {
//   //   return <p>Loading...</p>;
//   // }

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center ">
//       {/* Back Arrow at the Top Left of the Page, Below Navbar */}
//       <IoMdArrowBack
//         className="text-[37px] text-black cursor-pointer absolute top-[120px] left-[70px]"
//         onClick={() => navigate(-1)} // You may try replacing this with a direct path like `/people-directory`
//       />

//       <div className="w-[1357px] h-[872px] flex-shrink-0 rounded-[25px] bg-[#FAFAFA]">
//         {/* Profile and Details Section */}
//         <div className="inline-flex items-start gap-[50px] mt-[38px] mb-[35px] ml-[85px] mr-[85px]">

//           {/* Left: Profile Card */}
//           <div
//             className="w-[497px] h-[668px] flex-shrink-0 rounded-[21px] bg-white my-[60.5px]"
//             style={{
//               filter: "drop-shadow(-4px 4px 23.3px rgba(216, 216, 216, 0.25))",
//               marginTop: '0px', // Adjust this margin-top value to shift the card upwards
//             }}
//           >
//             <div className="w-[338.18px] h-[441px] flex-shrink-0">
//               <img
//                 src={data[showInCard[0]?.title.toLowerCase().replace(" ", "_")]}
//                 alt={`${data[showInCard[1]?.title.toLowerCase().replace(" ", "_")]}'s Profile`}
//                 // title={`${data[showInCard[1]?.title.toLowerCase().replace(" ", "_")]}'s Profile`}
//                 className="w-[338.18px] h-[338.18px] flex-shrink-0 rounded-full bg-lightgray bg-cover bg-center bg-no-repeat mt-[44px]  mx-[79px] "
//               />

//               <div className="flex flex-col items-center   gap-2">
//                 <div
//                   className="self-stretch text-[#1E1B1B] font-semibold mx-[125px] w-[309px] "
//                   style={{
//                     fontFamily: "Montserrat",
//                     fontSize: "36.226px",
//                     lineHeight: "normal",
//                   }}
//                 >
//                   {data[showInCard[1]?.title.toLowerCase().replace(" ", "_")]}
//                 </div>
//                 <p
//                   className="self-stretch text-[#747171] font-semibold mx-[135px] w-[330px]"
//                   style={{
//                     fontFamily: "Montserrat",
//                     fontSize: "21.127px",
//                     lineHeight: "normal",
//                   }}
//                 >
//                   {`${data[showInCard[2]?.title.toLowerCase().replace(" ", "_")]}, 
//                   ${data[showInCard[3]?.title.toLowerCase().replace(" ", "_")]}`}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col items-start w-[331.805px] gap-[16.212px]">
//               {/* Loop through the showincart properties */}
//               {profile.showincart && profile.showincart.includes("email") && (
//                 <div className="flex items-center gap-[18.374px] ml-[83px] mr-[105px]">
//                   <span>
//                     {" "}
//                     <HiOutlineEnvelope />
//                   </span>
//                   <a
//                     href={`mailto:${data[showInCard[4]?.title.toLowerCase().replace(" ", "_")]}`}
//                     className="text-[#3D6EEE] font-[Montserrat] text-[19.454px] normal-case font-normal underline decoration-solid decoration-0 text-underline-offset-auto"
//                   >
//                     {data[showInCard[4]?.title.toLowerCase().replace(" ", "_")]}
//                   </a>
//                 </div>
//               )}
//               {profile.showincart && profile.showincart.includes("phone") && (
//                 <div className="w-full max-w-[600px] flex items-center gap-[18.374px] ml-[83px] mr-[223px]">
//                   <span>
//                     {" "}
//                     <IoCallOutline />
//                   </span>
//                   <span className="text-[#4E4E4E] font-[Montserrat] text-[19.454px] font-normal normal-case leading-normal">
//                     {data[showInCard[5]?.title.toLowerCase().replace(" ", "_")] || ""}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: Employment Details */}
//           <div className="w-[640px] h-[799px] drop-shadow-[rgba(216,_216,_216,_0.25)_-4px_4px_23.3px] flex-shrink-0 rounded-[21px] bg-white">
//             <h2 className="self-stretch text-[#9F9F9F] font-[Montserrat] text-[30px] font-medium normal-case leading-normal border-b-2 pb-2 mb-6 mx-[47px] mt-[36px]">
//               {settings?.peopleDirectory?.HeaderTitle || "Details"} 
//             </h2>
//             <div className="space-y-4 text-sm ml-[51px] pr-[183.31px]">
//               {/* Loop through the employmentDetails properties */}
//               <div className="grid grid-cols-1 sm:grid-cols-[240px_50px_1fr] gap-y-4">
//                 {/* Date of Joining */}

//                 {showInProfile.map((profile, index) => (
//                   <>
//                     <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
//                       {profile?.title}
//                     </div>
//                     <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
//                       :
//                     </div>
//                     <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
//                       {data[profile?.title.toLowerCase().replace(" ", "_")]}
//                     </div>
//                   </>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoCallOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem(`profileData_${id}`);
    const storedSettings = localStorage.getItem(`profileSettings_${id}`);

    if (storedData) setData(JSON.parse(storedData));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, [id]);

  if (!data || !settings) return <p>Loading...</p>;

  const showInCard = settings?.showInCard || [];
  const showInProfile = settings?.showInProfile || [];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* Back Arrow at the Top Left */}
      {/* <IoMdArrowBack
        className="text-[37px] text-black cursor-pointer absolute top-[120px] left-[70px]"
        onClick={() => navigate(-1)}
      /> */}

      <div className="w-[1357px] h-[872px] flex-shrink-0 rounded-[25px] bg-[#FAFAFA]">
        <div className="inline-flex items-start gap-[50px] mt-[38px] mb-[35px] ml-[85px] mr-[85px]">

          {/* Left: Profile Card */}
          <div
            className="w-[497px] h-[668px] flex-shrink-0 rounded-[21px] bg-white my-[60.5px]"
            style={{
              filter: "drop-shadow(-4px 4px 23.3px rgba(216, 216, 216, 0.25))",
            }}
          >
            <div className="w-[338.18px] h-[441px] flex-shrink-0">
              <img
                src={data[showInCard[0]?.title.toLowerCase().replace(" ", "_")]}
                alt={data[showInCard[1]?.title.toLowerCase().replace(" ", "_")]}
                className="w-[338.18px] h-[338.18px] rounded-full bg-lightgray bg-cover bg-center bg-no-repeat mt-[44px] mx-[79px]"
              />

              <div className="flex flex-col items-center gap-2">
                <div className="self-stretch text-[#1E1B1B] font-semibold mx-[125px] w-[309px]"
                  style={{ fontFamily: "Montserrat", fontSize: "36.226px" }}>
                  {data[showInCard[1]?.title.toLowerCase().replace(" ", "_")]}
                </div>
                <p className="self-stretch text-[#747171] font-semibold mx-[135px] w-[330px]"
                  style={{ fontFamily: "Montserrat", fontSize: "21.127px" }}>
                  {`${data[showInCard[2]?.title.toLowerCase().replace(" ", "_")]}, 
                  ${data[showInCard[3]?.title.toLowerCase().replace(" ", "_")]}`}
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col items-start w-[331.805px] gap-[16.212px]">
              {showInCard[4].title !== "" && (
                <div className="flex items-center gap-[18.374px] ml-[83px] mr-[105px]">
                  <HiOutlineEnvelope />
                  <a
                    href={`mailto:${data[showInCard[4]?.title.toLowerCase().replace(" ", "_")]}`}
                    className="text-[#3D6EEE] font-[Montserrat] text-[19.454px] font-normal underline"
                  >
                    {data[showInCard[4]?.title.toLowerCase().replace(" ", "_")]}
                  </a>
                </div>
              )}
              {showInCard[5].title !== "" && (
                <div className="w-full max-w-[600px] flex items-center gap-[18.374px] ml-[83px] mr-[223px]">
                  <IoCallOutline />
                  <span className="text-[#4E4E4E] font-[Montserrat] text-[19.454px] font-normal">
                    {data[showInCard[5]?.title.toLowerCase().replace(" ", "_")] || ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Employment Details */}
          <div className="w-[640px] h-[799px] drop-shadow-[rgba(216,_216,_216,_0.25)_-4px_4px_23.3px] flex-shrink-0 rounded-[21px] bg-white">
            <h2 className="self-stretch text-[#9F9F9F] font-[Montserrat] text-[30px] font-medium normal-case leading-normal border-b-2 pb-2 mb-6 mx-[47px] mt-[36px]">
              {settings?.peopleDirectory?.HeaderTitle || "Details"}
            </h2>
            <div className="space-y-4 text-sm ml-[51px] pr-[183.31px]">
              <div className="grid grid-cols-1 sm:grid-cols-[240px_50px_1fr] gap-y-4">
                {showInProfile.map((profile, index) => (
                  <React.Fragment key={index}>
                    <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                      {profile.title}
                    </div>
                    <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                      :
                    </div>
                    <div className="text-[#808080] font-Montserrat text-[19.696px] leading-normal">
                      {data[profile.title.toLowerCase().replace(" ", "_")]}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
