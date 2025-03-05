import React, { useState, useEffect } from "react";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoCallOutline } from "react-icons/io5";
import { CgArrowsExpandRight } from "react-icons/cg";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";
import TitleBarPreview from "../TitleBarPreview";
import profile1 from "../../assets/images/p1.png";
import profile2 from "../../assets/images/p2.png";
import profile3 from "../../assets/images/p3.png";
import profile4 from "../../assets/images/p4.png";
import profile5 from "../../assets/images/p5.png";
import profile6 from "../../assets/images/p6.png";
import profile7 from "../../assets/images/p7.png";
import profile8 from "../../assets/images/p8.png";
import profile9 from "../../assets/images/p9.png";
import profile10 from "../../assets/images/p10.png";
import { dummyData_People, settings } from "../../utils/PeopleDirectory_DumyData";

import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Pagination } from "antd";
import { getDriveThumbnail, handleImageError } from "../../utils/globalFunctions";

export const dummyData = dummyData_People;

const PeopleDirectoryPreView = () => {
  const [visitedProfiles, setVisitedProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [data, setData] = useState([]);
  const navigate = useNavigate(); 

  // Load data on component mount
  useEffect(() => {
    if (dummyData) {
      setData(dummyData);
    }
  }, []);

  // Load visited profiles from localStorage
  useEffect(() => {
    const savedProfiles = JSON.parse(localStorage.getItem('visitedProfiles')) || [];
    setVisitedProfiles(savedProfiles);
  }, []);

  const handleProfileClick = (id) => {
    if (!visitedProfiles.includes(id)) {
      const updatedProfiles = [...visitedProfiles, id];
      setVisitedProfiles(updatedProfiles);
      localStorage.setItem('visitedProfiles', JSON.stringify(updatedProfiles));
    }

    // const filteredData = data.find((person) => person.key_id === id);

    const filteredData = dummyData.filter((profile) => { return profile.key_id == id })[0]
    
    // Store data and settings in localStorage
    localStorage.setItem(`profileData_${id}`, JSON.stringify(filteredData));
    localStorage.setItem(`profileSettings_${id}`, JSON.stringify(settings));

    // Open the profile in a new tab
    window.open(`/profile/${id}`, '_blank');
  };

  // const handleProfileClick = (id) => {
  //   console.log("Profile ID:", id);
  //   if (!visitedProfiles.includes(id)) {
  //     const updatedProfiles = [...visitedProfiles, id];
  //     setVisitedProfiles(updatedProfiles);
  //     localStorage.setItem('visitedProfiles', JSON.stringify(updatedProfiles));
  //   }

  //   // Filter data based on the clicked profile's ID
  //   const filteredData = dummyData.filter((profile)=>{ return profile.id == id})
  //   const settings = {
  //     "showInCard": [
  //         {
  //             "id": 1,
  //             "title": "Picture"
  //         },
  //         {
  //             "id": 2,
  //             "title": "Name"
  //         },
  //         {
  //             "id": 3,
  //             "title": "Role"
  //         },
  //         {
  //             "id": 4,
  //             "title": "Department"
  //         },
  //         {
  //             "id": 5,
  //             "title": "Email"
  //         },
  //         {
  //             "id": 6,
  //             "title": "Phone"
  //         }
  //     ],
  //     "showInProfile": [
  //         {
  //             "id": 1,
  //             "title": "Name"
  //         },
  //         {
  //             "id": 2,
  //             "title": "DOJ"
  //         },
  //         {
  //             "id": 3,
  //             "title": "Email"
  //         },
  //         {
  //             "id": 4,
  //             "title": "Department"
  //         },
  //         {
  //             "id": 5,
  //             "title": "Designation"
  //         },
  //         {
  //             "id": 6,
  //             "title": "Skills & Expertise"
  //         },
  //         {
  //             "id": 7,
  //             "title": "Birth date"
  //         },
  //         {
  //             "id": 8,
  //             "title": "UAN"
  //         },
  //         {
  //             "id": 9,
  //             "title": "ESI"
  //         },
  //         {
  //             "id": 10,
  //             "title": "Birth date"
  //         },
  //         {
  //             "id": 11,
  //             "title": "Branch location"
  //         },
  //         {
  //             "id": 12,
  //             "title": "Manager"
  //         },
  //         {
  //             "id": 13,
  //             "title": "Gender"
  //         }
  //     ],
  // }

  //   // Navigate to profile page
  //   navigate(`/profile/${id}`, { state: { data: filteredData, settings: settings } });
  // };

  // Pagination logic

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div className="px-6 py-4">
      <div>
        <TitleBarPreview appName={"People Directory"} spreadSheetID={"1X4urz9wKsAuWufXzy9UZKH3KIJmyFKDEM9O8aNied8c"} spreadSheetName={"Data"} />
      </div>

      {/* Grid View */}
      <div className="mx-2 sm:mx-4 lg:mx-">
        <div
          style={{ width: '100%', overflowX: 'auto', maxHeight: '600px' }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-3 w-full"
        >
          {paginatedData.map((person) => (
            <div key={person.key_id} className="relative group">
              <div className="absolute top-[24px] left-[10px] right-[10px] flex justify-between px-4">
                <a
                  onClick={() => handleProfileClick(person.key_id)}
                  className={`w-[24px] h-[24px] flex items-center justify-center 
                    transition-colors duration-300 cursor-pointer opacity-0 group-hover:opacity-100 
                    ${visitedProfiles.includes(person.key_id) ? 'text-[#497626]' : 'text-gray-500 hover:text-[#497626]'}`}
                >
                  <CgArrowsExpandRight />
                </a>
                {person.hasStar && (
                  <MdOutlineStar className="w-[24px] h-[24px] text-[#3D6EEE]" />
                )}
              </div>

              {/* Profile Card */}

              <div className="flex flex-col items-center justify-center bg-[#FBFBFB] rounded-[24px] shadow p-4 gap-2">
                <img
                  className="w-20 h-20 rounded-full mb-3 object-cover"
                  src={getDriveThumbnail(person[settings.showInCard[0].title.toLowerCase().replace(/\s/g, "_")])}
                  alt={`${person[settings.showInCard[1].title.toLowerCase().replace(/\s/g, "_")]}'s Profile`}
                  // onError={(e) => handleImageError(e)}
                />
                <h2 className="text-sm font-medium text-gray-900">{person[settings.showInCard[1].title.toLowerCase().replace(/\s/g, "_")]}</h2>
                <p className="text-xs text-gray-600">{person[settings.showInCard[2].title.toLowerCase().replace(/\s/g, "_")]}</p>
                <p className="text-xs text-gray-600">{person[settings.showInCard[3].title.toLowerCase().replace(/\s/g, "_")]}</p>
                <div className="flex items-center w-full mt-2 gap-2">
                  <HiOutlineEnvelope className="ml-8 shrink-0 text-gray-500" />
                  <a
                    href={`mailto:${person[settings.showInCard[4].title.toLowerCase().replace(/\s/g, "_")]}`}
                    className="text-blue-500 text-xs no-underline truncate max-w-[150px] sm:max-w-[250px] md:max-w-[300px] overflow-hidden whitespace-nowrap"
                    title={person[settings.showInCard[4].title.toLowerCase().replace(/\s/g, "_")]} // Tooltip to show full email on hover
                  >
                    {person[settings.showInCard[4].title.toLowerCase().replace(/\s/g, "_")]}
                  </a>
                </div>

                <div className="flex items-center w-full mt-2 gap-2">
                  <FaWhatsapp className="ml-8 text-gray-500" />
                  <a
                    href={`https://wa.me/${person[settings.showInCard[5].title.toLowerCase().replace(/\s/g, "_")].replace(/\D/g, '')}`} // Removes non-numeric characters
                    target="_blank" // Opens in a new tab
                    rel="noopener noreferrer" // Security best practice
                    className="text-blue-500 text-xs no-underline truncate max-w-[150px] sm:max-w-[250px] md:max-w-[300px] overflow-hidden whitespace-nowrap"
                    title={person[settings.showInCard[5].title.toLowerCase().replace(/\s/g, "_")]} // Tooltip to show full number on hover
                  >
                    {person[settings.showInCard[5].title.toLowerCase().replace(/\s/g, "_")]}
                  </a>
                </div>

                {/* <div className="flex items-center w-full mt-1 gap-2">
                  <IoCallOutline className="ml-8" />
                  <p className="text-xs text-gray-600">{person.phone}</p>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-6">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data.length}
            showSizeChanger
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PeopleDirectoryPreView;

