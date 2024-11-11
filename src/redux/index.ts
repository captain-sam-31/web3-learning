import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { StoreModel } from "./storeModel";

export const useMyRedux = create(
  persist<StoreModel>(
    (set, get) => ({
      msg: { content: "" },
      setMsg: (msg) => set({ ...get(), msg }),
      updateNFTMarket: 0,
      setUpdateNFTMarket: (timestamp) => set({ ...get(), updateNFTMarket: timestamp }),
    }),
    {
      name: "web3-learning", // 存储中的项目名称，必须是唯一的
      storage: createJSONStorage(() => sessionStorage), // 默认是localStorage
    }
  )
);
