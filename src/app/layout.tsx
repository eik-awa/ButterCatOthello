import "./globals.css";
import { ReactNode } from "react";
import { GameSettingsProvider } from "@/contexts/GameSettingsContext";

export const metadata = {
  title: "ButterCatOthello",
  description: "A simple Othello game with special discs",
  icons: {
    icon: "/buttercat.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <GameSettingsProvider>{children}</GameSettingsProvider>
      </body>
    </html>
  );
}
