import React, { createContext, useState } from 'react';
import Cookies from "js-cookie"
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isPCTSettings, setIsPCTSettings] = useState(false);
  const [categoryHeader, setCategoryHeader] = useState([]);

  return (
    <UserContext.Provider value={{ profile, setProfile, token, setToken, role, setRole, user, setUser, isPCTSettings, setIsPCTSettings, categoryHeader, setCategoryHeader }}>
      {children}
    </UserContext.Provider>
  );
};

