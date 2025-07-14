

import React from "react";
import HeaderSection from "./product_catalogue_view/HeaderSection";
import CardSection from "./product_catalogue_view/CardSection"; // Adjust path if needed
import FooterSection from "./product_catalogue_view/FooterSection"

const ProductCatalogueView = ({ data, settings}) => {
  return (
    <div className="">
      <HeaderSection data={data} settings={settings} />
      <CardSection data={data} settings={settings} />
      <FooterSection data={data} settingData={settings} />
    </div>
  );
};

export default ProductCatalogueView;
