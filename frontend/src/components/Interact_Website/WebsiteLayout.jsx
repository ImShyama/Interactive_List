// // // components/WebsiteLayout.jsx
// // import React from "react";
// // import WebsiteHeader from "./WebsiteHeader";
// // import { Outlet } from "react-router-dom";
// // import { ToastContainer } from "react-toastify";
// // import { ConfigProvider } from "antd";

// // const WebsiteLayout = () => {
// //   return (
// //     <ConfigProvider
// //       theme={{
// //         token: {
// //           colorPrimary: "#598931",
// //         },
// //       }}
// //     >
// //       <WebsiteHeader />
// //       <ToastContainer position="top-right" autoClose={3000} />
// //       <div className="mt-[80px]">
// //         <Outlet />
// //       </div>
// //     </ConfigProvider>
// //   );
// // };

// // export default WebsiteLayout;

// // components/WebsiteLayout.jsx
// import React from "react";
// import WebsiteHeader from "./WebsiteHeader";
// import { Outlet } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ConfigProvider } from "antd";

// const WebsiteLayout = () => {
//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#598931",
//         },
//       }}
//     >
//       {/* <div className="min-h-screen bg-[#f0fbf5]">
//         <WebsiteHeader />
//         <ToastContainer position="top-right" autoClose={3000} />
//         <main className="pt-[0px]">
//           <Outlet />
//         </main>
//       </div> */}

// <div className="relative min-h-screen overflow-hidden">
//   {/* Split background */}
//   <div className="absolute inset-0 flex z-0">
//     <div className="w-1/2 bg-white" />
//     <div className="w-1/2 bg-[#e9fdf3]" />
//   </div>

//   {/* Main content */}
//   <div className="relative z-10">
//     <WebsiteHeader />
//     <ToastContainer position="top-right" autoClose={3000} />
//     <main className="pt-[0px]">
//       <Outlet />
//     </main>
//   </div>
// </div>

//     </ConfigProvider>
//   );
// };

// export default WebsiteLayout;

// import React from "react";
// import WebsiteHeader from "./WebsiteHeader";
// import { Outlet, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ConfigProvider } from "antd";

// const WebsiteLayout = () => {
//   const location = useLocation();
//   const isLandingPage = location.pathname === "/"; // Adjust if needed

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#598931",
//         },
//       }}
//     >
//       {isLandingPage ? (
//         <div className="relative min-h-screen overflow-hidden bg-[#f0fbf5]">
//           {/* Split layout */}
//           <div className="absolute inset-0 flex z-0 w-full h-full">
//             <div className="w-[6%] " />
//             <div className="w-[47%] bg-white " />
//             <div className="w-[47%] bg-[#e9fdf3] " />
//           </div>

//           {/* Main content */}
//           <div className="relative z-10">
//             <WebsiteHeader />
//             <ToastContainer position="top-right" autoClose={3000} />
//             <main className="pt-[0px]">
//               <Outlet />
//             </main>
//           </div>
//         </div>
//       ) : (
//         // Normal layout
//         <div className="min-h-screen bg-white">
//           <WebsiteHeader />
//           <ToastContainer position="top-right" autoClose={3000} />
//           <main className="pt-[0px]">
//             <Outlet />
//           </main>
//         </div>
//       )}
//     </ConfigProvider>
//   );
// };

// export default WebsiteLayout;


// import React from "react";
// import WebsiteHeader from "./WebsiteHeader";
// import { Outlet, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ConfigProvider } from "antd";

// const WebsiteLayout = () => {
//   const location = useLocation();
//   const isLandingPage = location.pathname === "/"; // Adjust if needed

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#598931",
//         },
//       }}
//     >
//       {isLandingPage ? (
//         <div className="relative min-h-screen overflow-hidden bg-[#f0fbf5]">
//           {/* Split layout with rounded left corners */}
//           <div className="absolute inset-0 flex z-0 w-full h-full">
//             <div className="w-[6%]" />
//             <div className="w-[47%] bg-white rounded-l-[60px] h-full" />
//             <div className="w-[47%] bg-[#e9fdf3] rounded-l-[60px] h-full ml-[-30px]" />
//             {/* negative margin to blend corners without gap */}
//           </div>

