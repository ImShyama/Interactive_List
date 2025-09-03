

// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { useLocation, useNavigate, useSearchParams, useParams } from "react-router-dom";
// import { IoArrowBack } from "react-icons/io5";
// import { CgArrowsExpandRight } from "react-icons/cg";
// import { PiStarFour } from "react-icons/pi";
// import { GoLink } from "react-icons/go";
// import { LiaFileVideo } from "react-icons/lia";
// import { Carousel } from "antd";
// import { getDriveThumbnail, RenderTextPC } from "../../utils/globalFunctions";
// import HeaderSection from "./product_catalogue_view/HeaderSection";
// import { useHeaderVisibility } from "../../context/HeaderVisibilityContext";


// const ProductCatalogueBiggerView = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { settingsId, rowKey } = useParams();
//   const { setHideHeader } = useHeaderVisibility();

//   // Local state populated from BroadcastChannel/localStorage or fallback to location.state
//   const [title, setTitle] = useState(location.state?.title);
//   const [subtitle, setSubtitle] = useState(location.state?.subtitle);
//   const [description, setDescription] = useState(location.state?.description);
//   const [multipleimages, setMultipleimages] = useState(location.state?.multipleimages || []);
//   const [sheetlink, setSheetlink] = useState(location.state?.sheetlink);
//   const [videolink, setVideolink] = useState(location.state?.videolink);
//   const [features, setFeatures] = useState(location.state?.features);
//   const [rowData, setRowData] = useState(null);
//   const [showInProfile, setShowInProfile] = useState(null);
//   const [showInBox, setShowInBox] = useState(null);
//   const [showInCard, setShowInCard] = useState(null);
//   const [cardSettings, setCardSettings] = useState(location.state?.settings?.productCatalogue?.cardSettings);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeSection, setActiveSection] = useState(null);
//   const state = location.state || {};
//   // const effectiveData = state?.payload?.data;
//   // const effectiveSettings =  state?.payload?.settings;
//   const [effectiveData, setEffectiveData] = useState(null);
//   const [effectiveSettings, setEffectiveSettings] = useState(null);

  
  
//   const channel = useMemo(() => new BroadcastChannel('product-data'), []);

//   useEffect(() => {
//     const expectedUid = searchParams.get('uid');

//     // If navigated internally with state and no uid, just use it
//     if (!expectedUid && location.state) {
//       setLoading(false);
//       return;
//     }

//     if (!expectedUid) {
//       setError('No product ID found');
//       setLoading(false);
//       return;
//     }

//     const applyData = (data) => {
//       console.log({ data: data.payload });
//       const p = data?.payload || {};
//       setTitle(p.title);
//       setSubtitle(p.subtitle);
//       setDescription(p.description);
//       setMultipleimages(Array.isArray(p.multipleimages) ? p.multipleimages : (p.multipleimages ? [p.multipleimages] : []));
//       setSheetlink(p.sheetlink);
//       setVideolink(p.videolink);
//       setFeatures(p.features);
//       // Optional for broadcast/local payloads (may be undefined)
//       setRowData(p.row || null);
//       setShowInProfile(p.settings.showInProfile || null);
//       setShowInBox(p.settings.showInBox || null);
//       setShowInCard(p.settings.showInCard || null);
//       setCardSettings(p.settings?.productCatalogue?.cardSettings || null);
//       setActiveSection(p.settings.showInBox?.[0]);
//       setEffectiveData(p.row);
//       setEffectiveSettings(p.settings);

//       setLoading(false);
//       // cleanup after 1 hour like video flow
//       try {
//         setTimeout(() => {
//           localStorage.removeItem(`product_data_${expectedUid}`);
//         }, 60 * 60 * 1000);
//       } catch (e) { }
//     };

