"use client";
import { menus } from "@/utils/constants";
import { CrownOutlined, DollarOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Image } from "@nextui-org/react";
import { useMount, useUnmount } from "ahooks";
import { useRouter } from "next/navigation";
import { memo, useRef } from "react";

let border: number = 0;
let timer: number | null = null;
// 临时菜单
const unknownMenu = { key: "", label: "???", path: "/", desc: `??????????????????????` };
const menuItems = menus.concat([unknownMenu]);
const menuIcons = [<DollarOutlined />, <CrownOutlined />, <QuestionCircleOutlined />];

const HomeCarousel = () => {
  const nav = useRouter();
  const pDiv = useRef<HTMLDivElement>(null); // 父元素

  useMount(() => {
    if (!pDiv.current) return;
    border = -(pDiv.current.clientWidth / 2 + 8);
    window.addEventListener("resize", resetBorder);
    startAnimation(0, menuItems);
  });

  useUnmount(() => {
    window.removeEventListener("resize", resetBorder);
    timer !== null && cancelAnimationFrame(timer);
    timer = null;
  });
  // 滚动切换的边界
  const resetBorder = () => {
    if (!pDiv.current) return;
    border = -(pDiv.current.clientWidth / 2 + 8);
  };
  // 开始动画
  const startAnimation = (prevLeft: number, list: any[]) => {
    timer = requestAnimationFrame(() => {
      const tmpList = [...list];
      let nextLeft = prevLeft - 1;
      if (nextLeft < border) {
        nextLeft = 0;
        const firstNode = pDiv.current?.querySelector("div:first-child");
        firstNode && pDiv.current?.appendChild(firstNode);
      }
      pDiv.current?.style.setProperty("left", `${nextLeft}px`);
      startAnimation(nextLeft, tmpList);
    });
  };

  return (
    <div className="h-[45%] rounded-large p-4 border-2 border-foreground mx-4 sm:mx-0">
      <div className="size-full overflow-hidden relative">
        <div ref={pDiv} className="absolute size-full flex items-center gap-4">
          {menuItems.map((v, i) => (
            <div
              className="h-full shrink-0 grow-0 bg-black/5 dark:bg-white/10 rounded-large cursor-pointer relative"
              style={{ width: "calc(50% - 0.5rem)" }}
              onClick={() => nav.replace(v.path)}
              key={v.key}
            >
              <Image
                className="size-full object-cover transition-transform !opacity-90 dark:!opacity-60"
                removeWrapper={true}
                src={"/menu-bg.png"}
                alt=""
              />
              <div
                className="absolute top-0 left-0 size-full z-10 flex items-center justify-center content-center gap-6 flex-wrap px-2"
                style={{ textShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)" }}
              >
                <span className="text-7xl lg:text-8xl">{menuIcons[i]}</span>
                <div className="w-full h-1/2 text-center lg:h-fit lg:w-3/5 lg:text-left">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{v.label}</div>
                  <div className="lg:text-xl mt-2">{v.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default memo(HomeCarousel);
