"use client";
import { Chip, cn, Image, Input, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { bgBlock, ellipsis } from "@/utils/commonClass";
import Spinning from "@/app/components/Spinning";
import { memo, useEffect, useMemo, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useMyRedux } from "@/redux";
import { NftItem } from "../types";
import { formatEther, shortAddr } from "@/utils/utils";
import { useAccountChange } from "@/hooks/useAccountChange";
import BurnButton from "./BurnButton";
import BuyButton from "./BuyButton";
import { SearchOutlined } from "@ant-design/icons";
import { useReadWat } from "@/hooks/useWaterContract";
import Empty from "@/app/components/Empty";

interface IMetaDataProps {
  show: boolean;
}
const belongs = [
  { k: "1", v: "Only Mine" },
  { k: "2", v: "Except Mine" },
];
const NftMarket = ({ show }: IMetaDataProps) => {
  const currAddr = useAccountChange();
  const { nft, wat } = useMyRedux((state) => state.contract);
  const { data: uWat, run: watOfUser } = useReadWat({ functionName: "balanceOf" }, { manual: true });
  const { updateNFTMarket } = useMyRedux((state) => state);
  const [hoverId, setHoverId] = useState<string>();
  const [filter, setFilter] = useState<any>({ belong: [], tokenId: "" });

  useEffect(() => {
    if (currAddr) {
      watOfUser(currAddr);
    }
  }, [currAddr]);
  // const { data, loading } = useNftByOpensea();
  const { data, loading } = useFetch((p) => fetch(`/api/nft-market?timestamp=${p.timestamp}`), {
    initParam: { timestamp: updateNFTMarket },
    refreshDeps: [updateNFTMarket],
  });

  const list = useMemo(() => {
    return (
      data?.filter((v: NftItem) => {
        const cond1 = filter.tokenId ? v.tokenId.includes(filter.tokenId) : true;
        let cond2 = true;
        if (filter.belong[0] && currAddr) {
          cond2 = filter.belong[0] === "1" ? v.owner === currAddr : v.owner !== currAddr;
        }
        return cond1 && cond2;
      }) || []
    );
  }, [data, filter]);

  return (
    <div className={cn("h-full flex flex-col gap-4", show ? "" : "hidden")}>
      <div className="h-[40px] flex items-center justify-between gap-4">
        <div className="grow flex items-center gap-[10px]">
          <Input
            className="max-w-[50%] lg:max-w-[25%]"
            placeholder="Search by tokenId"
            variant="bordered"
            radius="full"
            size="sm"
            startContent={<SearchOutlined />}
            value={filter.tokenId}
            onChange={(e) => {
              setFilter({ ...filter, tokenId: e.target.value });
            }}
          />
          <Select
            className="max-w-[50%] lg:max-w-[25%]"
            labelPlacement={"outside-left"}
            placeholder="Filter the NFTs"
            variant="bordered"
            radius="full"
            size="sm"
            aria-label="belongs"
            selectedKeys={filter.belong}
            onChange={(e) => {
              setFilter({ ...filter, belong: e.target.value ? [e.target.value] : [] });
            }}
          >
            {belongs.map((v) => (
              <SelectItem key={v.k}>{v.v}</SelectItem>
            ))}
          </Select>
        </div>
        <Chip size="lg" color="primary" variant="dot">
          {formatEther(uWat)} {wat.symbol}
        </Chip>
      </div>
      <div className="grow relative overflow-hidden">
        <Spinning visible={loading} />
        {list.length ? (
          <div className="h-full grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 pr-2 content-start overflow-auto">
            {list.map((v: NftItem) => (
              <div
                key={v.tokenId}
                onMouseEnter={() => setHoverId(v.tokenId)}
                onMouseLeave={() => setHoverId("")}
                className={cn("p-3 dark:hover:bg-white/20 flex flex-col shadow hover:shadow-lg transition-all", bgBlock)}
              >
                <div className="rounded-large overflow-hidden w-full">
                  <Image
                    className={cn("size-full object-cover transition-transform", hoverId === v.tokenId ? "scale-125 -translate-y-3" : "")}
                    removeWrapper={true}
                    src={v.image}
                    alt=""
                  />
                </div>
                <div className="mt-2 relative h-[76px] flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <p className={`font-bold ${ellipsis}`}>{nft.name}</p>
                    <p className="text-sm"># {v.tokenId}</p>
                  </div>
                  <div>
                    {formatEther(BigInt(v.price))} {wat.symbol}
                  </div>
                  <div className="flex items-center gap-1">
                    <p className={cn("size-[8px] rounded-full bg-primary", v.owner === currAddr ? "bg-success" : "")} />
                    <Tooltip content={`Owner：${v.owner === currAddr ? "You" : v.owner}`}>
                      <p>{shortAddr(v.owner)}</p>
                    </Tooltip>
                  </div>
                  {v.owner !== currAddr ? (
                    <BuyButton
                      record={v}
                      uWat={uWat}
                      update={() => {
                        watOfUser(currAddr);
                      }}
                    />
                  ) : (
                    <BurnButton record={v} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty loading={loading} />
        )}
      </div>
    </div>
  );
};
export default memo(NftMarket);
