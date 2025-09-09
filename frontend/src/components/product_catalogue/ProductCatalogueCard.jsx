// import React, { useMemo } from "react";
// import { GoArrowUpRight } from "react-icons/go";
// import { useNavigate } from "react-router-dom";
// import { getDriveThumbnail, handlePCImageError, RenderText, RenderTextPC } from "../../utils/globalFunctions";
// import ImageNotFound from "../../assets/images/noPhoto.jpg";

// const CardText = ({
//   title1, title2, title3, title4, title5,
//   cardSettings
// }) => {
//   const titleData = [title1, title2, title3, title4, title5];
//   const titleKeys = ["Title_1", "Title_2", "Title_3", "Title_4", "Title_5"];

//   return titleData.map((text, index) => {
//     const key = titleKeys[index];
//     const style = cardSettings?.titles[key];

//     return (
//       <div
//         key={key}
//         style={{
//           fontFamily: style?.cardFont,
//           color: style?.cardFontColor,
//           fontSize: style?.cardFontSize,
//           fontWeight: style?.fontWeight,
//         }}
//       >
//         <RenderTextPC text={text} />
//         {/* {text} */}
//       </div>
//     );
//   });
// }

// const ProductCatalogueCard = ({
//   multipleimages,
//   title1,
//   title2,
//   title3,
//   title4,
//   title5,
//   cardSettings,
//   features,
//   row,
//   settings
// }) => {
//   console.log({settings})
//   const navigate = useNavigate(); // Initialize navigation function

//   // Prepare BroadcastChannel for cross-tab communication
//   const channel = useMemo(() => new BroadcastChannel('product-data'), []);

//   const handleClick = () => {
//     // If settings and row are present, we are in View context → open BiggerView (new tab)
//     if (settings && row) {
//       const uniqueId = `${(title1 || 'product').toString().slice(0,20).replace(/\s+/g,'_')}_${Date.now()}`;
//       const productData = {
//         id: uniqueId,
//         type: 'PRODUCT_DATA',
//         payload: {
//           title: title1,
//           subtitle: title2,
//           description: title3,
//           multipleimages,
//           sheetlink: title4,
//           videolink: title5,
//           features,
//           row,
//           settings,
//         },
//         timestamp: Date.now(),
//       };

//       try { channel.postMessage(productData); } catch (e) {}
//       try { localStorage.setItem(`product_data_${uniqueId}`, JSON.stringify(productData)); } catch (e) {}

//       const url = `/ProductCatalogueBiggerView?uid=${encodeURIComponent(uniqueId)}`;
//       window.open(url, '_blank');
//       return;
//     }

//     // Otherwise, we are in Preview context → open BiggerPreview (new tab with uid)
//     const uniqueId = `${(title1 || 'product').toString().slice(0,20).replace(/\s+/g,'_')}_${Date.now()}`;
//     const productData = {
//       id: uniqueId,
//       type: 'PRODUCT_DATA',
//       payload: {
//         title: title1,
//         subtitle: title2,
//         description: title3,
//         multipleimages,
//         sheetlink: title4,
//         videolink: title5,
//         features,
//       },
//       timestamp: Date.now(),
//     };
//     try { channel.postMessage(productData); } catch (e) {}
//     try { localStorage.setItem(`product_data_${uniqueId}`, JSON.stringify(productData)); } catch (e) {}
//     const url = `/ProductCatalogueBiggerPreview?uid=${encodeURIComponent(uniqueId)}`;
//     window.open(url, '_blank');
//   };
//   // console.log({ "multipleimages" : multipleimages, title1, title2, title3, title4, title5, cardSettings, features})
//   return (
//     <div className="bg-[#FFF] p-0 rounded-2xl shadow-lg max-w-[460px] w-full overflow-hidden">
//       {/* First Child - Image Section */}
//       <div className="w-full relative">
//         <img
//           src={getDriveThumbnail(multipleimages[0]) || ImageNotFound}
//           alt={title1}
//           className="w-full h-[200px] object-cover rounded-t-2xl cursor-pointer"
//           onClick={handleClick}
//           // onError={(e) => { handlePCImageError(e) }}
//         />
//         {/* <button
//           onClick={handleClick}
//           className="absolute bottom-[10px] right-[10px] bg-[#598931] p-3 rounded-full shadow-md"
//         >
//           <GoArrowUpRight className="text-white text-xl" />
//         </button> */}
//       </div>

//       {/* Second Child - Content Section with #F6F8ED background */}
//       <div className="bg-[#F6F8ED] flex flex-col items-start gap-[10px] h-full p-6 rounded-b-2xl">


//         <CardText title1={title1} title2={title2} title3={title3} title4={title4} title5={title5} cardSettings={cardSettings} />
//       </div>
//     </div>
//   );
// };

