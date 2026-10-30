/**
 * Analytics (GA4) + ad tracking (Google Ads) + lead submission, consent-first.
 *
 * - Nothing from Google loads until the visitor accepts the cookie banner
 *   (CNIL: refusing must be as easy as accepting, and no ad cookies before
 *   consent). The choice is remembered for 6 months.
 * - Attribution (gclid, UTMs, landing page, referrer) is read from the first
 *   page the visitor lands on and kept in memory. Barba keeps this module alive
 *   across page transitions, so it is still there when they reach /contact. It
 *   is only written to localStorage if they accepted cookies.
 * - `submitLead()` is the single entry point for every form that creates a
 *   lead: it attaches attribution, posts to /api/contact (email + Google
 *   Sheet) and, on success, fires the Google Ads conversion if consent allows.
 */

export const GOOGLE_ADS_ID = import.meta.env.PUBLIC_GOOGLE_ADS_ID || 'AW-16498528700';
export const GOOGLE_ADS_LEAD_LABEL =
  import.meta.env.PUBLIC_GOOGLE_ADS_LEAD_LABEL || 'IiegCPXXja8dELyjjrs9';
/** GA4 property "www.1367studio.com" (account "Compte Google Ads"). */
export const GA4_ID = import.meta.env.PUBLIC_GA4_ID || 'G-PBHW30ZSTW';

// v2: GA4 added to the banner, so earlier (Ads-only) choices are asked again.
const CONSENT_KEY = 'cookie-consent-v2';
const ATTRIBUTION_KEY = 'lead-attribution';
const CONSENT_MAX_AGE = 1000 * 60 * 60 * 24 * 182; // ~6 months
const ATTRIBUTION_MAX_AGE = 1000 * 60 * 60 * 24 * 90; // Google Ads click window

export type Consent = 'granted' | 'denied';

export interface Attribution {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  message: string;
  company?: string;
  website?: string;
  source?: string;
  /** Which form produced the lead, e.g. "contact-page" or "ask-agent". */
  form: string;
  /** Honeypot. Real visitors never fill it. */
  botcheck?: string;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// ---------------------------------------------------------------------------
// Storage helpers (storage can be disabled or throw in private modes)
// ---------------------------------------------------------------------------

function read<T>(key: string, maxAge: number): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { at, value } = JSON.parse(raw) as { at: number; value: T };
    if (Date.now() - at > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), value }));
  } catch {
    /* ignore */
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

export function getConsent(): Consent | null {
  return read<Consent>(CONSENT_KEY, CONSENT_MAX_AGE);
}

export function setConsent(value: Consent) {
  write(CONSENT_KEY, value);
  if (value === 'granted') {
    loadGoogleTag();
    if (attribution) write(ATTRIBUTION_KEY, attribution);
  } else {
    remove(ATTRIBUTION_KEY);
    window.gtag?.('consent', 'update', deniedState());
  }
}

function deniedState() {
  return {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  };
}

let tagLoaded = false;

/** Loads gtag.js. Only ever called once consent is granted. */
function loadGoogleTag() {
  if (tagLoaded || typeof window === 'undefined') return;
  tagLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the real `arguments` object, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });
  window.gtag('js', new Date());
  // GA4 sends the page_view for the page the visitor is on now; later pages
  // are sent by trackPageView() after each Barba transition (the stream's
  // "page changes based on browser history events" is off to avoid doubles).
  window.gtag('config', GA4_ID);
  window.gtag('config', GOOGLE_ADS_ID);

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(s);
}

/**
 * GA4 page view for a client-side (Barba) navigation. Barba has already
 * updated the URL and document.title when its afterEnter hook runs.
 */
export function trackPageView() {
  if (getConsent() !== 'granted' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    send_to: GA4_ID,
    page_location: window.location.href,
    page_title: document.title,
  });
}

// ---------------------------------------------------------------------------
// Attribution
// ---------------------------------------------------------------------------

let attribution: Attribution | null = null;

const PARAMS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

/** Reads attribution from the landing URL. Call once on the first hard load. */
function captureAttribution() {
  const url = new URL(window.location.href);
  const fromUrl: Attribution = {};
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) fromUrl[p] = v.slice(0, 300);
  }

  const external =
    document.referrer && !document.referrer.startsWith(window.location.origin)
      ? document.referrer.slice(0, 500)
      : undefined;

  const stored = getConsent() === 'granted' ? read<Attribution>(ATTRIBUTION_KEY, ATTRIBUTION_MAX_AGE) : null;
  const hasNewClick = Object.keys(fromUrl).length > 0;

  // A fresh ad click or campaign link wins; otherwise keep what we had.
  attribution =
    hasNewClick || !stored
      ? {
          ...fromUrl,
          landing_page: url.pathname + url.search,
          referrer: external,
          first_seen: new Date().toISOString(),
        }
      : stored;

  if (getConsent() === 'granted') write(ATTRIBUTION_KEY, attribution);
}

export function getAttribution(): Attribution {
  return attribution ?? {};
}

// ---------------------------------------------------------------------------
// Boot (called once from the persistent consent banner script)
// ---------------------------------------------------------------------------

let booted = false;

export function initTracking() {
  if (booted) return;
  booted = true;
  captureAttribution();
  if (getConsent() === 'granted') loadGoogleTag();
}

// ---------------------------------------------------------------------------
// Lead submission
// ---------------------------------------------------------------------------

/** Posts a lead and, on success, reports the Google Ads conversion. */
export async function submitLead(lead: LeadPayload): Promise<boolean> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...lead,
      page: window.location.pathname,
      attribution: getAttribution(),
      consent: getConsent() ?? 'unset',
    }),
  });

  if (res.ok && getConsent() === 'granted') {
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      value: 1.0,
      currency: 'EUR',
    });
    // GA4 recommended event; marked as a key event in the property.
    window.gtag?.('event', 'generate_lead', {
      send_to: GA4_ID,
      form_name: lead.form,
      value: 1.0,
      currency: 'EUR',
    });
  }

  return res.ok;
}
