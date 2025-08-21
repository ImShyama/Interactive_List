export const CLIENT_ID = "733145859090-a841efgntmtqmpqn8u08oiulimf0leeu.apps.googleusercontent.com";
export const HOST = "http://localhost:4000"
export const FRONTENDHOST = "http://localhost:5173"
// export const HOST = ""
// export const FRONTENDHOST = "https://interact.ceoitbox.com"
import PeopleImage from "../assets/images/PeopleImage.png";
import PeopleImage1 from "../assets/images/PeopleImage1.png";
import PeopleImage2 from "../assets/images/PeopleImage2.png";
import VideoImage from "../assets/images/VideoImage.png";
import VideoImage1 from "../assets/images/VideoImage1.png";
import VideoImage2 from "../assets/images/VideoImage2.png";
import PhotoImage from "../assets/images/PhotoGallery_Card_Image.png";
import InteractiveMapImage from "../assets/images/InteractiveMap_Card_Image.png"
import InteractiveList from "../assets/images/InteractiveList.png"
import InteractiveList1 from "../assets/images/InteractiveList1.png"
import InteractiveList2 from "../assets/images/InteractiveList2.png"

import InteractiveMap from "../assets/images/InteractiveMap.png"
import InteractiveMap1 from "../assets/images/InteractiveMap1.png"
import InteractiveMap2 from "../assets/images/InteractiveMap2.png"
import PeopleDirectory from "../assets/images/PeopleDirectoryCard.png"
import PhotoGallery from "../assets/images/PhotoGallery.png"
import PhotoGallery1 from "../assets/images/PhotoGallery1.png"
import PhotoGallery2 from "../assets/images/PhotoGallery2.png"
import ProductCatalogue from "../assets/images/ProductCatalogue.png"
import VideoGallery from "../assets/images/VideoGallery.png"
export const APPSNAME = [
  "Interactive List",
  "Interactive Map",
  "People Directory",
  "Photo Gallery",
  "Video Gallery",
  // "Product Catalogue",
];
export const CLIENTID = '260938166249-rv9fgk97t8b2qmrpi5nqk8hd4frd2qba.apps.googleusercontent.com';
export const DEVELOPERKEY = 'AIzaSyBnH_ONkdpY5NAFLdy6TKe4Y6SyEGmRzwQ';

export const OPTIONS = [
  { value: 'Interactive List' },
  { value: 'Interactive Map' },
  { value: 'People Directory' },
  { value: 'Photo Gallery' },
  // { value: 'Product Catalogue' },
  { value: 'Video Gallery' },
];

