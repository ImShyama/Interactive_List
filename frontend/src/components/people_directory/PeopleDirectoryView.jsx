import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'antd';
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoCallOutline } from "react-icons/io5";
import { CgArrowsExpandRight } from "react-icons/cg";
import { MdOutlineStar } from "react-icons/md";
// import TitleBarView from "./TitleBarView";
import profile1 from "../../assets/images/p1.png"
import profile2 from "../../assets/images/p2.png"
import profile3 from "../../assets/images/p3.png"
import profile4 from "../../assets/images/p4.png"
import profile5 from "../../assets/images/p5.png"
import profile6 from "../../assets/images/p6.png"
import profile7 from "../../assets/images/p7.png"
import profile8 from "../../assets/images/p8.png"
import profile9 from "../../assets/images/p9.png"
import profile10 from "../../assets/images/p10.png"
import { data } from "../../utils/InetractiveList_DumyData";

export const dummyData = [
  {

    id: 1,
    name: "Aliberia Prince",
    role: "Developer",
    department: "Development",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile1,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    hasStar: true,
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]

  },
  {
    id: 2,
    name: "Aliberia Prince",
    role: "UI/UX Designer",
    department: "Development",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile2,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    hasStar: true,
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]

  },
  {
    id: 3,
    name: "Aliberia Prince",
    role: "Marketing Manager",
    department: "Marketing",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile3,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    hasStar: true,
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]
  },
  {
    id: 4,
    name: "Aliberia Prince",
    role: "Head HR",
    department: "HR",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile4,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    hasStar: true,
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]

  },
  {
    id: 5,
    name: "Aliberia Prince",
    role: "UI/UX Designer",
    department: "Development",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile5,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]
  },
  {
    id: 6,
    name: "Aliberia Prince",
    role: "Developer",
    department: "Development",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile6,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]
  },
  {
    id: 7,
    name: "Aliberia Prince",
    role: "Marketing Manager",
    department: "Marketing",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile7,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]

  },
  {
    id: 8,
    name: "Aliberia Prince",
    role: "Head HR",
    department: "HR",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile8,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]

  },
  {
    id: 9,
    name: "Aliberia Prince",
    role: "Developer",
    department: "Development",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile9,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]
  },
  {
    id: 10,
    name: "Aliberia Prince",
    role: "UI/UX Designer",
    department: "Development",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile10,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]

  },
  {
    id: 11,
    name: "Aliberia Prince",
    role: "UI/UX Designer",
    department: "Development",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile4,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]
  },
  {
    id: 12,
    name: "Aliberia Prince",
    role: "Developer",
    department: "Development",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile5,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]

  },
  {
    id: 13,
    name: "Aliberia Prince",
    role: "Marketing Manager",
    department: "Marketing",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile6,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]
  },
  {
    id: 14,
    name: "Aliberia Prince",
    role: "UI/UX Designer",
    department: "Development",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile7,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]
  },
  {
    id: 15,
    name: "Aliberia Prince",
    role: "Head HR",
    department: "HR",
    email: "aliberiaprince@gmail.com",
    phone: "+91 6874521458",
    image: profile1,
    joiningDate: "20-Dec-2014",
    experience: "05",
    pf: "258741393",
    uan: "654871369",
    esi: "A5148365",
    branch: "Delhi",
    manager: "Madan",
    discScore: "-",
    discProfile: "-",
    reportsTo: "Madan",
    kpiLink: "https://drive.hahcu.bhuveu",
    birthDate: "24-May-1986",
    gender: "Male",
    emergencyContact: "Ramesh - 9874521635",
    showincart: ["image", "name", "role", "department", "email", "phone"],
    employmentDetails: ["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergencyContact"]
  },

  // Additional dummy data...
];

const PeopleDirectoryView = ({ 
  data,
  headers,
  tempHeader,
  filteredData,
  setFilteredData }) => {

  const [visitedProfiles, setVisitedProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const savedProfiles = JSON.parse(localStorage.getItem('visitedProfiles')) || [];
  //   setVisitedProfiles(savedProfiles);
  // }, []);

  // const handleProfileClick = (id) => {
  //   if (!visitedProfiles.includes(id)) {
  //     const updatedProfiles = [...visitedProfiles, id];
  //     setVisitedProfiles(updatedProfiles);
  //     localStorage.setItem('visitedProfiles', JSON.stringify(updatedProfiles));
  //   }
  //   navigate(`/profile/${id}`);
  // };

  // console.log("Visited Profiles:", visitedProfiles);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  console.log({ paginatedData });

  const showInCard = ["picture", "name", "department", "email_address", "contact"];

  return (
    <div className="px-6 py-4">
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Scrollable Grid View */}
        <div style={{ width: '100%', overflowX: 'auto', maxHeight: '600px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-3 w-full">
            {paginatedData.map((person) => (
              <div key={person.id} className="relative group">
                {/* Icon Section */}
                <div className="absolute top-[24px] left-[10px] right-[10px] flex justify-end px-4">
                  {/* <a
                    href="#!"
                    onClick={() => handleProfileClick(person.id)}
                    className={`w-[24px] h-[24px] flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-colors duration-300 ${visitedProfiles.includes(person.id) ? 'text-[#497626]' : 'text-gray-500 hover:text-[#497626]'}`}
                  >
                    <CgArrowsExpandRight />
                  </a> */}
                  {person.hasStar && <MdOutlineStar className="w-[24px] h-[24px] text-[#3D6EEE]" />}
                </div>

                {/* Profile Card */}
                <div className="flex flex-col items-center justify-center bg-[#FBFBFB] rounded-[24px] shadow p-4 gap-2">
                  <img
                    className="w-20 h-20 rounded-full mb-3 object-cover"
                    src={person[showInCard[0]]}
                    alt={`${person[showInCard[1]]}'s Profile`}
                  />
                  <h2 className="text-sm font-medium text-gray-900">{person[showInCard[1]]}</h2>
                  <p className="text-xs text-gray-600">{person.role}</p>
                  <p className="text-xs text-gray-600">{person[showInCard[2]]}</p>
                  <div className="flex items-center w-full mt-2 gap-2">
                    <HiOutlineEnvelope className="ml-8" />
                    <a href={`mailto:${person[showInCard[3]]}`} className="text-blue-500 text-xs underline">
                      {person[showInCard[3]]}
                    </a>
                  </div>
                  <div className="flex items-center w-full mt-1 gap-2">
                    <IoCallOutline className="ml-8" />
                    <p className="text-xs text-gray-600">{person[showInCard[4]]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'right', marginTop: '16px' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            showSizeChanger
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PeopleDirectoryView;
