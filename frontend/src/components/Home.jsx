
import React, { useState, useEffect, useContext } from "react";
import seatimage from "../assets/images/seatimg.png"
import "./home.css";
import { HOST } from "../utils/constants";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const [showSections, setShowSections] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const [showParts, setShowParts] = useState([false, false, false, false, false]); // Five parts

  useEffect(() => {
     // Prevent scrolling
     document.documentElement.style.overflow = "hidden";
     document.body.style.overflow = "hidden";
    // Slide in the left section after 500ms
    const sectionTimer = setTimeout(() => {
      setShowSections(true);
    }, 500);

    // Show right section circle after 1s (delay)
    const circleTimer = setTimeout(() => {
      setShowCircle(true);
    }, 500);

    // Reveal each part of the seat image sequentially
    const partTimers = [
      setTimeout(() => setShowParts((prev) => [true, false, false, false, false]), 1500),  // Part 1
      setTimeout(() => setShowParts((prev) => [true, true, false, false, false]), 2000),   // Part 2
      setTimeout(() => setShowParts((prev) => [true, true, true, false, false]), 2500),    // Part 3
      // setTimeout(() => setShowParts((prev) => [true, true, true, true, false]), 3000),     // Part 4
      setTimeout(() => setShowParts((prev) => [true, true, true, true, true]), 3000),      // Part 5
    ];

    return () => {
      clearTimeout(sectionTimer);
      clearTimeout(circleTimer);
      partTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const { token, setToken, setProfile, profile } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    // Check for token in cookies
    const tokenCookie = Cookies.get("token");
    const profileCookie = Cookies.get("profile");

    console.log("Cookies:", { token: tokenCookie, profile: profileCookie });

    if (tokenCookie && profileCookie) {
      setToken(tokenCookie);
      setProfile(JSON.parse(profileCookie));
      nav("/dashboard");
      return;
    }

    if (tokenCookie && profileCookie) {
      setToken(tokenCookie);
      try {
        setProfile(JSON.parse(profileCookie));
      } catch (error) {
        console.error("Error parsing profileCookie:", error);
        // Handle the error or reset the profile cookie
        Cookies.remove("profile");
        setProfile(null);
      }
      nav("/dashboard");
      return;
    }

    try {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      if (code == null) return;
      axios
        .get(`${HOST}/auth/google/callback?code=` + code, {
          withCredentials: true,
        })
        .then(({ data: res }) => {
          if (res.error) {
            nav("/");
            alert(res.error);
            return;
          }
          console.log("res", res);
          if (!token && !profile) {
            setToken(res.token);
            setProfile(res.body);
          }
          // Save token and profile to cookies
          Cookies.set("token", res.token, { expires: 6 });
          // Cookies.set("profile", JSON.stringify(res.body));
          nav("/dashboard");
        });
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  return (
    <div className=" w-[100vw] h-[100vh] flex overflow-hidden bg-[#FFF] ">
    {/* Left Section - Text and Button */}
    <div
      className={`left-section w-[40%] flex flex-col items-start justify-center pl-[76px] mt-[-181px] ${
        showSections ? "slide-in" : ""
      }`}
    >
      <p className="text-[2vw] font-medium text-black font-[Poppins] leading-[1.4]">
        Connect your business data to Google Sheets for a seamless website
        display.
      </p>
      <button
        className="mt-[72.47px] w-[16vw] h-[6vw] flex justify-center items-center gap-[16px] rounded-[4vw] bg-[#598931]"
        onClick={() => alert("Get Started Clicked!")}
      >
        <span className="text-white font-poppins text-[35.109px] font-medium leading-normal">
          Get Started
        </span>
      </button>
    </div>

    {/* Right Section - Circle with Seat Image Reveal */}
    <div
      className={`right-section w-[60%] flex justify-center items-center mt-[-70px] ${
        showCircle ? "fade-in" : ""
      }`}
    >
      <div className="w-[38vw] h-[38vw] rounded-full bg-[#F1FDE7] shadow-lg ">
        <div className="seat-wrapper abosolute w-[100%] h-[100%] flex justify-center items-center">
          <img
            src={seatimage}
            alt="Seat Image"
            className={`seat-image  scale-[1.2] translate-y-[80px] ${
              showParts[0] ? "part-1" : ""
            } ${showParts[1] ? "part-2" : ""} ${
              showParts[2] ? "part-3" : ""
            } ${showParts[3] ? "part-4" : ""} ${
              showParts[4] ? "part-5" : ""
            }`}
          />
        </div>
      </div>
    </div>
  </div>
);
};
export default Home;