// export default ProductCatalogueCard;




import React, { useMemo } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { getDriveThumbnail, handlePCImageError, RenderText, RenderTextPC } from "../../utils/globalFunctions";
import ImageNotFound from "../../assets/images/noPhoto.jpg";

const CardText = ({
  title1, title2, title3, title4, title5,
  cardSettings
}) => {
  const titleData = [title1, title2, title3, title4, title5];
  const titleKeys = ["Title_1", "Title_2", "Title_3", "Title_4", "Title_5"];

  return titleData.map((text, index) => {
    const key = titleKeys[index];
    const style = cardSettings?.titles[key];

    return (
      <div
        key={key}
        style={{
          fontFamily: style?.cardFont,
          color: style?.cardFontColor,
          fontSize: style?.cardFontSize,
          fontWeight: style?.fontWeight,
        }}
      >
        <RenderTextPC text={text} />
        {/* {text} */}
      </div>
    );
  });
}

const ProductCatalogueCard = ({
  multipleimages,
  title1,
  title2,
  title3,
  title4,
  title5,
  cardSettings,
  features,
  row: rowData,
  settings
}) => {
  console.log({ settings })
  const navigate = useNavigate(); // Initialize navigation function

  // Prepare BroadcastChannel for cross-tab communication
  const channel = useMemo(() => new BroadcastChannel('product-data'), []);

  const handleClick = () => {
    // If settings and row are present, we are in View context → open BiggerView (new tab)
    if (settings && rowData) {
      // Create composite unique ID
      const uniqueId = `${rowData.key_id}_${Date.now()}`;

      const catalogueData = {
        id: uniqueId,
        type: 'CATALOGUE_DATA',
        payload: {
          title: title1,
          subtitle: title2,
          description: title3,
          multipleimages,
          sheetlink: title4,
          videolink: title5,
          features,
          rowData,
          settings,
        },
        timestamp: Date.now(),
      };

      // Send via BroadcastChannel
    channel.postMessage(catalogueData);
    console.log('📤 BroadcastChannel message posted');
    
    // Also store in localStorage as backup
    localStorage.setItem(`catalogue_data_${uniqueId}`, JSON.stringify(catalogueData));
    console.log('💾 Data stored in localStorage with key:', `catalogue_data_${uniqueId}`);

      // const url = `/ProductCatalogueBiggerView?uid=${encodeURIComponent(uniqueId)}`;
      console.log({ settingId: settings._id, rowDataId: rowData.key_id, uniqueId });
      const url = `/catalogue/${settings._id}/${rowData.key_id}?uid=${uniqueId}`;
      console.log({url});
      window.open(url, '_blank');
      // return;
    }

    // Otherwise, we are in Preview context → open BiggerPreview (new tab with uid)
    const uniqueId = `${(title1 || 'product').toString().slice(0, 20).replace(/\s+/g, '_')}_${Date.now()}`;
    const productData = {
      id: uniqueId,
      type: 'PRODUCT_DATA',
      payload: {
        title: title1,
        subtitle: title2,
        description: title3,
        multipleimages,
        sheetlink: title4,
        videolink: title5,
        features,
      },
      timestamp: Date.now(),
    };
    try { channel.postMessage(productData); } catch (e) { }
    try { localStorage.setItem(`catalogue_data_${uniqueId}`, JSON.stringify(productData)); } catch (e) { }
    const url = `/ProductCatalogueBiggerPreview?uid=${encodeURIComponent(uniqueId)}`;
    window.open(url, '_blank');
  };
  // console.log({ "multipleimages" : multipleimages, title1, title2, title3, title4, title5, cardSettings, features})
  return (
    <div className="bg-[#FFF] p-0 rounded-2xl shadow-lg max-w-[460px] w-full overflow-hidden">
      {/* First Child - Image Section */}
      <div className="w-full relative">
        <img
          src={getDriveThumbnail(multipleimages[0]) || ImageNotFound}
          alt={title1}
          className="w-full h-[200px] object-cover rounded-t-2xl cursor-pointer"
          onClick={handleClick}
        // onError={(e) => { handlePCImageError(e) }}
        />
        {/* <button
          onClick={handleClick}
          className="absolute bottom-[10px] right-[10px] bg-[#598931] p-3 rounded-full shadow-md"
        >
          <GoArrowUpRight className="text-white text-xl" />
        </button> */}
      </div>

      {/* Second Child - Content Section with #F6F8ED background */}
      <div className="bg-[#F6F8ED] flex flex-col items-start gap-[10px] h-full p-6 rounded-b-2xl">


        <CardText title1={title1} title2={title2} title3={title3} title4={title4} title5={title5} cardSettings={cardSettings} />
      </div>
    </div>
  );
};

export default ProductCatalogueCard;
