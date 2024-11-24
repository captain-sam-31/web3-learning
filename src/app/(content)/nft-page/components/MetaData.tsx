"use client";
import { cn, Image, Input, Link } from "@nextui-org/react";
import MintButton from "./MintButton";
import { bgBlock, ellipsis } from "@/utils/commonClass";
import { useFetch } from "@/hooks/useFetch";
import Spinning from "@/app/components/Spinning";
import { memo, useMemo, useState } from "react";
import { MetaDataItem } from "../types";
import { nftContractAddr } from "@/utils/constants";
import { SearchOutlined } from "@ant-design/icons";
import { tracer } from "@/utils/utils";
import { useReadNFT } from "@/hooks/useNFTContract";
import Empty from "@/app/components/Empty";

interface IMetaDataProps {
  show: boolean;
}

const MetaData = ({ show }: IMetaDataProps) => {
  const [hoverId, setHoverId] = useState<string>();
  const [filter, setFilter] = useState<{ search: string }>({ search: "" });
  // 获取NFT合约持有者
  const { data: owner, loading: ownerLoading } = useReadNFT({ functionName: "owner" });
  // 获取metadata
  const { data, loading } = useFetch(() => fetch(`/api/nft-metadata`));

  const list = useMemo(() => {
    return (
      data?.filter((v: MetaDataItem) => {
        if (filter.search) {
          const cond1 = v.name.includes(filter.search);
          const cond2 = v.attributes.some((a) => a.value.includes(filter.search));
          return cond1 || cond2;
        }
        return true;
      }) || []
    );
  }, [data, filter]);

  return (
    <div className={cn("h-full flex flex-col gap-4", show ? "" : "hidden")}>
      <div className="flex items-center justify-between gap-4">
        <div className="grow flex items-center gap-[10px]">
          <Input
            className="max-w-[50%] lg:max-w-[25%]"
            placeholder="Fuzzy search"
            variant="bordered"
            radius="full"
            size="sm"
            startContent={<SearchOutlined />}
            value={filter.search}
            onChange={(e) => {
              setFilter({ ...filter, search: e.target.value });
            }}
          />
        </div>
        <Link className={cn("max-w-1/2 pr-[16px]", ellipsis)} href={tracer(nftContractAddr)} target="_blank">
          NFT Contract
        </Link>
      </div>
      <div className="grow relative overflow-hidden">
        <Spinning visible={loading} />
        {list.length ? (
          <div className={"h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 grow pr-2 overflow-auto content-start"}>
            {list.map((v: MetaDataItem) => (
              <div
                key={v.id}
                onMouseEnter={() => setHoverId(v.id)}
                onMouseLeave={() => setHoverId("")}
                className={cn("p-3 dark:hover:bg-white/20 flex shadow hover:shadow-lg transition-all h-[180px]", bgBlock)}
              >
                <div className="rounded-large overflow-hidden w-2/5 h-full">
                  <Image
                    className={cn("size-full object-cover transition-transform", hoverId === v.id ? "scale-125 -translate-y-3" : "")}
                    removeWrapper={true}
                    src={v.image}
                    alt=""
                  />
                </div>
                <div className="w-3/5 flex flex-col justify-between pl-4">
                  <div className="text-xl font-bold flex justify-between" title={v.name}>
                    <div className={ellipsis}>{v.name}</div>
                    <MintButton metaInfo={v} owner={owner} ownerLoading={ownerLoading} />
                  </div>
                  <div className={ellipsis} title={v.description}>
                    {v.description}
                  </div>
                  <div className="border-t-1 border-current text-sm grow flex flex-col justify-between pt-2">
                    {v.attributes.map((a, ai) => (
                      <div key={ai} className="flex justify-between gap-2">
                        <div className="shrink-0">{a.trait_type}</div>
                        <div className={ellipsis} title={a.value}>
                          {a.value}
                        </div>
                      </div>
                    ))}
                  </div>
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
export default memo(MetaData);
