"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { memo } from "react";
import { NftItem } from "../types";
import { ShoppingCartOutlined } from "@ant-design/icons";

interface IBuyButtonProps {
  record: NftItem;
}
// 交易NFT
const BuyButton = ({ record }: IBuyButtonProps) => {
  const handleBuy = () => {
    console.log("buy", record);
  };

  return (
    <Tooltip content={`Buy this NFT`}>
      <Button className="absolute bottom-0 right-0" size="sm" radius="full" isIconOnly color="primary" onClick={handleBuy}>
        <ShoppingCartOutlined className="text-[18px]" />
      </Button>
    </Tooltip>
  );
};
export default memo(BuyButton);
