import React, {useContext} from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import GoogleSignin from "./components/GoogleSignin";
import { UserProvider, UserContext } from "./context/UserContext";
import Header from "./components/Header";
import Table from "./components/Table";
import Setting from "./components/Setting";
import Dashboard from "./components/Dashboard";
import TestLogin from "./components/TestLogin";
import Portfolio from "./components/Portfolio";
import InteractiveList from "./components/InteractiveList";
import InteractiveListView from "./components/InteractiveListView";
import PeopleTable from "./components/people_directory/PeopleTable";
import PeopleDirectoryPreView from "./components/people_directory/PeopleDirectoryPreview";
import PeopleDirectoryView from "./components/people_directory/PeopleDirectoryView";
import ProfilePage from "./components/people_directory/ProfilePage";
import VideoGallaryView from "./components/video_gallary/VideoGallaryView";
import Testing1 from "./components/Testing1";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";


// Layout Component
const Layout = () => (
  <Provider store={appStore}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#598931", // green
        },
      }}
    >
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mt-[80px]">
        <Outlet />
      </div>
    </ConfigProvider>
  </Provider>
);

// Define the router configuration
const appRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signin", element: <GoogleSignin /> },
      { path: "/:id/edit", element: <Table /> },
      { path: "/:id/view", element: <Table /> },
      { path: "/setting", element: <Setting /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/login", element: <TestLogin /> },
      { path: "/interactiveList", element: <InteractiveList /> },
      { path: "/interactiveListView", element: <InteractiveListView /> },
      { path: "/peopledirectory", element: <PeopleTable /> },
      { path: "/peopleDirectoryPreView", element: <PeopleDirectoryPreView /> },
      { path: "/peopleDirectoryView", element: <PeopleDirectoryView /> },
      { path: "/videoGallaryView", element: <VideoGallaryView /> },
      { path: "/testing1", element: <Testing1 /> },
      { path: "/profile/:id", element: <ProfilePage /> },
    ],
  },
  { path: "/Test", element: <Portfolio /> },
]);

// App Component
const App = () => {


  return (
      <RouterProvider router={appRouter} />
  )
};

export default App;
