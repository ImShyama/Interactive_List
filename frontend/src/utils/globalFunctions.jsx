export function getDriveThumbnail(url) {
    if (!url) return "";

    if (url.includes("drive.google.com")) {
        let driveIdMatch = url.match(/(?:id=|\/d\/)([\w-]+)/);
        console.log({ driveIdMatch, url });
        return driveIdMatch ? `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}` : "";
    }

    return url;
}

// export function getDriveThumbnail(url) {
//     if (!url) return "";

//     let driveIdMatch = url.match(/(?:drive\.google\.com\/.*(?:id=|\/d\/))([\w-]+)/);

//     if (driveIdMatch) {
//         return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=s220`; // You can adjust `s220` for different resolutions
//     }

//     return url;
// }
