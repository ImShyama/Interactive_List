

import React from "react";
import HeaderSection from "./product_catalogue_preview/HeaderSection";
import CardSection from "./product_catalogue_preview/CardSection"; // Adjust path if needed
import FooterSection from "./product_catalogue_preview/FooterSection"

const ProductCatalogueView = () => {
  return (
    <div className="p-6">
      <HeaderSection/>
      <CardSection />
      <FooterSection/>
    </div>
  );
};

export default ProductCatalogueView;
