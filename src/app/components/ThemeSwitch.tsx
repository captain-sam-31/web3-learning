"use client";
import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { SunFilled, MoonOutlined } from "@ant-design/icons";
import { memo, useMemo } from "react";
import { useMount } from "ahooks";

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

  const isDark = useMemo(() => theme === undefined || theme === "dark", [theme]);

  return (
    <Button
      isIconOnly
      onClick={handleChange}
      color={"primary"}
      variant="flat"
      radius="full"
      size="sm"
      title={`Switch to ${isDark ? "light" : "dark"}`}
      className="text-md"
      endContent={isDark ? <SunFilled /> : <MoonOutlined />}
    />
  );
};
export default memo(ThemeSwitch);
