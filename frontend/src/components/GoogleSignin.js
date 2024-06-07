import React, { useState, useEffect, useContext } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Signin = ({ login }) => {
  return (
    <div className="form_container_main">
      <div className="form_container">
        <h2>Signin With Google</h2>
        <button onClick={login}>Sign in with Google 🚀 </button>

      </div>
    </div>
  )
}

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

function GoogleSignin() {
  return <div className="form_container_main">
    <div className="form_container">
      <h2>Signin With Google</h2>
      <button onClick={() => {
        window.location.href = "http://localhost:4000/auth/google"
      }}>Sign in with Google 🚀 </button>

    </div>
  </div>
}

export default GoogleSignin;
