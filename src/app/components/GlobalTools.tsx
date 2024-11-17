import { ConfirmProvider } from "./ConfirmProvider";
import { MessageProvider } from "./MessageProvider";

// GlobalTools 里自定义一些常用的全局组件
export default function GlobalTools({ children }: { children: React.ReactNode }) {
  return (
    <MessageProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </MessageProvider>
  );
}
