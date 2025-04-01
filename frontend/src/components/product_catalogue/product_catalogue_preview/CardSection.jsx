import React, { useState } from "react";
import { Pagination } from "antd";
import ProductCatalogueCard from "../ProductCatalogueCard";
import cardImage1 from "../../../assets/images/product_catalogue_card.png"; // Replace with actual image path
import cardImage2 from "../../../assets/images/detailimg.png"; // Replace with actual image path
import cardImage3 from "../../../assets/images/thumbnail1.png"; // Replace with actual image path
const dummyData = [
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",

    multipleimages: [cardImage1, cardImage2, cardImage3],
    sheetlink:
      "https://docs.google.com/spreadsheets/d/1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4/edit?gid=1974260981#gid=1974260981",
    videolink: "https://www.youtube.com/embed/a4vVGvrsKC8",
    features: {
      benefits: [
        "Efficiency: Automates data analysis and reporting.",
        "Insights: Provides valuable insights for decision-making.",
        "Communication: Easily shares reports via email and WhatsApp.",
        "Scalability: Handles various data sets and growing needs.",
        "Cost-effective: Reduces manual effort and improves efficiency.",
      ],
      useCases: [
        "Business Performance Tracking: Automate report generation and sharing.",
        "Sales Reporting: Streamline sales data analysis and share reports instantly.",
        "Financial Analysis: Compile financial data, track trends, and share insights.",
        "Client Reporting: Generate and send detailed reports to clients.",
        "Employee Performance Reviews: Automate HR reporting for tracking performance metrics.",
      ],
      featureList: [
        "Analyze Data given in any Google Sheet or Sheets.",
        "Generate reports or answer any question on the same.",
        "Send reports via Email & WhatsApp on a schedule.",
        "No more need to locate sheets & go through data manually.",
        "Provides insights for decision-making automatically.",
        "Limitation: 4096 tokens of data for GPT 3.5.",
      ],
    },
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",

    multipleimages: [cardImage1, cardImage2, cardImage3],
    sheetlink:
      "https://docs.google.com/spreadsheets/d/1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4/edit?gid=1974260981#gid=1974260981",
    features: {
      benefits: [
        "Efficiency: Automates data analysis and reporting.",
        "Insights: Provides valuable insights for decision-making.",
        "Communication: Easily shares reports via email and WhatsApp.",
        "Scalability: Handles various data sets and growing needs.",
        "Cost-effective: Reduces manual effort and improves efficiency.",
      ],
      useCases: [
        "Business Performance Tracking: Automate report generation and sharing.",
        "Sales Reporting: Streamline sales data analysis and share reports instantly.",
        "Financial Analysis: Compile financial data, track trends, and share insights.",
        "Client Reporting: Generate and send detailed reports to clients.",
        "Employee Performance Reviews: Automate HR reporting for tracking performance metrics.",
      ],
      featureList: [
        "Analyze Data given in any Google Sheet or Sheets.",
        "Generate reports or answer any question on the same.",
        "Send reports via Email & WhatsApp on a schedule.",
        "No more need to locate sheets & go through data manually.",
        "Provides insights for decision-making automatically.",
        "Limitation: 4096 tokens of data for GPT 3.5.",
      ],
    },
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",

    multipleimages: [cardImage1, cardImage2, cardImage3],
    sheetlink:
      "https://docs.google.com/spreadsheets/d/1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4/edit?gid=1974260981#gid=1974260981",
    videolink: "https://www.youtube.com/embed/a4vVGvrsKC8",

    features: {
      benefits: [
        "Efficiency: Automates data analysis and reporting.",
        "Insights: Provides valuable insights for decision-making.",
        "Communication: Easily shares reports via email and WhatsApp.",
        "Scalability: Handles various data sets and growing needs.",
        "Cost-effective: Reduces manual effort and improves efficiency.",
      ],
      useCases: [
        "Business Performance Tracking: Automate report generation and sharing.",
        "Sales Reporting: Streamline sales data analysis and share reports instantly.",
        "Financial Analysis: Compile financial data, track trends, and share insights.",
        "Client Reporting: Generate and send detailed reports to clients.",
        "Employee Performance Reviews: Automate HR reporting for tracking performance metrics.",
      ],
      featureList: [
        "Analyze Data given in any Google Sheet or Sheets.",
        "Generate reports or answer any question on the same.",
        "Send reports via Email & WhatsApp on a schedule.",
        "No more need to locate sheets & go through data manually.",
        "Provides insights for decision-making automatically.",
        "Limitation: 4096 tokens of data for GPT 3.5.",
      ],
    },
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",

    multipleimages: [cardImage1, cardImage2, cardImage3],
    sheetlink:
      "https://docs.google.com/spreadsheets/d/1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4/edit?gid=1974260981#gid=1974260981",
    videolink: "https://www.youtube.com/embed/a4vVGvrsKC8",

    features: {
      benefits: [
        "Efficiency: Automates data analysis and reporting.",
        "Insights: Provides valuable insights for decision-making.",
        "Communication: Easily shares reports via email and WhatsApp.",
        "Scalability: Handles various data sets and growing needs.",
        "Cost-effective: Reduces manual effort and improves efficiency.",
      ],
      useCases: [
        "Business Performance Tracking: Automate report generation and sharing.",
        "Sales Reporting: Streamline sales data analysis and share reports instantly.",
        "Financial Analysis: Compile financial data, track trends, and share insights.",
        "Client Reporting: Generate and send detailed reports to clients.",
        "Employee Performance Reviews: Automate HR reporting for tracking performance metrics.",
      ],
      featureList: [
        "Analyze Data given in any Google Sheet or Sheets.",
        "Generate reports or answer any question on the same.",
        "Send reports via Email & WhatsApp on a schedule.",
        "No more need to locate sheets & go through data manually.",
        "Provides insights for decision-making automatically.",
        "Limitation: 4096 tokens of data for GPT 3.5.",
      ],
    },
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",

    multipleimages: [cardImage1, cardImage2, cardImage3],
    sheetlink:
      "https://docs.google.com/spreadsheets/d/1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4/edit?gid=1974260981#gid=1974260981",
    videolink: "https://www.youtube.com/embed/a4vVGvrsKC8",

    features: {
      benefits: [
        "Efficiency: Automates data analysis and reporting.",
        "Insights: Provides valuable insights for decision-making.",
        "Communication: Easily shares reports via email and WhatsApp.",
        "Scalability: Handles various data sets and growing needs.",
        "Cost-effective: Reduces manual effort and improves efficiency.",
      ],
      useCases: [
        "Business Performance Tracking: Automate report generation and sharing.",
        "Sales Reporting: Streamline sales data analysis and share reports instantly.",
        "Financial Analysis: Compile financial data, track trends, and share insights.",
        "Client Reporting: Generate and send detailed reports to clients.",
        "Employee Performance Reviews: Automate HR reporting for tracking performance metrics.",
      ],
      featureList: [
        "Analyze Data given in any Google Sheet or Sheets.",
        "Generate reports or answer any question on the same.",
        "Send reports via Email & WhatsApp on a schedule.",
        "No more need to locate sheets & go through data manually.",
        "Provides insights for decision-making automatically.",
        "Limitation: 4096 tokens of data for GPT 3.5.",
      ],
    },
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",

    multipleimages: [cardImage1, cardImage2, cardImage3],
    sheetlink:
      "https://docs.google.com/spreadsheets/d/1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4/edit?gid=1974260981#gid=1974260981",
    videolink: "https://www.youtube.com/embed/a4vVGvrsKC8",

    features: {
      benefits: [
        "Efficiency: Automates data analysis and reporting.",
        "Insights: Provides valuable insights for decision-making.",
        "Communication: Easily shares reports via email and WhatsApp.",
        "Scalability: Handles various data sets and growing needs.",
        "Cost-effective: Reduces manual effort and improves efficiency.",
      ],
      useCases: [
        "Business Performance Tracking: Automate report generation and sharing.",
        "Sales Reporting: Streamline sales data analysis and share reports instantly.",
        "Financial Analysis: Compile financial data, track trends, and share insights.",
        "Client Reporting: Generate and send detailed reports to clients.",
        "Employee Performance Reviews: Automate HR reporting for tracking performance metrics.",
      ],
      featureList: [
        "Analyze Data given in any Google Sheet or Sheets.",
        "Generate reports or answer any question on the same.",
        "Send reports via Email & WhatsApp on a schedule.",
        "No more need to locate sheets & go through data manually.",
        "Provides insights for decision-making automatically.",
        "Limitation: 4096 tokens of data for GPT 3.5.",
      ],
    },
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",

    multipleimages: [cardImage1, cardImage2, cardImage3],
    sheetlink:
      "https://docs.google.com/spreadsheets/d/1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4/edit?gid=1974260981#gid=1974260981",
    videolink: "https://www.youtube.com/embed/a4vVGvrsKC8",

    features: {
      benefits: [
        "Efficiency: Automates data analysis and reporting.",
        "Insights: Provides valuable insights for decision-making.",
        "Communication: Easily shares reports via email and WhatsApp.",
        "Scalability: Handles various data sets and growing needs.",
        "Cost-effective: Reduces manual effort and improves efficiency.",
      ],
      useCases: [
        "Business Performance Tracking: Automate report generation and sharing.",
        "Sales Reporting: Streamline sales data analysis and share reports instantly.",
        "Financial Analysis: Compile financial data, track trends, and share insights.",
        "Client Reporting: Generate and send detailed reports to clients.",
        "Employee Performance Reviews: Automate HR reporting for tracking performance metrics.",
      ],
      featureList: [
        "Analyze Data given in any Google Sheet or Sheets.",
        "Generate reports or answer any question on the same.",
        "Send reports via Email & WhatsApp on a schedule.",
        "No more need to locate sheets & go through data manually.",
        "Provides insights for decision-making automatically.",
        "Limitation: 4096 tokens of data for GPT 3.5.",
      ],
    },
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",

    multipleimages: [cardImage1, cardImage2, cardImage3],
    sheetlink:
      "https://docs.google.com/spreadsheets/d/1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4/edit?gid=1974260981#gid=1974260981",
    videolink: "https://www.youtube.com/embed/a4vVGvrsKC8",

    features: {
      benefits: [
        "Efficiency: Automates data analysis and reporting.",
        "Insights: Provides valuable insights for decision-making.",
        "Communication: Easily shares reports via email and WhatsApp.",
        "Scalability: Handles various data sets and growing needs.",
        "Cost-effective: Reduces manual effort and improves efficiency.",
      ],
      useCases: [
        "Business Performance Tracking: Automate report generation and sharing.",
        "Sales Reporting: Streamline sales data analysis and share reports instantly.",
        "Financial Analysis: Compile financial data, track trends, and share insights.",
        "Client Reporting: Generate and send detailed reports to clients.",
        "Employee Performance Reviews: Automate HR reporting for tracking performance metrics.",
      ],
      featureList: [
        "Analyze Data given in any Google Sheet or Sheets.",
        "Generate reports or answer any question on the same.",
        "Send reports via Email & WhatsApp on a schedule.",
        "No more need to locate sheets & go through data manually.",
        "Provides insights for decision-making automatically.",
        "Limitation: 4096 tokens of data for GPT 3.5.",
      ],
    },
  },
  {
    title: "CBX NOTES",
    subtitle: "More Than Just Notes – It's Your Digital Workspace",
    description:
      "Perplexity AI is an AI-powered tool that delivers accurate, concise answers to complex queries using natural language processing, enhancing the search experience with clear responses from trusted sources.",

    multipleimages: [cardImage1, cardImage2, cardImage3],
    sheetlink:
      "https://docs.google.com/spreadsheets/d/1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4/edit?gid=1974260981#gid=1974260981",
    videolink: "https://www.youtube.com/embed/a4vVGvrsKC8",

    features: {
      benefits: [
        "Efficiency: Automates data analysis and reporting.",
        "Insights: Provides valuable insights for decision-making.",
        "Communication: Easily shares reports via email and WhatsApp.",
        "Scalability: Handles various data sets and growing needs.",
        "Cost-effective: Reduces manual effort and improves efficiency.",
      ],
      useCases: [
        "Business Performance Tracking: Automate report generation and sharing.",
        "Sales Reporting: Streamline sales data analysis and share reports instantly.",
        "Financial Analysis: Compile financial data, track trends, and share insights.",
        "Client Reporting: Generate and send detailed reports to clients.",
        "Employee Performance Reviews: Automate HR reporting for tracking performance metrics.",
      ],
      featureList: [
        "Analyze Data given in any Google Sheet or Sheets.",
        "Generate reports or answer any question on the same.",
        "Send reports via Email & WhatsApp on a schedule.",
        "No more need to locate sheets & go through data manually.",
        "Provides insights for decision-making automatically.",
        "Limitation: 4096 tokens of data for GPT 3.5.",
      ],
    },
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
