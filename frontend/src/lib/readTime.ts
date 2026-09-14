const WORDS_PER_MINUTE = 200;

/** Estimated read time (in whole minutes, minimum 1) from a portable text body array. */
export function estimateReadTime(body: any[] = []): number {
  const words = body
    .filter((node) => node?._type === "block")
    .flatMap((block) => block.children ?? [])
    .map((child: any) => (child?.text ?? "").trim())
    .filter(Boolean)
    .reduce((count: number, text: string) => count + text.split(/\s+/).length, 0);

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
