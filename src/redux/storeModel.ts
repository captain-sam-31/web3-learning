interface IMessage {
  content: string;
  type?: "info" | "succ" | "err";
}

export interface StoreModel {
  updateNFTMarket: number;
  setUpdateNFTMarket: (updateNFTMarket: number) => void;
}
