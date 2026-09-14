export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-") || "section"
  );
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

const HEADING_STYLES = ["h1", "h2", "h3"];

/** Extracts a table of contents from a portable text body array. Ids are
 * derived deterministically from heading text (deduped with a numeric
 * suffix), so BlogContent.astro can assign matching ids to the same
 * headings by walking the body in the same order. */
export function extractHeadings(body: any[] = []): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();

  for (const node of body) {
    if (node?._type !== "block" || !HEADING_STYLES.includes(node.style)) continue;
    const text = (node.children ?? []).map((c: any) => c.text ?? "").join("");
    if (!text) continue;

    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;

    headings.push({ id, text, level: Number(node.style.slice(1)) });
  }

  return headings;
}
