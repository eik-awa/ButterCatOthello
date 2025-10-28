/**
 * Next.js Image コンポーネント用のカスタムローダー
 * next.config.tsで設定されたloaderFileとして使用される
 */
export default function imageLoader({ src }: { src: string }): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${basePath}${src}`;
}
