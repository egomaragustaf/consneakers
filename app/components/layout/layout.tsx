import { Footer } from "./footer";
import { Navigation } from "./header-navigation";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="flex flex-col w-full gap-8">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
