// Maps Sanity-hosted video asset filenames to locally hardcoded files in
// public/videos, so these videos are served from our own host instead of
// Sanity's CDN (which was hitting bandwidth overage).
const localVideoMap: Record<string, string> = {
  "06f021a7d5df3aaa38dbd629dc2c73f9ef14c5fb.mp4": "/videos/featured-case-asr-temp.mp4",
  "4c551d194a75f78ac3028195070eb486f6639971.mp4": "/videos/featured-case-strat-eclosia.mp4",
  "e1e295f2b544a1b7a4bc7a354a974cf2b7e4616e.mp4": "/videos/project-cover-asr-temp.mp4",
  "a46fbf78b3561de11fc2a94179fafa26a564e463.mp4": "/videos/project-strat-eclosia-s1-v1.mp4",
  "bd6c4e83a3fe78b46750667cd85196e6e312dbd2.mp4": "/videos/project-strat-eclosia-s2-v1.mp4",
  "9979793a69c5febbfff6f0288dbe62e73cc3d56e.mp4": "/videos/project-strat-eclosia-s2-v2.mp4",
  "0593f11787622a185f26615f42546da56225c3a9.mp4": "/videos/project-strat-eclosia-s3-v1.mp4",
  "dff76d1f682b986225e48e3d401cd8f541c35eb4.mp4": "/videos/project-strat-eclosia-s4-v1.mp4",
  "8caf082f8fc64fe5679267f7670f970a917950fb.mp4": "/videos/project-strat-eclosia-s4-v2.mp4",
  "151cd773b501d72f5cb67de32d3b465c840bb4a3.mp4": "/videos/project-strat-eclosia-s4-v3.mp4",
  "5140f3757e7e8949dadd61706c1262a48bc626f6.mp4": "/videos/project-formwise-s1-v1.mp4",
  "b29f28803e32625d6ca732ab4671b41db4461d5a.mp4": "/videos/project-asr-temp-s1-v1.mp4",
  "774e0625e42853ef1350350d8384df88648c0c80.mp4": "/videos/project-asr-temp-s1-v2.mp4",
  "bbe8730d1e2f2267689da8ad4f11b29694e95d94.mp4": "/videos/project-asr-temp-s2-v1.mp4",
  "1a4655a11f0af5c837757ce2936092690f32a404.mp4": "/videos/project-asr-temp-s3-v1.mp4",
  "aa81eaae3130466430696322de6ed7f5cd6a4e71.mp4": "/videos/project-asr-temp-s3-v2.mp4",
  "6c9192a65235f777077f54f14b98ce3040679d67.mp4": "/videos/project-asr-temp-s4-v1.mp4",
  "5247107b9019f2554c08abd368d2402c3f33022e.mp4": "/videos/project-asr-temp-s4-v2.mp4",
  "b7c60481c09a1232086431e8d84c5709de221a64.mp4": "/videos/project-asr-temp-s6-v1.mp4",
  "5d46bc81f08da10c9f180405e45ff569da14afb3.mp4": "/videos/project-asr-temp-s6-v2.mp4",
};

export function localizeVideoUrl<T extends string | undefined | null>(
  sanityUrl: T,
): T | string {
  if (!sanityUrl) return sanityUrl;
  const filename = sanityUrl.split("/").pop() ?? "";
  return localVideoMap[filename] ?? sanityUrl;
}
