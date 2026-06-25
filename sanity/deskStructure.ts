import type {StructureBuilder} from 'sanity/structure'

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // -------------------------------------------------------
      // 1. GENERAL SETTINGS
      // -------------------------------------------------------
      S.listItem()
        .title('General Settings')
        .child(
          S.list()
            .title('General Settings')
            .items([
              S.listItem()
                .title('Header')
                .child(S.editor().schemaType('header').documentId('header')),
              S.listItem()
                .title('Footer')
                .child(S.editor().schemaType('footer').documentId('footer')),
            ]),
        ),

      S.divider(),

      // -------------------------------------------------------
      // 2. HOME PAGE
      // -------------------------------------------------------
      S.listItem()
        .title('Home Page')
        .child(
          S.list()
            .title('Home Page')
            .items([
              S.listItem()
                .title('Hero Section')
                .child(S.editor().schemaType('heroSection').documentId('heroSection')),
              S.listItem()
                .title('Statement Section')
                .child(S.editor().schemaType('statementSection').documentId('statementSection')),
              S.listItem()
                .title('Testimonials Section')
                .child(
                  S.editor().schemaType('testimonialsSection').documentId('testimonialsSection'),
                ),
              S.listItem()
                .title('Ticker Section')
                .child(S.editor().schemaType('tickerSection').documentId('tickerSection')),
              S.listItem()
                .title('Featured Case Section')
                .child(
                  S.editor().schemaType('featuredCaseSection').documentId('featuredCaseSection'),
                ),
              S.listItem()
                .title('Featured Case 2 Section')
                .child(
                  S.editor().schemaType('featuredCase2Section').documentId('featuredCase2Section'),
                ),
              S.listItem()
                .title('Featured Case 3 Section')
                .child(
                  S.editor().schemaType('featuredCase3Section').documentId('featuredCase3Section'),
                ),
              S.listItem()
                .title('Focus Areas Section')
                .child(
                  S.editor().schemaType('focusAreasSection').documentId('focusAreasSection'),
                ),
              S.listItem()
                .title("Let's Build Section")
                .child(S.editor().schemaType('letsBuildSection').documentId('letsBuildSection')),
              S.listItem()
                .title('Project Section')
                .child(S.editor().schemaType('projectSection').documentId('projectSection')),
            ]),
        ),

      S.divider(),

      // -------------------------------------------------------
      // 3. ABOUT PAGE
      // -------------------------------------------------------
      S.listItem()
        .title('About Page')
        .child(
          S.list()
            .title('About Page')
            .items([
              S.listItem()
                .title('Hero Section')
                .child(S.editor().schemaType('aboutHeroSection').documentId('aboutHeroSection')),
              S.listItem()
                .title('Text Revealing Section')
                .child(
                  S.editor()
                    .schemaType('aboutTextRevealSection')
                    .documentId('aboutTextRevealSection'),
                ),
              S.listItem()
                .title('Our Philosophy Section')
                .child(
                  S.editor()
                    .schemaType('aboutPhilosophySection')
                    .documentId('aboutPhilosophySection'),
                ),
            ]),
        ),

      S.divider(),

      // -------------------------------------------------------
      // 4. CONTACT PAGE
      // -------------------------------------------------------
      S.listItem()
        .title('Contact Page')
        .child(
          S.list()
            .title('Contact Page')
            .items([
              S.listItem()
                .title('Contact Section')
                .child(
                  S.editor().schemaType('contactSection').documentId('contactSection'),
                ),
            ]),
        ),

      S.divider(),

      // -------------------------------------------------------
      // 5. OTHER PAGES
      // -------------------------------------------------------
      S.listItem()
        .title('Other Pages')
        .child(
          S.list()
            .title('Other Pages')
            .items([
              S.listItem()
                .title('404 — Not Found')
                .child(
                  S.editor().schemaType('notFoundSection').documentId('notFoundSection'),
                ),
            ]),
        ),

      S.divider(),
      // -------------------------------------------------------
      // 6. CASES & POSTS
      // -------------------------------------------------------
      S.listItem()
        .title('Cases')
        .schemaType('case')
        .child(S.documentTypeList('case').title('Cases')),

      S.listItem()
        .title('Posts')
        .schemaType('post')
        .child(S.documentTypeList('post').title('Posts')),
    ])

export default deskStructure
