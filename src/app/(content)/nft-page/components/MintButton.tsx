"use client";
import { MetaDataItem } from "../types";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip } from "@nextui-org/react";
import HammerIcon from "@/assets/HammerIcon";
import { getAccount } from "@wagmi/core";
import { wagmiConfig } from "@/wagmi";
import { memo, useState } from "react";
import { useMyRedux } from "@/redux";
import { useWriteNFT } from "@/hooks/useNFTContract";
import { useMessage } from "@/app/components/MessageProvider";
import { useCheckBeforeTx } from "@/hooks/useCheckBeforeTx";

interface IMetaInfo {
  metaInfo: MetaDataItem;
  owner: string;
  ownerLoading: boolean;
}
// 铸造NFT
const MintButton = (props: IMetaInfo) => {
  const { metaInfo, owner, ownerLoading } = props;
  const isChecked = useCheckBeforeTx();
  const { setUpdateNFTMarket } = useMyRedux((state) => state);
  const { errorMsg, successMsg, infoMsg } = useMessage();

  const [visible, setVisible] = useState<boolean>(false);
  const [target, setTarget] = useState<string>("");

  // 铸造NFT
  const { run: mintFn, loading: mintLoading } = useWriteNFT({ functionName: "safeMint" });
  // 点击铸造按钮
  const handleMint = async () => {
    if (!(await isChecked())) return;
    const account = getAccount(wagmiConfig);
    if (owner === account.address) {
      setTarget("");
      setVisible(true);
    } else {
      infoMsg("This account has no permission to operate.");
    }
  };
  // 确认铸造
  const handleOk = () => {
    if (target && /^0x[a-fA-F0-9]{40}$/.test(target)) {
      mintFn([target, metaInfo.tokenURI])
        .then(() => {
          setUpdateNFTMarket(new Date().getTime());
          successMsg("Minted successfully");
          setVisible(false);
        })
        .catch((err) => errorMsg(err.message));
    } else {
      errorMsg("Invalid address");
    }
  };

  return (
    <>
      <Tooltip content="Mint a NFT Token">
        <Button color="primary" size="sm" radius="full" isLoading={ownerLoading || mintLoading} isIconOnly onClick={handleMint}>
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
