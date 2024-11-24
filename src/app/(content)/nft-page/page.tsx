"use client";
import { Tab, Tabs } from "@nextui-org/react";
import MetaData from "./components/MetaData";
import { memo, useState } from "react";
import NftMarket from "./components/NftMarket";

const tabItems = [
  { id: "market", label: "NFT Market" },
  { id: "metadata", label: "Meta Data" },
];

const NftPage = () => {
  const [tabKey, setTabKey] = useState<string>("market");

  return (
    <section className="h-full flex flex-col gap-4 sm:pr-0">
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
      </div>
      <div className="grow overflow-auto">
        <NftMarket show={tabKey === "market"} />
        <MetaData show={tabKey === "metadata"} />
      </div>
    </section>
  );
};
export default memo(NftPage);
