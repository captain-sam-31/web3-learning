import { ethers } from "ethers";
import { nftContractAddr, targetNetRPC } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";
import { NftContractAbi } from "@/abi/NftContract";
import { NftItem } from "@/app/(content)/nft-page/types";

const provider = new ethers.JsonRpcProvider(targetNetRPC);
const contract = new ethers.Contract(nftContractAddr, NftContractAbi, provider);

// 通过合约的 tokenByIndex 和 totalSupply 轮询获取NFT列表（由于是轮询，所以比较慢）
export async function GET(req: NextRequest) {
  // 获取当前账户地址
  // const accountAddr = new URL(req.url).searchParams.get("accountAddr");
  // if (!accountAddr) {
  //   return NextResponse.json({ msg: "accountAddr is required" }, { status: 400 });
  // }

  const nftList: NftItem[] = [];
  const nftName = await contract.name();
  const totalSupply = await contract.totalSupply();

  for (let i = 0; i < totalSupply; i++) {
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

  return Response.json(nftList);
}
