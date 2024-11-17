import { bgBlock } from "@/utils/commonClass";
import { watContractAddr } from "@/utils/constants";
import { shortAddr, thousands } from "@/utils/utils";
import { Button, cn, Image, Input, Link } from "@nextui-org/react";

export default function WaterPage() {
  return (
    <section className="h-full px-4 sm:pr-0 overflow-auto">
      <div className="h-2/5 relative flex items-center justify-around">
        <Image src="/water-bg.png" removeWrapper className="size-full object-cover !opacity-70 dark:!opacity-40" alt="" />
        <div
          className="absolute z-10 text-foreground size-full flex flex-col justify-center gap-4 px-20"
          style={{ textShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="text-6xl font-bold">Water Token</div>
          <div className="text-2xl">
            A fungible token which symbol is "wat", you can use it for getting virtual items on this website.
          </div>
        </div>
      </div>
      <div className="h-[800px] lg:h-3/5 pt-4 flex flex-wrap align-center gap-4">
        <div className={cn("w-full h-[45%] lg:w-2/5 lg:h-full px-5", bgBlock)}>
          <div className="h-[60%] flex flex-col items-center justify-center gap-6 border-b-2 border-default-400">
            <div className="text-2xl">Total Supply</div>
            <div className="font-bold flex items-baseline gap-2">
              <p className="text-5xl">{thousands(1000)}</p>
              <p className="text-4xl">wat</p>
            </div>
            <div className="text-2xl">Decimals {18}</div>
          </div>
          <div className="h-[40%] flex flex-col items-center justify-center gap-4">
            <Link className="text-3xl" href={`https://testnet.snowtrace.io/address/${watContractAddr}`} target="_blank">
              Water Token Contract
            </Link>
            <div className="text-2xl">Avalanche Fuji</div>
          </div>
        </div>
        <div className={cn("grow h-[55%] lg:h-full flex align-center", bgBlock)}>
          <div className="w-96 mx-auto flex flex-col justify-center gap-6">
            <div className="h-1/3 flex flex-col justify-center gap-6">
              <div className="text-center text-2xl">
                Your <span className="text-primary">Water Token</span> Amount
              </div>
              <div className="font-bold flex items-baseline justify-center gap-2 animate-pulse">
                <p className="text-5xl">{thousands(1233.22)}</p>
                <p className="text-4xl">wat</p>
              </div>
            </div>
            <Input
              type="number"
              label="AVAX Amount"
              placeholder="0"
              size="lg"
              variant="bordered"
              color="primary"
              classNames={{ inputWrapper: "border-default-400" }}
              description={"At least 0.01 AVAX"}
              endContent={<div className="pointer-events-none text-default-400 text-small">AVAX</div>}
            />
            <Button radius="full" color="primary" variant="solid">
              Exchange（1:1）
            </Button>
          </div>
          {/* <div>
            <div>1.先切换到avalanche fuji测试网</div>
            <div>2.确保账户在该网络中有足够的AVAX</div>
            <div>3.使用AVAX兑换WaterToken（wat）</div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
