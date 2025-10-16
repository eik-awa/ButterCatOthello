import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Othello",
  description: "A simple Othello game",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
