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

import Avatar from "../assets/images/avatar.png";
export const handleImageError = (e, fallbackImage = Avatar) => {
    e.target.onerror = null; // Prevent infinite loop if fallback fails
    e.target.src = fallbackImage; // Set the fallback/default image
};

// export function getDriveThumbnail(url) {
//     if (!url) return "";

//     let driveIdMatch = url.match(/(?:drive\.google\.com\/.*(?:id=|\/d\/))([\w-]+)/);

//     if (driveIdMatch) {
//         return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=s220`; // You can adjust `s220` for different resolutions
//     }
//     return url;
// }


// export const getDriveThumbnail = (logoUrl) => {
//     let link = logoUrl;
//     if (logoUrl?.indexOf("drive.google.com") > -1) {
//         var id = logoUrl.match(/[-\w]{25,}/)[0];
//         link =`https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
//     }
//     return link;
// };

// export function getDriveThumbnail(sharedUrl) {
//     const fileIdMatch = sharedUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  
//     if (fileIdMatch && fileIdMatch[1]) {
//       const fileId = fileIdMatch[1];
//       return `https://drive.google.com/uc?id=${fileId}`;
//     } else {
//       throw new Error("Invalid Google Drive sharing URL");
//     }
//   }


// write a function to convert normal drive image url to display proprly in react ui
// write a function to sum two numbers
// create a function to fetch data from api


// write a function that takes an array of strings and returns the longest string
