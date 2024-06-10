// src/App.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google"
import ReactDOM from 'react-dom/client';
import GoogleSignin from './components/GoogleSignin'
import Home from './components/Home'
import Navbar from './components/Navbar'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { CLIENT_ID } from './utils/constants';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';


function App() {
  const [cookies, removeCookie] = useCookies([]);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const verifyCookie = async () => {
      if (cookies.token) {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          { withCredentials: true }
        );
        const { status } = data;
        setAuth(status);
      }
    };
    verifyCookie();
  }, [cookies]);

  const handleLogout = () => {
    removeCookie("token");
    setAuth(false);
  };

  

  return (
    <div className="App">
       {/* <Navbar auth={auth} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        <Route path="/signin" element={<GoogleSignin />} />
        <Route path="/header" element={<Header />} />
      </Routes>
      
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
      <UserProvider>
      <App />
      </UserProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
