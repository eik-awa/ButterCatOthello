"use client";

import React from "react";
import { useGameSettings, GameMode } from "@/contexts/GameSettingsContext";
import { TEXTS } from "@/constants/texts";
import { STYLES } from "@/constants/styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
};

/**
 * ゲーム設定メニューコンポーネント
 */
export const SettingsMenu: React.FC<Props> = ({
  isOpen,
  onClose,
  onNewGame,
}) => {
  const { settings, updateSettings } = useGameSettings();

  if (!isOpen) return null;

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ mode: e.target.value as GameMode });
  };

  const handleCpuColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ cpuColor: e.target.value as "black" | "white" });
  };

  const handleNewGame = () => {
    onNewGame();
    onClose();
  };

  return (
    <div className={STYLES.SETTINGS.OVERLAY} onClick={onClose}>
      <div className={STYLES.SETTINGS.MODAL} onClick={(e) => e.stopPropagation()}>
        <h2 className={STYLES.SETTINGS.TITLE}>{TEXTS.SETTINGS_TITLE}</h2>

        {/* ゲームモード選択 */}
        <div className={STYLES.SETTINGS.SECTION}>
          <label className={STYLES.SETTINGS.LABEL}>
            {TEXTS.GAME_MODE_LABEL}
          </label>
          <select
            className={STYLES.SETTINGS.SELECT}
            value={settings.mode}
            onChange={handleModeChange}
          >
            <option value="pvp">{TEXTS.MODE_PVP}</option>
            <option value="cpu-easy">{TEXTS.MODE_CPU_EASY}</option>
            <option value="cpu-hard">{TEXTS.MODE_CPU_HARD}</option>
          </select>
        </div>

        {/* CPU色選択（CPUモードの場合のみ表示） */}
        {settings.mode !== "pvp" && (
          <div className={STYLES.SETTINGS.SECTION}>
            <label className={STYLES.SETTINGS.LABEL}>
              {TEXTS.CPU_COLOR_LABEL}
            </label>
            <select
              className={STYLES.SETTINGS.SELECT}
              value={settings.cpuColor}
              onChange={handleCpuColorChange}
            >
              <option value="black">{TEXTS.BLACK}</option>
              <option value="white">{TEXTS.WHITE}</option>
            </select>
          </div>
        )}

        {/* 新しいゲーム開始ボタン */}
        <button
          className={STYLES.SETTINGS.BUTTON_PRIMARY}
          onClick={handleNewGame}
        >
          {TEXTS.NEW_GAME_BUTTON}
        </button>

        {/* 閉じるボタン */}
        <button
          className={STYLES.SETTINGS.BUTTON_SECONDARY}
          onClick={onClose}
        >
          {TEXTS.CLOSE_SETTINGS_BUTTON}
        </button>
      </div>
    </div>
  );
};
