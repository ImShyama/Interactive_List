
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
import TestLogin from "./components/TestLogin";
import Portfolio from "./components/Portfolio";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};


const appRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <GoogleSignin />,
      },
      {
        path: "/interactivelist/:id",
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
      {
        path: "/login",
        element: <TestLogin />,
      },
      
    ],
    
  },
  {
    path: "/Test",
    element: <Portfolio />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <RouterProvider router={appRouter} />
  </UserProvider>
);
