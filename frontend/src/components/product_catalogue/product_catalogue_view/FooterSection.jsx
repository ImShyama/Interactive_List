import {
  FaFacebook,
  FaYoutube,
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa6";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const FooterSection = ({ settingData }) => {
  const footerSettings = settingData?.productCatalogue?.footerSettings;
  const footerHeaders = footerSettings?.footers;
  const footerColor = footerSettings?.footerColor;
  const footerBgColor = footerSettings?.footerBackground;
  const socialMediaSettings = footerSettings?.socialMediaSettings || {};

  // Convert footerHeaders object into an array of sections
  // const footerSections = Object.entries(footerHeaders || {}).map(([key, value]) => {
  //   const { Heading } = value;
  //   return {
  //     title: Heading.SubHeading1,
  //     items: [
  //       Heading.SubHeading2,
  //       Heading.SubHeading3,
  //       Heading.SubHeading4,
  //       Heading.SubHeading5
  //     ].filter(item => item !== "") // Filter out empty strings
  //   };
  // });

  // Convert footerHeaders object into an array of sections
const footerSections = Object.entries(footerHeaders || {}).map(([key, value]) => {
  const { Heading } = value;
  
  // Helper function to create item object with link and label
  const createItem = (link, label) => {
    if (!link && !label) return null;
    return {
      link: link || "",
      label: label || link || "" // Use label if available, otherwise fallback to link
    };
  };
  
  return {
    title: Heading.SubHeading1,
    items: [
      createItem(Heading.SubHeading2, Heading.SubHeading2Label),
      createItem(Heading.SubHeading3, Heading.SubHeading3Label),
      createItem(Heading.SubHeading4, Heading.SubHeading4Label),
      createItem(Heading.SubHeading5, Heading.SubHeading5Label)
    ].filter(item => item !== null) // Filter out null items
  };
});

  // Function to get all social media links
  const getSocialMediaLinks = () => {
    const links = [];
    
    // Add standard social media links
    if (socialMediaSettings.facebook) {
      links.push({ icon: <FaFacebook />, url: socialMediaSettings.facebook });
    }
    if (socialMediaSettings.youtube) {
      links.push({ icon: <FaYoutube />, url: socialMediaSettings.youtube });
    }
    if (socialMediaSettings.twitter) {
      links.push({ icon: <FaXTwitter />, url: socialMediaSettings.twitter });
    }
    if (socialMediaSettings.linkedin) {
      links.push({ icon: <FaLinkedin />, url: socialMediaSettings.linkedin });
    }
    if (socialMediaSettings.instagram) {
      links.push({ icon: <FaInstagram />, url: socialMediaSettings.instagram });
    }

    // Add custom social media links
    Object.entries(socialMediaSettings)
      .filter(([key]) => key.startsWith('socialMedia'))
      .forEach(([key, url]) => {
        if (url) { // Only add if URL is not empty
          links.push({ icon: <FaGlobe />, url });
        }
      });

    return links;
  };

  console.log({ settingData, footerSettings, footerColor, footerBgColor });
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
    <footer
      className="py-10"
      style={{ backgroundColor: footerBgColor, color: footerColor }}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div
          className="grid grid-cols-2 md:grid-cols-6 gap-6 border-b pb-6"
          style={{ borderColor: footerColor }}
        >
          {/* Services Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3
                className="self-stretch font-poppins text-[20.585px] font-semibold"
                style={{ color: footerColor }}
              >
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
              //    <li
              //    key={i}
              //    className="font-poppins text-[14.243px] font-normal leading-normal cursor-pointer"
              //    style={{ color: footerColor }}
              //  >
              //    {item.link ? (
              //      <a 
              //        href={item.link}
              //        className="hover:underline"
              //        style={{ color: footerColor }}
              //      >
              //        {item.label}
              //      </a>
              //    ) : (
              //      <span>{item.label}</span>
              //    )}
              //  </li>

              <li
  key={i}
  className="font-poppins text-[14.243px] font-normal leading-normal cursor-pointer"
  style={{ color: footerColor }}
>
  {item.link ? (
    <a 
      href={item.link}
      target="_blank"           // 👈 Opens in new tab
      rel="noopener noreferrer" // 👈 Security best practice
      className="hover:underline"
      style={{ color: footerColor }}
    >
      {item.label}
    </a>
  ) : (
    <span>{item.label}</span>
  )}
</li>

                ))}
              </ul>
            </div>
          ))}

          {/* Contact Details */}
          <div className="flex flex-col">
            <h3
              className="self-stretch font-poppins text-[20.585px] font-semibold"
              style={{ color: footerColor }}
            >
              Contact Details
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 font-poppins text-[14.243px] font-normal leading-normal" style={{ color: footerColor }}>
                <FaPhone className="w-4 h-4 cursor-pointer flex-shrink-0" />
                <span className="mt-px">{footerSettings?.contactSettings[1].text || "98547156XX"}</span>
              </li>
              <li className="flex items-center gap-2 font-poppins text-[14.243px] font-normal leading-normal" style={{ color: footerColor }}>
                <FaEnvelope className="w-4 h-4 cursor-pointer flex-shrink-0" />
                <span className="mt-px">{footerSettings?.contactSettings[2].text || "officialwebsite.com"}</span>
              </li>
              <li className="flex items-center gap-2 font-poppins text-[14.243px] font-normal leading-normal" style={{ color: footerColor }}>
                <FaMapMarkerAlt className="w-4 h-4 cursor-pointer flex-shrink-0" />
                <span className="mt-px">{footerSettings?.contactSettings[0].text || "23 Main Street, Anytown, USA, 12345"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-between mt-6">
          <div className="flex space-x-4">
            {getSocialMediaLinks().map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: footerColor }}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright Section */}
          <div className="text-sm" style={{ color: footerColor }}>
            Copyright &copy; {new Date().getFullYear()} All rights reserved | by CEOITBOX
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
