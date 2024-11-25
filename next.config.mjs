/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'vulnerable-orange-tern.myfilebase.com',
    }],
  },
  // eslint: {
  //   ignoreDuringBuilds: true, //构建时忽略所有eslint检测
  // }
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
