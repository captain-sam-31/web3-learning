// 获取 NFT MetaData 的json文件
export async function GET() {
  return fetch(`${process.env.NFT_IPFS_JSON_URL}`);
}
