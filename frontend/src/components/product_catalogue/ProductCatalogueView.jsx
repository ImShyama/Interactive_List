

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHeaderVisibility } from "../../context/HeaderVisibilityContext";
import HeaderSection from "./product_catalogue_view/HeaderSection";
import CardSection from "./product_catalogue_view/CardSection"; // Adjust path if needed
import FooterSection from "./product_catalogue_view/FooterSection"

const ProductCatalogueView = ({ data, settings, tempHeader }) => {
  const { setHideHeader } = useHeaderVisibility();
  const location = useLocation();
  const isRouteView = location.pathname.toLowerCase().endsWith("/view");

  // Allow navigation via location.state from card click
  const state = location.state || {};
  const effectiveData = data ?? state.data;
  const effectiveSettings = settings ?? state.settings;

  useEffect(() => {
    // Hide header when component mounts
    setHideHeader(true);

    // Show header when component unmounts
    return () => {
      setHideHeader(false);
    };
  }, [setHideHeader]);

  console.log({ settings1: effectiveSettings, data1: effectiveData })
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
        <HeaderSection isPopup={true} data={effectiveData} settings={effectiveSettings} />
        <CardSection data={effectiveData} settings={effectiveSettings} tempHeader={tempHeader} />
        <FooterSection data={effectiveData} settingData={effectiveSettings} />
      </div>
    </div>
  );
};

export default ProductCatalogueView;
