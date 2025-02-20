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

const center = [38.37323, -97.37323];

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

  const showInProfile = settings?.showInProfile || [];

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="w-full relative">
          <MapContainer
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

            <CustomZoomControl />

            <MarkerClusterGroup>
            {data.map((store, index) => (
              // <Marker
              //   key={index}
              //   position={[store.latitude, store.longitude]}
              //   zIndexOffset={selectedStore?.srNo === store.srNo ? 1000 : 0}
              //   opacity={selectedStore?.srNo === store.srNo ? 1 : 0.6}
              //   eventHandlers={{
              //     click: () => setSelectedStore(store),
              //   }}
              <Marker
                key={index}
                position={[store.latitude, store.longitude]}
                zIndexOffset={selectedStore?.key_id === index+1 ? 1000 : 0}
                opacity={selectedStore?.key_id === index+1 ? 0.6 : 1}
                eventHandlers={{
                  click: () => setSelectedStore(store),
                }}
                // eventHandlers={{
                //   click: () =>
                //     setSelectedStore({
                //       ...store,
                //       images:
                //         typeof store.images === "string"
                //           ? store.images.split(",").map((img) => img.trim())
                //           : Array.isArray(store.images)
                //           ? store.images
                //           : [],
                //     }),
                // }}
              />
            ))}
            </MarkerClusterGroup>
          </MapContainer>

          {selectedStore && (
            <div className="absolute top-4 left-20 bg-white p-4 rounded shadow-md max-h-[600px] w-[300px] z-50">
              <div>
                <div
                  className="relative w-full h-40 rounded-md overflow-hidden shadow-md"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* <Carousel ref={carouselRef} autoplay dots>
                    {selectedStore.images.map((img, idx) => (
                      <div key={idx} className="w-full h-40">
                        <img
                          src={img}
                          alt={`Slide ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </Carousel> */}

                  {Array.isArray(selectedStore?.images) ||
                  typeof selectedStore?.images === "string" ? (
                    <Carousel ref={carouselRef} autoplay dots>
                      {(typeof selectedStore.images === "string"
                        ? selectedStore.images
                            .split(",")
                            .map((img) => img.trim())
                        : selectedStore.images
                      ).map((img, idx) => (
                        <div key={idx} className="w-full h-40">
                          <img
                            src={img}
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
                  )}

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

                {/* <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p className="font-semibold text-gray-700">Sr. No.:</p>
                  <p>{selectedStore.sr_no}</p>
                  <p className="font-semibold text-gray-700">Address:</p>
                  <p>{selectedStore.address}</p>
                  <p className="font-semibold text-gray-700">City:</p>
                  <p>{selectedStore.city}</p>
                  <p className="font-semibold text-gray-700">State:</p>
                  <p>{selectedStore.state}</p>
                  <p className="font-semibold text-gray-700">Pin Code:</p>
                  <p>{selectedStore.pin_code}</p>
                  <p className="font-semibold text-gray-700">Phone Number:</p>
                  <p>{selectedStore.phone}</p>
                  <p className="font-semibold text-gray-700">Store Manager:</p>
                  <p>{selectedStore.store_manager}</p>
                  <p className="font-semibold text-gray-700">Fuel:</p>
                  <p>{selectedStore.fuel}</p>
                  <p className="font-semibold text-gray-700">Pharmacy:</p>
                  <p>{selectedStore.pharmacy}</p>
                </div> */}
                {console.log(settings)}
                <hr />
                <div className="grid grid-cols-[auto_auto_1fr] gap-y-4 gap-x-4 mt-2 text-[#595959] font-poppins text-[15px] font-medium leading-normal">
                  <div>Sr. No.</div>
                  <div>:</div>
                  <div>{selectedStore["s_no."]}</div>
                  <div>Address</div>
                  <div>:</div>
                  <div>{selectedStore.address}</div>
                  <div>City</div>
                  <div>:</div>
                  <div>{selectedStore.city}</div>
                  <div>State</div>
                  <div>:</div>
                  <div>{selectedStore.state}</div>
                  <div>Pin Code</div>
                  <div>:</div>
                  <div>{selectedStore.pin_code}</div>
                  <div>Phone Number</div>
                  <div>:</div>
                  <div>{selectedStore.phone_number}</div>
                  <div>Store Manager</div>
                  <div>:</div>
                  <div>{selectedStore.store_manager}</div>
                  <div>Fuel</div>
                  <div>:</div>
                  <div>{selectedStore.fuel}</div>
                  <div>Pharmacy</div>
                  <div>:</div>
                  <div>{selectedStore.pharmacy}</div>
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
