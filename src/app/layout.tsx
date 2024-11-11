import type { Metadata } from "next";
import Home from "./components/Home";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import Providers from "./components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "web3",
  description: "web3 learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // className="dark"控制 nextUI组件的主题色，不写默认是亮色
    <html lang="en" className="dark">
      <body>
        <NextUIProvider>
          {/* ThemeProvider是 NextUI 官方推荐的配套组件 */}
          <ThemeProvider defaultTheme="dark" themes={["dark", "light"]} enableSystem={false}>
            <Providers>
              <Home>{children}</Home>
            </Providers>
          </ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
