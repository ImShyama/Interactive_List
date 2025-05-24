

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { HOST } from "../../utils/constants";
import axios from "axios";
import Cookies from "js-cookie";
import HeroSection from "./HeroSection";
import AllProducts from "./AllProducts";
import Testimonial from "./Testimonial";
import LoadingPage from "./LoadingPage";
import { notifyError } from "../../utils/notify";
import { initial } from "lodash";

const LandingPage = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showTestimonial, setShowTestimonial] = useState(false);

  console.log("Landing Page");
  const { setSection } = useOutletContext();
  const {
    setToken,
    setProfile,
    profile,
    initialLoadingCount,
    setInitialLoadingCount,
  } = useContext(UserContext);
  const nav = useNavigate();
  const [scrollLocked, setScrollLocked] = useState(false);

  const temporarilyLockScroll = () => {
    setScrollLocked(true);
    setTimeout(() => {
      setScrollLocked(false);
    }, 800); // Adjust as needed
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowLoading(false);
        setShowHero(true); // Transition to the Hero section on scroll
        window.removeEventListener("scroll", handleScroll);
        // setInitialLoadingCount(false);
        console.log("Initial loading count:", initialLoadingCount);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!showLoading && showHero) setSection("hero");
    else if (showProducts) setSection("products");
    else if (showTestimonial) setSection("testimonial");
  }, [showLoading, showHero, showProducts, showTestimonial, setSection]);

  useEffect(() => {
    const tokenCookie = Cookies.get("token");
    const profileCookie = Cookies.get("profile");

    if (tokenCookie && profileCookie) {
      setToken(tokenCookie);
      setProfile(JSON.parse(profileCookie));
      nav("/dashboard");
      return;
    }

    try {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      if (!code) return;

      axios
        .get(`${HOST}/auth/google/callback?code=${code}`, {
          withCredentials: true,
        })
        .then(({ data: res }) => {
          if (res.error) {
            nav("/");
            notifyError(res.error);
            return;
          }

          if (!profile) {
            setToken(res.token);
            setProfile(res.body);
          }

          Cookies.set("token", res.token, { expires: 6 });
          nav("/dashboard");
        });
    } catch (err) {
      console.error(err.message);
    }
  }, [profile]);

  const handleExitHero = () => {
    setShowHero(false);
    setShowProducts(true);
  };

  const handleExitProducts = () => {
    setShowProducts(false);
    setShowTestimonial(true);
  };

  return (
    <div className="landing-page overflow-scroll">
      {showLoading && initialLoadingCount && <LoadingPage />}
      {!showLoading && showHero && <HeroSection onExit={handleExitHero} />}
      {/* {!showLoading && showProducts && <AllProducts onExit={handleExitProducts} />} */}
      {!showLoading && showProducts && (
        // <AllProducts
        //   onExit={handleExitProducts}
        //   onBack={() => {
        //     setShowProducts(false);
        //     setShowHero(true);
        //   }}
        // />
        <AllProducts
          onExit={() => {
            temporarilyLockScroll();
            setShowProducts(false);
            setShowTestimonial(true);
          }}
          onBack={() => {
            temporarilyLockScroll();
            setShowProducts(false);
            setShowHero(true);
          }}
          scrollLocked={scrollLocked}
        />
      )}

      {/* {!showLoading && showTestimonial && <Testimonial />} */}

      {!showLoading && showTestimonial && (
        // <Testimonial
        //   onBack={() => {
        //     setShowTestimonial(false);
        //     setShowProducts(true); // Go back to AllProducts
        //   }}
        // />
        <Testimonial
          onBack={() => {
            temporarilyLockScroll();
            setShowTestimonial(false);
            setShowProducts(true);
          }}
          scrollLocked={scrollLocked}
        />
      )}
    </div>
  );
};

export default LandingPage;
