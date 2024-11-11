"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { memo } from "react";
import { NftItem } from "../types";
import { FireOutlined } from "@ant-design/icons";

interface IBurnButtonProps {
  record: NftItem;
}
// 销毁NFT
const BurnButton = ({ record }: IBurnButtonProps) => {
  const handleBurn = () => {
    console.log("burn", record);
  };

  return (
    <Tooltip content={`Burn this NFT`}>
      <Button className="absolute bottom-0 right-0" size="sm" radius="full" isIconOnly color="danger" onClick={handleBurn}>
        <FireOutlined className="text-[18px]" />
      </Button>
    </Tooltip>
  );
};
export default memo(BurnButton);
