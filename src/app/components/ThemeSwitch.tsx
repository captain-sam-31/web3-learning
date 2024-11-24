"use client";
import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useMount } from "ahooks";
import { SunFilled, MoonOutlined } from "@ant-design/icons";
import { memo } from "react";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  useMount(() => {
    setTheme("dark");
  });

  const handleChange = () => {
    // 切换nextUI主题
    document.querySelector("html")?.classList.toggle("dark");
    // 切换tailwind主题
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      isIconOnly
      onClick={handleChange}
      color={"primary"}
      variant="flat"
      radius="full"
      size="sm"
      title={`Switch to ${theme === "dark" ? "light" : "dark"}`}
      className="text-md"
      endContent={theme === "dark" ? <SunFilled /> : <MoonOutlined />}
    />
  );
};
export default memo(ThemeSwitch);