//     // 1) Try localStorage immediate
//     try {
//       const raw = localStorage.getItem(`product_data_${expectedUid}`);
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         if (parsed?.type === 'PRODUCT_DATA' && parsed?.id === expectedUid) {
//           applyData(parsed);
//           return;
//         }
//       }
//     } catch (e) { }

//     // 2) Try server fetch if we have params
//     const tryServer = async () => {
//       try {
//         if (!settingsId || !rowKey) return false;
//         const [{ default: axios }, { HOST }] = await Promise.all([
//           import("axios"),
//           import("../../utils/constants"),
//         ]);
//         const resp = await axios.post(`${HOST}/getSheetRowData`, {
//           sheetID: settingsId,
//           key_id: rowKey,
//         });
//         const payload = {
//           title: resp.data?.data?.title_1 || resp.data?.data?.title || title,
//           subtitle: resp.data?.data?.title_2 || subtitle,
//           description: resp.data?.data?.title_3 || description,
//           multipleimages: (resp.data?.data?.multipleimages || "")
//             .toString()
//             .split(",")
//             .filter(Boolean),
//           sheetlink: resp.data?.data?.title_4,
//           videolink: resp.data?.data?.title_5,
//           features: resp.data?.settings?.productCatalogue?.features,
//           rowData: resp.data?.data || null,
//           showInProfile: resp.data?.settings?.showInProfile || null,
//           showInCard: resp.data?.settings?.showInCard || null,
//           effectiveData: resp.data?.data || null,
//           effectiveSettings: resp.data?.settings || null,
//         };
//         applyData({ payload });
//         return true;
//       } catch (e) {
//         return false;
//       }
//     };

//     // 3) Wait for BroadcastChannel for a short time
//     const onMessage = (event) => {
//       const msg = event?.data;
//       if (msg?.type === 'PRODUCT_DATA' && msg?.id === expectedUid) {
//         applyData(msg);
//       }
//     };
//     channel.addEventListener('message', onMessage);
//     let timeout;
//     tryServer().then((ok) => {
//       if (!ok) {
//         timeout = setTimeout(() => {
//           setError('Product data not found. Please try again.');
//           setLoading(false);
//         }, 5000);
//       }
//     });

//     return () => {
//       clearTimeout(timeout);
//       channel.removeEventListener('message', onMessage);
//     };
//   }, [channel, location.state, searchParams, settingsId, rowKey]);

//   // State to track active section (default: "features")

//   const carouselRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const contentRef = useRef(null);

//   // Map dynamic button text to a known section key
//   const resolveSectionType = (label) => {
//     const l = (label || "").toString().toLowerCase();
//     if (l.includes("feature")) return "features";
//     if (l.includes("video") || l.includes("update")) return "video";
//     if (l.includes("link") || l.includes("website") || l.includes("sheet")) return "link";
//     return label || "features";
//   };

//   const sectionType = useMemo(() => resolveSectionType(activeSection), [activeSection]);



//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center p-8">{error}</div>
//     );
//   }

// // Alternative: More dynamic function that can handle any placeholder pattern
// function replaceAllTemplateVariables(template, data) {
//   let result = template;
  
//   // Find all placeholders in the format {key} and replace them
//   const placeholderRegex = /\{([^}]+)\}/g;
  
//   result = result.replace(placeholderRegex, (match, key) => {
//       // Convert key to lowercase and replace spaces with underscores
//       const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
        
//       // Check if the normalized key exists in the data object
//       if (data.hasOwnProperty(normalizedKey)) {
//           return data[normalizedKey] || '';
//       }
//       // If key doesn't exist, return the original placeholder
//       return match;
//   });
  
//   return result;
// }

// // Process the HTML content
// const htmlContent = activeSection ? replaceAllTemplateVariables(activeSection.value, rowData) : '';
// console.log("Dynamic replacement result:", htmlContent);

//   // Ensure links are clickable, underlined, and open in new tab
//   useEffect(() => {
//     const container = contentRef.current;
//     if (!container) return;
//     const links = container.querySelectorAll('a');
//     links.forEach((a) => {
//       a.setAttribute('target', '_blank');
//       a.setAttribute('rel', 'noopener noreferrer');
//       a.classList.add('underline');
//     });
//   }, [htmlContent]);

//   // Helpers to detect media types for the carousel
//   const isVideoUrl = (url) => {
//     if (!url) return false;
//     const u = url.toString().toLowerCase();
//     return u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.ogg');
//   };

//   const isYouTubeUrl = (url) => {
//     if (!url) return false;
//     return /(?:youtube\.com\/.+v=|youtu\.be\/)/i.test(url);
//   };

//   const getYouTubeEmbedSrc = (url) => {
//     try {
//       const ytMatch = url.match(/(?:v=|youtu\.be\/)([\w-]+)/i);
//       const id = ytMatch ? ytMatch[1] : null;
//       return id ? `https://www.youtube.com/embed/${id}` : url;
//     } catch (e) {
//       return url;
//     }
//   };


//   // Header visibility effect
//   useEffect(() => {
//     setHideHeader(true);
//     return () => {
//       setHideHeader(false);
//     };
//   }, [setHideHeader]);

  


//   return (
//     <div className="min-h-screen bg-white flex flex-col">

//       {/* Header Section */}
//       <HeaderSection isPopup={true} data={effectiveData} settings={effectiveSettings} />
//       {/* Product Image and Description Section - Full Width */}
//       <div className="w-[90%] md:w-[95%] mx-auto py-20">
//         <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-16">
//           {/* Image Section */}
//           <div className="relative w-full md:w-1/2">
//             {/* <button
//               onClick={() => navigate(-1)}
//               className="absolute top-4 left-4 bg-[#598931] p-2 rounded-full shadow-md z-10"
//             >
//               <IoArrowBack className="text-white text-3xl" />
//             </button> */}

//             <div className="relative w-full bg-[#FDFEFF] rounded-[35.746px] border-[2.07px] border-[#F1F1F1] shadow-lg overflow-hidden h-auto">
//               <Carousel
//                 ref={carouselRef}
//                 autoplay={true}
//                 dots={true}
//                 className="w-full h-full my-red-dots"
//                 afterChange={(index) => setCurrentIndex(index)}
//               >
//                 {multipleimages.length > 0 ? (
//                   multipleimages.map((media, index) => (
//                     <div key={index} className="w-full h-full">
//                       <div className="w-full h-[400px] object-cover">
//                         {isVideoUrl(media) ? (
//                           <video controls className="max-w-full max-h-full" src={media} />
//                         ) : isYouTubeUrl(media) ? (
//                           <iframe
//                             className="w-full h-full"
//                             src={getYouTubeEmbedSrc(media)}
//                             title={`video-${index}`}
//                             frameBorder="0"
//                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                             allowFullScreen
//                           />
//                         ) : (
//                           <img
//                             src={getDriveThumbnail(media) || media}
//                             alt={`Slide ${index + 1}`}
//                             className="w-full h-[400px] object-cover"
//                           />
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-gray-500">
//                     No images available
//                   </div>
//                 )}
//               </Carousel>

//               <div className="absolute bottom-4 left-0 w-full py-2 flex justify-center">
//                 <ul className="custom-carousel-dots"></ul>
//               </div>

//               <button
//                 onClick={() =>
//                   window.open(multipleimages[currentIndex], "_blank")
//                 }
//                 className="absolute bottom-4 right-4 bg-[#D3EEBC] p-2 rounded-full shadow-md"
//               >
//                 <CgArrowsExpandRight className="text-[#598931] text-2xl" />
//               </button>
//             </div>
//           </div>

//           {/* Text Section */}
//           <div className="w-full  md:w-1/2 flex flex-col items-start text-left ">
//             {console.log({ rowData, showInCard, showInProfile, showInBox })}
//             {Array.isArray(showInCard) && showInCard.length > 1 && rowData && (
//               <div className="w-full  mb-4 space-y-4">
//                 {(() => {
//                   const titleKeys = ["Title_1", "Title_2", "Title_3", "Title_4", "Title_5"];
//                   return titleKeys.map((tk, idx) => {
//                     const cfg = cardSettings?.titles?.[tk] || {};
//                     const scItem = showInCard[idx + 1]; // skip images at index 0
//                     if (!scItem) return null;
//                     const key = (scItem?.value || "").replaceAll(" ", "_").toLowerCase();
//                     const value = rowData?.[key];
//                     if (value == null || value === "") return null;
//                     return (
//                       <div
//                         key={`${tk}-${key}`}
//                         style={{
//                           fontFamily: cfg?.cardFont,
//                           color: cfg?.cardFontColor,
//                           fontSize: cfg?.cardFontSize,
//                           fontWeight: cfg?.fontWeight,
//                         }}
//                       >
//                         <RenderTextPC text={String(value)} />
//                       </div>
//                     );
//                   });
//                 })()}
//               </div>
//             )}


//             {Array.isArray(showInProfile) && showInProfile.length > 0 && rowData && (
//               <div className="w-full space-y-4">
//                 {showInProfile.map((item, idx) => {
//                   const key = (item?.value || "").replaceAll(" ", "_").toLowerCase();
//                   const value = rowData?.[key];
//                   if (value == null || value === "") return null;
//                   return (
//                     <div key={`${key}-${idx}`} className="flex flex-col">
//                       {/* <div className="text-sm text-[#9B9B9B] font-[Poppins]">{item?.value}</div> */}
//                       <div className="font-normal text-[#060606]">{String(value)}</div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="w-[90%] md:w-[95%] mx-auto py-12 relative">
//         {/* Features Section - Also Full Width */}
//         <div className="relative flex flex-col  items-start gap-[15.246px] rounded-[50px] bg-[rgba(211,238,188,0.10)] px-12 md:px-20 pt-8 md:pt-12 pb-20 shadow-lg">
//           {/* Buttons at the Top Center */}
//           <div className="w-full flex justify-center gap-8 mb-10">
//             {showInBox?.map((item) => {
//               return (
//                 <button
//                   key={item.id || item.text} // good practice: unique key
//                   onClick={() => setActiveSection(item)} // use item-specific value
//                   className={`px-4 py-2 rounded-[8px] font-semibold shadow-md transition-all duration-300 text-xl ${(activeSection?.text === item?.text)
//                     ? "bg-[#598931] text-white"
//                     : "bg-[#EBEEE9] text-[#9B9B9B]"
//                     }`}
//                 >
//                   <PiStarFour className="inline-block mr-2" /> {item.text}
//                 </button>
//               )
//             })}

//           </div>

//           {/* Conditional Rendering of Content */}
//           {sectionType === "features" && features && (
//             <div className="w-[95%] mx-auto">
//               <div className="text-4xl font-bold text-gray-900 mb-6">
//                 Features:
//               </div>


//               <div className="mb-10">
//                 <h4 className="text-3xl font-semibold text-gray-800 mb-6">
//                   Benefits
//                 </h4>
//                 <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
//                   {features.benefits.map((benefit, index) => (
//                     <li key={index}>{benefit}</li>
//                   ))}
//                 </ul>
//               </div>


//               <div className="mb-10">
//                 <h4 className="text-3xl font-semibold text-gray-800 mb-6">
//                   Use Cases
//                 </h4>
//                 <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
//                   {features.useCases.map((useCase, index) => (
//                     <li key={index}>{useCase}</li>
//                   ))}
//                 </ul>
//               </div>


//               <div>
//                 <h4 className="text-3xl font-semibold text-gray-800 mb-6">
//                   Features List
//                 </h4>
//                 <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
//                   {features.featureList.map((feature, index) => (
//                     <li key={index}>{feature}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           )}

//           {sectionType === "link" && (
//             <div className="w-[80%] mx-auto">
//               <h3 className="text-3xl font-bold text-gray-900 mb-6">
//                 Sheet Link / Website
//               </h3>

//               <a
//                 href={
//                   sheetlink?.startsWith("http")
//                     ? sheetlink
//                     : `https://${sheetlink}`
//                 }
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-[#D3EEBC80] border-2 rounded-3xl px-4 py-1 text-xl underline hover:text-[#598931]"
//               >
//                 Make a Link
//               </a>
//             </div>
//           )}

//           {sectionType === "video" && (
//             <div className="w-[80%] mx-auto">
//               <h3 className="text-3xl font-bold text-gray-900 mb-6">
//                 Updates / Video
//               </h3>

//               <a
//                 href={
//                   videolink?.startsWith("http")
//                     ? videolink
//                     : `https://${videolink}`
//                 }
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-[#D3EEBC80] border-2 rounded-3xl px-4 py-1 text-xl underline hover:text-[#598931]"
//               >
//                 Instruction Video
//               </a>
//             </div>
//           )}

//           {/* {activeSection &&
//             activeSection.value
//           } */}
//           {activeSection &&
//             <div
//               ref={contentRef}
//               className="prose max-w-none text-gray-800  prose-a:underline"
//               dangerouslySetInnerHTML={{ __html: htmlContent }}
//             />
//           }


//         </div>
//       </div>
//       {/* Scoped styles for red carousel dots */}
//       <style>{`
//         .my-red-dots .slick-dots li button { background: #ef4444 !important; }
//         .my-red-dots .slick-dots li.slick-active button { background: #b91c1c !important; }
//       `}</style>
//     </div>
//   );
// };

// export default ProductCatalogueBiggerView;




import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { CgArrowsExpandRight } from "react-icons/cg";
import { PiStarFour } from "react-icons/pi";
import { GoLink } from "react-icons/go";
import { LiaFileVideo } from "react-icons/lia";
import { Carousel } from "antd";
import { getDriveThumbnail, RenderTextPC } from "../../utils/globalFunctions";
import HeaderSection from "./product_catalogue_view/HeaderSection";
import { useHeaderVisibility } from "../../context/HeaderVisibilityContext";

const ProductCatalogueBiggerView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { settingsId, rowKey } = useParams();
  const { setHideHeader } = useHeaderVisibility();

  // Local state populated from BroadcastChannel/localStorage or fallback to location.state
  const [title, setTitle] = useState(location.state?.title);
  const [subtitle, setSubtitle] = useState(location.state?.subtitle);
  const [description, setDescription] = useState(location.state?.description);
  const [multipleimages, setMultipleimages] = useState(location.state?.multipleimages || []);
  const [sheetlink, setSheetlink] = useState(location.state?.sheetlink);
  const [videolink, setVideolink] = useState(location.state?.videolink);
  const [features, setFeatures] = useState(location.state?.features);
  const [rowData, setRowData] = useState(null);
  const [showInProfile, setShowInProfile] = useState(null);
  const [showInBox, setShowInBox] = useState(null);
  const [showInCard, setShowInCard] = useState(null);
  const [cardSettings, setCardSettings] = useState(location.state?.settings?.productCatalogue?.cardSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const state = location.state || {};
  const [effectiveData, setEffectiveData] = useState(null);
  const [effectiveSettings, setEffectiveSettings] = useState(null);

  const channel = useMemo(() => new BroadcastChannel('product-data'), []);

  useEffect(() => {
    const expectedUid = searchParams.get('uid');

    // If navigated internally with state and no uid, just use it
    if (!expectedUid && location.state) {
      setLoading(false);
      return;
    }

    if (!expectedUid) {
      setError('No product ID found');
      setLoading(false);
      return;
    }

    const applyData = (data) => {
      console.log({ data: data.payload });
      const p = data?.payload || {};
      setTitle(p.title);
      setSubtitle(p.subtitle);
      setDescription(p.description);
      setMultipleimages(Array.isArray(p.multipleimages) ? p.multipleimages : (p.multipleimages ? [p.multipleimages] : []));
      setSheetlink(p.sheetlink);
      setVideolink(p.videolink);
      setFeatures(p.features);
      setRowData(p.row || null);
      setShowInProfile(p.settings.showInProfile || null);
      setShowInBox(p.settings.showInBox || null);
      setShowInCard(p.settings.showInCard || null);
      setCardSettings(p.settings?.productCatalogue?.cardSettings || null);
      setActiveSection(p.settings.showInBox?.[0]);
      setEffectiveData(p.row);
      setEffectiveSettings(p.settings);

      setLoading(false);
      try {
        setTimeout(() => {
          localStorage.removeItem(`product_data_${expectedUid}`);
        }, 60 * 60 * 1000);
      } catch (e) { }
    };

    // 1) Try localStorage immediate
    try {
      const raw = localStorage.getItem(`product_data_${expectedUid}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.type === 'PRODUCT_DATA' && parsed?.id === expectedUid) {
          applyData(parsed);
          return;
        }
      }
    } catch (e) { }

    // 2) Try server fetch if we have params
    const tryServer = async () => {
      try {
        if (!settingsId || !rowKey) return false;
        const [{ default: axios }, { HOST }] = await Promise.all([
          import("axios"),
          import("../../utils/constants"),
        ]);
        const resp = await axios.post(`${HOST}/getSheetRowData`, {
          sheetID: settingsId,
          key_id: rowKey,
        });
        const payload = {
          title: resp.data?.data?.title_1 || resp.data?.data?.title || title,
          subtitle: resp.data?.data?.title_2 || subtitle,
          description: resp.data?.data?.title_3 || description,
          multipleimages: (resp.data?.data?.multipleimages || "")
            .toString()
            .split(",")
            .filter(Boolean),
          sheetlink: resp.data?.data?.title_4,
          videolink: resp.data?.data?.title_5,
          features: resp.data?.settings?.productCatalogue?.features,
          rowData: resp.data?.data || null,
          showInProfile: resp.data?.settings?.showInProfile || null,
          showInCard: resp.data?.settings?.showInCard || null,
          effectiveData: resp.data?.data || null,
          effectiveSettings: resp.data?.settings || null,
        };
        applyData({ payload });
        return true;
      } catch (e) {
        return false;
      }
    };

    // 3) Wait for BroadcastChannel for a short time
    const onMessage = (event) => {
      const msg = event?.data;
      if (msg?.type === 'PRODUCT_DATA' && msg?.id === expectedUid) {
        applyData(msg);
      }
    };
    channel.addEventListener('message', onMessage);
    let timeout;
    tryServer().then((ok) => {
      if (!ok) {
        timeout = setTimeout(() => {
          setError('Product data not found. Please try again.');
          setLoading(false);
        }, 5000);
      }
    });

    return () => {
      clearTimeout(timeout);
      channel.removeEventListener('message', onMessage);
    };
  }, [channel, location.state, searchParams, settingsId, rowKey]);

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const contentRef = useRef(null);

  // Map dynamic button text to a known section key
  const resolveSectionType = (label) => {
    const l = (label || "").toString().toLowerCase();
    if (l.includes("feature")) return "features";
    if (l.includes("video") || l.includes("update")) return "video";
    if (l.includes("link") || l.includes("website") || l.includes("sheet")) return "link";
    return label || "features";
  };

  const sectionType = useMemo(() => resolveSectionType(activeSection), [activeSection]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">{error}</div>
    );
  }

  // Alternative: More dynamic function that can handle any placeholder pattern
  function replaceAllTemplateVariables(template, data) {
    let result = template;
    
    // Find all placeholders in the format {key} and replace them
    const placeholderRegex = /\{([^}]+)\}/g;
    
    result = result.replace(placeholderRegex, (match, key) => {
        // Convert key to lowercase and replace spaces with underscores
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
          
        // Check if the normalized key exists in the data object
        if (data && data.hasOwnProperty(normalizedKey)) {
            return data[normalizedKey] || '';
        }
        // If key doesn't exist, return the original placeholder
        return match;
    });
    
    return result;
  }

  // Process the HTML content
  const htmlContent = activeSection ? replaceAllTemplateVariables(activeSection.value, rowData) : '';
  console.log("Dynamic replacement result:", htmlContent);

  // Ensure links are clickable, underlined, and open in new tab
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const links = container.querySelectorAll('a');
    links.forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.classList.add('underline');
    });
  }, [htmlContent]);

  // Enhanced media type detection helpers
  const isVideoUrl = (url) => {
    if (!url) return false;
    const u = url.toString().toLowerCase();
    return u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.ogg') || u.endsWith('.mov') || u.endsWith('.avi');
  };

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)/i.test(url);
  };

  const getYouTubeVideoId = (url) => {
    try {
      const ytMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/i);
      return ytMatch ? ytMatch[1] : null;
    } catch (e) {
      return null;
    }
  };

  const getYouTubeEmbedSrc = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : url;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  // Enhanced image source handler with fallbacks
  const getImageSrc = (media) => {
    if (!media) return null;
    
    // Check if it's a Google Drive link
    if (media.includes('drive.google.com')) {
      return getDriveThumbnail(media) || media;
    }
    
    // For other URLs, return as is
    return media;
  };

  // Handle image load errors
  const handleImageError = (index, media) => {
    console.warn(`Failed to load image at index ${index}:`, media);
    setImageLoadErrors(prev => new Set([...prev, index]));
  };

  // Get current media for expand functionality
  // const getCurrentMedia = () => {
  //   const currentMedia = multipleimages[currentIndex];
  //   if (!currentMedia) return null;
    
  //   if (isYouTubeUrl(currentMedia)) {
  //     // For YouTube, open the original URL
  //     return currentMedia;
  //   } else if (isVideoUrl(currentMedia)) {
  //     // For video files, open the direct URL
  //     return currentMedia;
  //   } else {
  //     // For images, use the processed source
  //     return getImageSrc(currentMedia);
  //   }
  // };

  const getYouTubeWatchUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
  };
  
  const getCurrentMedia = () => {
    const currentMedia = multipleimages[currentIndex];
    if (!currentMedia) return null;
  
    if (isYouTubeUrl(currentMedia)) {
      return getYouTubeWatchUrl(currentMedia); // 👍 open proper watch page
    } else if (isVideoUrl(currentMedia)) {
      return currentMedia; // browser tries to play/download
    } else {
      return getImageSrc(currentMedia);
    }
  };
  


  // Header visibility effect
  useEffect(() => {
    setHideHeader(true);
    return () => {
      setHideHeader(false);
    };
  }, [setHideHeader]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section */}
      <HeaderSection isPopup={true} data={effectiveData} settings={effectiveSettings} />
      
      {/* Product Image and Description Section - Full Width */}
      <div className="w-[90%] md:w-[95%] mx-auto py-20">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-16">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2">
            <div className="relative w-full bg-[#FDFEFF] rounded-[35.746px] border-[2.07px] border-[#F1F1F1] shadow-lg overflow-hidden h-auto">
              <Carousel
                ref={carouselRef}
                autoplay={true}
                dots={true}
                className="w-full h-full my-red-dots"
                afterChange={(index) => setCurrentIndex(index)}
              >
                {multipleimages.length > 0 ? (
                  multipleimages.map((media, index) => (
                    <div key={index} className="w-full h-full">
                      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100">
                        {isVideoUrl(media) ? (
                          <video 
                            controls 
                            className="max-w-full max-h-full object-contain"
                            src={media}
                            onError={() => handleImageError(index, media)}
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : isYouTubeUrl(media) ? (
                          <div className="w-full h-full relative">
                            <iframe
                              className="w-full h-full"
                              src={getYouTubeEmbedSrc(media)}
                              title={`YouTube video ${index + 1}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full relative">
                            {imageLoadErrors.has(index) ? (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                                <div className="text-center">
                                  <div className="text-lg mb-2">⚠️</div>
                                  <div>Image failed to load</div>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={getImageSrc(media)}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-[400px] object-contain"
                                onError={() => handleImageError(index, media)}
                                onLoad={() => {
                                  // Remove from error set if it loads successfully
                                  setImageLoadErrors(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(index);
                                    return newSet;
                                  });
                                }}
                                loading="lazy"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-[400px] flex items-center justify-center text-gray-500 bg-gray-100">
                    <div className="text-center">
                      <div className="text-lg mb-2">📷</div>
                      <div>No images available</div>
                    </div>
                  </div>
                )}
              </Carousel>

              <div className="absolute bottom-4 left-0 w-full py-2 flex justify-center">
                <ul className="custom-carousel-dots"></ul>
              </div>

              {multipleimages.length > 0 && (
                <button
                  onClick={() => {
                    const mediaToOpen = getCurrentMedia();
                    if (mediaToOpen) {
                      window.open(mediaToOpen, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="absolute bottom-4 right-4 bg-[#D3EEBC] p-2 rounded-full shadow-md hover:bg-[#c8e6b3] transition-colors"
                  title="Open in new tab"
                >
                  <CgArrowsExpandRight className="text-[#598931] text-2xl" />
                </button>
              )}
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start text-left">
            {console.log({ rowData, showInCard, showInProfile, showInBox })}
            {Array.isArray(showInCard) && showInCard.length > 1 && rowData && (
              <div className="w-full mb-4 space-y-4">
                {(() => {
                  const titleKeys = ["Title_1", "Title_2", "Title_3", "Title_4", "Title_5"];
                  return titleKeys.map((tk, idx) => {
                    const cfg = cardSettings?.titles?.[tk] || {};
                    const scItem = showInCard[idx + 1]; // skip images at index 0
                    if (!scItem) return null;
                    const key = (scItem?.value || "").replaceAll(" ", "_").toLowerCase();
                    const value = rowData?.[key];
                    if (value == null || value === "") return null;
                    return (
                      <div
                        key={`${tk}-${key}`}
                        style={{
                          fontFamily: cfg?.cardFont,
                          color: cfg?.cardFontColor,
                          fontSize: cfg?.cardFontSize,
                          fontWeight: cfg?.fontWeight,
                        }}
                      >
                        <RenderTextPC text={String(value)} />
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {Array.isArray(showInProfile) && showInProfile.length > 0 && rowData && (
              <div className="w-full space-y-4">
                {showInProfile.map((item, idx) => {
                  const key = (item?.value || "").replaceAll(" ", "_").toLowerCase();
                  const value = rowData?.[key];
                  if (value == null || value === "") return null;
                  return (
                    <div key={`${key}-${idx}`} className="flex flex-col">
                      <div className="font-normal text-[#060606]">{String(value)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-[90%] md:w-[95%] mx-auto py-12 relative">
        {/* Features Section - Also Full Width */}
        <div className="relative flex flex-col items-start gap-[15.246px] rounded-[50px] bg-[rgba(211,238,188,0.10)] px-12 md:px-20 pt-8 md:pt-12 pb-20 shadow-lg">
          {/* Buttons at the Top Center */}
          <div className="w-full flex justify-center gap-8 mb-10">
            {showInBox?.map((item) => {
              return (
                <button
                  key={item.id || item.text}
                  onClick={() => setActiveSection(item)}
                  className={`px-4 py-2 rounded-[8px] font-semibold shadow-md transition-all duration-300 text-xl ${(activeSection?.text === item?.text)
                    ? "bg-[#598931] text-white"
                    : "bg-[#EBEEE9] text-[#9B9B9B]"
                    }`}
                >
                  <PiStarFour className="inline-block mr-2" /> {item.text}
                </button>
              );
            })}
          </div>

          {/* Conditional Rendering of Content */}
          {sectionType === "features" && features && (
            <div className="w-[95%] mx-auto">
              <div className="text-4xl font-bold text-gray-900 mb-6">
                Features:
              </div>

              <div className="mb-10">
                <h4 className="text-3xl font-semibold text-gray-800 mb-6">
                  Benefits
                </h4>
                <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
                  {features.benefits?.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-10">
                <h4 className="text-3xl font-semibold text-gray-800 mb-6">
                  Use Cases
                </h4>
                <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
                  {features.useCases?.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-3xl font-semibold text-gray-800 mb-6">
                  Features List
                </h4>
                <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
                  {features.featureList?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {sectionType === "link" && (
            <div className="w-[80%] mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Sheet Link / Website
              </h3>

              {sheetlink && (
                <a
                  href={
                    sheetlink?.startsWith("http")
                      ? sheetlink
                      : `https://${sheetlink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#D3EEBC80] border-2 rounded-3xl px-4 py-1 text-xl underline hover:text-[#598931] transition-colors"
                >
                  <GoLink className="inline-block mr-2" />
                  Visit Link
                </a>
              )}
            </div>
          )}

          {sectionType === "video" && (
            <div className="w-[80%] mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Updates / Video
              </h3>

              {videolink && (
                <a
                  href={
                    videolink?.startsWith("http")
                      ? videolink
                      : `https://${videolink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#D3EEBC80] border-2 rounded-3xl px-4 py-1 text-xl underline hover:text-[#598931] transition-colors"
                >
                  <LiaFileVideo className="inline-block mr-2" />
                  Watch Video
                </a>
              )}
            </div>
          )}

          {activeSection && activeSection.value && (
            <div
              ref={contentRef}
              className="prose max-w-none text-gray-800 prose-a:underline w-full"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </div>
      </div>
      
      {/* Scoped styles for red carousel dots */}
      <style>{`
        .my-red-dots .slick-dots li button { 
          background: #598931 !important; 
          border-radius: 50%;
          width: 12px;
          height: 12px;
        }
        .my-red-dots .slick-dots li.slick-active button { 
          background: #598931 !important; 
          transform: scale(1.2);
        }
        .my-red-dots .slick-dots {
          bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default ProductCatalogueBiggerView;
