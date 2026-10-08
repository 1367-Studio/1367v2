// 1367 Studio's own case-study videos. This is a small, fixed set that was
// downloaded once and hardcoded into public/videos to stop hitting Sanity's
// CDN bandwidth. The lookups below key off stable content fields (case tag,
// project slug, section/video position) instead of a live Sanity asset URL,
// so the Sanity file assets can be safely deleted without breaking playback.
// New blog-post videos (videoBlock, embedded in post body) are NOT part of
// this set and still stream straight from Sanity.

export const featuredCaseVideoByTag: Record<string, string> = {
  "ASR-TEMP": "/videos/featured-case-asr-temp.mp4",
  "STRAT ÉCLOSIA": "/videos/featured-case-strat-eclosia.mp4",
};

export const projectCoverVideoBySlug: Record<string, string> = {
  "asr-temp": "/videos/project-cover-asr-temp.mp4",
};

const projectSectionVideosBySlug: Record<string, (string | undefined)[][]> = {
  "strat-eclosia": [
    ["/videos/project-strat-eclosia-s1-v1.mp4"],
    [
      "/videos/project-strat-eclosia-s2-v1.mp4",
      "/videos/project-strat-eclosia-s2-v2.mp4",
    ],
    ["/videos/project-strat-eclosia-s3-v1.mp4"],
    [
      "/videos/project-strat-eclosia-s4-v1.mp4",
      "/videos/project-strat-eclosia-s4-v2.mp4",
      "/videos/project-strat-eclosia-s4-v3.mp4",
    ],
  ],
  formwise: [["/videos/project-formwise-s1-v1.mp4"]],
  "asr-temp": [
    [
      "/videos/project-asr-temp-s1-v1.mp4",
      "/videos/project-asr-temp-s1-v2.mp4",
    ],
    ["/videos/project-asr-temp-s2-v1.mp4"],
    [
      "/videos/project-asr-temp-s3-v1.mp4",
      "/videos/project-asr-temp-s3-v2.mp4",
    ],
    [
      "/videos/project-asr-temp-s4-v1.mp4",
      "/videos/project-asr-temp-s4-v2.mp4",
    ],
    // Reuses the Featured Case 3 background video — same source clip.
    ["/videos/featured-case-asr-temp.mp4"],
    [
      "/videos/project-asr-temp-s6-v1.mp4",
      "/videos/project-asr-temp-s6-v2.mp4",
    ],
  ],
};

export function getProjectSectionVideo(
  projectSlug: string | undefined,
  sectionIndex: number,
  videoIndex: number,
): string | undefined {
  if (!projectSlug) return undefined;
  return projectSectionVideosBySlug[projectSlug]?.[sectionIndex]?.[videoIndex];
}
