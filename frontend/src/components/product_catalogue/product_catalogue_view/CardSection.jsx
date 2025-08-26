import React, { useState, useContext } from "react";
import { Pagination } from "antd";
import ProductCatalogueCard from "../ProductCatalogueCard";
import cardImage from "../../../assets/images/product_catalogue_card.png"; // Replace with actual image path
import { UserContext } from "../../../context/UserContext";
import ProductTitle from "./ProductTitle";

const dummyData = [
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",
    image: cardImage,
    link: "#",
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",
    image: cardImage,
    link: "#",
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",
    image: cardImage,
    link: "#",
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",
    image: cardImage,
    link: "#",
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",
    image: cardImage,
    link: "#",
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",
    image: cardImage,
    link: "#",
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",
    image: cardImage,
    link: "#",
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",
    image: cardImage,
    link: "#",
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",
    image: cardImage,
    link: "#",
  },
  // Add more items as needed...
];

const CardSection = ({ settings, data }) => {
  const { dataRows } = useContext(UserContext);
  const headerSettings = settings?.productCatalogue?.headerSettings || {};
  const cardSettings = settings?.productCatalogue?.cardSettings || {};
  const footerSettings = settings?.productCatalogue?.footerSettings || {};
  const showInCard = settings?.showInCard || [];
  console.log({ dataRows, settings, headerSettings, cardSettings, footerSettings, showInCard });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(cardSettings?.numberOfColumns * cardSettings?.numberOfRows || 6);
  const [searchQuery, setSearchQuery] = useState("");

  const sourceData = Array.isArray(data) && data.length > 0 ? data : (Array.isArray(dataRows) ? dataRows : []);

  // Build list of keys to search across based on showInCard config
  const keysForSearch = (showInCard || [])
    .map((c) => c?.value)
    .filter(Boolean)
    .map((k) => k.replaceAll(" ", "_").toLowerCase());

  // Filter by searchQuery across configured fields
  const filteredData = (searchQuery || "").trim().length === 0
    ? sourceData
    : sourceData.filter((row) => {
        return keysForSearch.some((key) => {
          const value = row?.[key];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
      });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  console.log({ "paginatedConsoleData" : data, settings, paginatedData})

  let multipleimages = paginatedData[0]?.[showInCard[0]?.value?.replaceAll(" ", "_").toLowerCase()]?.split(",") || [];
  let title1 = paginatedData[0]?.[showInCard[1]?.value?.replaceAll(" ", "_").toLowerCase()] ;
  let title2 = paginatedData[0]?.[showInCard[2]?.value?.replaceAll(" ", "_").toLowerCase()] ;
  let title3 = paginatedData[0]?.[showInCard[3]?.value?.replaceAll(" ", "_").toLowerCase()];
  let title4 = paginatedData[0]?.[showInCard[4]?.value?.replaceAll(" ", "_").toLowerCase()];
  let title5 = paginatedData[0]?.[showInCard[5]?.value?.replaceAll(" ", "_").toLowerCase()];

  console.log({multipleimages_cardsection: multipleimages, title1, title2, title3, title4, title5, showInCard})
  return (
    <div className="p-6">
      <ProductTitle
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setCurrentPage(1);
          setSearchQuery(q);
        }}
      />
      {/* Scrollable Grid Section */}
      <div
        style={{ width: "100%", overflowX: "auto", maxHeight: "600px" }}
        className={`bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${cardSettings?.numberOfColumns} lg:grid-cols-${cardSettings?.numberOfColumns} gap-6 mt-4 w-full`}
      >
        {paginatedData.map((item, index) => {
          let multipleimages = item[showInCard[0]?.value?.replaceAll(" ", "_").toLowerCase()]?.split(",") || [];
          let title1 = item[showInCard[1]?.value?.replaceAll(" ", "_").toLowerCase()] ;
          let title2 = item[showInCard[2]?.value?.replaceAll(" ", "_").toLowerCase()] ;
          let title3 = item[showInCard[3]?.value?.replaceAll(" ", "_").toLowerCase()];
          let title4 = item[showInCard[4]?.value?.replaceAll(" ", "_").toLowerCase()];
          let title5 = item[showInCard[5]?.value?.replaceAll(" ", "_").toLowerCase()];
          return <ProductCatalogueCard key={index} multipleimages={multipleimages} title1={title1} title2={title2} title3={title3} title4={title4} title5={title5} cardSettings={cardSettings} />
        }
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          showSizeChanger
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </div>
    </div>
  );
};

export default CardSection;
