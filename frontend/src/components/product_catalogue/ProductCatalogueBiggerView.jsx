

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
  const state = location.state || {};
  // const effectiveData = state?.payload?.data;
  // const effectiveSettings =  state?.payload?.settings;
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
      // Optional for broadcast/local payloads (may be undefined)
      setRowData(p.row || null);
      setShowInProfile(p.settings.showInProfile || null);
      setShowInBox(p.settings.showInBox || null);
      setShowInCard(p.settings.showInCard || null);
      setCardSettings(p.settings?.productCatalogue?.cardSettings || null);
      setActiveSection(p.settings.showInBox?.[0]);
      setEffectiveData(p.row);
      setEffectiveSettings(p.settings);

      setLoading(false);
      // cleanup after 1 hour like video flow
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

  // State to track active section (default: "features")

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      if (data.hasOwnProperty(normalizedKey)) {
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


  // Header visibility effect
  useEffect(() => {
    setHideHeader(true);
    return () => {
      setHideHeader(false);
    };
  }, [setHideHeader]);

  


  return (
    <div className="min-h-screen bg-white flex flex-col p-2">

      {/* Header Section */}
      <HeaderSection isPopup={true} data={effectiveData} settings={effectiveSettings} />
      {/* Product Image and Description Section - Full Width */}
      <div className="w-[90%] md:w-[95%] mx-auto py-20">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-16">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2">
            {/* <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-[#598931] p-2 rounded-full shadow-md z-10"
            >
              <IoArrowBack className="text-white text-3xl" />
            </button> */}

            <div className="relative w-full bg-[#FDFEFF] rounded-[51.746px] border-[2.07px] border-[#F1F1F1] shadow-lg overflow-hidden h-auto">
              <Carousel
                ref={carouselRef}
                autoplay={true}
                dots={true}
                className="w-full h-full"
                afterChange={(index) => setCurrentIndex(index)}
              >
                {multipleimages.length > 0 ? (
                  multipleimages.map((img, index) => (
                    <div key={index} className="w-full h-full">
                      <img
                        src={getDriveThumbnail(img) || img}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-[320px] object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No images available
                  </div>
                )}
              </Carousel>

              <div className="absolute bottom-4 left-0 w-full py-2 flex justify-center">
                <ul className="custom-carousel-dots"></ul>
              </div>

              <button
                onClick={() =>
                  window.open(multipleimages[currentIndex], "_blank")
                }
                className="absolute bottom-4 right-4 bg-[#D3EEBC] p-2 rounded-full shadow-md"
              >
                <CgArrowsExpandRight className="text-[#598931] text-2xl" />
              </button>
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full  md:w-1/2 flex flex-col items-start text-left ">
            {console.log({ rowData, showInCard, showInProfile, showInBox })}
            {Array.isArray(showInCard) && showInCard.length > 1 && rowData && (
              <div className="w-full  mb-4 space-y-4">
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
                      {/* <div className="text-sm text-[#9B9B9B] font-[Poppins]">{item?.value}</div> */}
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
        <div className="relative flex flex-col  items-start gap-[15.246px] rounded-[50px] bg-[rgba(211,238,188,0.10)] px-12 md:px-20 pt-8 md:pt-12 pb-20 shadow-lg">
          {/* Buttons at the Top Center */}
          <div className="w-full flex justify-center gap-8 mb-10">
            {showInBox?.map((item) => {
              return (
                <button
                  key={item.id || item.text} // good practice: unique key
                  onClick={() => setActiveSection(item)} // use item-specific value
                  className={`px-4 py-2 rounded-[8px] font-semibold shadow-md transition-all duration-300 text-xl ${(activeSection?.text === item?.text)
                    ? "bg-[#598931] text-white"
                    : "bg-[#EBEEE9] text-[#9B9B9B]"
                    }`}
                >
                  <PiStarFour className="inline-block mr-2" /> {item.text}
                </button>
              )
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
                  {features.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>


              <div className="mb-10">
                <h4 className="text-3xl font-semibold text-gray-800 mb-6">
                  Use Cases
                </h4>
                <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
                  {features.useCases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>


              <div>
                <h4 className="text-3xl font-semibold text-gray-800 mb-6">
                  Features List
                </h4>
                <ul className="list-disc list-inside text-xl text-gray-700 space-y-3">
                  {features.featureList.map((feature, index) => (
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

              <a
                href={
                  sheetlink?.startsWith("http")
                    ? sheetlink
                    : `https://${sheetlink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D3EEBC80] border-2 rounded-3xl px-4 py-1 text-xl underline hover:text-[#598931]"
              >
                Make a Link
              </a>
            </div>
          )}

          {sectionType === "video" && (
            <div className="w-[80%] mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Updates / Video
              </h3>

              <a
                href={
                  videolink?.startsWith("http")
                    ? videolink
                    : `https://${videolink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D3EEBC80] border-2 rounded-3xl px-4 py-1 text-xl underline hover:text-[#598931]"
              >
                Instruction Video
              </a>
            </div>
          )}

          {/* {activeSection &&
            activeSection.value
          } */}
          {activeSection &&
            <div
          
            className="prose max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            
          />
        }


        </div>
      </div>
    </div>
  );
};

export default ProductCatalogueBiggerView;
