import { NftContractAbi } from "@/abi/NftContract";
import { nftContractAddr, targetNetRPC } from "@/utils/constants";
import { wagmiConfig } from "@/wagmi";
import { useRequest } from "ahooks";
import { ethers } from "ethers";
import { readContract, writeContract } from "wagmi/actions";

interface IOptions {
  functionName: string;
  args?: unknown[];
}
const provider = new ethers.JsonRpcProvider(targetNetRPC);
// 合约 写入
export const useWriteNFT = (options: IOptions) => {
  // 调用写入方法
  const { runAsync, loading } = useRequest(
    async (...args) => {
      const opts = { ...options };
      args.length && (opts.args = args);
      const hash = await writeContract(wagmiConfig, {
        abi: NftContractAbi,
        address: nftContractAddr,
        ...opts,
      });
      // 快速等2个区块确认，标准一般等6个区块确认，高安全性等12个区块确认
      return provider.waitForTransaction(hash, 2);
    },
    { manual: true }
  );

  return { loading, run: runAsync };
};
// 合约 读取
export const useReadNFT = (options: IOptions) => {
  // 调用读取方法
  const { runAsync, loading } = useRequest(
    (...args) => {
      const opts = { ...options };
      args.length && (opts.args = args);
      return readContract(wagmiConfig, { abi: NftContractAbi, address: nftContractAddr, ...opts });
    },
    { manual: true }
  );

  return { loading, run: runAsync };
};
