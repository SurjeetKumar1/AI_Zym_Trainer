import MainLayoutClient from "./MainLayoutClient";

export const metadata = {
  title: "AIZym — Dashboard",
  description: "Your AI-powered gym trainer dashboard.",
};

export default function MainLayout({ children }) {
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
