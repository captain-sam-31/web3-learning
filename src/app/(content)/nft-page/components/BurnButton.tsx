"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { memo } from "react";
import { NftItem } from "../types";
import { FireOutlined } from "@ant-design/icons";
import { useMyRedux } from "@/redux";
import { useConfirm } from "@/app/components/ConfirmProvider";
import { useWriteNFT } from "@/hooks/useNFTContract";
import { useMessage } from "@/app/components/MessageProvider";
import { useCheckBeforeTx } from "@/hooks/useCheckBeforeTx";

interface IBurnButtonProps {
  record: NftItem;
}
// 销毁NFT
const BurnButton = ({ record }: IBurnButtonProps) => {
  const { setUpdateNFTMarket } = useMyRedux((state) => state);
  const { errorMsg, successMsg } = useMessage();
  const isChecked = useCheckBeforeTx();
  const confirm = useConfirm();

  // 销毁NFT
  const { run: burnFn, loading: burnLoading } = useWriteNFT({ functionName: "burn", args: [record.tokenId] });

  // 点击销毁按钮
  const handleBurn = async () => {
    if (!(await isChecked())) return;
    if (!record.tokenId) {
      errorMsg("Invalid tokenId");
      return;
    }
    confirm({
      content: "Are you sure to burn this NFT ?",
      onOk: () => {
        burnFn()
          .then(() => {
            setUpdateNFTMarket(new Date().getTime());
            successMsg("Burnt successfully");
          })
          .catch((err) => {
            errorMsg(err.message);
          });
      },
    });
  };

  return (
    <Tooltip content={`Burn this NFT`}>
      <Button
        className="absolute bottom-0 right-0"
        isLoading={burnLoading}
        size="sm"
        radius="full"
        isIconOnly
        color="danger"
        onClick={handleBurn}
      >
        <FireOutlined className="text-[18px]" />
      </Button>
    </Tooltip>
  );
};
export default memo(BurnButton);
