/**
 * GitHub Pages等でbasePathが設定されている場合に、
 * 静的アセットのパスを正しく返すユーティリティ関数
 */
export const getAssetPath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${basePath}${path}`;
};
