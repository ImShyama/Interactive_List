
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { HOST } from "../../utils/constants";
import axios from "axios";
import Cookies from "js-cookie";
import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";

const LandingPage = () => {
  const navigate = useNavigate();

  // Function to handle button click
 
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
    <div className="landing-page">
       <HeroSection />
       <ContentSection />
    </div>
  );
};

export default LandingPage;
