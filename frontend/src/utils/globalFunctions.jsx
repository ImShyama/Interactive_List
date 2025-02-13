// export function getDriveThumbnail(url) {
//     if (!url) return "";

//     if (url.includes("drive.google.com")) {
//         let driveIdMatch = url.match(/(?:id=|\/d\/)([\w-]+)/);
//         console.log({ driveIdMatch, url });
//         return driveIdMatch ? `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}` : "";
//     }

//     return url;
// }

import defaultimage from "../assets/images/p1.png";
export const handleImageError = (e, fallbackImage = defaultimage) => {
    e.target.onerror = null; // Prevent infinite loop if fallback fails
    e.target.src = fallbackImage; // Set the fallback/default image
};

export function getDriveThumbnail(url) {
    if (!url) return "";

    let driveIdMatch = url.match(/(?:drive\.google\.com\/.*(?:id=|\/d\/))([\w-]+)/);

    if (driveIdMatch) {
        return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=s220`; // You can adjust `s220` for different resolutions
    }
    return url;
}
