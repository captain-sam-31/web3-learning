"use client";
import { menus } from "@/utils/constants";
import { useMount, useUnmount } from "ahooks";
import { useRouter } from "next/navigation";
import { memo, useRef, useState } from "react";

let border: number = 0;
let timer: number | null = null;
// 临时菜单
const tmpMenu = { key: "", label: "???", path: "/", desc: `???` };
const HomeCarousel = () => {
  const nav = useRouter();
  const pDiv = useRef<HTMLDivElement>(null);
  const [list, setList] = useState(menus.concat([tmpMenu]));

  useMount(() => {
    if (!pDiv.current) return;
    border = -(pDiv.current.clientWidth / 2 + 8);
    window.addEventListener("resize", resetBorder);
    startMove(0, list);
  });

  useUnmount(() => {
    window.removeEventListener("resize", resetBorder);
    cancelAnimationFrame(timer as number);
    timer = null;
  });

  const resetBorder = () => {
    if (!pDiv.current) return;
    border = -(pDiv.current.clientWidth / 2 + 8);
  };

  const startMove = (prevLeft: number, list: any[]) => {
    timer = requestAnimationFrame(() => {
      const tmpList = [...list];
      let nextLeft = prevLeft - 1;
      if (nextLeft < border) {
        nextLeft = 0;
        tmpList.push(tmpList.shift() as string);
        setList(tmpList);
      }
      pDiv.current?.style.setProperty("left", `${nextLeft}px`);
      startMove(nextLeft, tmpList);
    });
  };

  return (
    <div className="h-[45%] rounded-large p-4 border-2 mx-4 sm:mx-0">
      <div className="size-full overflow-hidden relative">
        <div ref={pDiv} className="absolute size-full flex items-center gap-4">
          {list.map((v) => (
            <div
              className="h-full shrink-0 grow-0 bg-black/5 dark:bg-white/10 rounded-large cursor-pointer"
              style={{ width: "calc(50% - 0.5rem)" }}
              onClick={() => nav.replace(v.path)}
              key={v.key}
            >
              <div>{v.label}</div>
              <div>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default memo(HomeCarousel);
