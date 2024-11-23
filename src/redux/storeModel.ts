interface ContractInfo {
  name: string;
  symbol: string;
  decimals?: string;
}
export interface StoreModel {
  updateNFTMarket: number;
  setUpdateNFTMarket: (updateNFTMarket: number) => void;
  contract: { nft: ContractInfo; wat: ContractInfo };
  setContract: (info: { [key: string]: ContractInfo }) => void;
}
