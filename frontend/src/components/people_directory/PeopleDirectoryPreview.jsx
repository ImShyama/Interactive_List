import React, { useState, useEffect } from "react";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoCallOutline } from "react-icons/io5";
import { CgArrowsExpandRight } from "react-icons/cg";
import { MdOutlineStar } from "react-icons/md";
import TitleBarPreview from "./TitleBarPreview";
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

import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Pagination } from "antd";

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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
  },
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
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
    employmentDetails: [
      "joiningDate",
      "experience",
      "pf",
      "uan",
      "esi",
      "branch",
      "manager",
      "discScore",
      "discProfile",
      "reportsTo",
      "kpiLink",
      "birthDate",
      "gender",
      "emergencyContact",
    ],
  },
  
  // Additional dummy data...
];

// const starprofile=[1, 3, 7, 12];
// const showincart =["image", "name", "role", "department", "email", "phone"];
// const employmentDetails=["joiningDate", "experience", "pf", "uan", "esi", "branch", "manager", "discScore", "discScore", "discProfile", "reportsTo", "kpiLink", "birthDate", "gender", "emergency"];

// const PeopleDirectoryPreView = () => {
//   const [visitedProfiles, setVisitedProfiles] = useState([]);
//   const navigate = useNavigate();
//   const [Data, setData] = useState([]);
//   // const [rowsPerPage, setRowsPerPage] = useState(10); // Initialize rowsPerPage
//   useEffect(() => {
//     if (dummyData) {
//       setData(dummyData);
//     }
//   }, []);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5); // Make rowsPerPage a state if you want to change it dynamically
  
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const paginatedData = Data.slice(startIndex, startIndex + rowsPerPage);
  
//   const handlePageChange = (page, pageSize) => {
//     setCurrentPage(page); // Update currentPage
//     setRowsPerPage(pageSize); // Update rowsPerPage if the page size changes
//   };
  
//   // Load visitedProfiles from localStorage on component mount
//   useEffect(() => {
//     const savedProfiles =
//       JSON.parse(localStorage.getItem("visitedProfiles")) || [];
//     setVisitedProfiles(savedProfiles);
//     console.log("Loaded visitedProfiles from localStorage:", savedProfiles); // Debug: Check loaded profiles
//   }, []);

//   const handleProfileClick = (id) => {
//     console.log("Clicked profile ID:", id); // Debug: Check clicked ID

//     if (!visitedProfiles.includes(id)) {
//       const updatedProfiles = [...visitedProfiles, id];
//       setVisitedProfiles(updatedProfiles); // Update state
//       localStorage.setItem("visitedProfiles", JSON.stringify(updatedProfiles)); // Update localStorage immediately
//       console.log("Updated visitedProfiles:", updatedProfiles); // Debug: Check updated array
//     }

//     navigate(`/profile/${id}`);
//   };

//   // To reset data

//   // const handleResetData = () => {
//   //   // Clear visited profiles from localStorage
//   //   localStorage.removeItem('visitedProfiles');

//   //   // Reset visitedProfiles state to empty array
//   //   setVisitedProfiles([]);
//   // };

//   return (
//     <div className="px-6 py-4">
//       {/* TitleBar Section */}
//       <div>
//         <TitleBarPreview />
//       </div>

//       {/* Reset Button to clear localStorage and reset state */}
//       {/* <button
//         onClick={handleResetData}
//         className="bg-red-500 text-white p-2 rounded-md mt-4"
//       >
//         Reset Data
//       </button> */}

//       {/* Grid View */}
//       <div className="mx-2 sm:mx-4 lg:mx-">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-3 w-full h-[293px]">
//           {paginatedData.map((person) => (
//             <div key={person.id} className="relative group">
//               {/* Icons Section */}
//               <div className="absolute top-[24px] left-[10px] right-[10px] flex justify-between px-4 ">
//                 <a
//                   href="#!" // Placeholder URL
//                   onClick={() => handleProfileClick(person.id)}
//                   className={`w-[24px] h-[24px] flex items-center justify-center 
//                  transition-colors duration-300 cursor-pointer opacity-0 group-hover:opacity-100 
//                   ${
//                     visitedProfiles.includes(person.id)
//                       ? "text-[#497626]"
//                       : "text-gray-500 hover:text-[#497626]"
//                   }`}
//                   aria-label="Expand Icon"
//                 >
//                   <CgArrowsExpandRight />
//                 </a>

