import React from "react";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";


const SocialIcons = () => {
  return (
    <div
      style={{
        width: "100%",
        padding: "20px 80px",
        background: "#F1FDE7",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
        display: "flex",
        alignItems: "center",
      }}

    >
      <div className="flex items-center">
        <div
        className="flex items-center"
          style={{
            fontSize: "18px",
            color: "#020811",
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: 500 }}>© </span>2025
          CEOITBOX TECH SERVICES LLP All Rights Reserved
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <a
          href="https://www.instagram.com/ceoitbox/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={25} color="#020811" className="socialIcons" />
        </a>

        <a
          href="https://www.youtube.com/@SanjeevJainCBX"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IoLogoYoutube size={25} color="#020811" className="socialIcons" />
        </a>

        <a
          href="https://www.facebook.com/ceoitbox/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF size={25} color="#020811" className="socialIcons" />
        </a>

        <a
          href="https://www.linkedin.com/in/sjtns"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedinIn size={25} color="#020811" className="socialIcons" />
        </a>
      </div>
    </div>
  );
};

export default SocialIcons;
