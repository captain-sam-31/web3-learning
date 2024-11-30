import { NftContractAbi } from "@/abi/NftContract";
import { deployNetRPC, nftContractAddr } from "@/utils/constants";
import { IExtra, IOptions } from "@/utils/types";
import { wagmiConfig } from "@/wagmi";
import { useRequest } from "ahooks";
import { Options } from "ahooks/lib/useRequest/src/types";
import { ethers } from "ethers";
import { writeContract } from "wagmi/actions";

const provider = new ethers.JsonRpcProvider(deployNetRPC);
const contract = new ethers.Contract(nftContractAddr, NftContractAbi, provider);
/**
 * 这里的合约操作 都是需要通过MetaMask弹窗让用户确认（无需弹窗确认的方式涉及私钥，不可写在client模式）
 */
// 合约 写入
export const useWriteNFT = (options: IOptions) => {
  // 如果要在useMount中使用，要改成useWriteContract，否则由于wagmi某些参数 未初始化完成 可能会报错
  const { runAsync, loading } = useRequest(
    async (args: unknown[] = [], extra: IExtra = {}) => {
      const hash = await writeContract(wagmiConfig, {
        abi: NftContractAbi,
        address: nftContractAddr,
        ...options,
        ...(args.length ? { args } : {}),
        ...extra,
      });
      // 快速等2个区块确认，标准一般等6个区块确认，高安全性等12个区块确认
      return provider.waitForTransaction(hash, 1);
    },
    { manual: true }
  );

  return { loading, run: runAsync };
};
// 合约 读取（默认第一次会调用）
export const useReadNFT = (options: IOptions, extra?: Options<any, any[]>) => {
  // 未连接钱包时，wagmi居然无法调用，改由ethers调用
  const { data, runAsync, loading } = useRequest(
    async (...args) => {
      const newArgs = args.length ? args : options.args;
      return contract[options.functionName](...(newArgs || []));
    },
    { ...extra }
  );

  return { data, loading, run: runAsync };
};
