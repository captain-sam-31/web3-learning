import { useMount } from "ahooks";
import Message from "./Message";
import { useMyRedux } from "@/redux";

// GlobalTools 里自定义一些常用的全局组件
export default function GlobalTools({ children }: { children: React.ReactNode }) {
  const { setMsg } = useMyRedux((state) => state);

  useMount(() => {
    checkMetaMask();
  });

  const checkMetaMask = () => {
    if (!window.ethereum) {
      setMsg({ content: "Please install MetaMask first, which is a Chrome extension" });
    }
  };

  return (
    <>
      {children}
      <Message />
    </>
  );
}
