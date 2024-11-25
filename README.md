This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1.部署合约

1）先部署 NFT 合约
2）再部署 WaterToken 合约（部署时 需填入 NFT 合约地址）
3）再调用 NFT 合约的 abi：setTxTokenAddress(填入 WaterToken 合约地址)

2.在根目录创建.env 文件，并添加以下环境变量

```bash
// 所有 NFT metadata 的 json 配置文件
NFT_IPFS_JSON_URL=.....
```

3.安装依赖，启动项目

```bash
# 安装依赖（由于一开始是用npm安装，所以别改用pnpm安装，否则有些依赖版本会错乱）
npm install
# 启动（开发环境）
npm run dev
# 打包构建
npm run build
# 启动构建后的静态文件（生产环境）
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
