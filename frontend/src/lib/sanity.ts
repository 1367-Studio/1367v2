import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: import.meta.env.PROD,
});

const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source).url();
}
