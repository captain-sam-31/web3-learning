"use client";
import { MetaDataItem } from "../types";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip } from "@nextui-org/react";
import HammerIcon from "@/assets/HammerIcon";
import { getAccount, readContract, writeContract } from "@wagmi/core";
import { wagmiConfig } from "@/wagmi";
import { nftContractAddr, targetNetId, targetNetName, targetNetRPC } from "@/utils/constants";
import { memo, useState } from "react";
import { useRequest } from "ahooks";
import { NftContractAbi } from "@/abi/NftContract";
import { useMyRedux } from "@/redux";
import { ethers } from "ethers";

interface IMetaInfo {
  metaInfo: MetaDataItem;
}
const provider = new ethers.JsonRpcProvider(targetNetRPC);

const MintButton = (props: IMetaInfo) => {
  const { metaInfo } = props;
  const { setMsg, setUpdateNFTMarket } = useMyRedux((state) => state);

  const [visible, setVisible] = useState<boolean>(false);
  const [target, setTarget] = useState<string>("");

  // 获取合约持有者
  const { runAsync: ownerFn, loading: ownerLoading } = useRequest(
    () => readContract(wagmiConfig, { abi: NftContractAbi, address: nftContractAddr, functionName: "owner" }),
    { manual: true }
  );
  // 铸造nft
  const { runAsync: mintFn, loading: mintLoading } = useRequest(
    async (addr) => {
      const hash = await writeContract(wagmiConfig, {
        abi: NftContractAbi,
        address: nftContractAddr,
        functionName: "safeMint",
        args: [addr, metaInfo.tokenURI],
      });
      // 快速等2个区块确认，标准一般等6个区块确认，高安全性等12个区块确认
      return provider.waitForTransaction(hash, 2);
    },
    { manual: true }
  );
  // 点击铸造按钮
  const handleMint = async () => {
    const account = getAccount(wagmiConfig);
    if (account.chainId === targetNetId) {
      ownerFn()
        .then((ownerAddr) => {
          if (ownerAddr == account.address) {
            setTarget("");
            setVisible(true);
          } else {
            setMsg({ content: "This account has no permission to operate." });
          }
        })
        .catch((err) => {
          setMsg({ type: "err", content: err.message });
        });
    } else {
      setMsg({ content: `This action can only be executed on ${targetNetName}. Switch your network first.` });
    }
  };
  // 确认铸造
  const handleOk = () => {
    if (target && /^0x[a-fA-F0-9]{40}$/.test(target)) {
      mintFn(target)
        .then(() => {
          setUpdateNFTMarket(new Date().getTime());
          setMsg({ type: "succ", content: "Mint success" });
          setVisible(false);
        })
        .catch((err) => {
          setMsg({ type: "err", content: err.message });
        });
    } else {
      setMsg({ content: "Invalid address" });
    }
  };

  return (
    <>
      <Tooltip content="Mint a NFT Token">
        <Button color="primary" size="sm" radius="full" isLoading={ownerLoading} isIconOnly onClick={handleMint}>
          <HammerIcon className="text-white w-5" />
        </Button>
      </Tooltip>
      <Modal isOpen={visible} size="lg" onClose={() => setVisible(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Mint a NFT</ModalHeader>
              <ModalBody>
                <Input
                  value={target}
                  isRequired
                  onValueChange={setTarget}
                  label="Target Address"
                  placeholder="Enter a Address like 0x111111..."
                  labelPlacement="outside"
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleOk} isLoading={mintLoading}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default memo(MintButton);
