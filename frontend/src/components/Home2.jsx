
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
    <div className="w-[1920px] h-[1080px] flex items-center justify-center bg-[#FFF] overflow-hidden">
      {/* Left Section - Text and Button */}
      <div className={`left-section flex flex-col items-start gap-[72.47px] w-[808.493px] -mt-[350px] ${showSections ? 'slide-in' : ''}`}>
        <p className="text-[47.558px] font-medium text-black font-[Poppins] leading-normal">
          Connect your business data to Google Sheets for a seamless website
          display.
        </p>
        <button
          className="flex w-[308px] h-[109px] p-[16px] justify-center items-center gap-[16px] rounded-[80px] bg-[#598931]"
          onClick={() => alert("Get Started Clicked!")}
        >
          <span className="text-white font-poppins text-[35.109px] font-medium leading-normal">
            Get Started
          </span>
        </button>
      </div>

      {/* Right Section - Circle with Seat Image Reveal */}
      <div className={`right-section w-[949.511px] ${showCircle ? 'fade-in' : ''}`}>
        <div className="w-[849.511px] h-[849.511px] rounded-full bg-[#F1FDE7] shadow-lg ml-[50px] pt-[86px] -mt-[100px]">
          <div className="seat-wrapper">
            <img
              src={seatimage}
              alt="Seat Image"
              className={`seat-image ${showParts[0] ? 'part-1' : ''} ${showParts[1] ? 'part-2' : ''} ${showParts[2] ? 'part-3' : ''} ${showParts[3] ? 'part-4' : ''} ${showParts[4] ? 'part-5' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