//           {/* Main content */}
//           <div className="relative z-10">
//             <WebsiteHeader />
//             <ToastContainer position="top-right" autoClose={3000} />
//             <main className="pt-[0px]">
//               <Outlet />
//             </main>
//           </div>
//         </div>
//       ) : (
//         // Normal layout
//         <div className="min-h-screen bg-white">
//           <WebsiteHeader />
//           <ToastContainer position="top-right" autoClose={3000} />
//           <main className="pt-[0px]">
//             <Outlet />
//           </main>
//         </div>
//       )}
//     </ConfigProvider>
//   );
// };

// export default WebsiteLayout;


// import React from "react";
// import WebsiteHeader from "./WebsiteHeader";
// import { Outlet, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ConfigProvider } from "antd";

// const WebsiteLayout = () => {
//   const location = useLocation();
//   const isLandingPage = location.pathname === "/"; // Adjust if needed

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#598931",
//         },
//       }}
//     >
//       {isLandingPage ? (
//         <div className="relative min-h-screen overflow-hidden bg-[#f0fbf5]">
//           {/* Split layout with left-rounded corners */}
//           <div className="absolute inset-0 flex z-0 w-full h-full">
//             <div className="w-[6%]" />
//             <div className="w-[94%] flex h-full overflow-hidden ">
//               <div className="w-1/2 bg-white h-full rounded-l-[60px]" />
//               <div className="w-1/2 bg-[#e9fdf3] h-full rounded-l-[60px]" />
//             </div>
//           </div>

//           {/* Main content */}
//           <div className="relative z-10">
//             <WebsiteHeader />
//             <ToastContainer position="top-right" autoClose={3000} />
//             <main className="pt-[0px]">
//               <Outlet />
//             </main>
//           </div>
//         </div>
//       ) : (
//         // Normal layout
//         <div className="min-h-screen bg-white">
//           <WebsiteHeader />
//           <ToastContainer position="top-right" autoClose={3000} />
//           <main className="pt-[0px]">
//             <Outlet />
//           </main>
//         </div>
//       )}
//     </ConfigProvider>
//   );
// };

// export default WebsiteLayout;


// import React, { useRef, useState, useEffect } from "react";
// import WebsiteHeader from "./WebsiteHeader";
// import { Outlet, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ConfigProvider } from "antd";

// const WebsiteLayout = () => {
//   const location = useLocation();
//   const isLandingPage = location.pathname === "/";
//   const heroRef = useRef(null);
//   const [isHeroVisible, setIsHeroVisible] = useState(true);

//   useEffect(() => {
//     if (!isLandingPage) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsHeroVisible(entry.isIntersecting);
//       },
//       { threshold: 0.1 } // Trigger when 10% is visible
//     );

//     const current = heroRef.current;
//     if (current) observer.observe(current);

//     return () => {
//       if (current) observer.unobserve(current);
//     };
//   }, [isLandingPage]);

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#598931",
//         },
//       }}
//     >
//       <div className={`relative min-h-screen overflow-hidden bg-[#f0fbf5]`}>
//         {/* Only on landing page and only when HeroSection is visible */}
//         {isLandingPage && isHeroVisible && (
//           <div className="absolute inset-0 flex z-0 w-full h-full">
//             <div className="w-[6%]" />
//             <div className="w-[94%] flex h-full overflow-hidden">
//               <div className="w-1/2 bg-white h-full rounded-l-[60px]" />
//               <div className="w-1/2 bg-[#e9fdf3] h-full rounded-l-[60px]" />
//             </div>
//           </div>
//         )}

