import React, { useState, useEffect, useContext } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// function GoogleSignin() {
//   const [user, setUser] = useState(null);
//   const { profile, setProfile } = useContext(UserContext);
//   // const [profile, setProfile] = useState(null);
//   const navigate = useNavigate();

//   const login = useGoogleLogin({
//     onSuccess: (codeResponse) => {
//       console.log("Login successful: ", codeResponse);
//       setUser(codeResponse);
//     },
//     onError: (error) => console.log("Login Failed:", error),
//   });

//   // Check for user info in cookies on component mount
//   useEffect(() => {
//     const userCookie = Cookies.get('user');
//     if (userCookie) {
//       const userInfo = JSON.parse(userCookie);
//       setUser({ access_token: userInfo.accessToken });
//       setProfile({
//         name: userInfo.name,
//         email: userInfo.email,
//         picture: userInfo.profileUrl,
//       });
//       navigate("/");
//     }
//   }, [setProfile]);

//   useEffect(() => {
//     if (user) {
//       axios
//         .get(
//           `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
//           {
//             headers: {
//               Authorization: `Bearer ${user.access_token}`,
//               Accept: "application/json",
//             },
//           }
//         )
//         .then((res) => {
//           setProfile(res.data);
//           console.log("profile",res.data);

//           // Save user details in cookies
//           Cookies.set('user', JSON.stringify({
//             accessToken: user.access_token,
//             name: res.data.name,
//             email: res.data.email,
//             profileUrl: res.data.picture
//           }));

//           console.log("user.access_token",user.access_token)

//           // Send user details to backend
//           axios.post('http://localhost:4000/GoogleSignin', {
//             accessToken: user.access_token,
//             name: res.data.name,
//             email: res.data.email,
//             profileUrl: res.data.picture
//           })
//           .then(response => {
//             console.log("User saved to MongoDB", response);
//             navigate("/");
//           })
//           .catch(error => {
//             console.log("Error saving user to MongoDB", error);
//           });

//         })
//         .catch((err) => {
//           setProfile(null);
//           console.log("err", err);
//         });
//     }
//   }, [user]);

//   const logOut = () => {
//     googleLogout();
//     setProfile(null);
//     Cookies.remove('user');
//   };

//   return (
//     <div>
//       {profile ? null : (
//         <Signin login={login} />
//       )}
//     </div>
//   );
// }

const Sigin = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-[50px] w-[1114px] h-[337px] p-[53px_18px] flex-shrink-0 rounded-[30px] bg-gradient-to-r from-[#FFF] to-[#FFFAF1] shadow-[30px_13px_42.6px_rgba(152,151,168,0.04)]">
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
            window.location.href = "http://localhost:4000/auth/google";
          }}
        >
          <div className="flex items-start gap-[9.814px]">
            <div className="w-[28.55px] h-[28.55px] bg-[url('https://s3-alpha-sig.figma.com/img/8e42/4139/9baefbe8f8feffab0fe67682e140e1b1?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nhxMeV0S4hZMFnDbU0egzbfDvezCnHSdL5XG-wGQ4O-YIIcopATaxdjKEjsgj6dd0n81rBhQUrXF-8G7QmLIte02yWZR~l38ywtAesfd3n~buNCe~Tw5mW~c9HPA8a-FPCNUrbaf19MYiFo3h5nsA66nAqqJGjN4feoZC352LMib4C3wKJJiREuNTxoTrMiYKSCibTl16cJmIYCmamZe-eXLdv3pvW4PhFjJrAx2z~3jm7-~T3fQkD~x2cAHBP8F1NMZZdofZxBRLwhZ5oQIfuozwj3vJPsNowPUuJbyhFZq9eCgC1L3DsYlTY7jMN~xiKGAQO-LzsahmcG4sANO9A__')] bg-lightgray bg-center bg-cover bg-no-repeat"></div>
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

  useEffect(() => {
    // Check for token in cookies
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
      if (code == null) return;
      axios
        .get("http://localhost:4000/auth/google/callback?code=" + code)
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
          Cookies.set("token", res.token);
          Cookies.set("profile", JSON.stringify(res.body));
          nav("/dashboard");
        });
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  return (
    <div className="flex justify-center">
      {/* <div className="form_container">
      <h2>Signin With Google</h2>
      <button onClick={() => {
        window.location.href = "http://localhost:4000/auth/google"
      }}>Sign in with Google 🚀 </button>

    </div> */}
      <Sigin />
    </div>
  );
}

export default GoogleSignin;
