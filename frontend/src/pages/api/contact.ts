import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const ATTRIBUTION_FIELDS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "landing_page",
  "referrer",
  "first_seen",
] as const;

type Attribution = Partial<Record<(typeof ATTRIBUTION_FIELDS)[number], string>>;

interface Payload {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  website?: string;
  source?: string;
  form?: string;
  page?: string;
  consent?: string;
  botcheck?: string;
  attribution?: Attribution;
}

const clip = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * One lead, two destinations: an email (Resend) and a row in the leads Google
 * Sheet (Apps Script web app). The visitor gets a success as long as at least
 * one of them worked, so a Sheet outage never loses a lead.
 */
export const POST: APIRoute = async ({ request, redirect }) => {
  let payload: Payload;

  // Plain HTML form post: the JS handler wasn't attached yet (e.g. submitted
  // mid page-transition). Still record the lead, then send them back.
  const isFormPost = !(request.headers.get("content-type") ?? "").includes("application/json");

  try {
    payload = isFormPost
      ? { ...(Object.fromEntries(await request.formData()) as Payload), form: "contact-page (no-js)" }
      : await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const respond = (body: { ok?: boolean; error?: string }, status: number) =>
    isFormPost ? redirect(body.ok ? "/contact?sent=1" : "/contact?error=1", 303) : json(body, status);

  // Honeypot filled → bot. Pretend it worked so it doesn't retry.
  if (clip(payload.botcheck)) return respond({ ok: true }, 200);

  const name = clip(payload.name, 200);
  const email = clip(payload.email, 200);
  const message = clip(payload.message, 10_000);

  if (!name || !email || !message) {
    return respond({ error: "Missing required fields" }, 422);
  }

  const attribution: Attribution = {};
  for (const key of ATTRIBUTION_FIELDS) {
    const v = clip(payload.attribution?.[key]);
    if (v) attribution[key] = v;
  }

  const lead = {
    received_at: new Date().toISOString(),
    name,
    email,
    company: clip(payload.company, 200),
    website: clip(payload.website, 300),
    source: clip(payload.source, 100),
    message,
    form: clip(payload.form, 50),
    page: clip(payload.page, 300),
    consent: clip(payload.consent, 20),
    ...attribution,
  };

  const [mail, sheet] = await Promise.allSettled([sendEmail(lead), appendToSheet(lead)]);

  if (mail.status === "rejected") console.error("Lead email failed:", mail.reason);
  if (sheet.status === "rejected") console.error("Lead sheet append failed:", sheet.reason);

  if (mail.status === "rejected" && sheet.status === "rejected") {
    return respond({ error: "Failed to send message" }, 502);
  }

  return respond({ ok: true }, 200);
};

type Lead = Record<string, string>;

async function sendEmail(lead: Lead) {
  const details = (items: (string | false | undefined)[]) =>
    items.filter((l): l is string => typeof l === "string" && l !== "");

  const header = details([
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.company && `Company: ${lead.company}`,
    lead.website && `Website: ${lead.website}`,
    lead.source && `Heard about us: ${lead.source}`,
  ]);

  const tracking = details([
    `Form: ${lead.form || "unknown"} on ${lead.page || "?"}`,
    lead.gclid && "Came from: Google Ads click",
    lead.utm_source &&
      `UTM: ${[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ")}`,
    lead.utm_term && `Keyword: ${lead.utm_term}`,
    lead.landing_page && `Landing page: ${lead.landing_page}`,
    lead.referrer && `Referrer: ${lead.referrer}`,
  ]);

  const text = [...header, "", lead.message, "", "—", ...tracking].join("\n");

  const { error } = await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL,
    to: import.meta.env.RESEND_TO_EMAIL,
    replyTo: lead.email,
    subject: `${lead.gclid ? "[Google Ads] " : ""}New message from ${lead.name}`,
    text,
  });

  if (error) throw new Error(error.message);
}

async function appendToSheet(lead: Lead) {
  const url = import.meta.env.LEADS_WEBHOOK_URL;
  if (!url) throw new Error("LEADS_WEBHOOK_URL is not set");

  // Apps Script answers POSTs with a redirect to the result; fetch follows it.
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: import.meta.env.LEADS_WEBHOOK_SECRET, lead }),
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });

  const text = await res.text();
  if (!res.ok || !text.includes('"ok":true')) {
    throw new Error(`Sheet webhook ${res.status}: ${text.slice(0, 200)}`);
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
