import { NftContractAbi } from "@/abi/NftContract";
import { NftItem } from "@/app/(content)/nft-page/types";
import { deployNetRPC, nftContractAddr } from "@/utils/constants";
import { ResultItem } from "@/utils/types";
import { apiRes } from "@/utils/utils";
import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";

interface NftResult {
  data: NftItem[];
  timeStamp: number;
}
// 该变量位于后台内存中（即node环境中），若服务器（即node服务）重启会被重置为null
const result: NftResult = {
  data: [],
  timeStamp: 0,
};
// 通过合约的 tokenByIndex 和 totalSupply 轮询获取NFT列表（由于是轮询，所以比较慢）
export async function GET(req: NextRequest) {
  let resInfo: ResultItem;
  const { data, timeStamp } = result;
  const search = new URL(req.url).searchParams;
  const newStamp = Number(search.get("timestamp") || timeStamp);

  try {
    if (!data.length || newStamp !== timeStamp) {
      // 创建只读合约实例
      const provider = new ethers.JsonRpcProvider(deployNetRPC);
      const contract = new ethers.Contract(nftContractAddr, NftContractAbi, provider);

      const nftList: NftItem[] = [];
      const totalSupply = await contract.totalSupply();

      for (let i = totalSupply - BigInt(1); i >= BigInt(0); i--) {
        const tokenId = await contract.tokenByIndex(i);
        const tokenURI = await contract.tokenURI(tokenId);
        const owner = await contract.ownerOf(tokenId);
        const price = await contract.priceOfNFT(tokenId);
        const res = await fetch(tokenURI);
        const metadata = await res.json();
        nftList.push({
          owner: owner.toLowerCase(),
          tokenId: tokenId.toString(),
          image: metadata.image,
          price: price.toString(),
        });
      }
      result.data = nftList;
      result.timeStamp = Number(newStamp);
    }
    resInfo = apiRes.succ(result.data);
  } catch (err) {
    resInfo = apiRes.fail(err);
  }
  return NextResponse.json(resInfo);
}
// 交易NFT（若涉及到敏感信息，基于安全性考虑，要放在后台处理，即此处的node环境）
// export async function POST(req: NextRequest) {
// let params: { tokenId: string };
// try {
//   params = await req.json();
//   if (!params.tokenId) throw Error();
// } catch (e) {
//   return NextResponse.json({ msg: "Invalid request params" }, { status: 400 });
// }
// // 创建读写合约实例（免钱包弹窗。若要钱包弹窗，需在client模式使用ethers.BrowserProvider）
// const provider = new ethers.JsonRpcProvider(deployNetRPC);
// const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY as string, provider);
// const nft = new ethers.Contract(nftContractAddr, NftContractAbi, wallet);
// const tx = await nft.transactNFT(params.tokenId);
// const res = await tx.wait();
// return NextResponse.json(null, { status: 200 });
// }
