

import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext"; // Ensure this path is correct
import axios from "axios";
import Cookies from "js-cookie";
import { HOST } from "../../utils/constants";
import Profile from "../Profile"; // Reuse existing Profile component
import { handleImageError } from "../../utils/globalFunctions";
const WebsiteHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, setRole } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const profileRef = useRef(null);
  const profileImageRef = useRef(null);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
  ];

  // Fetch user data if token exists
  useEffect(() => {
    if (token) {
      axios
        .get(`${HOST}/getuser`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then(({ data: res }) => {
          if (!res.error) {
            setUser(res);
            setRole(res.role);
          } else if (res.error === "Token expired. Please log in again.") {
            Cookies.remove("token");
            navigate("/signin");
          }
        })
        .catch((err) => {
          Cookies.remove("token");
          navigate("/signin");
        });
    }
  }, [token]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        profileImageRef.current &&
        !profileImageRef.current.contains(event.target)
      ) {
        setIsProfileVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full px-12 py-8 z-50 h-10 flex items-center justify-between fixed top-0 left-0 right-0">
      {/* Left Nav */}
      <div className="flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`text-[16px] font-medium ${
              location.pathname === item.path
                ? "text-main border-b-[3px] border-main pb-1"
                : "text-gray-500 hover:text-black transition"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Center Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <img
          src="https://i.ibb.co/sbwvB0L/logo-png-1-1.webp"
          alt="Logo"
          className="h-6 w-6"
        />
        <span className="font-semibold text-black text-xl tracking-wide">
          INTERACTIVE
        </span>
      </div>

      {/* Right Side */}

      <div className="relative">
        {user ? (
          <>
            <img
              // src={user?.profilePhoto || "/default-profile.png"}
              src={user?.profileUrl || "https://i.ibb.co/qC5F7XW/image25.jpg"}
              alt="Profile"
              ref={profileImageRef}
              onClick={() => setIsProfileVisible((prev) => !prev)}
              onError={(e) => handleImageError(e)}
              className="w-12 h-12 rounded-full cursor-pointer object-cover"
            />
          
            {isProfileVisible && (
              <div
                ref={profileRef}
                className="absolute right-[45px] mt-[-10px] "
              >
                <Profile
                  name={user?.name}
                  email={user?.email}
                  closeProfile={() => setIsProfileVisible(false)}
                />
              </div>
            )}
          </>
        ) : (
          <Link
            to="/signin"
            className="bg-main hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold text-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default WebsiteHeader;
