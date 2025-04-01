import React, { useState } from "react";
import { Pagination } from "antd";
import ProductCatalogueCard from "../ProductCatalogueCard";
import cardImage from "../../../assets/images/product_catalogue_card.png"; // Replace with actual image path

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

const CardSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Adjust the page size as needed

  const paginatedData = dummyData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      {/* Scrollable Grid Section */}
      <div
        style={{ width: "100%", overflowX: "auto", maxHeight: "600px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-3 w-full"
      >
        {paginatedData.map((item, index) => (
          <ProductCatalogueCard key={index} {...item} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={dummyData.length}
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