//         <div className="relative z-10">
//           <WebsiteHeader />
//           <ToastContainer position="top-right" autoClose={3000} />
//           <main className="pt-[0px]">
//             {/* Pass the heroRef down to the HeroSection */}
//             {isLandingPage ? <Outlet context={{ heroRef }} /> : <Outlet />}
//           </main>
//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default WebsiteLayout;


// import React, { useRef, useState, useEffect } from "react";
// import WebsiteHeader from "./WebsiteHeader";
// import { Outlet, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ConfigProvider } from "antd";

// const WebsiteLayout = () => {
//   const location = useLocation();
//   const isLandingPage = location.pathname === "/";
//   const isLoadingPage = location.pathname === "/loading"; // 👈 Check for LoadingPage route
//   const heroRef = useRef(null);
//   const [isHeroVisible, setIsHeroVisible] = useState(true);

//   useEffect(() => {
//     if (!isLandingPage) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsHeroVisible(entry.isIntersecting);
//       },
//       { threshold: 0.1 }
//     );

//     const current = heroRef.current;
//     if (current) observer.observe(current);

//     return () => {
//       if (current) observer.unobserve(current);
//     };
//   }, [isLandingPage]);

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#598931",
//         },
//       }}
//     >
//       <div className="relative min-h-screen overflow-hidden bg-[#f0fbf5]">
//         {/* Background effect on landing page */}
//         {isLandingPage && isHeroVisible && (
//           <div className="absolute inset-0 flex z-0 w-full h-full">
//             <div className="w-[6%]" />
//             <div className="w-[94%] flex h-full overflow-hidden">
//               <div className="w-1/2 bg-white h-full rounded-l-[60px]" />
//               <div className="w-1/2 bg-[#e9fdf3] h-full rounded-l-[60px]" />
//             </div>
//           </div>
//         )}

//         <div className="relative z-10">
//           {/* 👇 Hide WebsiteHeader if it's LoadingPage */}
//           {!isLoadingPage && <WebsiteHeader />}
//           <ToastContainer position="top-right" autoClose={3000} />
//           <main className="pt-[0px]">
//             {isLandingPage ? <Outlet context={{ heroRef }} /> : <Outlet />}
//           </main>
//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default WebsiteLayout;


// import React, { useRef, useState, useEffect } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ConfigProvider } from "antd";
// import WebsiteHeader from "./WebsiteHeader";

// const WebsiteLayout = () => {
//   const location = useLocation();
//   const isLandingPage = location.pathname === "/";
//   const isLoadingPage = location.pathname === "/loading";

//   const heroRef = useRef(null);
//   const [section, setSection] = useState("hero");
//   const [isHeroVisible, setIsHeroVisible] = useState(true);

//   useEffect(() => {
//     if (!isLandingPage) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsHeroVisible(entry.isIntersecting);
//       },
//       { threshold: 0.1 }
//     );

//     const current = heroRef.current;
//     if (current) observer.observe(current);

//     return () => {
//       if (current) observer.unobserve(current);
//     };
//   }, [isLandingPage]);

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#598931",
//         },
//       }}
//     >
//       <div className="relative min-h-screen overflow-hidden bg-[#f0fbf5]">
//         {/* ✅ Show custom background ONLY if we're on landing page AND section is 'hero' */}
//         {isLandingPage && section === "hero" && isHeroVisible && (
//           <div className="absolute inset-0 flex z-0 w-full h-full">
//             <div className="w-[6%]" />
//             <div className="w-[94%] flex h-full overflow-hidden">
//               <div className="w-1/2 bg-white h-full rounded-l-[60px]" />
//               <div className="w-1/2 bg-[#e9fdf3] h-full rounded-l-[60px]" />
//             </div>
//           </div>
//         )}

//         <div className="relative z-10">
//           {!isLoadingPage && <WebsiteHeader />}
//           <ToastContainer position="top-right" autoClose={3000} />
//           <main className="pt-0">
//             <Outlet context={{ heroRef, section, setSection }} />
//           </main>
//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default WebsiteLayout;


