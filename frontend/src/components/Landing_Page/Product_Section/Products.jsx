import React from "react";
import {
  APPS,
  APPSNAME,
  CLIENTID,
  DEVELOPERKEY,
  OPTIONS,
} from "../../../utils/constants"; // Importing all required constants
import AppCard from "./AppCard"; // Importing the AppCard component

// Component to display app cards
const Products = () => {
  return (
    <div className="min-h-screen max-h-[100vh] overflow-y-auto py-24 px-6 md:px-12">
      <div className="text-black font-[Poppins] text-[32.607px] font-medium leading-none flex justify-center ml-10 mb-4 mt-[-80px]">
        Discover Our Complete Suite of Digital Tools
      </div>

      <div className="flex flex-wrap justify-center">
        {APPS.map((app, index) => (
          <div className="flex justify-center w-full sm:w-1/2 lg:w-1/3">
          <AppCard
            key={index}
            appName={app.appName}
            spreadSheetName={app.spreadSheetName}
            spreadSheetID={app.appID}
            appView={app.appView}
            appImg={app.appImg}
            description={app.description}
            overview={app.overview}
            multipleImage={app.multipleImage}
            standOut={app.standOut}
          />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
