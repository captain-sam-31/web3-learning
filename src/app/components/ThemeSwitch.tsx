"use client";
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useMount } from "ahooks";
import { SunOutlined, MoonFilled } from "@ant-design/icons";

export default function ThemeSwitch() {
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
    <Switch
      isSelected={theme ? theme === "dark" : true}
      onChange={handleChange}
      size="md"
      color="primary"
      startContent={<MoonFilled />}
      endContent={<SunOutlined />}
    />
  );
}
