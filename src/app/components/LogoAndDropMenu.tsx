"use client";
import { menus } from "@/utils/constants";
import { CaretDownOutlined, HomeOutlined } from "@ant-design/icons";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";

const LogoAndDropMenu = () => {
  const path = usePathname();
  const nav = useRouter();
  const [seletected, setSelected] = useState<string>(path);

  useEffect(() => {
    setSelected(path);
  }, [path]);

  // 跳转到指定页面
  const handleMenu = (path: string) => {
    setSelected(path);
    nav.replace(path);
  };
  // 跳转回主页
  const toHome = () => {
    path !== "/" && nav.replace("/");
  };

  const currKey = useMemo(() => seletected.replace(/\/(.+)-page/, (...all) => all[1]), [seletected]);

  return (
    <div className="flex items-center gap-2">
      <div className="font-bold text-3xl hidden md:block cursor-pointer" onClick={toHome}>
        Web3 Ground
      </div>
      <Button
        className="block md:hidden"
        title="To home page"
        color="primary"
        isIconOnly
        endContent={<HomeOutlined />}
        onClick={toHome}
      />
      <Dropdown>
        <DropdownTrigger>
          <Button className="md:hidden flex items-center gap-2" variant="bordered">
            Menu
            <CaretDownOutlined />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="menu items" style={{ width: "calc(100vw - 40px)" }}>
          {menus.map((m) => (
            <DropdownItem
              key={m.key}
              className={currKey === m.key ? "bg-primary text-white" : ""}
              onClick={() => handleMenu(m.path)}
            >
              {m.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
export default memo(LogoAndDropMenu);
