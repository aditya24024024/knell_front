// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images:{
//     remotePatterns:[{
//       protocol:"https",
//       hostname:"**",
//       port:"",
//       pathname:"**",
//     }]
//   }
// };

// export default nextConfig; because site fatrrii thi and next img optimizer messing w cloudonary
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // important fix
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
