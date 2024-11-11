/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'vulnerable-orange-tern.myfilebase.com',
    }],
  },
  // rewrites 只对 use client 生效
  // rewrites: async () => {
  //   return [
  //     {
  //       source: "/ipfs/:cid*",
  //       destination: "https://vulnerable-orange-tern.myfilebase.com/ipfs/:cid*",
  //     },
  //   ];
  // }
};

export default nextConfig;
