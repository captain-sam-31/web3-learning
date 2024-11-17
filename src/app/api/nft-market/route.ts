import { ethers } from "ethers";
import { nftContractAddr, targetNetRPC } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";
import { NftContractAbi } from "@/abi/NftContract";
import { NftItem } from "@/app/(content)/nft-page/types";

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
  const { data, timeStamp } = result;
  const search = new URL(req.url).searchParams;
  const newStamp = Number(search.get("timestamp") || timeStamp);
  // if (!accountAddr) {
  //   return NextResponse.json({ msg: "accountAddr is required" }, { status: 400 });
  // }
  if (!data.length || newStamp !== timeStamp) {
    const provider = new ethers.JsonRpcProvider(targetNetRPC);
    const contract = new ethers.Contract(nftContractAddr, NftContractAbi, provider);

    const nftList: NftItem[] = [];
    const nftName = await contract.name();
    const totalSupply = await contract.totalSupply();

    for (let i = totalSupply - BigInt(1); i >= BigInt(0); i--) {
      const tokenId = await contract.tokenByIndex(i);
      const tokenURI = await contract.tokenURI(tokenId);
      const owner = await contract.ownerOf(tokenId);
      const res = await fetch(tokenURI);
      const metadata = await res.json();
      nftList.push({
        nftName,
        owner: owner.toLowerCase(),
        tokenId: tokenId.toString(),
        image: metadata.image,
        price: "0.0001 wat", // 暂时写死
      });
    }
    result.data = nftList;
    result.timeStamp = Number(newStamp);
  }

  return Response.json(result.data);
}
