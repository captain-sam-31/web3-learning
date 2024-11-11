"use client";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { Key, useState } from "react";

const items = [
  { key: "nft", label: "Plant NFT" },
  { key: "water", label: "Water Token" },
];

export default function SideMenu() {
  const path = usePathname();
  const nav = useRouter();
  const [seletected, setSelected] = useState(path);

  const handleMenu = (key: Key) => {
    setSelected(`/${key}-page`);
    nav.replace(`/${key}-page`);
  };

  const currKey = seletected.replace(/\/(.+)-page/, (...all) => all[1]);

  return (
    <aside className="w-1/6 shrink-0 bg-black/5 dark:bg-white/10 overflow-auto hidden sm:block rounded-large">
      {/* className={`[&_li[tabindex="0"]]:bg-primary`} */}
      <Listbox selectedKeys={"water"} aria-label="side menu" onAction={handleMenu}>
        {items.map((v) => (
          <ListboxItem key={v.key} color="primary" className={currKey === v.key ? "bg-primary text-white" : ""}>
            {v.label}
          </ListboxItem>
        ))}
      </Listbox>
    </aside>
  );
}
