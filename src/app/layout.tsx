import "./globals.css";
import { ReactNode } from "react";
import { GameSettingsProvider } from "@/contexts/GameSettingsContext";

export const metadata = {
  title: "ButterCatOthello",
  description: "A simple Othello game with special discs",
  icons: {
    icon: "/buttercat.svg",
  },
  themeColor: "#fed7aa", // bg-orange-200 に対応する色
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* Safari iOS用の追加設定 */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <GameSettingsProvider>{children}</GameSettingsProvider>
      </body>
    </html>
  );
}
