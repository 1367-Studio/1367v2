import groq from "groq";

export const PAGE_BY_SLUG = groq`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    description,
    body
  }
`;

export const ALL_PROJECTS = groq`
  *[_type == "project"] | order(order asc){
    title,
    "slug": slug.current,
    excerpt,
    cover
  }
`;
