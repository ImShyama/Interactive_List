import React, { useState, useRef, useEffect } from "react";
import { Carousel, Pagination } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import Table from "../interactive_list/Table";
// import { data, headers } from "../../utils/IntractiveMap_DummyData";
import L from "leaflet";
// import markerIcon from "../../assets/images/marker-icon.png";
// import markerIconSelected from "../../assets/images/marker-icon-selected.png";
import MarkerClusterGroup from "react-leaflet-cluster"; // Import Cluster Group
import { getDriveThumbnail } from "../../utils/globalFunctions";

// var center = [40.57402898172323, 74.51454199738905];
// var center = [21.1458, 79.0882];

// Custom Zoom Buttons
const CustomZoomControl = () => {
  const map = useMap();

  return (
    // <div className="leaflet-control leaflet-bar flex flex-col m-4">
    <div className="flex flex-col  absolute top-4 right-4 z-[1000] ">
      <button
        onClick={() => map.zoomIn()}
        className="leaflet-control-zoom-in bg-white text-black px-2 py-2 text-sm border-b border-gray-300 hover:bg-gray-200"
        title="Zoom in"
      >
        <FaPlus size={16} />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="leaflet-control-zoom-out bg-white text-black px-2 py-2 text-sm hover:bg-gray-200"
        title="Zoom out"
      >
        <FaMinus size={16} />
      </button>
    </div>
  );
};

