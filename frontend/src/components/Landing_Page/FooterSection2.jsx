import React from "react";
import SocialIcons from "./SocialIcons"; // Import SocialIcons
import "./Footer.css";
const FooterSection = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "auto",
          background: "#020811",
          padding: "50px 40px",
        }}
      >
        <div
          style={{
            width: "90%",
            margin: "auto",
          }}
        >
          <div
            className="footerContainer"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                className="logo-div"
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <div className="left-panel-svg">
                  <img
                    className="logo_img"
                    src="https://i.ibb.co/sbwvB0L/logo-png-1-1.webp"
                    alt="Logo"
                  />
                </div>

                <span style={{ color: "#fff", fontSize: "32px" }}>Interact</span>
              </div>

              <div>
                {/* <p
                  className="footer-subtext"
                  style={{
                    color: "#bed900",
                    fontSize: "22px",
                    marginBottom: "20px",
                  }}
                >
                  Bring Google Sheets to Life with Our Custom App.
                </p> */}
              </div>
            </div>

            <div
              className="footerItemBox"
              style={{ display: "flex", gap: "100px" }}
            >
              <div className="needHelpBox">
                <p
                  style={{
                    color: "#FFFFFF",
                    fontSize: "24px",
                    fontWeight: 400,
                    lineHeight: "30px",
                    textTransform: "uppercase",
                    marginBottom: 1,
                    letterSpacing: "0.05em",
                  }}
                >
                  Company
                </p>
                <p
                  style={{
                    color: "#C3C8CA",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "27px",
                    marginTop: "5px",
                  }}
                >
                  CEOITBOX TECH SERVICES LLP
                </p>
                <p
                  style={{
                    color: "#C3C8CA",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "27px",
                    marginTop: "5px",
                    width: "200px",
                  }}
                >
                  293, Dhanmill Road, Chattarpur Hills, New Delhi-110074
                </p>
                {/* <p
                    style={{
                      color: "#21C0F9",
                      marginTop: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    Privacy & Policy
                  </p> */}
              </div>

              <div className="needHelpBox">
                <p
                  style={{
                    color: "#FFFFFF",
                    fontSize: "24px",
                    fontWeight: 400,
                    lineHeight: "30px",
                    textTransform: "uppercase",
                    marginBottom: 1,
                    letterSpacing: "0.05em",
                  }}
                >
                  Need Help?
                </p>
                <p
                  style={{
                    // color: "#21C0F9",
                    color: "#C3C8CA",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "27px",
                    cursor: "pointer",
                  }}
                  className="footerLinksItems"
                >
                  <a
                    href="https://ceoitbox.com/"
                    style={{ color: "inherit", textDecoration: "none" }}
                    target="_blank"
                  >
                    {" "}
                    About Us
                  </a>
                </p>
                <p
                  style={{
                    color: "#C3C8CA",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "27px",
                    marginTop: "5px",
                    cursor: "pointer",
                  }}
                  className="footerLinksItems"
                >
                  <a
                    style={{ textDecoration: "none", color: "inherit" }}
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=access@ceoitbox.in&su=Enquiry on CBXMEET&body="
                    target="_blank"
                  >
                    Contact Us
                  </a>
                </p>
                {/* <p style={{ lineHeight: "27px" }}>
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#21C0F9",
                        marginTop: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        textDecoration: "none",
                      }}
                    >
                      Privacy & Policy
                    </a>
                  </p> */}
                <a
                  style={{ textDecoration: "none", color: "inherit" }}
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p
                    style={{
                      color: "#C3C8CA",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "27px",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                    className="footerLinksItems"
                  >
                    Privacy & Policy
                  </p>
                </a>
                {/* <a
                  style={{ textDecoration: "none", color: "inherit" }}
                  href="#features"
                >
                  <p
                    style={{
                      color: "#C3C8CA",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "27px",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                    className="footerLinksItems"
                  >
                    Features
                  </p>
                </a>
                <a
                  style={{ textDecoration: "none", color: "inherit" }}
                  href="#faqs"
                >
                  <p
                    style={{
                      color: "#C3C8CA",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "27px",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                    className="footerLinksItems"
                  >
                    FAQ`s
                  </p>
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Include Social Icons Below the Footer */}
      <SocialIcons />
    </>
  );
};

export default FooterSection;
