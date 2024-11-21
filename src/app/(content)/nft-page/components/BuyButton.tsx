"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { memo } from "react";
import { NftItem } from "../types";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { useConfirm } from "@/app/components/ConfirmProvider";
import { useCheckBeforeTx } from "@/hooks/useCheckBeforeTx";

interface IBuyButtonProps {
  record: NftItem;
  wat: bigint; // waterToken 余额
  account: string; // 当前账户地址
}
// 交易NFT
const BuyButton = ({ record, wat, account }: IBuyButtonProps) => {
  const confirm = useConfirm();
  const isChecked = useCheckBeforeTx();
  // 点击交易按钮
  const handleBuy = async () => {
    if (!(await isChecked())) return;
    confirm({
      content: "Are you sure to buy this NFT ?",
      onOk: () => {
        // axios.post("/api/nft-market", { to: account, tokenId: record.tokenId });
      },
    });
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
