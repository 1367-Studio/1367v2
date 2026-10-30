/**
 * One-time seed: loads the SEO landing pages and the French footer text.
 *
 * Run AFTER the Studio has been deployed with the `landingPage` schema:
 *   cd sanity
 *   npx sanity deploy
 *   npx sanity exec scripts/seed-landing-pages.ts --with-user-token
 *
 * Safe to re-run: it only creates documents/fields that don't exist yet and
 * never overwrites edits made in the Studio.
 */
import {getCliClient} from 'sanity/cli'
import docs from './landing-pages.seed.json'

const client = getCliClient({apiVersion: '2024-01-01'})

async function run() {
  const tx = client.transaction()
  for (const doc of docs as Array<Record<string, unknown> & {_id: string; _type: string}>) {
    tx.createIfNotExists(doc)
  }
  tx.patch('footer', (p) =>
    p.setIfMissing({
      heading_fr: 'Imaginons la suite.',
      ctaLabel_fr: 'NOUS CONTACTER',
      navLinks_fr: [
        {_key: 'fr-projects', _type: 'navLink', label: 'Projets', href: '/projects'},
        {_key: 'fr-about', _type: 'navLink', label: 'À propos', href: '/about'},
        {_key: 'fr-privacy', _type: 'navLink', label: 'Politique de confidentialité', href: '/legal/privacy-policy'},
        {_key: 'fr-legal', _type: 'navLink', label: 'Mentions légales', href: '/legal/mentions-legales'},
        {_key: 'fr-contact', _type: 'navLink', label: 'Nous contacter', href: '/contact'},
      ],
    }),
  )
  const res = await tx.commit()
  console.log(`Seeded ${docs.length} landing pages + French footer (${res.results.length} mutations).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
