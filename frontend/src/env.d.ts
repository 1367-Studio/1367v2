/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_API_VERSION: string;
  readonly SANITY_API_READ_TOKEN: string;
  readonly RESEND_API_KEY: string;
  readonly RESEND_FROM_EMAIL: string;
  readonly RESEND_TO_EMAIL: string;
  /** Google Apps Script web app URL that appends leads to the Google Sheet. */
  readonly LEADS_WEBHOOK_URL?: string;
  /** Shared secret checked by the Apps Script before writing a row. */
  readonly LEADS_WEBHOOK_SECRET?: string;
  /** Optional overrides; defaults live in src/lib/tracking.ts. */
  readonly PUBLIC_GOOGLE_ADS_ID?: string;
  readonly PUBLIC_GOOGLE_ADS_LEAD_LABEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
