// src/App.js
import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, BrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google"
import ReactDOM from 'react-dom/client';
import GoogleSignin from './components/GoogleSignin'
import Home from './components/Home'
import Navbar from './components/Navbar'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { CLIENT_ID } from './utils/constants';
import { UserContext, UserProvider } from './context/UserContext';
import Cookies from "js-cookie"

function App() {
  const [cookies, removeCookie] = useCookies([]);
  const [auth, setAuth] = useState(false);
  const { token, setToken, setProfile, profile } = useContext(UserContext);
  const nav = useNavigate();

  const handleLogout = () => {
    removeCookie("token");
    setAuth(false);
  };

  useEffect(() => {
    if (!token) return;
    try {
      axios
        .get("http://localhost:4000/getUserData", {
          headers: {
            authorization: "Bearer " + token
          }
        })
        .then(({ data: res }) => {
          if (res.error) {
            alert(res.error)
            nav("/signin")
            return
          }
          setProfile(res)
        });
    } catch (err) {
      console.log(err.message);
    }
  }, []);
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      if (code == null) return;
      axios
        .get("http://localhost:4000/auth/google/callback?code=" + code)
        .then(({ data: res }) => {
          if (res.error) {
            nav("/signin")
            alert(res.error)
            return
          }
          console.log(res)
          if (!token && !profile) {
            setToken(res.token);
            setProfile(res.body);
          }
          Cookies.set("token", res.token)
          nav("/home")
        });
    } catch (err) {
      console.log(err.message);
    }
  }, []);



  useEffect(() => {
    try {
      axios
        .post("http://localhost:4000/getSheetData", {
          spreadSheetLink: "https://docs.google.com/spreadsheets/d/1Z5FFXPsi_1wrq-DiuDtK-qfZz_pC6za0ZJXR4JHyIbs/edit?pli=1#gid=1009149727",
          spreadSheetName: "Sheet10"
        }, {
          headers: {
            authorization: "Bearer " + token
          }
        })
        .then(({ data: res }) => {
          if (res.error) {
            alert(res.error)
            nav("/signin")
            return
          }
          setProfile(res)
        });
    } catch (err) {
      console.log(err.message);
    }
  }, [])






  // if token exists then render the original component else navigate to signin


  //   !token ? <Navigate to={"/"}/> :




  return (
    <div className="App">
      <Navbar auth={auth} />
      <Routes>
        <Route path="/" element={<></> } />
        <Route path="/home" element={!token ? <Navigate to={"/signin"} /> : <Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        <Route path="/signin" element={token ? <Navigate to={"/"} /> : <GoogleSignin />} />
      </Routes>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);
