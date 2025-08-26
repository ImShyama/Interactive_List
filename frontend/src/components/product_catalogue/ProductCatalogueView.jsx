

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHeaderVisibility } from "../../context/HeaderVisibilityContext";
import HeaderSection from "./product_catalogue_view/HeaderSection";
import CardSection from "./product_catalogue_view/CardSection"; // Adjust path if needed
import FooterSection from "./product_catalogue_view/FooterSection"

const ProductCatalogueView = ({ data, settings }) => {
  const { setHideHeader } = useHeaderVisibility();
  const location = useLocation();
  const isRouteView = location.pathname.toLowerCase().endsWith("/view");

  useEffect(() => {
    // Hide header when component mounts
    setHideHeader(true);

    // Show header when component unmounts
    return () => {
      setHideHeader(false);
    };
  }, [setHideHeader]);

  console.log({ settings1: settings, data1: data })
  return (
    <div className="">
      <div style={{ width: '100%', overflowX: 'hidden', ...(isRouteView ? {} : { overflowY: 'auto', maxHeight: '88vh' }) }}>
        {/* <div
  className={`${!isRouteView ? "px-[50px]" : ""}`}
  style={{
    width: "100%",
    overflowX: "hidden",
    ...(isRouteView ? {} : { overflowY: "auto", maxHeight: "80vh" }),
  }}
> */}
        <HeaderSection isPopup={true} data={data} settings={settings} />
        <CardSection data={data} settings={settings} />
        <FooterSection data={data} settingData={settings} />
      </div>
    </div>
  );
};

export default ProductCatalogueView;
