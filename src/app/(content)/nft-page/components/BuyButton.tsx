"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { memo } from "react";
import { NftItem } from "../types";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useConfirm } from "@/app/components/ConfirmProvider";
import { useCheckBeforeTx } from "@/hooks/useCheckBeforeTx";
import { useMessage } from "@/app/components/MessageProvider";
import { useMyRedux } from "@/redux";
import { useWriteNFT } from "@/hooks/useNFTContract";

interface IBuyButtonProps {
  record: NftItem;
  uWat: bigint; // waterToken 余额
  update: () => void;
}
// 交易NFT
const BuyButton = ({ record, uWat, update }: IBuyButtonProps) => {
  const { setUpdateNFTMarket } = useMyRedux((state) => state);
  const { errorMsg, successMsg } = useMessage();
  const confirm = useConfirm();
  const isChecked = useCheckBeforeTx();
  // 购买NFT
  const { run: transactNFT, loading } = useWriteNFT({ functionName: "transactNFT" });

  // 点击交易按钮
  const handleBuy = async () => {
    if (!(await isChecked())) return;
    if (uWat < BigInt(record.price)) {
      errorMsg("Your wat balance is not enough");
      return;
    }
    confirm({
      content: "Are you sure to buy this NFT ?",
      onOk: () => {
        transactNFT([record.tokenId])
          .then(() => {
            setUpdateNFTMarket(new Date().getTime());
            update();
            successMsg("Bought successfully");
          })
          .catch((err) => errorMsg(err.message));
      },
    });
  };

  return (
    <Tooltip content={`Buy this NFT`}>
      <Button
        className="absolute bottom-0 right-0"
        size="sm"
        radius="full"
        isIconOnly
        color="primary"
        isLoading={loading}
        onClick={handleBuy}
      >
        <ShoppingCartOutlined className="text-[18px]" />
      </Button>
    </Tooltip>
  );
};
export default memo(BuyButton);
