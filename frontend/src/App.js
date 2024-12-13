
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
import InteractiveList from "./components/InteractiveList";
import InteractiveListView from "./components/InteractiveListView";
import PeopleTable from "./components/people_directory/PeopleTable";
import PeopleDirectoryView from "./components/people_directory/PeopleDirectoryView";
import Testing from "./components/Testing";
import { Provider } from "react-redux"
import appStore from "./utils/appStore";
import { ConfigProvider } from "antd";
import Testing1 from "./components/Testing1";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import ProfilePage from "./components/people_directory/ProfilePage";
import { useEffect } from "react";

const Layout = () => {

  return (
    <Provider store={appStore}>
      <>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#598931', // green
            },
          }}
        >
          <Header />
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="mt-[80px]">
            <Outlet />
          </div>

        </ConfigProvider>
      </>
    </Provider>
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
        path: "/:id/edit",
        element: <Table />,
      },
      {
        path: "/:id/view",
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
      {
        path: "/interactiveList",
        element: <InteractiveList />,
      },
      {
        path: "/interactiveListView",
        element: <InteractiveListView />,
      },
      {
        path: "/peopledirectory",
        element: <PeopleTable />,
      },
      {
        path: "/peopleDirectoryView",
        element: <PeopleDirectoryView />,
      },
      {
        path: "/testing1",
        element: <Testing1 />,
      },
      {
        path: "/profile/:id",
        element: <ProfilePage />,
      }

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
