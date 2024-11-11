import ThemeSwitch from "./ThemeSwitch";
import WalletBtn from "./WalletBtn";

export default function Header() {
  return (
    <header className="h-20 flex items-center justify-between border-b-1 dark:border-white/80 border-black/80 shrink-0">
      <div className="font-bold text-3xl">Web3 Playground</div>
      <div className="flex">
        <ThemeSwitch />
        <WalletBtn />
      </div>
    </header>
  );
}
