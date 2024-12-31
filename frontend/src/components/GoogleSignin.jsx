import React, { useState, useEffect, useContext } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import google from "../assets/google.png";
import { HOST } from "../utils/constants";

const Sigin = () => {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center mt-[100px] gap-[50px] w-[1114px] h-[337px] p-[53px_18px] flex-shrink-0 rounded-[30px] bg-gradient-to-r from-[#FFF] to-[#FFFAF1] shadow-[30px_13px_42.6px_rgba(152,151,168,0.04)]">
        <div className="flex flex-col items-center gap-[5px] w-[386px]">
          <span className="w-[397px] text-[#111] font-poppins text-[48px] font-semibold leading-normal">
            Welcome Back!
          </span>
          <span className="self-stretch text-center text-[var(--text,#787D89)] font-poppins text-[20px] font-medium leading-normal">
            Please Sign In with - Google
          </span>
        </div>
        <div
          className="flex justify-center items-center gap-[47.286px] w-[285.5px] h-[82.973px] flex-shrink-0 rounded-[17.844px] border-[0.892px] border-[#D3DAE7] cursor-pointer"
          onClick={() => {
            window.location.href = `${HOST}/auth/google`;
          }}
        >
          <div className="flex items-start gap-[9.814px]">
            <img src={google} />
            {/* <div className="w-[28.55px] h-[28.55px] bg-[url('https://s3-alpha-sig.figma.com/img/8e42/4139/9baefbe8f8feffab0fe67682e140e1b1?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nhxMeV0S4hZMFnDbU0egzbfDvezCnHSdL5XG-wGQ4O-YIIcopATaxdjKEjsgj6dd0n81rBhQUrXF-8G7QmLIte02yWZR~l38ywtAesfd3n~buNCe~Tw5mW~c9HPA8a-FPCNUrbaf19MYiFo3h5nsA66nAqqJGjN4feoZC352LMib4C3wKJJiREuNTxoTrMiYKSCibTl16cJmIYCmamZe-eXLdv3pvW4PhFjJrAx2z~3jm7-~T3fQkD~x2cAHBP8F1NMZZdofZxBRLwhZ5oQIfuozwj3vJPsNowPUuJbyhFZq9eCgC1L3DsYlTY7jMN~xiKGAQO-LzsahmcG4sANO9A__')] bg-lightgray bg-center bg-cover bg-no-repeat"></div> */}
            <div className="font-poppins text-[21.412px] font-medium bg-[var(--gradation, linear-gradient(180deg, #00155E 0%, #04142E 100%))] bg-clip-text text-black">
              Google
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function GoogleSignin() {
  const { token, setToken, setProfile, profile } = useContext(UserContext);
  const nav = useNavigate();

  // useEffect(() => {
  //   // Check for token in cookies
  //   const tokenCookie = Cookies.get("token");
  //   const profileCookie = Cookies.get("profile");

  //   console.log("Cookies:", { token: tokenCookie, profile: profileCookie });

  //   if (tokenCookie && profileCookie) {
  //     setToken(tokenCookie);
  //     setProfile(JSON.parse(profileCookie));
  //     nav("/dashboard");
  //     return;
  //   }

  //   if (tokenCookie && profileCookie) {
  //     setToken(tokenCookie);
  //     try {
  //       setProfile(JSON.parse(profileCookie));
  //     } catch (error) {
  //       console.error("Error parsing profileCookie:", error);
  //       // Handle the error or reset the profile cookie
  //       Cookies.remove("profile");
  //       setProfile(null);
  //     }
  //     nav("/dashboard");
  //     return;
  //   }

  //   try {
  //     const searchParams = new URLSearchParams(location.search);
  //     const code = searchParams.get("code");
  //     if (code == null) return;
  //     axios
  //       .get(`${HOST}/auth/google/callback?code=` + code, {
  //         withCredentials: true,
  //       })
  //       .then(({ data: res }) => {
  //         if (res.error) {
  //           nav("/");
  //           alert(res.error);
  //           return;
  //         }
  //         console.log("res", res);
  //         if (!token && !profile) {
  //           setToken(res.token);
  //           setProfile(res.body);
  //         }
  //         // Save token and profile to cookies
  //         Cookies.set("token", res.token, { expires: 6 });
  //         // Cookies.set("profile", JSON.stringify(res.body));
  //         nav("/dashboard");
  //       });
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // }, []);

  return (
    <div className="flex justify-center h-[90vh]">
      <Sigin />
    </div>
  );
}

export default GoogleSignin;
