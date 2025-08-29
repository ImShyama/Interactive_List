import React, { useContext, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import GoogleSignin from "./components/GoogleSignin";
import { UserProvider, UserContext } from "./context/UserContext";
import { HeaderVisibilityContext } from "./context/HeaderVisibilityContext";
import Header from "./components/Header";
import Table from "./components/Table";
import Setting from "./components/Setting";
import Dashboard from "./components/Dashboard";
import TestLogin from "./components/TestLogin";
import InteractiveList from "./components/InteractiveList";
import InteractiveListView from "./components/InteractiveListView";
import PeopleTable from "./components/people_directory/PeopleTable";
import PeopleDirectoryPreview from "./components/people_directory/PeopleDirectoryPreview";
import VideoGalleryPreview from "./components/video_gallary/VideoGallaryPreView";
import LargeVideoView from "./components/video_gallary/LargeVideoView";
import LargeVideoView_New from "./components/video_gallary/LargeVideoView_New";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./components/people_directory/ProfilePage";
// import Home from "./components/Home";
import PhotoGalleryPreview from "./components/photo_gallery/PhotoGalleryPreview";
import LandingPage from "./components/Interact_Website/LandingPage";
import About from "./components/Landing_Page/AboutSection";
import Products from "./components/Landing_Page/Product_Section/Products";
import OverviewPage from "./components/Landing_Page/Product_Section/OverviewPage";
import PrivacyPolicy from "./components/Landing_Page/PrivacyPolicy";
import InteractiveMapPreview from "./components/interactive_map/InteractiveMapPreview";
import UsersDashboard from "./components/AdminDashboard/UsersDashboard";
import AdminBtn from "./components/component/AdminBtn";
import ProductCataloguePreview from "./components/product_catalogue/ProductCataloguePreview";
import ProductCatalogueView from "./components/product_catalogue/ProductCatalogueView";
import ProductCatalogueBiggerView from "./components/product_catalogue/ProductCatalogueBiggerView"
import ProductCatalogueBiggerPreview from "./components/product_catalogue/ProductCatalogueBiggerPreivew";
import WebsiteLayout from "./components/Interact_Website/WebsiteLayout";
import NotFound from './components/NotFound';


// Layout Component
const Layout = () => {
  const { role } = useContext(UserContext);
  const [hideHeader, setHideHeader] = useState(false);

  return(
  <Provider store={appStore}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#598931", // green
        },
      }}
    >
      <HeaderVisibilityContext.Provider value={{ hideHeader, setHideHeader }}>
        <Header />
        <ToastContainer position="top-right" autoClose={3000} />
        <div className={hideHeader ? "relative" : "mt-[80px] relative"}>
          <Outlet />
          {role === "admin" && ( // Show AdminBtn only if role is 'admin'
            <div className="fixed bottom-6 right-6 z-50">
              <AdminBtn />
            </div>
          )}
        </div>
      </HeaderVisibilityContext.Provider>
    </ConfigProvider>
  </Provider>
  )
};

// Define the router configuration
const appRouter = createBrowserRouter([
  // 🔵 Website routes
  {
    element: <WebsiteLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/about", element: <About /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:product", element: <OverviewPage /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
    ],
  },
  // 🟢 Interact App routes
  {
    element: <Layout />,
    children: [
      // { path: "/", element: <Home /> },
      // { path: "/", element: <LandingPage /> },
      // { path: "/about", element: <About /> },
      // { path: "/products", element: <Products /> },
      { path: "/admin", element: <UsersDashboard /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      // { path: "/products/:product", element: <OverviewPage /> },
      { path: "/signin", element: <GoogleSignin /> },
      { path: "/:id/edit", element: <Table /> },
      { path: "/:id/view", element: <Table /> },
      { path: "/setting", element: <Setting /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/login", element: <TestLogin /> },
      { path: "/interactiveList", element: <InteractiveList /> },
      { path: "/interactiveListView", element: <InteractiveListView /> },
      { path: "/peopledirectory", element: <PeopleTable /> },
      { path: "/peopleDirectoryPreview", element: <PeopleDirectoryPreview /> },
      { path: "/VideoGalleryPreview", element: <VideoGalleryPreview /> },
      { path: "/PhotoGalleryPreview", element: <PhotoGalleryPreview /> },
      { path: "/InteractiveMapPreview", element: <InteractiveMapPreview /> },
      { path: "/profile/:id", element: <ProfilePage /> },
      { path: "/video/:settingsId/:videoId", element: <LargeVideoView /> },
      { path: "/ProductCataloguePreview", element: <ProductCataloguePreview /> },
      { path: "/ProductCatalogueView", element: <ProductCatalogueView /> },
      { path: "/ProductCatalogueBiggerPreview", element: <ProductCatalogueBiggerPreview /> },
      { path: "/ProductCatalogueBiggerView", element: <ProductCatalogueBiggerView /> },
    ],
  },
  // Add catch-all route for 404
  {
    path: "*",
    element: <NotFound />
  }
]);

// App Component
const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