// import React, { useRef, useState, useEffect } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ConfigProvider } from "antd";
// import WebsiteHeader from "./WebsiteHeader";
// import testimonialBg from "../../assets/images/testimonial_background.png"; // ✅ Add this line

// const WebsiteLayout = () => {
//   const location = useLocation();
//   const isLandingPage = location.pathname === "/";
//   const isLoadingPage = location.pathname === "/loading";

//   const heroRef = useRef(null);
//   const [section, setSection] = useState("hero");
//   const [isHeroVisible, setIsHeroVisible] = useState(true);

//   useEffect(() => {
//     if (!isLandingPage) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsHeroVisible(entry.isIntersecting);
//       },
//       { threshold: 0.1 }
//     );

//     const current = heroRef.current;
//     if (current) observer.observe(current);

//     return () => {
//       if (current) observer.unobserve(current);
//     };
//   }, [isLandingPage]);

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#598931",
//         },
//       }}
//     >
//       <div
//         className={`relative min-h-screen overflow-hidden ${
//           section === "testimonial" ? "" : "bg-[#f0fbf5]"
//         }`}
//         style={
//           section === "testimonial"
//             ? {
//                 backgroundImage: `url(${testimonialBg})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }
//             : {}
//         }
//       >
//         {/* ✅ Show custom hero background ONLY if we're on landing page AND section is 'hero' */}
//         {isLandingPage && section === "hero" && isHeroVisible && (
//           <div className="absolute inset-0 flex z-0 w-full h-full">
//             <div className="w-[6%]" />
//             <div className="w-[94%] flex h-full overflow-hidden">
//               <div className="w-1/2 bg-white h-full rounded-l-[60px]" />
//               <div className="w-1/2 bg-[#e9fdf3] h-full rounded-l-[60px]" />
//             </div>
//           </div>
//         )}

//         <div className="relative z-10">
//           {!isLoadingPage && <WebsiteHeader />}
//           <ToastContainer position="top-right" autoClose={3000} />
//           <main className="pt-0">
//             <Outlet context={{ heroRef, section, setSection }} />
//           </main>
//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default WebsiteLayout;


import React, { useRef, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ConfigProvider } from "antd";
import WebsiteHeader from "./WebsiteHeader";
import testimonialBg from "../../assets/images/testimonial_background.png";
import primaryBg from "../../assets/images/primary_background.png"; // ✅ New image import

const WebsiteLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isLoadingPage = location.pathname === "/loading";

  const heroRef = useRef(null);
  const [section, setSection] = useState("loading");
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    if (!isLandingPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const current = heroRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [isLandingPage]);


  useEffect(() => {
    if (!isLandingPage) {
      setSection("hero"); // reset to default when navigating away from landing page
    }
  }, [location.pathname]);
  
  // ✅ Determine background image based on section
  const getBackgroundStyle = () => {
    if (section === "testimonial") {
      return {
        backgroundImage: `url(${testimonialBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    } else {
      return {
        backgroundImage: `url(${primaryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
  };
 console.log("Section:", section);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#598931",
        },
      }}
    >
      <div
        className="relative min-h-screen overflow-hidden"
        style={getBackgroundStyle()}
      >
        {/* ✅ Show custom hero background ONLY if we're on landing page AND section is 'hero' */}
        {isLandingPage && section === "hero" && isHeroVisible && (
          <div className="absolute inset-0 flex z-0 w-full">
            <div className="w-[6%]" />
            <div className="w-[94%] flex h-full overflow-hidden">
              <div className="w-1/2 bg-white h-full rounded-l-[60px]" />
              <div className="w-1/2 bg-[#e9fdf3] h-full rounded-l-[60px]" />
            </div>
          </div>
        )}

        <div className="relative z-10 top-20">
          {!isLoadingPage && <WebsiteHeader />}
          {/* {section !== "loading" && <WebsiteHeader />} */}

          <ToastContainer position="top-right" autoClose={3000} />
          <main className="pt-0">
            <Outlet context={{ heroRef, section, setSection }} />
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default WebsiteLayout;
