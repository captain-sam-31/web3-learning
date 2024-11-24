"use client";
import { menus } from "@/utils/constants";
import { cn, Listbox, ListboxItem } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";

const SideMenu = () => {
  const path = usePathname();
  const nav = useRouter();
  const [seletected, setSelected] = useState<string>(path);

  useEffect(() => {
    setSelected(path);
  }, [path]);

  const handleMenu = (path: string) => {
    setSelected(path);
    nav.replace(path);
  };

  const currKey = useMemo(() => seletected.replace(/\/(.+)-page/, (...all) => all[1]), [seletected]);

  return (
    <aside
      className={cn(
        "w-1/6 shrink-0 overflow-auto hidden md:block bg-black/5 dark:bg-white/10 rounded-large",
        path === "/" ? "!hidden" : ""
      )}
    >
      {/* className={`[&_li[tabindex="0"]]:bg-primary`} */}
      <Listbox aria-label="side menu">
        {menus.map((v) => (
          <ListboxItem
            key={v.key}
            color="primary"
            className={currKey === v.key ? "bg-primary text-white" : ""}
            onClick={() => handleMenu(v.path)}
          >
            {v.label}
          </ListboxItem>
        ))}
      </Listbox>
    </aside>
  );
};
export default memo(SideMenu);
