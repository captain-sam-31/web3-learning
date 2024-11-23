"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { memo } from "react";
import { NftItem } from "../types";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { useConfirm } from "@/app/components/ConfirmProvider";
import { useCheckBeforeTx } from "@/hooks/useCheckBeforeTx";
import { useMessage } from "@/app/components/MessageProvider";
import { useRequest } from "ahooks";
import { useMyRedux } from "@/redux";

interface IBuyButtonProps {
  record: NftItem;
  uWat: bigint; // waterToken 余额
  account: string; // 当前账户地址
  update: () => void;
}
// 交易NFT
const BuyButton = ({ record, uWat, account, update }: IBuyButtonProps) => {
  const { setUpdateNFTMarket } = useMyRedux((state) => state);
  const { errorMsg, successMsg } = useMessage();
  const confirm = useConfirm();
  const isChecked = useCheckBeforeTx();
  const { runAsync: buyFn, loading } = useRequest((params) => axios.post("/api/nft-market", params), { manual: true });

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
        buyFn({ to: account, tokenId: record.tokenId })
          .then((res) => {
            console.log(res, 88888);
            setUpdateNFTMarket(new Date().getTime());
            update();
            successMsg("Bought successfully");
          })
          .catch(({ response, message }) => {
            console.log(response, 55555555);
            errorMsg(response.data?.msg || message);
          });
      },
    });
  };

  return (
    <Tooltip content={`Buy this NFT`}>
      <Button className="absolute bottom-0 right-0" size="sm" radius="full" isIconOnly color="primary" isLoading={loading} onClick={handleBuy}>
        <ShoppingCartOutlined className="text-[18px]" />
      </Button>
    </Tooltip>
  );
};
export default memo(BuyButton);
