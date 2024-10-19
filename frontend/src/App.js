
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
import Testing from "./components/Testing";
import { Provider } from "react-redux"
import appStore from "./utils/appStore";
import { ConfigProvider } from "antd";

const Layout = () => {
  return (
    <Provider store={appStore}>
      <>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#FFA500', // Orange
            },
          }}
        >
          <Header />
          <Outlet />
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
        path: "/testing",
        element: <Testing />,
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
