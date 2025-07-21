import React, { useRef, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ConfigProvider } from "antd";
import WebsiteHeader from "./WebsiteHeader";
import testimonialBg from "../../assets/images/testimonial_background.png";
import primaryBg from "../../assets/images/primary_background.png"; // ✅ New image import

const WebsiteLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isLoadingPage = location.pathname === "/loading";

  const heroRef = useRef(null);
  const [section, setSection] = useState("loading");
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    if (!isLandingPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const current = heroRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [isLandingPage]);


  useEffect(() => {
    if (!isLandingPage) {
      setSection("hero"); // reset to default when navigating away from landing page
    }
  }, [location.pathname]);
  
  // ✅ Determine background image based on section
  const getBackgroundStyle = () => {
    if (section === "testimonial") {
      return {
        backgroundImage: `url(${testimonialBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    } else {
      return {
        backgroundImage: `url(${primaryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
  };
 console.log("Section:", section);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#598931",
        },
      }}
    >
      <div
        className="relative min-h-screen overflow-hidden"
        style={getBackgroundStyle()}
      >
        {/* ✅ Show custom hero background ONLY if we're on landing page AND section is 'hero' */}
        {isLandingPage && section === "hero" && isHeroVisible && (
          <div className="absolute inset-0 flex z-0 w-full">
            <div className="w-[6%]" />
            <div className="w-[94%] flex h-full overflow-hidden">
              <div className="w-1/2 bg-white h-full rounded-l-[60px]" />
              <div className="w-1/2 bg-[#e9fdf3] h-full rounded-l-[60px]" />
            </div>
          </div>
        )}

        <div className="relative z-10 top-20">
          {!isLoadingPage && <WebsiteHeader />}
          {/* {section !== "loading" && <WebsiteHeader />} */}

          <ToastContainer position="top-right" autoClose={3000} />
          <main className="pt-0">
            <Outlet context={{ heroRef, section, setSection }} />
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default WebsiteLayout;
