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
                .title('Ticker Section')
                .child(S.editor().schemaType('tickerSection').documentId('tickerSection')),
              S.listItem()
                .title('Featured Case Section')
                .child(
                  S.editor()
                    .schemaType('featuredCaseSection')
                    .documentId('featuredCaseSection'),
                ),
            ]),
        ),

      S.divider(),

      // -------------------------------------------------------
      // 3. CASES & POSTS
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
