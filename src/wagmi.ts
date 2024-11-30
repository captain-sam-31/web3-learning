import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { avalancheFuji, mainnet, mantleSepoliaTestnet } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "web3_learning",
  projectId: "b74ff78a8256eac550805546a75fe14d",
  chains: [mainnet, avalancheFuji, mantleSepoliaTestnet],
  ssr: true,
});