//                 {/* Conditionally render the star icon */}
//                 {person.hasStar && (
//                   <MdOutlineStar className="w-[24px] h-[24px] text-[#3D6EEE]" />
//                 )}
//               </div>

//               {/* Profile Card Section */}
//               <div className="flex flex-col items-center justify-center bg-[#FBFBFB] rounded-[24.154px] shadow-[rgba(167,167,167,0.1)_-6px_6px_0px_0px] p-[12.882px_45.892px] gap-[8.051px]">
//                 {/* Profile Image */}
//                 <img
//                   className="w-20 h-20 rounded-full mb-3 object-cover"
//                   src={person.image}
//                   alt={`${person.name}'s Profile`}
//                 />

//                 {/* Profile Details */}
//                 <h2 className="text-sm font-medium text-gray-900 font-Montserrat">
//                   {person.name}
//                 </h2>
//                 <p className="text-xs text-gray-600 font-Montserrat">
//                   {person.role},
//                 </p>
//                 <p className="text-xs text-gray-600 font-Montserrat">
//                   {person.department}
//                 </p>

//                 {/* Email */}
//                 <div className="flex items-start w-full gap-[13.69px] mt-2">
//                   <HiOutlineEnvelope />
//                   <a
//                     href={`mailto:${person.email}`}
//                     className="text-blue-500 text-xs underline"
//                   >
//                     {person.email}
//                   </a>
//                 </div>

