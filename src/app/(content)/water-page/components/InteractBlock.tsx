"use client";
import { useReadWat } from "@/hooks/useWaterContract";
import { bgBlock } from "@/utils/commonClass";
import { deployNetName, watContractAddr } from "@/utils/constants";
import { formatEther, tracer } from "@/utils/utils";
import { cn, Link } from "@nextui-org/react";
import { memo } from "react";
import TxBlock from "./TxBlock";
import { useMyRedux } from "@/redux";

// 需动态获取数据的模块
const InteractBlock = () => {
  const { name, symbol, decimals } = useMyRedux((state) => state.contract.wat);
  const { data: totalSupply, run: totalSupplyFn } = useReadWat({ functionName: "totalSupply" });

  return (
    <div className="h-[800px] lg:h-3/5 pt-4 flex flex-wrap align-center gap-4">
      <div className={cn("w-full h-[45%] lg:w-2/5 lg:h-full px-5", bgBlock)}>
        <div className="h-[60%] flex flex-col items-center justify-center gap-6 border-b-2 border-default-400">
          <div className="text-2xl">Total Supply</div>
          <div className="font-bold flex items-baseline gap-2">
            <p className="text-5xl">{formatEther(totalSupply)}</p>
            <p className="text-4xl">{symbol}</p>
          </div>
          <div className="text-2xl">Decimals {decimals || "??"}</div>
        </div>
        <div className="h-[40%] flex flex-col items-center justify-center gap-4">
          <Link className="text-3xl" href={tracer(watContractAddr)} target="_blank">
            Water Token Contract
          </Link>
          <div className="text-2xl">{deployNetName}</div>
        </div>
      </div>
      <TxBlock
        tokenName={name}
        tokenSymbol={symbol}
        update={() => {
          totalSupplyFn();
        }}
      />
    </div>
  );
};

export default memo(InteractBlock);
