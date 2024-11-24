import { Image } from "@nextui-org/react";
import HomeCarousel from "./components/HomeCarousel";

export default function HomePage() {
  return (
    <div className="h-full overflow-auto">
      <div className="h-[55%] flex flex-col gap-8 items-center justify-center">
        <Image
          src="/home.png"
          removeWrapper
          className="size-[150px] md:size-[180px] rounded-full shadow-md shadow-[rgba(0,0,0,0.6)]"
          alt=""
        />
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center">Welcome to my Web3 ground</div>
        <div className="md:text-xl lg:text-2xl text-center">
          I'm learning Web3 now, and I will make demos here when some interesting ideas occurred to me.
        </div>
      </div>
      <HomeCarousel />
    </div>
  );
}
