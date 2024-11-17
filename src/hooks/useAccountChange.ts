import { useMount, useUnmount } from "ahooks";
import { useState } from "react";

// 监听账户变更
export const useAccountChange = () => {
  const [account, setAccount] = useState<string>("");

  useMount(async () => {
    if (!window.ethereum) return;
    const accounts = await window.ethereum.request({ method: "eth_accounts", params: [] });
    setAccount(accounts[0]?.toLowerCase() ?? "");
    window.ethereum.on("accountsChanged", handleChange);
  });

  useUnmount(() => {
    if (!window.ethereum) return;
    window.ethereum.off("accountsChanged", handleChange);
  });
  // 处理账户变更
  const handleChange = (accounts: string[]) => {
    setAccount(accounts[0]?.toLowerCase() ?? "");
  };

  return account;
};
