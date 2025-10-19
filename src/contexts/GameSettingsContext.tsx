"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type GameMode = "pvp" | "cpu-easy" | "cpu-hard";

export type GameSettings = {
  mode: GameMode;
  cpuColor: "black" | "white";
};

type GameSettingsContextType = {
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
};

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(
  undefined
);

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error(
      "useGameSettings must be used within GameSettingsProvider"
    );
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const GameSettingsProvider: React.FC<Props> = ({ children }) => {
  const [settings, setSettings] = useState<GameSettings>({
    mode: "cpu-hard",
    cpuColor: "white",
  });

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <GameSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </GameSettingsContext.Provider>
  );
};
