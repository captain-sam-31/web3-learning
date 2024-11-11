"use client";
import { cn, Link, Tab, Tabs, Tooltip } from "@nextui-org/react";
import MetaData from "./components/MetaData";
import { memo, useState } from "react";
import NftMarket from "./components/NftMarket";
import { nftContractAddr } from "@/utils/constants";
import { ellipsis } from "@/utils/commonClass";
import { shortAddr } from "@/utils/utils";

const tabItems = [
  { id: "market", label: "NFT Market" },
  { id: "metadata", label: "Meta Data" },
];

const NftPage = () => {
  const [tabKey, setTabKey] = useState<string>("market");

  return (
    <section className="h-full pl-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-5">
        <Tabs
          aria-label="tabs"
          className="flex-col grow"
          variant="bordered"
          color="primary"
          items={tabItems}
          selectedKey={tabKey}
          onSelectionChange={(k) => setTabKey(k as string)}
        >
          {(item) => <Tab key={item.id} title={item.label} />}
        </Tabs>
        <Tooltip content={nftContractAddr}>
          <Link
            className={cn("max-w-1/2 pr-[16px]", ellipsis)}
            href={`https://testnet.snowtrace.io/address/${nftContractAddr}`}
            target="_blank"
          >
            NFT Contract：{shortAddr(nftContractAddr, 6)}
          </Link>
        </Tooltip>
      </div>
      <NftMarket show={tabKey === "market"} />
      <MetaData show={tabKey === "metadata"} />
    </section>
  );
};
export default memo(NftPage);
