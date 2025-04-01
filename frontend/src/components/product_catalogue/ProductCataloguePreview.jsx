import React from "react";
import ProductTitle from "./product_catalogue_preview/ProductTitle";
import HeaderSection from "./product_catalogue_preview/HeaderSection";
import CardSection from "./product_catalogue_preview/CardSection"; // Adjust path if needed
import FooterSection from "./product_catalogue_preview/FooterSection";


const ProductCataloguePreview = () => {
  return (
    <div className="p-6">
      <div className="mt-6">
      <HeaderSection />
      </div>
      
      {/* <ProductTitle /> */}
      <CardSection />
      <FooterSection />
    </div>
  );
};

export default ProductCataloguePreview;
