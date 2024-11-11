"use client";
import { darkTheme, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/wagmi";
import GlobalTools from "./GlobalTools";
import { useTheme } from "next-themes";
import IdentIcon from "@/assets/IdentIcon";
import "@rainbow-me/rainbowkit/styles.css";

// react-query的默认配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      retry: false,
      retryOnMount: false,
    },
  },
});

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale={"en"}
          theme={theme === "dark" ? darkTheme() : lightTheme()}
          avatar={({ address, size }) => <IdentIcon addr={address} size={size} />}
        >
          <GlobalTools>{children}</GlobalTools>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
