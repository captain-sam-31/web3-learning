export interface MetaDataItem {
  id: string;
  name: string;
  image: string;
  tokenURI: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export interface NftItem {
  owner: string;
  tokenId: string;
  image: string;
  price: string;
}
