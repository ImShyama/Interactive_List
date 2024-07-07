
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import ReactDOM from "react-dom/client";
import GoogleSignin from "./components/GoogleSignin";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import Table from "./components/Table";
import Setting from "./components/Setting";
import Dashboard from "./components/Dashboard";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

// function App() {
//   const [cookies, removeCookie] = useCookies([]);
//   const [auth, setAuth] = useState(false);
//   const { token, setToken, setProfile, profile } = useContext(UserContext);
//   const nav = useNavigate();

//   const handleLogout = () => {
//     removeCookie("token");
//     setAuth(false);
//   };

//   useEffect(() => {
//     if (!token) return;
//     try {
//       axios
//         .get("http://localhost:4000/getUserData", {
//           headers: {
//             authorization: "Bearer " + token,
//           },
//         })
//         .then(({ data: res }) => {
//           if (res.error) {
//             alert(res.error);
//             nav("/signin");
//             return;
//           }
//           setProfile(res);
//         });
//     } catch (err) {
//       console.log("catch error", err.message);
//     }
//   }, []);

//   useEffect(() => {
//     try {
//       const searchParams = new URLSearchParams(location.search);
//       const code = searchParams.get("code");
//       if (code == null) return;
//       axios
//         .get("http://localhost:4000/auth/google/callback?code=" + code)
//         .then(({ data: res }) => {
//           if (res.error) {
//             nav("/signin");
//             alert(res.error);
//             return;
//           }
//           console.log(res);
//           if (!token && !profile) {
//             setToken(res.token);
//             setProfile(res.body);
//           }
//           Cookies.set("token", res.token);
//           nav("/home");
//         });
//     } catch (err) {
//       console.log(err.message);
//     }
//   }, []);

  // useEffect(() => {
  //   try {
  //     axios
  //       .post("http://localhost:4000/getSheetData", {
  //         spreadSheetLink: "https://docs.google.com/spreadsheets/d/1WGUEwH7oDjflqFMWh1RyRP1L2W__uv0jw0Y0MsDmL4M/edit#gid=0",
  //         spreadSheetName: "Sheet1"
  //       }, {
  //         headers: {
  //           authorization: "Bearer " + token
  //         }
  //       })
  //       .then(({ data: res }) => {
  //         if (res.error) {
  //           alert(res.error)
  //           nav("/signin")
  //           return
  //         }
  //         setProfile(res)
  //       });
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // }, [])

//   // if token exists then render the original component else navigate to signin

//   // !token ? <Navigate to={"/"}/> :

//   console.log("token", token);

//   return (
//     <div className="App">
//       {/* <Navbar auth={auth} /> */}
//       <Header />
//       <Routes>
//         <Route
//           path="/"
//           element={token ? <Navigate to={"/"} /> : <GoogleSignin />}
//         />
//         <Route
//           path="/home"
//           element={!token ? <Navigate to={"/signin"} /> : <Home />}
//         />
//         <Route
//           path="/signin"
//           element={token ? <Navigate to={"/"} /> : <GoogleSignin />}
//         />
//         <Route path="/table" element={<Table />} />
//         <Route path="/setting" element={<Setting />} />
//       </Routes>
//     </div>
//   );
// }

const appRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <GoogleSignin />,
      },
      {
        path: "/table",
        element: <Table />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <RouterProvider router={appRouter} />
  </UserProvider>
);
