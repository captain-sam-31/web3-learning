import { deployNetRPC, nftContractAddr, watContractAddr } from "@/utils/constants";
import { ConfirmProvider } from "./ConfirmProvider";
import { MessageProvider } from "./MessageProvider";
import { ethers } from "ethers";
import { NftContractAbi } from "@/abi/NftContract";
import { useMount } from "ahooks";
import { WatContractAbi } from "@/abi/WaterContract";
import { useMyRedux } from "@/redux";
import { bigToString } from "@/utils/utils";

const provider = new ethers.JsonRpcProvider(deployNetRPC);
const nftCon = new ethers.Contract(nftContractAddr, NftContractAbi, provider);
const watCon = new ethers.Contract(watContractAddr, WatContractAbi, provider);
// GlobalTools 里自定义一些常用的全局组件
export default function GlobalTools({ children }: { children: React.ReactNode }) {
  const { setContract } = useMyRedux((state) => state);

  useMount(async () => {
    const nft = {
      name: await nftCon.name(),
      symbol: await nftCon.symbol(),
    };
    const wat = {
      name: await watCon.name(),
      symbol: await watCon.symbol(),
      decimals: bigToString(await watCon.decimals()),
    };
    setContract({ nft, wat });
  });

  return (
    <MessageProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </MessageProvider>
  );
}
