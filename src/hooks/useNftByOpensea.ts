"use client";
import { nftContractAddr, targetNetRPC } from "@/utils/constants";
import { ethers } from "ethers";
import { Chain, OpenSeaSDK } from "opensea-js";
import { useMemo } from "react";
import { useFetch } from "./useFetch";
import { NftContractAbi } from "@/abi/NftContract";
import { NftItem } from "@/app/(content)/nft-page/types";

const provider = new ethers.JsonRpcProvider(targetNetRPC);
const contract = new ethers.Contract(nftContractAddr, NftContractAbi, provider);

// 通过openseaSDK获取NFT信息（OpenSeaSDK只能在client模式下执行）
export const useNftByOpensea = () => {
  const openseaSDK = useMemo(() => {
    // 官网虽有现成的Api提供，但目前不传apiKey会报错，估计不让用了（https://docs.opensea.io/reference/api-overview）
    const provider = new ethers.JsonRpcProvider(targetNetRPC);
    return new OpenSeaSDK(provider, { chain: Chain.Fuji /* 若非测试网，需多传apiKey字段 */ });
  }, []);

  // 除了openseaSDK的方式，也可通过合约的 tokenByIndex 和 totalSupply 轮询获取NFT列表
  const { data, loading } = useFetch(async () => {
    // 获取NFT名称
    const nftName = await contract.name();
    // 通过合约地址 获取NFT
    const res = await openseaSDK.api.getNFTsByContract(nftContractAddr);

    const list: NftItem[] = [];
    for (const v of res?.nfts || []) {
      // OpenSea返回的NFT包含了已经burn掉的，需过滤掉
      if (v.metadata_url) {
        const owner = await contract.ownerOf(v.identifier);
        list.push({
          nftName,
          owner: owner.toLowerCase(),
          tokenId: v.identifier,
          image: v.image_url,
          price: "0.0001 wat", // 暂时写死
        });
      }
    }
    return Promise.resolve(list);
  });

  return { data, loading };
};
