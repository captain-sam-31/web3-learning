import LogoAndDropMenu from "./LogoAndDropMenu";
import SideMenu from "./SideMenu";
import ThemeSwitch from "./ThemeSwitch";
import WalletBtn from "./WalletBtn";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen w-screen container mx-auto flex flex-col">
      <header className="h-20 flex items-center justify-between border-b-2 dark:border-white/80 border-black/80 shrink-0">
        <LogoAndDropMenu />
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <WalletBtn />
        </div>
      </header>
      <div className="overflow-hidden flex grow py-4 gap-4">
        <SideMenu />
        <section className="grow overflow-auto">{children}</section>
      </div>
    </main>
  );
}
