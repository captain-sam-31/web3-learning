import { Image } from "@nextui-org/react";
import InteractBlock from "./components/InteractBlock";

export default function WaterPage() {
  return (
    <section className="h-full sm:pr-0 overflow-auto">
      <div className="h-2/5 relative flex items-center justify-around">
        <Image src="/water-bg.png" removeWrapper className="size-full object-cover !opacity-70 dark:!opacity-40" alt="" />
        <div
          className="absolute z-10 text-foreground size-full flex flex-col justify-center gap-4 px-8 sm:px-20"
          style={{ textShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="text-6xl font-bold">Water Token</div>
          <div className="text-2xl">
            A fungible token which symbol is "wat", you can use it for getting virtual items on this website.
          </div>
        </div>
      </div>
      <InteractBlock />
    </section>
  );
}
