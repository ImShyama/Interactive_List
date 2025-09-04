import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios, { spread } from "axios";
import "../../setting.css";
import settingIcon from "../../../assets/settingIcon.svg";
import cancelIcon from "../../../assets/cancelIcon.svg";
// import searchIcon from "../assets/searchIcon.svg";
// import videoIcon from "../assets/videoIcon.svg";
// import refreshIcon from "../assets/refreshIcon.svg";
// import helpIcon from "../assets/helpIcon.svg";
// import copyIcon from "../assets/copyIcon.svg";
// import shareIcon from "../assets/shareIcon.svg";
// import logoutIcon from "../assets/logoutIcon.svg";
import downIcon from "../../../assets/downIcon.svg";
import upIcon from "../../../assets/upIcon.svg";
// import filterIcon from "../assets/filterIcon.svg";
import sheetIcon from "../../../assets/sheetIcon.svg";
import openIcon from "../../../assets/openIcon.svg";
import { UserContext } from "../../../context/UserContext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { updateSetting } from "../../../utils/settingSlice";
import { HOST } from "../../../utils/constants.jsx";
// import ColorPick from "./ColorPick.jsx";
import useDrivePicker from "react-google-drive-picker";
import { CLIENTID, DEVELOPERKEY } from "../../../utils/constants.jsx";
import { ColorPicker } from "antd";
import Loader from "../../Loader.jsx";
import { notifyError, notifySuccess } from "../../../utils/notify.jsx";
import { Reset } from "../../../assets/svgIcons.jsx";
import DeleteAlert from "../../DeleteAlert.jsx";
import { set } from "lodash";
import { debounce } from "lodash";
import { ImSpinner2 } from "react-icons/im";
// import { PiDotsSixVerticalBold } from "react-icons/pi";
import { SixDots } from "../../../assets/svgIcons.jsx";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { handleSaveChanges, handleUpdateSettings } from "../../../APIs/index.jsx";
import HeadingTitle from "../../people_directory/HeadingTitle.jsx";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoMdOpen } from "react-icons/io";
import { LuEye } from "react-icons/lu";
import { Select, Slider } from "antd";
import Info from "../../info.jsx";
import { motion } from "framer-motion";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { FaMinus } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import HeaderSection from "../product_catalogue_preview/HeaderSection.jsx";
import HeaderPopup from "./HeaderPopup.jsx";
import CardPopup from "./CardPopup.jsx";
import FooterPopup from "./FooterPopup.jsx";
import { LuUpload, LuMove } from "react-icons/lu";
import { Tooltip } from "antd";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import {
  getDriveThumbnail,
  handleImageError,
} from "../../../utils/globalFunctions.jsx";

const { Option } = Select;


