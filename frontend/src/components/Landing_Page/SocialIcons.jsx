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
        padding: "20px 40px",
        background: "#598931",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          color: "#FFF",
          fontWeight: 500,
          marginLeft: "50px",
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: 500 }}>©</span>2024
        INTERACT All Rights Reserved
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginRight: "50px",
        }}
      >
        <a
          href="https://www.instagram.com/ceoitbox/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={25} color="#FFF" className="socialIcons" />
        </a>

        <a
          href="https://www.youtube.com/@SanjeevJainCBX"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IoLogoYoutube size={25} color="#FFF" className="socialIcons" />
        </a>

        <a
          href="https://www.facebook.com/ceoitbox/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF size={25} color="#FFF" className="socialIcons" />
        </a>

        <a
          href="https://www.linkedin.com/in/sjtns"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedinIn size={25} color="#FFF" className="socialIcons" />
        </a>
      </div>
    </div>
  );
};

export default SocialIcons;
