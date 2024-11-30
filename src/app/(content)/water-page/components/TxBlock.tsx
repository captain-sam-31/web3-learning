"use client";
import { useConfirm } from "@/app/components/ConfirmProvider";
import { useMessage } from "@/app/components/MessageProvider";
import { useAccountChange } from "@/hooks/useAccountChange";
import { useCheckBeforeTx } from "@/hooks/useCheckBeforeTx";
import { useReadWat, useWriteWat } from "@/hooks/useWaterContract";
import { bgBlock } from "@/utils/commonClass";
import { deployNetRPC, deploySymbol, watContractAddr } from "@/utils/constants";
import { formatEther } from "@/utils/utils";
import { Button, cn, Input, Spinner } from "@nextui-org/react";
import { useRequest } from "ahooks";
import { ethers } from "ethers";
import { memo, useEffect, useMemo, useState } from "react";

interface ITxBlock {
  tokenName: string;
  tokenSymbol: string;
  update: () => void;
}

const provider = new ethers.JsonRpcProvider(deployNetRPC);
// 交易模块
const TxBlock = ({ tokenName, tokenSymbol, update }: ITxBlock) => {
  const currAddr = useAccountChange();
  const confirm = useConfirm();
  const isChecked = useCheckBeforeTx();
  const { errorMsg, successMsg } = useMessage();
  const { data: owner } = useReadWat({ functionName: "owner" });
  const { data: uWat, run: watOfUser } = useReadWat({ functionName: "balanceOf" }, { manual: true });
  const { data: uEth, loading, runAsync: ethOfUser } = useRequest((addr) => provider.getBalance(addr), { manual: true });
  const { data: cEth, runAsync: ethOfCon } = useRequest(() => provider.getBalance(watContractAddr));
  const { run: payMe, loading: payMeLoading } = useWriteWat({ functionName: "payMe" });
  const { run: mint, loading: mintLoading } = useWriteWat({ functionName: "mint" });
  const { run: withdraw, loading: withdrawLoading } = useWriteWat({ functionName: "withdraw" });

  const [exVal, setExVal] = useState<string>(""); // 输入值
  const [target, setTarget] = useState<string>(""); // 目标地址
  // 是否合约持有者
  const isOwner = useMemo(() => owner?.toLowerCase() === currAddr, [currAddr, owner]);

  useEffect(() => {
    if (currAddr) {
      watOfUser(currAddr);
      ethOfUser(currAddr);
      isOwner && ethOfCon();
    }
  }, [currAddr]);
  // 原生币 兑换 waterToken
  const handleExchange = async () => {
    if (!(await isChecked())) return;
    if (!exVal || !(Number(exVal) > 0)) {
      errorMsg(`At least input 0.01 ${deploySymbol}`);
      return;
    }
    const value = ethers.parseEther(exVal);
    if ((uEth ?? BigInt(0)) <= value) {
      errorMsg(`Not enough ${deploySymbol} to exchange`);
      return;
    }
    confirm({
      content: `Are you sure to exchange ${exVal} wat ?`,
      onOk: () => {
        payMe([], { value })
          .then(() => {
            successMsg("Exchanged successfully");
            currAddr && watOfUser(currAddr); // 更新wat余额
            update(); // 更新wat总量
          })
          .catch((err) => errorMsg(err.message));
      },
    });
  };
  // 铸造water token
  const handleMint = async () => {
    if (!(await isChecked())) return;
    if (!target || !exVal || !(Number(exVal) > 0)) {
      errorMsg("Please input target address and WAT amount");
      return;
    }
    confirm({
      content: `Are you sure to mint ${exVal} WAT ?`,
      onOk: () => {
        mint([target, ethers.parseEther(exVal)])
          .then(() => {
            successMsg("Minted successfully");
            watOfUser(target); // 更新wat余额
            update(); // 更新wat总量
          })
          .catch((err) => errorMsg(err.message));
      },
    });
  };
  // 取回 原生币 余额
  const handleWithdraw = async () => {
    if (withdrawLoading) return;
    if (!(await isChecked())) return;
    confirm({
      content: `Are you sure to withdraw all ${deploySymbol}s ?`,
      onOk: () => {
        withdraw()
          .then(() => {
            successMsg("Withdrawn successfully");
            isOwner && ethOfCon();
          })
          .catch((err) => errorMsg(err.message));
      },
    });
  };

  return (
    <div className={cn("grow h-[55%] lg:h-full flex align-center", bgBlock)}>
      <div className="w-96 mx-auto flex flex-col justify-center gap-4">
        <div className="h-1/3 flex flex-col justify-center gap-6">
          {isOwner ? (
            <div className="flex items-center justify-center gap-2 text-2xl">
              <p className="text-primary cursor-pointer" onClick={handleWithdraw}>
                Withdraw
              </p>
              <p>Contract Balance</p>
            </div>
          ) : (
            <div className="text-center text-2xl">
              Your <span className="text-primary">{tokenName}</span> Balance
            </div>
          )}
          <div className="font-bold flex items-baseline justify-center gap-2 animate-pulse">
            {isOwner ? (
              withdrawLoading ? (
                <Spinner />
              ) : (
                <p className="text-5xl">{formatEther(cEth)}</p>
              )
            ) : (
              <p className="text-5xl">{formatEther(currAddr ? uWat : undefined)}</p>
            )}
            <p className="text-4xl">{isOwner ? deploySymbol.toLowerCase() : tokenSymbol}</p>
          </div>
        </div>
        {isOwner && (
          <Input
            classNames={{ inputWrapper: "border-default-400" }}
            variant="bordered"
            color="primary"
            label="Target Address"
            placeholder="Target Address"
            value={target}
            onValueChange={setTarget}
          />
        )}
        <Input
          value={exVal}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              let [intPart, decPart] = val.split(".");
              intPart = intPart.replace(/[^0-9]/g, "");
              decPart = decPart?.slice(0, 2) || "";
              setExVal(`${intPart}${decPart ? `.${decPart}` : ""}`);
            } else {
              setExVal(val);
            }
          }}
          label={isOwner ? "WAT Amount" : `${deploySymbol} Amount`}
          size={isOwner ? "md" : "lg"}
          placeholder="0"
          type="number"
          variant="bordered"
          color="primary"
          classNames={{ inputWrapper: "border-default-400" }}
          description={`At least input 0.01 ${isOwner ? "WAT" : deploySymbol}`}
          endContent={<div className="pointer-events-none text-default-400 text-small">{isOwner ? "WAT" : deploySymbol}</div>}
        />
        {isOwner ? (
          <Button radius="full" color="primary" variant="solid" isLoading={mintLoading} onPress={handleMint}>
            Mint water token
          </Button>
        ) : (
          <Button radius="full" color="primary" variant="solid" isLoading={loading || payMeLoading} onPress={handleExchange}>
            Exchange（1:1）
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(TxBlock);
