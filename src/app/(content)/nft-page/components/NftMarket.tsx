"use client";
import { cn, Image, Tooltip } from "@nextui-org/react";
import { ellipsis } from "@/utils/commonClass";
import Spinning from "@/app/components/Spinning";
import { memo, useState } from "react";
import { useNftByOpensea } from "@/hooks/useNftByOpensea";
import { useFetch } from "@/hooks/useFetch";
import { useMyRedux } from "@/redux";
import { NftItem } from "../types";
import { shortAddr } from "@/utils/utils";
import { useAccountChange } from "@/hooks/useAccountChange";
import BurnButton from "./BurnButton";
import BuyButton from "./BuyButton";

interface IMetaDataProps {
  show: boolean;
}

const NftMarket = ({ show }: IMetaDataProps) => {
  const { updateNFTMarket } = useMyRedux((state) => state);
  const [hoverId, setHoverId] = useState<string>();
  const currAddr = useAccountChange();
  // const { data, loading } = useNftByOpensea();
  const { data, loading } = useFetch(() => fetch("/api/nft-market"), { refreshDeps: [updateNFTMarket] });

  return (
    <div
      className={cn(
        "relative grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 grow pr-2 overflow-auto content-start",
        show ? "" : "hidden"
      )}
    >
      <Spinning visible={loading} />
      {data?.map((v: NftItem) => (
        <div
          key={v.tokenId}
          onMouseEnter={() => setHoverId(v.tokenId)}
          onMouseLeave={() => setHoverId("")}
          className="p-3 rounded-large dark:bg-white/10 dark:hover:bg-white/20 bg-black/5 flex flex-col shadow hover:shadow-lg transition-all "
        >
          <div className="rounded-large overflow-hidden w-full">
            <Image
              className={cn(
                "size-full object-cover transition-transform",
                hoverId === v.tokenId ? "scale-125 -translate-y-3" : ""
              )}
              removeWrapper={true}
              src={v.image}
              alt=""
            />
          </div>
          <div className="mt-2 relative h-[76px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <p className={`font-bold ${ellipsis}`}>{v.nftName}</p>
              <p className="text-sm"># {v.tokenId}</p>
            </div>
            <div>{v.price}</div>
            <div className="flex items-center gap-1">
              <p className={cn("size-[8px] rounded-full bg-primary", v.owner === currAddr ? "bg-success" : "")} />
              <Tooltip content={`Owner：${v.owner === currAddr ? "You" : v.owner}`}>
                <p>{shortAddr(v.owner)}</p>
              </Tooltip>
            </div>
            {v.owner !== currAddr ? <BuyButton record={v} /> : <BurnButton record={v} />}
          </div>
        </div>
      ))}
    </div>
  );
};
export default memo(NftMarket);