//                 {/* Phone */}
//                 <div className="flex items-start w-full gap-[13.69px] mt-1">
//                   <IoCallOutline />
//                   <p className="text-xs text-gray-600">{person.phone}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Move Pagination here */}
//         <div className="flex justify-end mt-6">
//           <Pagination
//             current={currentPage}
//             pageSize={rowsPerPage}
//             total={Data.length}
//             onChange={handlePageChange}
            
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PeopleDirectoryPreView;

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
    navigate(`/profile/${id}`);
  };

  // Pagination logic
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div className="px-6 py-4">
      <div>
        <TitleBarPreview appName={"People Directory"} />
      </div>

      {/* Grid View */}
      <div className="mx-2 sm:mx-4 lg:mx-">
        <div
          style={{ width: '100%', overflowX: 'auto', maxHeight: '600px' }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-3 w-full"
        >
          {paginatedData.map((person) => (
            <div key={person.id} className="relative group">
              <div className="absolute top-[24px] left-[10px] right-[10px] flex justify-between px-4">
                <a
                  href="#!"
                  onClick={() => handleProfileClick(person.id)}
                  className={`w-[24px] h-[24px] flex items-center justify-center 
                    transition-colors duration-300 cursor-pointer opacity-0 group-hover:opacity-100 
                    ${visitedProfiles.includes(person.id) ? 'text-[#497626]' : 'text-gray-500 hover:text-[#497626]'}`}
                >
                  <CgArrowsExpandRight />
                </a>
                {person.hasStar && (
                  <MdOutlineStar className="w-[24px] h-[24px] text-[#3D6EEE]" />
                )}
              </div>

              <div className="flex flex-col items-center justify-center bg-[#FBFBFB] rounded-[24px] shadow p-4 gap-2">
                <img
                  className="w-20 h-20 rounded-full mb-3 object-cover"
                  src={person.image}
                  alt={`${person.name}'s Profile`}
                />
                <h2 className="text-sm font-medium text-gray-900">{person.name}</h2>
                <p className="text-xs text-gray-600">{person.role}</p>
                <p className="text-xs text-gray-600">{person.department}</p>
                <div className="flex items-center w-full mt-2 gap-2">
                  <HiOutlineEnvelope className="ml-8" />
                  <a href={`mailto:${person.email}`} className="text-blue-500 text-xs underline">
                    {person.email}
                  </a>
                </div>
                <div className="flex items-center w-full mt-1 gap-2">
                  <IoCallOutline className="ml-8"/>
                  <p className="text-xs text-gray-600">{person.phone}</p>
                </div>
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

// use state use effect for visible profile and starred profile
// const PeopleDirectoryView = () => {
//   const [visitedProfiles, setVisitedProfiles] = useState([]);
//   const [starredProfiles, setStarredProfiles] = useState([]); // To store starred profile ids

//   // Load visited and starred profiles from localStorage on component mount
//   useEffect(() => {
//     const savedVisitedProfiles = JSON.parse(localStorage.getItem("visitedProfiles"));
//     const savedStarredProfiles = JSON.parse(localStorage.getItem("starredProfiles"));
//     if (savedVisitedProfiles) {
//       setVisitedProfiles(savedVisitedProfiles);
//     }
//     if (savedStarredProfiles) {
//       setStarredProfiles(savedStarredProfiles);
//     }
//   }, []);

//   // Update localStorage whenever visitedProfiles or starredProfiles changes
//   useEffect(() => {
//     localStorage.setItem("visitedProfiles", JSON.stringify(visitedProfiles));
//   }, [visitedProfiles]);

//   useEffect(() => {
//     localStorage.setItem("starredProfiles", JSON.stringify(starredProfiles));
//   }, [starredProfiles]);

//   const handleProfileClick = (id) => {
//     if (!visitedProfiles.includes(id)) {
//       setVisitedProfiles((prev) => [...prev, id]);
//     }
//   };

//   const handleStarClick = (id) => {
//     if (starredProfiles.includes(id)) {
//       setStarredProfiles(starredProfiles.filter((profileId) => profileId !== id));
//     } else {
//       setStarredProfiles((prev) => [...prev, id]);
//     }
//   };

//   return (
//     <div className="px-6 py-4">
//       {/* TitleBar Section */}
//       <div>
//         <TitleBar />
//       </div>

//       {/* Grid View */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-3 w-full h-[293px]">
//         {dummyData.map((person) => (
//           <div key={person.id} className="relative">
//             {/* Icons Section */}
//             <div className="absolute top-[24px] left-[10px] right-[10px] flex justify-between px-4">
//               <a
//                 href="#!"
//                 onClick={() => handleProfileClick(person.id)}
//                 className={`w-[24px] h-[24px] flex items-center justify-center
//                   transition-colors duration-300 cursor-pointer
//                   ${visitedProfiles.includes(person.id) ? "text-[#497626]" : "text-gray-500 hover:text-[#497626]"}
//                 `}
//                 aria-label="Expand Icon"
//               >
//                 <CgArrowsExpandRight />
//               </a>

//               {/* Star Icon */}
//               <MdOutlineStar
//                 className={`w-[24px] h-[24px] ${starredProfiles.includes(person.id) ? "text-[#3D6EEE]" : "text-transparent"}`}
//                 onClick={() => handleStarClick(person.id)}
//               />
//             </div>

//             {/* Profile Card Section */}
//             <div className="flex flex-col items-center justify-center bg-[#FBFBFB] rounded-[24.154px] shadow-[rgba(167,167,167,0.1)_-6px_6px_0px_0px] p-[12.882px_45.892px] gap-[8.051px]">
//               {/* Profile Image */}
//               <img
//                 className="w-20 h-20 rounded-full mb-3 object-cover"
//                 src={person.image}
//                 alt={`${person.name}'s Profile`}
//               />

//               {/* Profile Details */}
//               <h2 className="text-sm font-medium text-gray-900 font-Montserrat">{person.name}</h2>
//               <p className="text-xs text-gray-600 font-Montserrat">{person.role},</p>
//               <p className="text-xs text-gray-600 font-Montserrat">{person.department}</p>

//               {/* Email */}
//               <div className="flex items-start w-full gap-[13.69px] mt-2">
//                 <HiOutlineEnvelope />
//                 <a href={`mailto:${person.email}`} className="text-blue-500 text-xs underline">
//                   {person.email}
//                 </a>
//               </div>

//               {/* Phone */}
//               <div className="flex items-start w-full gap-[13.69px] mt-1">
//                 <IoCallOutline />
//                 <p className="text-xs text-gray-600">{person.phone}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PeopleDirectoryView;
