import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { dummyData } from "./PeopleDirectoryView"; // Adjust path if necessary
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoCallOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate(); // Move it inside here
  useEffect(() => {
    const selectedProfile = dummyData.find(
      (person) => person.id === parseInt(id)
    );
    setProfile(selectedProfile);
  }, [id]);

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-10">
      {/* Back Arrow at the Top Left of the Page, Below Navbar */}
      <IoMdArrowBack
        className="text-[37px] text-black cursor-pointer absolute top-[120px] left-[70px]"
        onClick={() => navigate("/PeopleDirectoryPreView")} // You may try replacing this with a direct path like `/people-directory`
      />

      <div className="w-[1357px] h-[872px] flex-shrink-0 rounded-[25px] bg-[#FAFAFA]">
        {/* Profile and Details Section */}
        <div className="inline-flex items-start gap-[50px] mt-[38px] mb-[35px] ml-[85px] mr-[85px]">
          
          {/* Left: Profile Card */}
          <div
            className="w-[497px] h-[668px] flex-shrink-0 rounded-[21px] bg-white my-[60.5px]"
            style={{
              filter: "drop-shadow(-4px 4px 23.3px rgba(216, 216, 216, 0.25))",
              marginTop: '0px', // Adjust this margin-top value to shift the card upwards
            }}
          >
            <div className="w-[338.18px] h-[441px] flex-shrink-0">
              <img
                src={profile.image}
                alt={`${profile.name}'s Profile`}
                className="w-[338.18px] h-[338.18px] flex-shrink-0 rounded-full bg-lightgray bg-cover bg-center bg-no-repeat mt-[44px]  mx-[79px] "
              />

              <div className="flex flex-col items-center   gap-2">
                <h2
                  className="self-stretch text-[#1E1B1B] font-semibold mx-[94px] w-[309px] "
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: "36.226px",
                    lineHeight: "normal",
                  }}
                >
                  {profile.name}
                </h2>
                <p
                  className="self-stretch text-[#747171] font-semibold mx-[83px] w-[330px]"
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: "21.127px",
                    lineHeight: "normal",
                  }}
                >
                  {`${profile.role}, ${profile.department}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start w-[331.805px] gap-[16.212px]">
              {/* Loop through the showincart properties */}
              {profile.showincart && profile.showincart.includes("email") && (
                <div className="flex items-center gap-[18.374px] ml-[83px] mr-[105px]">
                  <span>
                    {" "}
                    <HiOutlineEnvelope />
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-[#3D6EEE] font-[Montserrat] text-[19.454px] normal-case font-normal underline decoration-solid decoration-0 text-underline-offset-auto"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.showincart && profile.showincart.includes("phone") && (
                <div className="w-full max-w-[600px] flex items-center gap-[18.374px] ml-[83px] mr-[223px]">
                  <span>
                    {" "}
                    <IoCallOutline />
                  </span>
                  <span className="text-[#4E4E4E] font-[Montserrat] text-[19.454px] font-normal normal-case leading-normal">
                    {profile.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Employment Details */}
          <div className="w-[640px] h-[799px] drop-shadow-[rgba(216,_216,_216,_0.25)_-4px_4px_23.3px] flex-shrink-0 rounded-[21px] bg-white">
            <h2 className="self-stretch text-[#9F9F9F] font-[Montserrat] text-[30px] font-medium normal-case leading-normal border-b-2 pb-2 mb-6 mx-[47px] mt-[36px]">
              Employment Details
            </h2>
            <div className="space-y-4 text-sm ml-[51px] pr-[183.31px]">
              {/* Loop through the employmentDetails properties */}
              <div className="grid grid-cols-1 sm:grid-cols-[240px_50px_1fr] gap-y-4">
                {/* Date of Joining */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("joiningDate") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        Date of Joining
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.joiningDate}
                      </div>
                    </>
                  )}

                {/* Year of Experience */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("experience") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        Year of Experience
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.experience}
                      </div>
                    </>
                  )}
                {/* PF */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("pf") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        PF
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.pf}
                      </div>
                    </>
                  )}

                {/* UAN */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("uan") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        UAN
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.uan}
                      </div>
                    </>
                  )}
                {/*ESI */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("esi") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        ESI
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.esi}
                      </div>
                    </>
                  )}

                {/* Branch location */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("branch") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        Branch location
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.branch}
                      </div>
                    </>
                  )}
                {/* Manager */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("manager") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        Manager
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.manager}
                      </div>
                    </>
                  )}

                {/* DISC score */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("discScore") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        DISC score
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.discScore}
                      </div>
                    </>
                  )}
                {/* DISC profile */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("discProfile") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        DISC profile
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.discProfile}
                      </div>
                    </>
                  )}

                {/* Reports To*/}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("reportsTo") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        Reports to
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.reportsTo}
                      </div>
                    </>
                  )}
                {/* KPI link */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("kpiLink") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        KPI & KRA link
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.kpiLink}
                      </div>
                    </>
                  )}

                {/* Birth Date*/}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("birthDate") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        Birth Date
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.birthDate}
                      </div>
                    </>
                  )}
                {/* Gender */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("gender") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        Gender
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.gender}
                      </div>
                    </>
                  )}

                {/* Emergency Contact */}
                {profile.employmentDetails &&
                  profile.employmentDetails.includes("emergencyContact") && (
                    <>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        Emergency No.
                      </div>
                      <div className="text-[#2F2F2F] font-Montserrat font-semibold text-[20px] leading-normal">
                        :
                      </div>
                      <div className="text-[#808080] font-Montserrat font-normal text-[19.696px] leading-normal">
                        {profile.emergencyContact}
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
