import { useMessage } from "@/app/components/MessageProvider";
import { deployNetId, deployNetName } from "@/utils/constants";
import { useCallback } from "react";

// 交易前检查
export const useCheckBeforeTx = () => {
  const { errorMsg } = useMessage();

  const isChecked = useCallback(async () => {
    // 是否安装了MetaMask
    if (!window.ethereum) {
      errorMsg("Please install MetaMask first, which is a Chrome extension");
      return false;
    }
    // 是否连接了MetaMask
    const accounts = await window.ethereum.request({ method: "eth_accounts", params: [] });
    if (!accounts.length) {
      errorMsg("Please connect to MetaMask first");
      return false;
    }
    // 是否切换到目标网（即合约部署所在的网）
    const chainId = await window.ethereum.request({ method: "eth_chainId", params: [] });
    if (chainId !== deployNetId) {
      errorMsg(`Please switch to ${deployNetName}, which is permitted to operate`);
      return false;
    }
    return true;
  }, []);

  return isChecked;
};