export const APPS = [
  {
    appName: "Interactive List",
    appView: "InteractiveListView",
    appImg: InteractiveList,
    description: "Transform raw data into an interactive, searchable, and customizable table.",
    appID: "1Mp4Fnw22ukZyZaWtP-apjcHCUeuWswqCYGHX9xEhTbQ",
    spreadSheetName: "Data",
    overview:
      "Transform your raw data into a fully interactive, searchable, and customizable table. Ideal for employee databases, client records, or project tracking.",
    multipleImage: [InteractiveList,InteractiveList1,InteractiveList2],
    standOut: [
      {
        "Seamless Data Management":
          "Easily select your desire spreadsheet data and convert it into an organized table view. Enjoy edit, delete, and select functionalities directly in the table.",
      },
      {
        "Fully Customizable Tables":
          "Use built-in settings to customize font size, colors, background, and overall appearance of both headers and body to suit your brand style.",
      },
      {
        "Powerful Filtering & Search":
          "Enable advanced search, sorting, and filtering across all columns, so you can instantly find the information you need.",
      },
    ],
  },
  {
    appName: "People Directory",
    appView: "PeopleDirectoryPreview",
    appImg: PeopleDirectory,
    description: "Convert your employee database into an interactive format.",
    appID: "1VIWkwCewrs9Ydbo4mTWLovsa78jX1ZJc33BJpaZ5WHg",
    spreadSheetName: "Data",
    overview:
      "The People Directory is a dynamic, interactive tool designed to help organizations present, explore, and connect with their team members in one place. Whether you're a startup or an enterprise, this tool allows for a clean, engaging, and searchable view of your workforce.",
    multipleImage: [PeopleImage, PeopleImage1, PeopleImage2],
    standOut: [
      {
        "Centralized Directory":
          "Keep all employee or team data in one centralized place. Search, sort, and filter by department, location, skills, or any custom attribute.",
      },
      {
        "Interactive & User-Friendly Design":
          "Sleek, card-style interface with quick access to employee profiles. Click to view detailed bios, contact details, and project involvement.",
      },
      {
        "Customizable to Your Needs":
          "Easily customize fields to match your company’s needs—whether it's for HR use, internal networking, or a public-facing team page.",
      },
    ],
  },
  {
    appName: "Video Gallery",
    appView: "VideoGalleryPreview",
    appImg: VideoGallery,
    description: "Transform scattered videos into a visually appealing and structured gallery.",
    appID: "1d8_iPCgw7NhMd-4Jjl4RY_aENd0kA-j3YiaB24mVe4U",
    spreadSheetName: "Data",
    overview:
      "The Video Gallery helps you showcase your visual content in a clean, structured, and interactive way. Whether you're highlighting tutorials, marketing campaigns, internal presentations, or testimonials—this gallery organizes your videos beautifully for easy access and engagement.",
    multipleImage: [VideoImage, VideoImage1, VideoImage2],
    standOut: [
      {
        "Smart Categorization":
          "Easily sort videos into categories like marketing, product tutorials, or team updates. Make it easier for viewers to find what they’re looking for.",
      },
      {
        "Responsive and Easy to Embed":
          "Designed to work on all devices, the gallery can be embedded into your internal tools, websites, or shared portals with ease.",
      },
      {
        "Interactive Player & Metadata":
          "Integrated video viewer with detailed metadata—title, tags, duration, creator info, and more—all in one clean card format.",
      },
    ],
  },
  {
    appName: "Photo Gallery",
    appView: "PhotoGalleryPreview",
    appImg: PhotoGallery,
    description: "Easily organize and explore images in a structured gallery with zoom and slideshow features.",
    appID: "1U8KFBe4oEtO5RmA3J2aj5F0zUIgghDRq5Y3JIi8VVq4",
    spreadSheetName: "Data",
    overview:
      "The Photo Gallery offers a seamless and visually stunning way to organize, browse, and present images. Whether you're showcasing event pictures, product photography, employee portraits, or visual assets, our tool makes image management easy and efficient.",
    multipleImage: [PhotoGallery, PhotoGallery1, PhotoGallery2],
    standOut: [
      {
        "Clean Visual Layout":
          "Present your image assets in a structured, grid-based layout that’s easy to browse and pleasing to the eye. Designed to handle everything from product photos to event galleries.",
      },
      {
        "Easy Upload & Categorization":
          "Quickly upload photos in bulk, add tags or categories, and organize them for easy retrieval. Ideal for teams that need centralized photo storage with smart filters.",
      },
      {
        "Seamless Preview & Sharing":
          "View multiple images in a smooth slideshow or video-style preview. Click to expand any image, then copy and share the link with internal teams or external users — all through a responsive and easy-to-use interface.",
      },
    ],
  },
  {
    appName: "Interactive Map",
    appView: "InteractiveMapPreview",
    appImg: InteractiveMap,
    description: "Create an interactive map to display multiple locations with details, images, and search filters.",
    appID: "1IDvlKAFVt5xc06RGtHXZ9I5SDoBbIGAPBe8N4o0O6oQ",
    spreadSheetName: "Data",
    overview:
      "The Interactive Map allows you to display data in a location-based format, making it easier to explore, analyze, and present geographically distributed information. Whether it's store locations, employee spread, service zones, or client territories — make it all interactive and visual.",
    multipleImage: [InteractiveMap,InteractiveMap1,InteractiveMap2],
    standOut: [
      {
        "Geo-Based Visualization":
          "See your workforce, customers, or assets displayed directly on an interactive map. Quickly understand location distribution and drill down into key areas.",
      },
      {
        "Filter & Search by Region":
          "Use built-in filters to segment by country, region, or custom labels. Perfect for teams managing global operations, remote workers, or regional marketing data.",
      },
      {
        "Interactive Marker Insights":
          "Click on any marker to view detailed store information—such as brand, address, and store manager—displayed in a clean and organized card layout. Image support is included where available, enhancing context without clutter.",
      },
    ],
  },
  // {
  //     appName: "Product Catalogue",
  //     appView: "ProductCataloguePreview",
  //     appImg: ProductCatalogue,
  //     description: "Create an interactive map to display multiple locations with details, images, and search filters.",
  //     appID: "1Ec32czq2ilWYGKllZ8SBrt_RiViSPpPN2awdB2tnMj4",
  //     spreadSheetName: "Data",
  //     overview:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",
  //     multipleImage: [PeopleImage, VideoImage],
  //     standOut: [
  //       {
  //         "Heading 1":
  //           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",
  //       },
  //       {
  //         "Heading 2":
  //           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",
  //       },
  //       {
  //         "Heading 3":
  //           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",
  //       },
  //     ],
  // },
];
// export const CLIENTID = '210551094674-r1bvcns06j8pj06bk8dnfhl3mh6feuag.apps.googleusercontent.com';
// export const DEVELOPERKEY = 'AIzaSyBnH_ONkdpY5NAFLdy6TKe4Y6SyEGmRzwQ'; // Use correct developer key