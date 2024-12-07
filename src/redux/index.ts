import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { StoreModel } from "./storeModel";

export const useMyRedux = create(
  persist<StoreModel>(
    (set, get) => ({
      updateNFTMarket: 0,
      setUpdateNFTMarket: (timestamp) => set({ ...get(), updateNFTMarket: timestamp }),
      // 合约信息常量
      contract: { nft: { name: "", symbol: "" }, wat: { name: "", symbol: "" } },
      setContract: (info) => set({ ...get(), contract: { ...get().contract, ...info } }),
    }),
    {
      name: "web3-learning", // 存储中的项目名称，必须是唯一的
      storage: createJSONStorage(() => sessionStorage), // 默认是localStorage
    }
  )
);
