import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Home = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);

  // useEffect(() => {
  //   console.log("Cookies:", cookies);
  //   if (!cookies.token) {
  //     console.log("No token found, navigating to signin page.");
  //     navigate("/signin");
  //   } else {
  //     console.log("Token found, staying on home page.");
  //   }
  // }, [cookies.token, navigate]);

  return (
    <div className="">
      <h4>Welcome Home</h4>
    </div>
  );
};

export default Home;
