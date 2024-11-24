// 获取 NFT MetaData 的json文件
export async function GET() {
  // 若涉及到敏感信息，基于安全性考虑，要放在后台处理，即此处的node环境）
  return fetch(`${process.env.NFT_IPFS_JSON_URL}`);
}
