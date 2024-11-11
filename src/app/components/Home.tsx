import Header from "./Header";
import SideMenu from "./SideMenu";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen w-screen container mx-auto flex flex-col">
      <Header />
      <div className="overflow-hidden flex grow py-4">
        <SideMenu />
        <section className="grow overflow-auto">{children}</section>
      </div>
    </main>
  );
}
