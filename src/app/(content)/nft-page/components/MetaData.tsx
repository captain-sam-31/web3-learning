"use client";
import { cn, Image } from "@nextui-org/react";
import MintButton from "./MintButton";
import { ellipsis } from "@/utils/commonClass";
import { useFetch } from "@/hooks/useFetch";
import Spinning from "@/app/components/Spinning";
import { memo, useState } from "react";
import { MetaDataItem } from "../types";

interface IMetaDataProps {
  show: boolean;
}

const MetaData = ({ show }: IMetaDataProps) => {
  const [hoverId, setHoverId] = useState<string>();

  const { data, loading } = useFetch(() => fetch(`/api/nft-metadata`));

  return (
    <div
      className={cn(
        "relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 grow pr-2 overflow-auto content-start",
        show ? "" : "hidden"
      )}
    >
      <Spinning visible={loading} />
      {data?.map((v: MetaDataItem) => (
        <div
          key={v.id}
          onMouseEnter={() => setHoverId(v.id)}
          onMouseLeave={() => setHoverId("")}
          className="p-3 rounded-large dark:bg-white/10 dark:hover:bg-white/20 bg-black/5 flex shadow hover:shadow-lg transition-all h-[180px]"
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
              <MintButton metaInfo={v} />
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
  );
};
export default memo(MetaData);
