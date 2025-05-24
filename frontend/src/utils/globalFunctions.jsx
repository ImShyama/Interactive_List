

import Avatar from "../assets/images/avatar.png";
import ImageNotFound from "../assets/images/noPhoto.jpg";

export function getDriveThumbnail(url) {
    if (!url) return '';

    if (url.includes('drive.google.com')) {
        let driveIdMatch = url.match(/(?:id=|\/d\/)([\w-]+)/);
        return driveIdMatch
            ? `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}&sz=w1000`
            : '';
    }
    return url;
}

export const handleImageError = (e, fallbackImage = Avatar) => {
    e.target.onerror = null; // Prevent infinite loop if fallback fails
    e.target.src = fallbackImage; // Set the fallback/default image
};

export const handlePCImageError = (e, fallbackImage = ImageNotFound) => {
    e.target.onerror = null; // Prevent infinite loop if fallback fails
    e.target.src = fallbackImage; // Set the fallback/default image
};

export const RenderText = ({ text }) => {
    if (!text) return null;

    // Regular expression to detect URLs (http, https, www)
    const urlRegex = /(https?:\/\/[^\s,]+|www\.[^\s,]+)/g;

    // Check if the text contains URLs
    const parts = text?.toString().split(urlRegex);

    return (
        <span className="truncate" >
            {parts.map((part, index) => {
                if (part.match(urlRegex)) {
                    return (
                        <a
                            key={index}
                            href={part.startsWith("http") ? part : `https://${part}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline ml-1 no-underline hover:underline"
                        >
                            Click Here
                        </a>
                    );
                }
                return part;
            })}
        </span>
    );
};
export const RenderTextPC = ({ text }) => {
    if (!text) return null;

    // Regular expression to detect URLs (http, https, www)
    const urlRegex = /(https?:\/\/[^\s,]+|www\.[^\s,]+)/g;

    // Check if the text contains URLs
    const parts = text?.toString().split(urlRegex);

    return (
        <span className="" >
            {parts.map((part, index) => {
                if (part.match(urlRegex)) {
                    return (
                        <a
                            key={index}
                            href={part.startsWith("http") ? part : `https://${part}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-inherit no-underline hover:underline"
                        >
                            Click Here
                        </a>
                    );
                }
                return part;
            })}
        </span>
    );
};

export const formatHeader = ({ header }) => {
    return header
        ?.replace(/_/g, " ").split(" ").slice(0, -1).join(" ")
}

export const generateAvatar = (email, index) => {
    console.log({ email, index });
    if (!email) return null;
    const firstLetter = email.charAt(0).toUpperCase();
    const avatarColors = ["#FF5733", "#33C1FF", "#9B59B6", "#F1C40F", "#2ECC71",
        "#E67E22", "#1ABC9C", "#3498DB", "#E74C3C", "#34495E"];
    const bgColor = avatarColors[index % avatarColors.length];

    const svg = `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="${bgColor}" />
          <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="50" fill="white" font-family="Arial, sans-serif">
            ${firstLetter}
          </text>
        </svg>
      `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