const InteractiveMapView = ({ data, headers, settings }) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showMap, setShowMap] = useState(false);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const filterHeader = [
    "sr_no",
    "city",
    "state",
    "brand",
    "store_manager",
    "market_segment",
    "latitude",
    "longitude",
    "images",
  ];

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // let totalLat = 0;
  // let totalLng = 0;
  // let count = 0;

  // data.forEach(item => {
  //   const lat = parseFloat(item.latitude);
  //   const lng = parseFloat(item.longitude);

  //   if (!isNaN(lat) && !isNaN(lng)) {
  //     totalLat += lat;
  //     totalLng += lng;
  //     count++;
  //   }
  // });

  // const center = count > 0
  //   ? [totalLat / count, totalLng / count]
  //   : [21.1458, 79.0882]; // fallback default if nothing valid

  // console.log("🗺️ Center of the map:", center);


  const showInProfile = settings?.showInProfile || [];
  const showInCard = settings?.showInCard || [];
  console.log({  showInProfile, selectedStore, data, settings, showInCard, selectedStore, image: showInCard[0].title });

  // const showInDetails = showInProfile.

  const SetMapCenter = ({ center }) => {
    const map = useMap();

    useEffect(() => {
      if (center) {
        map.setView(center); // This updates the map center dynamically
      }
    }, [center, map]);

    return null;
  };

  const [mapCenter, setMapCenter] = useState(null); // null initially

  useEffect(() => {
    let totalLat = 0;
    let totalLng = 0;
    let count = 0;
  
    data.forEach((item) => {
      const lat = parseFloat(item[showInCard[2].title.replace(" ", "_").toLowerCase()]);
      const lng = parseFloat(item[showInCard[1].title.replace(" ", "_").toLowerCase()]);
  
      if (!isNaN(lat) && !isNaN(lng)) {
        totalLat += lat;
        totalLng += lng;
        count++;
      }
    });
  
    // if (count > 0) {
    //   const calculatedCenter = [totalLat / count, totalLng / count];
    //   console.log("🗺️ Center of the map:", calculatedCenter);
    //   setMapCenter(calculatedCenter);
    // }

    if (count > 0) {
      setMapCenter([totalLat / count, totalLng / count]);
    } else {
      setMapCenter([21.1458, 79.0882]); // fallback
    }

    // Delay showing the map to prevent jitter
  setTimeout(() => setShowMap(true), 2000);
  }, [data, showInCard]);
  



  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="w-full relative">
          {/* <MapContainer
            center={center}
            zoom={5}
            style={{
              width: "100%",
              height: "800px",
              position: "relative",
              zIndex: 0,
            }}
            zoomControl={false}
            scrollWheelZoom={false}
            whenReady={(map) => {
              map.target.scrollWheelZoom.disable();
              map.target.on("click", () => map.target.scrollWheelZoom.enable());
              map.target.on("mouseout", () =>
                map.target.scrollWheelZoom.disable()
              );
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <SetMapCenter center={center} />

            <CustomZoomControl />

            <MarkerClusterGroup>
              {data
                .filter((store) => store.latitude !== undefined && store.longitude !== undefined)
                .map((store, index) => (
                  <Marker
                    key={index}
                    position={[store[showInCard[2].title.replace(" ", "_").toLowerCase()], store[showInCard[1].title.replace(" ", "_").toLowerCase()]]}
                    zIndexOffset={selectedStore?.key_id === index + 1 ? 1000 : 0}
                    opacity={selectedStore?.key_id === index + 1 ? 0.6 : 1}
                    eventHandlers={{
                      click: () => setSelectedStore(store),
                    }}

                  />
                ))}
            </MarkerClusterGroup>
          </MapContainer> */}

          {(mapCenter && showMap) ? (
            <MapContainer
              center={mapCenter}
              zoom={5}
              style={{
                width: "100%",
                height: "800px",
                position: "relative",
                zIndex: 0,
              }}
              zoomControl={false}
              scrollWheelZoom={false}
              whenReady={(map) => {
                map.target.scrollWheelZoom.disable();
                map.target.on("click", () => map.target.scrollWheelZoom.enable());
                map.target.on("mouseout", () => map.target.scrollWheelZoom.disable());
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <SetMapCenter center={mapCenter} />
              <CustomZoomControl />
              <MarkerClusterGroup>
                {data
                  .filter((store) => store.latitude && store.longitude)
                  .map((store, index) => (
                    <Marker
                      key={index}
                      position={[
                        parseFloat(store[showInCard[2]?.title?.replace(" ", "_").toLowerCase()]),
                        parseFloat(store[showInCard[1]?.title?.replace(" ", "_").toLowerCase()])
                      ]}
                      zIndexOffset={selectedStore?.key_id === index + 1 ? 1000 : 0}
                      opacity={selectedStore?.key_id === index + 1 ? 0.6 : 1}
                      eventHandlers={{
                        click: () => setSelectedStore(store),
                      }}
                    />
                  ))}
              </MarkerClusterGroup>
            </MapContainer>
          ) :
            <div className="flex justify-center items-center h-[800px]">
              <span className="text-gray-500 text-lg">Loading map...</span>
            </div>
          }


          {selectedStore && (
            <div className="absolute top-4 left-20 bg-white p-4 rounded shadow-md max-h-[600px] w-[300px] z-50">
              <div>
                {
                  showInCard[0]?.title.trim() == '' ?
                    null
                    : (
                      <div
                        className="relative w-full h-40 rounded-md overflow-hidden shadow-md"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        {/* Carousel for Photo Swiping */
                          Array.isArray(selectedStore[showInCard[0]?.title.replace(" ", "_").toLowerCase()]) || typeof selectedStore[showInCard[0]?.title.replace(" ", "_").toLowerCase()] === "string"
                            ? (<Carousel ref={carouselRef} autoplay dots>
                              {(typeof selectedStore[showInCard[0]?.title.replace(" ", "_").toLowerCase()] === "string"
                                ? selectedStore[showInCard[0]?.title.replace(" ", "_").toLowerCase()]
                                  .split(",")
                                  .map((img) => img.trim())
                                : selectedStore[showInCard[0]?.title.replace(" ", "_").toLowerCase()]
                              ).map((img, idx) => (
                                <div key={idx} className="w-full h-40">
                                  <img
                                    src={getDriveThumbnail(img)}
                                    alt={`Slide ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </Carousel>
                            ) : (
                              <p className="text-center text-gray-500">
                                No images available
                              </p>
                            )
                        }

                        {isHovered && (
                          <>
                            <button
                              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white text-xl p-2 rounded-full hover:bg-opacity-80 transition-all z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                carouselRef.current.prev();
                              }}
                            >
                              <LeftOutlined />
                            </button>
                            <button
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white text-xl p-2 rounded-full hover:bg-opacity-80 transition-all z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                carouselRef.current.next();
                              }}
                            >
                              <RightOutlined />
                            </button>
                          </>
                        )}
                      </div>
                    )
                }


                <div className="flex items-center justify-between mt-4">
                  <h3 className="font-poppins text-[#484848] text-lg">
                    Store Details
                  </h3>
                  <button
                    className="text-[#000000] hover:text-[#598931]"
                    onClick={() => setSelectedStore(null)}
                  >
                    <CloseOutlined className="text-lg" />
                  </button>
                </div>
                <hr />
                <div className="grid grid-cols-[auto_auto_1fr] gap-y-4 gap-x-4 mt-2 text-[#595959] font-poppins text-[15px] font-medium leading-normal">
                  {showInProfile
                    .filter((item) => item.title.trim() !== "")
                    .map((item, i) => (
                      <React.Fragment key={i}>
                        <div>{item.title}</div>
                        <div>:</div>
                        <div>{selectedStore[item.title.replace(" ", "_").toLowerCase()]}</div>
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <Table
        data={data}
        tempHeader={headers}
        headers={filterHeader}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        paginatedData={paginatedData}
      /> */}
    </div>
  );
};

export default InteractiveMapView;
