interface IMessage {
  content: string;
  type?: "info" | "succ" | "err";
}

export interface StoreModel {
  msg: IMessage;
  setMsg: (msg: IMessage) => void;
  updateNFTMarket: number;
  setUpdateNFTMarket: (updateNFTMarket: number) => void;
}
