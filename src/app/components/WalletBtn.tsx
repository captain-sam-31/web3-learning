"use client";
import { Button } from "@nextui-org/button";
import MetamaskIcon from "@/assets/MetamaskIcon";
import { memo } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ToolOutlined } from "@ant-design/icons";
import IdentIcon from "@/assets/IdentIcon";

const WalletBtn = () => {
  return (
    <ConnectButton.Custom>
      {(props) => {
        const { account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted } = props;
        // Note: If your app doesn't use authentication, you can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    size="sm"
                    color="primary"
                    radius="full"
                    endContent={<MetamaskIcon className="h-4" />}
                    onClick={openConnectModal}
                  >
                    Connect MetaMask
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button color="danger" size="sm" radius="full" endContent={<ToolOutlined />} onClick={openChainModal}>
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <Button radius="full" color="primary" variant="flat" onClick={openChainModal} size="sm">
                    {chain.hasIcon && (
                      <Image alt={chain.name ?? "Chain icon"} src={chain.iconUrl || ""} width={14} height={14} priority />
                    )}
                    {chain.name}
                  </Button>
                  <Button
                    onClick={openAccountModal}
                    className="flex items-center gap-1"
                    color="primary"
                    variant="flat"
                    radius="full"
                    size="sm"
                  >
                    <IdentIcon addr={account.address} size={14} />
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ""}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default memo(WalletBtn);
