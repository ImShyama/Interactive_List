import {
  FaFacebook,
  FaYoutube,
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa6";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const FooterSection = () => {
  const serviceSections = [
    {
      title: "Services1",
      items: [
        "Product Demo",
        "Online Workshop",
        "G-Suit Services",
        "Alumni recordings",
      ],
    },
    {
      title: "Services2",
      items: [
        "Consulting",
        "Web Development",
        "SEO Services",
        "Marketing Analysis",
      ],
    },
    {
      title: "Services3",
      items: [
        "Cloud Hosting",
        "Cyber Security",
        "IT Support",
        "Data Analytics",
      ],
    },
    {
      title: "Services4",
      items: [
        "E-commerce Solutions",
        "Mobile App Development",
        "AI & ML Services",
        "Blockchain Solutions",
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-b border-gray-700 pb-6">
          {/* Services Sections */}
          {serviceSections.map((section, index) => (
            <div key={index}>
              <h3 className="self-stretch text-white font-poppins text-[20.585px] font-semibold">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-[#9AA1A7] font-poppins text-[14.243px] font-normal leading-normal hover:text-white cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Contact Details */}

          <div>
            <h3 className="self-stretch text-white font-poppins text-[20.585px] font-semibold">
              Contact Details
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[#9AA1A7] font-poppins text-[14.243px] font-normal leading-normal ">
                <FaPhone className="w-4 h-4 hover:text-white cursor-pointer" />{" "}
                98547156XX
              </li>
              <li className="flex items-center gap-2 text-[#9AA1A7] font-poppins text-[14.243px] font-normal leading-normal">
                <FaEnvelope className="w-4 h-4 hover:text-white cursor-pointer" />{" "}
                officialwebsite.com
              </li>
              <li className="flex items-center gap-2 text-[#9AA1A7] font-poppins text-[14.243px] font-normal leading-normal">
                <FaMapMarkerAlt className="w-5 h-5 hover:text-white cursor-pointer" />{" "}
                23 Main Street, Anytown, USA, 12345
              </li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-between mt-6">
          <div className="flex space-x-4 ">
            <FaFacebook className="text-2xl hover:text-white cursor-pointer" />
            <FaYoutube className="text-2xl hover:text-white cursor-pointer" />
            <FaXTwitter className="text-2xl hover:text-white cursor-pointer" />
            <FaLinkedin className="text-2xl hover:text-white cursor-pointer" />
            <FaInstagram className="text-2xl hover:text-white cursor-pointer" />
          </div>

          {/* Copyright Section */}
          <div className="text-sm text-gray-500 ">
            Copyright &copy; 2025 All rights reserved | by CEOITBOX
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
