import Jazzicon, { jsNumberForAddress } from "react-jazzicon"; // Metamask使用的Jazzicons插件
import { blo } from "blo"; // Metamask使用的Blockies插件
import Image from "next/image";
import { memo } from "react";

interface IIdentIconProps {
  addr: string;
  size?: number;
  /**
   * Metamask有2种类型头像(默认Jazzicons)，但Metamask切换类型，并没有通知事件，因此type无法跟随其切换。
   * 如果以后官方提供事件通知，才可以跟随切换。
   */
  type?: "Jazzicons" | "Blockies";
}
// 根据 账户地址 生成 头像
const IdentIcon = ({ addr, size = 20, type = "Jazzicons" }: IIdentIconProps) => {
  return type === "Jazzicons" ? (
    <Jazzicon diameter={size} seed={jsNumberForAddress(addr)} />
  ) : (
    <Image width={size} height={size} style={{ borderRadius: "50%" }} src={blo(addr as `0x${string}`)} alt="" priority />
  );
};

export default memo(IdentIcon);