const Setting = ({ closeDrawer, handleToggleDrawer }) => {
  const { setToken, setProfile } = useContext(UserContext);
  const [addData, setAddData] = useState(false);
  const [addSheet, setAddSheet] = useState(false);
  const [addView, setAddView] = useState(false);
  const [isSaveChanges, setIsSaveChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const nav = useNavigate();
  const { token } = useContext(UserContext);
  const dispatch = useDispatch();
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(false);

  const settingData = useSelector((state) => state.setting.settings);
  const [showHeaderPreview, setShowHeaderPreview] = useState(false);
  const [showHeaderPopup, setShowHeaderPopup] = useState(false); // State for modal visibility
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [showCardPopup, setShowCardPopup] = useState(false); // State for modal visibility
  const [showFooterPreview, setShowFooterPreview] = useState(false);
  const [showFooterPopup, setShowFooterPopup] = useState(false); // State for modal visibility
  const [uploading, setUploading] = useState(false);

  const [headerSettings, setHeaderSettings] = useState(
    settingData?.productCatalogue?.headerSettings || {}
  );

  const [cardSettings, setCardSettings] = useState(
    settingData?.productCatalogue?.cardSettings || {}
  );

  const [footerSettings, setFooterSettings] = useState(
    settingData?.productCatalogue?.footerSettings || {}
  );

  const [selectedTitle, setSelectedTitle] = useState("Title_1");

  console.log({ headerSettings, cardSettings, footerSettings });
  console.log(cardSettings?.titles[selectedTitle]?.cardFontSize)

  // const [headerSettings, setHeaderSettings] = useState({
  //   headerText: "CBXTREE Header",
  //   headerFont: "Poppins",
  //   headerFontColor: "#fff000",
  //   headerFontSize: "16px",
  //   bg: "#ffffff",
  //   logoURL: "",
  //   tabTitle: "",
  //   reset: false,
  //   search: true,
  // });

  const [addHeaderSettings, setAddHeaderSettings] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(""); // Store file name

  // Add these states in your component
  const [logoSaved, setLogoSaved] = useState(false);
  const [selectedFilePreview, setSelectedFilePreview] = useState(""); // For file upload preview

  // Modify existing handlers
  const handleLogoURLKeyPress = (e) => {
    if (e.key === "Enter" && headerSettings.logoURL.trim() !== "") {
      setLogoSaved(true);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Logo_Images");
      formData.append("folder", "logos");

      try {
        setUploading(true);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dq6cfckdm/image/upload`,
          formData
        );
        const imageUrl = res.data.secure_url;
        setHeaderSettings((prev) => ({
          ...prev,
          logoURL: imageUrl,
        }));
        setSelectedFilePreview(imageUrl);
        setSelectedFile(file.name);
        setLogoSaved(true);
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  // Remove logo handler
  const handleRemoveLogo = () => {
    setHeaderSettings((prev) => ({
      ...prev,
      logoURL: "",
    }));
    setSelectedFile("");
    setSelectedFilePreview("");
    setLogoSaved(false);
  };

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file.name); // Show file name in input field
  //   }
  // };

  // const [cardSettings, setCardSettings] = useState({
  //   titles: {
  //     Title_1: {
  //       cardFont: "Poppins",
  //       cardFontColor: "#fff000",
  //       cardFontSize: "16px",
  //       numberOfRows: "",
  //       numberOfColumns: "",
  //     },
  //     Title_2: {
  //       cardFont: "Poppins",
  //       cardFontColor: "#fff000",
  //       cardFontSize: "16px",
  //       numberOfRows: "",
  //       numberOfColumns: "",
  //     },
  //     Title_3: {
  //       cardFont: "Poppins",
  //       cardFontColor: "#fff000",
  //       cardFontSize: "16px",
  //       numberOfRows: "",
  //       numberOfColumns: "",
  //     },
  //     Title_4: {
  //       cardFont: "Poppins",
  //       cardFontColor: "#fff000",
  //       cardFontSize: "16px",
  //       numberOfRows: "",
  //       numberOfColumns: "",
  //     },
  //     Title_5: {
  //       cardFont: "Poppins",
  //       cardFontColor: "#fff000",
  //       cardFontSize: "16px",
  //       numberOfRows: "",
  //       numberOfColumns: "",
  //     },
  //   },
  // });



  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setSelectedTitle(newTitle);
    console.log(newTitle);
  };

  // const handleCardChange = (e) => {
  //   const { name, value } = e.target;
  //   setCardSettings((prev) => ({
  //     ...prev,
  //     titles: {
  //       ...prev.titles,
  //       [selectedTitle]: {
  //         ...prev.titles[selectedTitle],
  //         [name]: value,
  //       },
  //     },
  //   }));
  // };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setIsSaveChanges(true);

    // Handle noOfRows and noOfColumns directly
    if (name === "numberOfRows" || name === "numberOfColumns") {
      setCardSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Otherwise, assume it's inside titles[selectedTitle]
    else {
      setCardSettings((prev) => ({
        ...prev,
        titles: {
          ...prev.titles,
          [selectedTitle]: {
            ...(prev.titles?.[selectedTitle] || {}),
            [name]: value,
          },
        },
      }));
    }

  };

  const [addCardSettings, setAddCardSettings] = useState(false);

  // const [footerSettings, setFooterSettings] = useState({
  //   footers: {
  //     Footer_1: {
  //       Heading: {
  //         SubHeading1: "",
  //         SubHeading2: "",
  //         SubHeading3: "",
  //         SubHeading4: "",
  //       },
  //       footerFont: "Arial, sans-serif", // Add default font
  //       footerFontSize: "16px", // Add default size
  //       footerFontColor: "#000000", // Add default color
  //       bg: "#ffffff", // Add default background
  //     },
  //     Footer_2: {
  //       Heading: {
  //         SubHeading1: "",
  //         SubHeading2: "",
  //         SubHeading3: "",
  //         SubHeading4: "",
  //       },
  //       footerFont: "Arial, sans-serif",
  //       footerFontSize: "16px",
  //       footerFontColor: "#000000",
  //       bg: "#ffffff",
  //     },
  //     Footer_3: {
  //       Heading: {
  //         SubHeading1: "",
  //         SubHeading2: "",
  //         SubHeading3: "",
  //         SubHeading4: "",
  //       },
  //       footerFont: "Arial, sans-serif",
  //       footerFontSize: "16px",
  //       footerFontColor: "#000000",
  //       bg: "#ffffff",
  //     },
  //     Footer_4: {
  //       Heading: {
  //         SubHeading1: "",
  //         SubHeading2: "",
  //         SubHeading3: "",
  //         SubHeading4: "",
  //       },
  //       footerFont: "Arial, sans-serif",
  //       footerFontSize: "16px",
  //       footerFontColor: "#000000",
  //       bg: "#ffffff",
  //     },
  //     Footer_5: {
  //       Heading: {
  //         SubHeading1: "",
  //         SubHeading2: "",
  //         SubHeading3: "",
  //         SubHeading4: "",
  //       },
  //       footerFont: "Arial, sans-serif",
  //       footerFontSize: "16px",
  //       footerFontColor: "#000000",
  //       bg: "#ffffff",
  //     },
  //   },
  //   socialMediaSettings: {
  //     facebook: "",
  //     youtube: "",
  //     twitter: "",
  //     linkedin: "",
  //     instagram: "",
  //     socialMedia1: "",
  //   },
  //   mainFooter: "",
  //   footerColor: "",
  //   footerBackground: "",
  //   contactSettings: {
  //     address: "",
  //     phone: "",
  //     email: "",
  //   },
  // });

  const [selectedFooters, setSelectedFooters] = useState("Footer_1");

  const handleFootersChange = (e) => {
    const newFooters = e.target.value;
    setSelectedFooters(newFooters);
  };

  // const handleFooterChange = (e) => {
  //   const { name, value } = e.target;

  //   if (!selectedFooters) return; // Ensure a footer is selected

  //   setFooterSettings((prev) => ({
  //     ...prev,
  //     footers: {
  //       ...prev.footers,
  //       [selectedFooters]: {
  //         ...prev.footers[selectedFooters],
  //         Heading: {
  //           ...prev.footers[selectedFooters].Heading,
  //           [name]: value,
  //         },
  //       },
  //     },
  //   }));
  // };

  const handleFooterChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    // Handle contact settings
    if (["address", "phone", "email"].includes(name)) {
      setFooterSettings((prev) => ({
        ...prev,
        contactSettings: {
          ...prev.contactSettings,
          [name]: value,
        },
      }));
      setIsSaveChanges(true);
      return;
    }

    // Handle social media settings (static only)
    if (
      ["facebook", "youtube", "twitter", "linkedin", "instagram"].includes(name)
    ) {
      setFooterSettings((prev) => ({
        ...prev,
        socialMediaSettings: {
          ...prev.socialMediaSettings,
          [name]: value,
        },
      }));
      setIsSaveChanges(true);
      return;
    }

    // Handle flat footer settings
    if (["footerColor", "footerBackground"].includes(name)) {
      setFooterSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
      setIsSaveChanges(true);
      return;
    }

    // Handle footer headings
    if (!selectedFooters) return;

    setFooterSettings((prev) => ({
      ...prev,
      footers: {
        ...prev.footers,
        [selectedFooters]: {
          ...prev.footers?.[selectedFooters],
          Heading: {
            ...(prev.footers?.[selectedFooters]?.Heading || {}),
            [name]: value,
          },
        },
      },
    }));
    setIsSaveChanges(true);
  };


  const [addFooterSettings, setAddFooterSettings] = useState(false);

  const getDynamicSocialLinks = () => {
    return Object.entries(footerSettings.socialMediaSettings)
      .filter(([key]) => key.startsWith("socialMedia"))
      .map(([key, value], index) => ({
        id: key,
        name: `Social Media ${index + 1}`,
        link: value,
      }));
  };

  const [socialMediaLinks, setSocialMediaLinks] = useState(getDynamicSocialLinks() || []);


  // const handleAddSocialMedia = () => {
  //   const newId = socialMediaLinks.length + 1;
  //   setSocialMediaLinks([
  //     ...socialMediaLinks,
  //     { id: newId, name: `Social media ${newId}`, link: "", isEditing: false },
  //   ]);
  // };

  // const handleAddSocialMedia = () => {
  //   // Generate new ID based on the last entry, or set to 1 if no links exist
  //   const newId = socialMediaLinks.length > 0 ? socialMediaLinks[socialMediaLinks.length - 1].id + 1 : 1;

  //   // Add the new social media link to the socialMediaLinks state
  //   setSocialMediaLinks([
  //     ...socialMediaLinks,
  //     { id: newId, name: `Social media ${newId}`, link: "", isEditing: false },
  //   ]);

  //   // Add the new social media link to footerSettings as well
  //   setFooterSettings((prev) => ({
  //     ...prev,
  //     socialMediaSettings: {
  //       ...prev.socialMediaSettings,
  //       [`socialMedia${newId}`]: { link: "", label: `Social Media ${newId}` },
  //     },
  //   }));
  // };


  const handleAddSocialMedia = () => {
    // Get the current number of social media links
    const currentSocialMediaCount = Object.keys(footerSettings.socialMediaSettings || {})
      .filter(key => key.startsWith('socialMedia'))
      .length;

    // Create new ID for the social media link
    const newId = `socialMedia${currentSocialMediaCount + 1}`;

    // Update footerSettings with the new social media link
    setFooterSettings(prev => ({
      ...prev,
      socialMediaSettings: {
        ...prev.socialMediaSettings,
        [newId]: "" // Initialize with empty string
      }
    }));

    // Update socialMediaLinks state
    setSocialMediaLinks(prev => [
      ...prev,
      {
        id: currentSocialMediaCount + 1,
        name: `Social Media ${currentSocialMediaCount + 1}`,
        link: "",
        isEditing: false
      }
    ]);

    setIsSaveChanges(true);
  };

  const handleRemoveSocialMedia = (id) => {
    // Remove from footerSettings
    setFooterSettings(prev => {
      const newSettings = { ...prev.socialMediaSettings };
      delete newSettings[`socialMedia${id}`];
      return {
        ...prev,
        socialMediaSettings: newSettings
      };
    });

    // Remove from socialMediaLinks
    setSocialMediaLinks(prev => prev.filter(social => social.id !== id));
    setIsSaveChanges(true);
  };


  // const handleRemoveSocialMedia = (id) => {
  //   setSocialMediaLinks(socialMediaLinks.filter((item) => item.id !== id));
  // };

  // const handleRemoveSocialMedia = (id) => {
  //   // Remove the social media link from socialMediaLinks state
  //   setSocialMediaLinks(socialMediaLinks.filter((item) => item.id !== id));

  //   // Remove the social media link from footerSettings
  //   setFooterSettings((prev) => {
  //     const updatedSocialMediaSettings = { ...prev.socialMediaSettings };
  //     delete updatedSocialMediaSettings[id]; // Remove the link from socialMediaSettings
  //     return { ...prev, socialMediaSettings: updatedSocialMediaSettings };
  //   });
  // };


  const handleChange = (id, field, value) => {
    setSocialMediaLinks((prevLinks) =>
      prevLinks.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleEditToggle = (id) => {
    setSocialMediaLinks((prevLinks) =>
      prevLinks.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const [contactSettings, setContactSettings] = useState(() => {
    const initialContactData = footerSettings?.contactSettings;
    if (Array.isArray(initialContactData)) {
      return initialContactData.map(item => ({...item})); // Ensure a new array is returned
    }
    return [
      { id: 1, name: "Address", text: "", isContactEditing: false },
      { id: 2, name: "Phone", text: "", isContactEditing: false },
      { id: 3, name: "Email", text: "", isContactEditing: false },
    ];
  });

  useEffect(() => {
    const initialContactData = footerSettings?.contactSettings;
    if (Array.isArray(initialContactData)) {
      setContactSettings(initialContactData.map(item => ({...item})));
    } else {
      setContactSettings([
        { id: 1, name: "Address", text: "", isContactEditing: false },
        { id: 2, name: "Phone", text: "", isContactEditing: false },
        { id: 3, name: "Email", text: "", isContactEditing: false },
      ]);
    }
  }, [footerSettings?.contactSettings]);

  const handleContactChange = (id, field, value) => {
    setContactSettings((prevContacts) =>
      prevContacts.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

    // Update the `footerSettings` state directly based on the array structure
    setFooterSettings((prevFooterSettings) => ({
      ...prevFooterSettings,
      contactSettings: prevFooterSettings.contactSettings.map((contactItem) =>
        contactItem.id === id ? { ...contactItem, [field]: value } : contactItem
      ),
    }));

    setIsSaveChanges(true);
  };

  // Toggle edit mode for a specific contact
  const handleContactEditToggle = (id) => {
    setContactSettings((prevContacts) =>
      prevContacts.map((item) =>
        item.id === id
          ? { ...item, isContactEditing: !item.isContactEditing }
          : item
      )
    );
  };

  // Handle footer sub-heading edit toggle
  const handleFooterSubHeadingEditToggle = (subHeadingKey) => {
    setFooterSettings((prev) => ({
      ...prev,
      footers: {
        ...prev.footers,
        [selectedFooters]: {
          ...prev.footers?.[selectedFooters],
          Heading: {
            ...(prev.footers?.[selectedFooters]?.Heading || {}),
            [`isEditing${subHeadingKey}`]: !(prev.footers?.[selectedFooters]?.Heading?.[`isEditing${subHeadingKey}`] || false),
          },
        },
      },
    }));
  };
  const handleRemoveContact = (id) => {
    setContactSettings(contactSettings.filter((item) => item.id !== id));
  };
  const activateSave = () => {
    setIsSaveChanges(true);
  };

  // const handleSaveChanges = async (updatedSetting, message) => {
  //   setIsLoading(true);
  //   try {
  //     console.log({ updatedSetting, settingData });
  //     // Use the passed settings or fallback to the Redux state
  //     const settingsToSave = updatedSetting || settingData;
  //     console.log({ settingsToSave });

  //     const response = await axios.put(
  //       `${HOST}/spreadsheet/${settingData._id}`,
  //       settingsToSave,
  //       {
  //         headers: {
  //           authorization: "Bearer " + token,
  //         },
  //       }
  //     );

  //     console.log("Settings updated successfully:", response.data);
  //     dispatch(updateSetting(response.data));
  //     setIsLoading(false);
  //     setIsSaveChanges(false);
  //     notifySuccess(message);
  //     setIsTableLoading(false);
  //     // closeDrawer();

  //     // Refresh the page
  //     // window.location.reload();
  //   } catch (error) {
  //     console.error("Error updating settings in DB:", error);
  //     setIsTableLoading(false);
  //     setIsLoading(false);
  //     setIsSaveChanges(false);
  //   }
  // };

  const handleResetChange = async () => {
    setIsTableLoading(true);
    // Define the updated settings
    const updatedSetting = {
      headerSettings: [
        {
          headerBgColor: "#f1f1f1",
          headerTextColor: "#000000",
          headerFontSize: "14",
          headerFontStyle: "Poppins",
          bodyBgColor: "#ffffff",
          bodyTextColor: "#000000",
          bodyFontSize: "14",
          bodyFontStyle: "Poppins",
        },
      ],
    };

    // Dispatch the settings to update Redux state
    dispatch(updateSetting(updatedSetting));

    // Directly pass the updated settings to handleSaveChanges
    await handleSaveChanges(updatedSetting, "Table Style Reset successfully");
  };

  const handleHeaderChange = (e) => {
    const { name, type, checked } = e.target;
    setHeaderSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? !prev[name] : e.target.value,
    }));
    setIsSaveChanges(true);
  };

  const saveProductCatalogueSettings = async () => {
    console.log({ headerSettings, cardSettings, footerSettings });
    const updatedSettings = {
      productCatalogue: {
        headerSettings,
        cardSettings,
        footerSettings,
      },
    };

    console.log("Saving productCatalogue settings:", updatedSettings);

    const result = await handleSaveChanges(settingData, token, dispatch, updatedSettings);

    if (result) {
      notifySuccess("Product Catalogue settings saved successfully!");
      setIsSaveChanges(false);
      // setAddHeaderSettings(false);
      // setAddCardSettings(false);
      // setAddFooterSettings(false);
    }
  };


  const saveHeaderSettings = () => {
    console.log(headerSettings); // Latest settings
    setAddHeaderSettings(false); // Collapse settings
    // Maybe send data to backend or local storage
  };

  const saveCardSettings = () => {
    console.log(cardSettings);
    setAddCardSettings(false);

  };

  const saveFooterSettings = () => {
    console.log(footerSettings);
    setAddFooterSettings(false);
    // May send data to backend or local storage
  };


  const handleOpenViewPage = () => {
    const url = window.location.href.replace("edit", "view");
    window.open(url, "_blank");
  };

  const handleCopyToClipboard = () => {
    const url = window.location.href.replace("edit", "view");
    navigator.clipboard
      .writeText(url)
      .then(() => {
        notifySuccess("Link copied to clipboard!");
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const fontOptions = [
    "Poppins",
    "Arial",
    "Roboto",
    "Verdana",
    "Times New Roman",
    "Montserrat",
    "Lato",
    "Open Sans",
    "Courier New",
    "Georgia",
    "Tahoma",
    "Trebuchet MS",
    "Lucida Sans",
    "Fira Sans",
    "Nunito",
    "Raleway",
    "Merriweather",
    "Playfair Display",
    "Oswald",
    "Quicksand",
    "Dancing Script",
    "Pacifico",
  ];

  return (
    <div>
      <div className="setting_drawer">
        <div className="setting_icons">
          <div className="setting_icons_top">
            <div className="setting_icons_top_left">
              <div className="setting_icons_top_left_img">
                <img src={settingIcon} />
              </div>
              <div>
                <span className="setting_icons_top_left_span">Settings</span>
              </div>
            </div>
            <div className="setting_icons_top_right">
              <button
                className="submit_btn"
                onClick={saveProductCatalogueSettings}
                disabled={!isSaveChanges}
              >
                <span className="span_btn">Save Changes</span>

              </button>
              {/* <button
                className="bg-primary text-white py-2 px-2 font-medium rounded-full mt-2 max-w-[150px]"
                onClick={saveProductCatalogueSettings}
              >
                Save Changes
              </button> */}
              <div
                className="setting_icons_top_right_inner"
                onClick={() => handleToggleDrawer()}
              >
                {/* <span>Cancel</span> */}
                <img src={cancelIcon} />
              </div>
            </div>
          </div>
        </div>

        <div className="setting_filter">
          <div className="flex justify-between items-center w-[100%]">
            <div className="flex justify-center items-center">
              <div className="flex items-center">
                <div
                  className="setting_filter_top1"
                  onClick={() => {
                    setAddHeaderSettings(!addHeaderSettings);
                  }}
                >
                  <span className="setting_filter_top1_text">
                    Header Settings
                  </span>
                  <img className="setting_filter_top1_img" src={downIcon} />
                </div>

                {/* LuEye Icon to Open Full-Screen Header Popup */}
                <LuEye
                  className="w-5 h-5 text-[#598931] cursor-pointer"
                  onClick={() => setShowHeaderPopup(true)}
                />
              </div>
            </div>
            {/* Render HeaderPopup */}
            <HeaderPopup
              isOpen={showHeaderPopup}
              onClose={() => setShowHeaderPopup(false)}
              settings={settingData}
            />
          </div>

          {addHeaderSettings && (
            <div className="flex flex-col gap-4 pl-5 w-full">
              <div className="flex items-center gap-2">
                {/* <label className="w-[40%]">Header Text:</label> */}
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Header Text:
                </label>

                <input
                  type="text"
                  name="headerText"
                  value={headerSettings.headerText}
                  onChange={handleHeaderChange}
                  placeholder="Enter Text"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                />
                {/* Hide LuEye and Info when preview is open */}
                {!showHeaderPreview && (
                  <>
                    <button
                      onClick={() => setShowHeaderPreview(true)}
                      className="rounded-md text-[#A7A7A7] hover:text-[#598931]"
                    >
                      <LuEye className="w-5 h-5" />
                    </button>

                    <Info info="Here you can see preview of all Header Settings." />
                  </>
                )}
                {showHeaderPreview && (
                  <div className="flex align-center">
                    <button
                      onClick={() => setShowHeaderPreview(false)}
                      className="text-gray-600 hover:text-black text-lg font-bold mr-2"
                    >
                      ✕
                    </button>
                    <div className="flex min-w-[158px] w-full h-[33px]  justify-center items-center  rounded-[8px] border-2 border-[#598931]">
                      <div
                        style={{
                          fontFamily: headerSettings.headerFont,
                          fontSize: headerSettings.headerFontSize,
                          color: headerSettings.headerFontColor,
                          backgroundColor: headerSettings.bg,
                        }}
                      >
                        {headerSettings.headerText}
                      </div>
                      {headerSettings.logoURL && (
                        <img src={headerSettings.logoURL} alt="Logo" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* <label className="w-[40%]">Font:</label> */}
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Header Font:
                </label>

                <div className="relative flex-1 max-w-[180px] w-full">
                  <select
                    name="headerFont"
                    value={headerSettings.headerFont}
                    onChange={handleHeaderChange}
                    className="border border-[#F1F1F1] bg-[#F9F9F9] py-1 px-4 rounded-md w-full h-auto appearance-none placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>

                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <img
                      src={downIcon}
                      alt="Dropdown Icon"
                      className="w-4 h-4"
                      style={{
                        filter:
                          "invert(27%) sepia(91%) saturate(425%) hue-rotate(68deg) brightness(88%) contrast(95%)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Header Font Color:
                </label>

                <div className="flex items-center">
                  {/* Color Picker */}
                  <input
                    type="color"
                    name="headerFontColor"
                    value={headerSettings.headerFontColor}
                    onChange={handleHeaderChange}
                    // className="border border-[#F1F1F1] bg-[#F9F9F9] py-1 px-1 rounded-md w-8 h-8 cursor-pointer focus:ring-1 focus:ring-[#598931] outline-none"
                    className="custom-color-input"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Header Font Size:
                </label>

                <div className="relative max-w-[80px] w-full">
                  <select
                    name="headerFontSize"
                    value={headerSettings.headerFontSize}
                    onChange={handleHeaderChange}
                    className="border border-[#F1F1F1] bg-[#F9F9F9] py-1 px-2 rounded-md w-full h-auto appearance-none placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none z-50"
                  >
                    {[
                      "6px",
                      "8px",
                      "10px",
                      "12px",
                      "14px",
                      "16px",
                      "18px",
                      "20px",
                      "22px",
                      "24px",
                      "26px",
                      "28px",
                      "30px",
                      "32px",
                      "34px",
                      "36px",
                      "38px",
                      "40px",
                      "42px",
                    ].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>

                  {/* Dropdown Icon */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <img
                      src={downIcon}
                      alt="Dropdown Icon"
                      className="w-3 h-3"
                      style={{
                        filter:
                          "invert(27%) sepia(91%) saturate(425%) hue-rotate(68deg) brightness(88%) contrast(95%)",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Header Bg Color:
                </label>

                <input
                  type="color"
                  name="bg"
                  value={headerSettings.bg}
                  onChange={handleHeaderChange}
                  // className="border border-[#F1F1F1] bg-transparent p-0 m-0 rounded-md w-8 h-8 cursor-pointer focus:ring-1 focus:ring-[#598931] outline-none "
                  className="custom-color-input"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Logo:
                </label>

                {/* Conditionally render Input + Upload icon */}
                {!logoSaved ? (
                  <>
                    <input
                      type="text"
                      name="logoURL"
                      value={headerSettings?.logoURL}
                      onChange={handleHeaderChange}
                      onKeyPress={handleLogoURLKeyPress}
                      placeholder="Enter URL"
                      className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md w-full flex-1 min-w-0 max-h-[30px] placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                    />

                    {/* <span className="text-[#1E1B1B] font-medium whitespace-nowrap">
                      Or
                    </span> */}

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <Tooltip
                      title={selectedFile || "Upload File"}
                      color="#598931"
                    >
                      <div className="flex justify-center items-center w-8">
                        <LuUpload
                          className="w-5 h-5 text-[#A7A7A7] cursor-pointer hover:text-[#598931]"
                          onClick={() => fileInputRef.current.click()}
                        />
                      </div>
                    </Tooltip>
                  </>
                ) : (
                  // Logo Preview + Remove button
                  <div className="flex items-center gap-2">
                    <div
                      className="flex justify-center items-center border-2 border-[#598931] rounded-md w-8 h-8"
                      style={{
                        backgroundColor: headerSettings.bg,
                      }}
                    >
                      <img
                        // src={headerSettings.logoURL}
                        src={getDriveThumbnail(headerSettings.logoURL)}
                        alt="Logo Preview"
                        onError={handleImageError}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <button
                      onClick={handleRemoveLogo}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      <IoMdRemoveCircleOutline size={30} />
                    </button>
                  </div>
                )}
                {/* <Tooltip title="Position" color="#598931">
                  <div className="flex justify-center items-center w-8">
                    <LuMove className="w-5 h-5 text-[#A7A7A7] cursor-pointer hover:text-[#598931]" />
                  </div>
                </Tooltip> */}
              </div>

              {/* Tab Title Name */}
              {/* <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Tab Title Name:
                </label>

                <input
                  type="text"
                  name="tabTitle"
                  value={headerSettings.tabTitle}
                  onChange={handleHeaderChange}
                  placeholder="Enter Text"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div> */}

              {/* Reset Toggle */}

              <div className="flex items-center gap-2">
                <label className="w-[40%] flex items-center text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Reset:
                  <span className="ml-1">
                    <Info info="Choose weather to keep Reset on table view?" />
                  </span>
                </label>

                <label htmlFor="toggle" className="cursor-pointer relative">
                  {/* Hidden Checkbox */}
                  <input
                    type="checkbox"
                    name="reset"
                    id="toggle"
                    checked={headerSettings.reset}
                    onChange={handleHeaderChange}
                    className="sr-only"
                  />

                  {/* Toggle Background */}
                  <motion.div
                    className="w-12 h-6 rounded-full transition relative"
                    animate={{
                      backgroundColor: headerSettings.reset
                        ? "#598931"
                        : "#A0A0A0",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Moving Circle */}
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                      animate={{ x: headerSettings.reset ? 24 : 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </motion.div>
                </label>
              </div>

              {/* Search Toggle */}
              <div className="flex items-center gap-2">
                <label className="w-[40%] flex items-center text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Search:
                  <span className="ml-1">
                    <Info info="Choose weather to keep Search on table view?" />
                  </span>
                </label>

                <label
                  htmlFor="toggle-search"
                  className="cursor-pointer relative"
                >
                  {/* Hidden Checkbox */}
                  <input
                    type="checkbox"
                    name="search"
                    id="toggle-search"
                    checked={headerSettings.search}
                    onChange={handleHeaderChange}
                    className="sr-only"
                  />

                  {/* Toggle Background */}
                  <motion.div
                    className="w-12 h-6 rounded-full transition relative"
                    animate={{
                      backgroundColor: headerSettings.search
                        ? "#598931"
                        : "#A0A0A0",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Moving Circle */}
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                      animate={{ x: headerSettings.search ? 24 : 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </motion.div>
                </label>
              </div>

              {/* <button
                className="bg-primary text-white py-2 px-2 font-medium rounded-full mt-2 max-w-[150px]"
                onClick={saveProductCatalogueSettings}
              >
                Save Changes
              </button> */}
            </div>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="472"
            height="2"
            viewBox="0 0 472 2"
            fill="none"
          >
            <path d="M0 1.21265H621" stroke="#EDEEF3" />
          </svg>

          <div className="flex justify-between items-center w-[100%]">
            <div className="flex justify-center items-center">
              <div className="flex items-center">
                <div
                  className="setting_filter_top1"
                  onClick={() => {
                    setAddCardSettings(!addCardSettings);
                  }}
                >
                  <span className="setting_filter_top1_text">
                    Card Settings
                  </span>
                  <img className="setting_filter_top1_img" src={downIcon} />
                </div>

                {/* LuEye Icon to Open Full-Screen Card Popup */}
                <LuEye
                  className="w-5 h-5 text-[#598931] cursor-pointer"
                  onClick={() => setShowCardPopup(true)}
                />
              </div>
            </div>
            {/* Render CardPopup */}
            <CardPopup
              isOpen={showCardPopup}
              onClose={() => setShowCardPopup(false)}
              settings={settingData}
            />
          </div>
          {addCardSettings && (
            <div className="flex flex-col gap-4 pl-5 w-full">
              <div className="flex items-center gap-4">
                {/* Styled Dropdown */}
                <div className="relative">
                  <select
                    value={selectedTitle || ""}
                    onChange={handleTitleChange}
                    className="bg-white text-[#598931] font-semibold py-2 px-4 pr-4 rounded-md border border-gray-300 outline-none appearance-none w-full"
                  >
                    {/* <option value="" disabled hidden>
                      Titles
                    </option> */}
                    {Object.keys(cardSettings.titles).map((title) => (
                      <option key={title} value={title}>
                        {title.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>

                  {/* Custom Drop Icon */}
                  <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                    <img
                      src={downIcon}
                      alt="Dropdown Icon"
                      className="w-3 h-3 text-[#598931]"
                    />
                  </div>
                </div>

                {/* Hide LuEye and Info when preview is open */}
                {!showCardPreview && (
                  <>
                    <button
                      onClick={() => setShowCardPreview(true)}
                      className="rounded-md text-[#A7A7A7] hover:text-[#598931]"
                    >
                      <LuEye className="w-5 h-5" />
                    </button>

                    <Info info="Here you can see preview of all Card Settings." />
                  </>
                )}
                {showCardPreview && selectedTitle && (
                  <div className="flex align-center">
                    <button
                      onClick={() => setShowCardPreview(false)}
                      className="text-gray-600 hover:text-black text-lg font-bold mr-2"
                    >
                      ✕
                    </button>
                    <div className="flex min-w-[158px] w-full h-[33px]  justify-center items-center  rounded-[8px] border-2 border-[#598931]">
                      <div
                        style={{
                          fontFamily:
                            cardSettings.titles[selectedTitle]?.cardFont,
                          fontSize:
                            cardSettings.titles[selectedTitle]?.cardFontSize,
                          color:
                            cardSettings.titles[selectedTitle]?.cardFontColor,
                          //background color
                          backgroundColor:
                            cardSettings.titles[selectedTitle]?.bg ||
                            "defaultColor",
                        }}
                      >
                        {selectedTitle.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Card Font:
                </label>

                <div className="relative flex-1 max-w-[180px] w-full">
                  <select
                    name="cardFont"
                    // value={cardSettings.cardFont}
                    value={
                      selectedTitle
                        ? cardSettings?.titles[selectedTitle]?.cardFont
                        : ""
                    }
                    onChange={handleCardChange}
                    className="border border-[#F1F1F1] bg-[#F9F9F9] py-1 px-4 rounded-md w-full h-auto appearance-none placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                  >
                    <option value="" disabled hidden>
                      Choose Font
                    </option>
                    {fontOptions.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>

                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <img
                      src={downIcon}
                      alt="Dropdown Icon"
                      className="w-4 h-4"
                      style={{
                        filter:
                          "invert(27%) sepia(91%) saturate(425%) hue-rotate(68deg) brightness(88%) contrast(95%)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Card Font Color:
                </label>
                <input
                  type="color"
                  name="cardFontColor"
                  value={
                    selectedTitle
                      ? cardSettings?.titles[selectedTitle]?.cardFontColor
                      : ""
                  }
                  onChange={handleCardChange}
                  // className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[33px] w-full max-h-[33px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                  className="custom-color-input"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Card Font Size:
                </label>

                <div className="relative max-w-[80px] w-full">
                  <select
                    name="cardFontSize"
                    // value={cardSettings.cardFontSize}
                    value={
                      selectedTitle
                        ? cardSettings?.titles[selectedTitle]?.cardFontSize
                        : ""
                    }
                    onChange={handleCardChange}
                    className="border border-[#F1F1F1] bg-[#F9F9F9] py-1 px-2 rounded-md w-full h-auto appearance-none placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none z-50"
                  >
                    {[
                      "6px",
                      "8px",
                      "10px",
                      "12px",
                      "14px",
                      "16px",
                      "18px",
                      "20px",
                      "22px",
                      "24px",
                      "26px",
                      "28px",
                      "30px",
                      "32px",
                      "34px",
                      "36px",
                      "38px",
                      "40px",
                      "42px",
                    ].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>

                  {/* Dropdown Icon */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <img
                      src={downIcon}
                      alt="Dropdown Icon"
                      className="w-3 h-3"
                      style={{
                        filter:
                          "invert(27%) sepia(91%) saturate(425%) hue-rotate(68deg) brightness(88%) contrast(95%)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-[40%] flex items-center text-[#1E1B1B] font-poppins text-[16px] font-medium">
                  No. of Columns:
                  <span className="ml-1">
                    {" "}
                    <Info info="Choose how much Columns shall be in card view!" />
                  </span>
                </label>

                <input
                  type="text"
                  name="numberOfColumns"
                  value={cardSettings.numberOfColumns}
                  onChange={handleCardChange}
                  placeholder="Enter Text"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="w-[40%] flex items-center text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  No. of Rows:
                  <span className="ml-1">
                    {" "}
                    <Info info="Choose how much rows shall be in card view!" />
                  </span>
                </label>

                <input
                  type="text"
                  name="numberOfRows"
                  value={cardSettings.numberOfRows}
                  onChange={handleCardChange}
                  placeholder="Enter Text"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div>



              {/* <button
                className="bg-primary text-white py-2 px-2 font-medium rounded-full mt-2 max-w-[150px]"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button> */}
              {/* <button
                className="bg-primary text-white py-2 px-2 font-medium rounded-full mt-2 max-w-[150px]"
                onClick={saveProductCatalogueSettings}
              >
                Save Changes
              </button> */}
            </div>
          )}

          {/* {settingData?.appName == "Product Catalogue" && ( */}
          {/* <> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="472"
            height="2"
            viewBox="0 0 472 2"
            fill="none"
          >
            <path d="M0 1.21265H621" stroke="#EDEEF3" />
          </svg>

          <div className="flex justify-between items-center w-[100%]">
            <div className="flex justify-center items-center">
              <div className="flex items-center">
                <div
                  className="setting_filter_top1"
                  onClick={() => {
                    setAddFooterSettings(!addFooterSettings);
                  }}
                >
                  <span className="setting_filter_top1_text">
                    Footer Settings
                  </span>
                  <img className="setting_filter_top1_img" src={downIcon} />
                </div>

                {/* LuEye Icon to Open Full-Screen Footer Popup */}
                <LuEye
                  className="w-5 h-5 text-[#598931] cursor-pointer"
                  onClick={() => setShowFooterPopup(true)}
                />
              </div>
            </div>
            {/* Render FooterPopup */}
            <FooterPopup
              isOpen={showFooterPopup}
              onClose={() => setShowFooterPopup(false)}
              settings={settingData}
            />
          </div>
          {addFooterSettings && (
            <div className="flex flex-col gap-4 pl-5 w-full">
              <div className="flex items-center gap-4">
                {/* Styled Dropdown */}
                <div className="relative">
                  <select
                    value={selectedFooters || ""}
                    onChange={handleFootersChange}
                    className="bg-white text-[#598931] font-semibold py-2 px-4 pr-4 rounded-md border border-gray-300 outline-none appearance-none w-full"
                  >
                    <option value="" disabled hidden>
                      Footers
                    </option>
                    {Object.keys(footerSettings.footers).map((footers) => (
                      <option key={footers} value={footers}>
                        {footers.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>

                  {/* Custom Drop Icon */}
                  <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                    <img
                      src={downIcon}
                      alt="Dropdown Icon"
                      className="w-3 h-3 text-[#598931]"
                    />
                  </div>
                </div>

                {/* Hide LuEye and Info when preview is open */}
                {!showFooterPreview && (
                  <>
                    <button
                      onClick={() => setShowFooterPreview(true)}
                      className="rounded-md text-[#A7A7A7] hover:text-[#598931]"
                    >
                      <LuEye className="w-5 h-5" />
                    </button>

                    <Info info="Here you can see preview of all Footer Settings." />
                  </>
                )}
                {showFooterPreview && selectedFooters && (
                  <div className="flex align-center">
                    <button
                      onClick={() => setShowFooterPreview(false)}
                      className="text-gray-600 hover:text-black text-lg font-bold mr-2"
                    >
                      ✕
                    </button>
                    <div className="flex min-w-[158px] w-full h-[33px]  justify-center items-center  rounded-[8px] border-2 border-[#598931]">
                      <div
                        style={{
                          fontFamily:
                            footerSettings.footers[selectedFooters]?.footerFont,
                          fontSize:
                            footerSettings.footers[selectedFooters]
                              ?.footerFontSize,
                          color:
                            footerSettings.footers[selectedFooters]
                              ?.footerFontColor,
                          //background color
                          backgroundColor:
                            footerSettings.footers[selectedFooters]?.bg ||
                            "defaultColor",
                        }}
                      >
                        {selectedFooters.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Heading */}
              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Heading
                </label>

                <input
                  type="text"
                  name="SubHeading1"
                  value={
                    footerSettings.footers[selectedFooters]?.Heading
                      ?.SubHeading1 || ""
                  }
                  onChange={handleFooterChange}
                  placeholder="Enter Text"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div>

              <div className="flex items-center gap-2">
                {footerSettings.footers[selectedFooters]?.Heading?.isEditingSubHeading2 ? (
                  <input
                    type="text"
                    value={footerSettings.footers[selectedFooters]?.Heading?.SubHeading2Label ?? ""}
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        footers: {
                          ...prev.footers,
                          [selectedFooters]: {
                            ...prev.footers?.[selectedFooters],
                            Heading: {
                              ...(prev.footers?.[selectedFooters]?.Heading || {}),
                              SubHeading2Label: e.target.value,
                            },
                          },
                        },
                      }));
                      setIsSaveChanges(true);
                    }}
                    className="w-[40%] border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md text-[#1E1B1B] font-poppins text-[17px] font-medium placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                    placeholder="Enter Label"
                  />
                ) : (
                  <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                    {footerSettings.footers[selectedFooters]?.Heading?.SubHeading2Label || "Sub-heading1"}
                  </label>
                )}

                <input
                  type="text"
                  name="SubHeading2"
                  value={
                    footerSettings.footers[selectedFooters]?.Heading
                      ?.SubHeading2 || ""
                  }
                  onChange={handleFooterChange}
                  placeholder="Enter Link"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
                <button
                  onClick={() => handleFooterSubHeadingEditToggle('SubHeading2')}
                  className="text-[#1E1B1B] hover:text-[#598931] transition-colors"
                >
                  {footerSettings.footers[selectedFooters]?.Heading?.isEditingSubHeading2 ? (
                    <FiSave className="w-5 h-5" />
                  ) : (
                    <CiEdit className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {footerSettings.footers[selectedFooters]?.Heading?.isEditingSubHeading3 ? (
                  <input
                    type="text"
                    value={footerSettings.footers[selectedFooters]?.Heading?.SubHeading3Label ?? ""}
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        footers: {
                          ...prev.footers,
                          [selectedFooters]: {
                            ...prev.footers?.[selectedFooters],
                            Heading: {
                              ...(prev.footers?.[selectedFooters]?.Heading || {}),
                              SubHeading3Label: e.target.value,
                            },
                          },
                        },
                      }));
                      setIsSaveChanges(true);
                    }}
                    className="w-[40%] border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md text-[#1E1B1B] font-poppins text-[17px] font-medium placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                    placeholder="Enter Label"
                  />
                ) : (
                  <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                    {footerSettings.footers[selectedFooters]?.Heading?.SubHeading3Label || "Sub-heading2"}
                  </label>
                )}

                <input
                  type="text"
                  name="SubHeading3"
                  value={
                    footerSettings.footers[selectedFooters]?.Heading
                      ?.SubHeading3 || ""
                  }
                  onChange={handleFooterChange}
                  placeholder="Enter Link"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
                <button
                  onClick={() => handleFooterSubHeadingEditToggle('SubHeading3')}
                  className="text-[#1E1B1B] hover:text-[#598931] transition-colors"
                >
                  {footerSettings.footers[selectedFooters]?.Heading?.isEditingSubHeading3 ? (
                    <FiSave className="w-5 h-5" />
                  ) : (
                    <CiEdit className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {footerSettings.footers[selectedFooters]?.Heading?.isEditingSubHeading4 ? (
                  <input
                    type="text"
                    value={footerSettings.footers[selectedFooters]?.Heading?.SubHeading4Label ?? ""}
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        footers: {
                          ...prev.footers,
                          [selectedFooters]: {
                            ...prev.footers?.[selectedFooters],
                            Heading: {
                              ...(prev.footers?.[selectedFooters]?.Heading || {}),
                              SubHeading4Label: e.target.value,
                            },
                          },
                        },
                      }));
                      setIsSaveChanges(true);
                    }}
                    className="w-[40%] border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md text-[#1E1B1B] font-poppins text-[17px] font-medium placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                    placeholder="Enter Label"
                  />
                ) : (
                  <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                    {footerSettings.footers[selectedFooters]?.Heading?.SubHeading4Label || "Sub-heading2"}
                  </label>
                )}

                <input
                  type="text"
                  name="SubHeading4"
                  value={
                    footerSettings.footers[selectedFooters]?.Heading
                      ?.SubHeading4 || ""
                  }
                  onChange={handleFooterChange}
                  placeholder="Enter Link"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
                <button
                  onClick={() => handleFooterSubHeadingEditToggle('SubHeading4')}
                  className="text-[#1E1B1B] hover:text-[#598931] transition-colors"
                >
                  {footerSettings.footers[selectedFooters]?.Heading?.isEditingSubHeading4 ? (
                    <FiSave className="w-5 h-5" />
                  ) : (
                    <CiEdit className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {footerSettings.footers[selectedFooters]?.Heading?.isEditingSubHeading5 ? (
                  <input
                    type="text"
                    value={footerSettings.footers[selectedFooters]?.Heading?.SubHeading5Label ?? ""}
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        footers: {
                          ...prev.footers,
                          [selectedFooters]: {
                            ...prev.footers?.[selectedFooters],
                            Heading: {
                              ...(prev.footers?.[selectedFooters]?.Heading || {}),
                              SubHeading5Label: e.target.value,
                            },
                          },
                        },
                      }));
                      setIsSaveChanges(true);
                    }}
                    className="w-[40%] border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md text-[#1E1B1B] font-poppins text-[17px] font-medium placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                    placeholder="Enter Label"
                  />
                ) : (
                  <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                    {footerSettings.footers[selectedFooters]?.Heading?.SubHeading5Label || "Sub-heading4"}
                  </label>
                )}

                <input
                  type="text"
                  name="SubHeading5"
                  value={
                    footerSettings.footers[selectedFooters]?.Heading
                      ?.SubHeading5 || ""
                  }
                  onChange={handleFooterChange}
                  placeholder="Enter Link"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
                <button
                  onClick={() => handleFooterSubHeadingEditToggle('SubHeading5')}
                  className="text-[#1E1B1B] hover:text-[#598931] transition-colors"
                >
                  {footerSettings.footers[selectedFooters]?.Heading?.isEditingSubHeading5 ? (
                    <FiSave className="w-5 h-5" />
                  ) : (
                    <CiEdit className="w-5 h-5" />
                  )}
                </button>
              </div>
              <hr />

              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Footer Color:
                </label>

                <input
                  type="color"
                  name="footerColor"
                  value={footerSettings?.footerColor}
                  onChange={(e) => {
                    setFooterSettings({
                      ...footerSettings,
                      footerColor: e.target.value,
                    });
                    setIsSaveChanges(true);
                  }}
                  // className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[33px] w-full max-h-[33px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                  className="custom-color-input"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Footer Bg Color:
                </label>

                <input
                  type="color"
                  name="footerBackground"
                  value={footerSettings?.footerBackground}
                  onChange={(e) => {
                    setFooterSettings({
                      ...footerSettings,
                      footerBackground: e.target.value,
                    });
                    setIsSaveChanges(true);
                  }}
                  // className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[33px] w-full max-h-[33px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                  className="custom-color-input"
                />
              </div>

              <hr />

              {/* Social Media Settings Header */}
              <div className="flex items-center justify-start mt-4 gap-4">
                <div className="text-[#1E1B1B] font-poppins text-[18px] font-semibold">
                  Social Media Settings:
                </div>
                <span className="ml-[-10px]">
                  <Info info="You can add, Edit or delete social media pages according to your preference!" />
                </span>

                {/* Add Another Button */}
                <button
                  onClick={handleAddSocialMedia}
                  className="ml-auto flex items-center text-[#CDCCCC]  font-medium  rounded-md hover:text-[#598931] transition duration-200 "
                >
                  Add another +
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Facebook
                </label>

                <input
                  type="text"
                  name="facebook"
                  value={footerSettings?.socialMediaSettings?.facebook}
                  onChange={handleFooterChange}
                  placeholder="Enter Link"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  YouTube
                </label>

                <input
                  type="text"
                  name="youtube"
                  value={footerSettings?.socialMediaSettings?.youtube}
                  onChange={handleFooterChange}
                  placeholder="Enter Link"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div>
              {/* Tab Title Name */}
              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Twitter
                </label>

                <input
                  type="text"
                  name="twitter"
                  value={footerSettings?.socialMediaSettings?.twitter}
                  onChange={handleFooterChange}
                  placeholder="Enter Link"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div>
              {/* Tab Title Name */}
              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  LinkedIn
                </label>

                <input
                  type="text"
                  name="linkedin"
                  value={footerSettings?.socialMediaSettings?.linkedin}
                  onChange={handleFooterChange}
                  placeholder="Enter Link"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div>
              {/* Tab Title Name */}
              <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Instagram
                </label>

                <input
                  type="text"
                  name="instagram"
                  value={footerSettings?.socialMediaSettings?.instagram}
                  onChange={handleFooterChange}
                  placeholder="Enter Link"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div>

              {/* Dynamic Social Media Inputs */}

              {socialMediaLinks.map((social) => (
                <div key={social.id} className="flex items-center gap-2">
                  {social.isEditing ? (
                    <input
                      type="text"
                      value={social.name}
                      onChange={(e) => {
                        setSocialMediaLinks(prev =>
                          prev.map(item =>
                            item.id === social.id
                              ? { ...item, name: e.target.value }
                              : item
                          )
                        );
                      }}
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                      {social.name}
                    </label>
                  )}

                  <input
                    type="text"
                    value={footerSettings.socialMediaSettings[`socialMedia${social.id}`] || ''}
                    onChange={(e) => {
                      setFooterSettings(prev => ({
                        ...prev,
                        socialMediaSettings: {
                          ...prev.socialMediaSettings,
                          [`socialMedia${social.id}`]: e.target.value
                        }
                      }));
                      setIsSaveChanges(true);
                    }}
                    placeholder="Enter Link"
                    className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                  />

                  {/* <button
                    onClick={() => handleEditToggle(social.id)}
                    className="text-[#1E1B1B] hover:text-[#598931]"
                  >
                    <CiEdit />
                  </button> */}

                  <button
                    onClick={() => handleRemoveSocialMedia(social.id)}
                    className="text-[#598931] hover:text-[#598931]"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}






              {/* <div className="flex items-center gap-2">
                <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                  Main Footer:
                </label>

                <input
                  type="text"
                  name="mainFooter"
                  value={footerSettings.mainFooter}
                  onChange={handleFooterChange}
                  placeholder="Enter Text"
                  className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none "
                />
              </div> */}



              {/* <button
                className="bg-primary text-white py-2 px-2 font-medium rounded-full mt-2 max-w-[150px]"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button> */}

              {/* <button
                className="bg-primary text-white py-2 px-2 font-medium rounded-full mt-2 max-w-[150px]"
                onClick={saveProductCatalogueSettings}
              >
                Save Changes
              </button> */}

              <hr />

              {/* Contact Settings */}
              <div className="text-[#1E1B1B] font-poppins text-[20px] font-semibold mt-4">
                Contact Settings:
              </div>

              {/* Dynamically Render Contact Settings */}
              {contactSettings.map((contact) => (
                <div key={contact.id} className="flex items-center gap-2">
                  {/* Editable Name (Only if in edit mode) */}

                  {contact.isContactEditing ? (
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => {
                        handleContactChange(contact.id, "name", e.target.value)
                        setIsSaveChanges(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleContactEditToggle(contact.id); // Save and exit edit mode
                        }
                      }}
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    <label className="w-[40%] text-[#1E1B1B] font-poppins text-[17px] font-medium">
                      {contact.name}:
                    </label>
                  )}

                  {/* Editable Text Field */}
                  <input
                    type="text"
                    value={contact.text}
                    onChange={(e) =>{
                      handleContactChange(contact.id, "text", e.target.value)
                      setIsSaveChanges(true);
                    }}
                    placeholder={`Enter ${contact.name}`}
                    className="border border-[#F1F1F1] bg-[#F9F9F9] py-2 px-4 rounded-md max-w-[180px] w-full max-h-[30px] flex-1 placeholder-gray-400 focus:ring-1 focus:ring-[#598931] outline-none"
                  />

                  {/* Edit Icon - Toggles Edit Mode */}
                  {/* <button
                    onClick={() => handleContactEditToggle(contact.id)}
                    className="text-[#1E1B1B] hover:text-[#598931]"
                  >
                    <CiEdit />
                  </button> */}

                  {/* Remove Button */}
                  {/* <button
                        onClick={() => handleRemoveContact(contact.id)}
                        className="text-[#598931] hover:text-[#598931]"
                      >
                        <FaMinus />
                      </button> */}
                </div>
              ))}

              {/* <button
                className="bg-primary text-white py-2 px-2 font-medium rounded-full mt-2 max-w-[150px]"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button> */}

              {/* <button
                className="bg-primary text-white py-2 px-2 font-medium rounded-full mt-2 max-w-[150px]"
                onClick={saveProductCatalogueSettings}
              >
                Save Changes
              </button> */}
            </div>
          )}
          {/* </> */}
          {/* // )} */}
        </div>
      </div>
      <DeleteAlert
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleResetChange}
        sheetName={"Are you sure you want to reset table styling."} // Optional: Provide a dynamic name
      />
    </div>
  );
};

export default Setting;
