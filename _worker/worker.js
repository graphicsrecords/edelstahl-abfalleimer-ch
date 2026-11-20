/* Cloudflare Worker: nimmt das Offertformular von edelstahl-abfalleimer.ch entgegen
   und sendet es per Cloudflare Email Routing (Send Email Binding) an die hinterlegte Adresse.
   Binding-Name: OFFERTE_MAIL
   Variablen:    MAIL_FROM (z. B. formular@edelstahl-abfalleimer.ch)
                 MAIL_TO   (verifizierte Zieladresse in Email Routing)  */
import { EmailMessage } from "cloudflare:email";

const SITE = "https://edelstahl-abfalleimer.ch";
const ALLOWED = [SITE, "https://www.edelstahl-abfalleimer.ch"];
const LIMITS = { name: 120, organisation: 160, typ: 60, ort: 80, email: 160, telefon: 40, modell: 60, menge: 20, nachricht: 2000 };

const clean = (v, max) => String(v || "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
const cleanMulti = (v, max) => String(v || "").replace(/\r/g, "").trim().slice(0, max);

function b64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
const wrap76 = (s) => s.replace(/(.{76})/g, "$1\r\n");

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : SITE,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Accept, Content-Type",
      "Vary": "Origin",
    };
    const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
    const reply = (ok, status) =>
      wantsJson
        ? new Response(JSON.stringify({ ok }), { status, headers: { ...cors, "Content-Type": "application/json" } })
        : ok
          ? new Response(null, { status: 303, headers: { Location: SITE + "/offerte-danke.html" } })
          : new Response("Fehler beim Senden.", { status, headers: cors });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
    if (origin && !ALLOWED.includes(origin)) return new Response("Forbidden", { status: 403 });

    let form;
    try { form = await request.formData(); } catch { return reply(false, 400); }

    // Spam: Honeypot und zu schnelles Absenden werden still als "gesendet" behandelt
    if (clean(form.get("website"), 50)) return reply(true, 200);
    const t = Number(form.get("t"));
    if (!t || Date.now() - t < 3000) return reply(true, 200);

    const d = {};
    for (const k of Object.keys(LIMITS)) d[k] = k === "nachricht" ? cleanMulti(form.get(k), LIMITS[k]) : clean(form.get(k), LIMITS[k]);
    if (!d.name || !d.organisation || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || form.get("datenschutz") !== "ja") {
      return reply(false, 400);
    }

    const lines = [
      "Neue Offertanfrage über edelstahl-abfalleimer.ch",
      "",
      "Name:         " + d.name,
      "Organisation: " + d.organisation,
      "Art:          " + d.typ,
      "PLZ / Ort:    " + d.ort,
      "E-Mail:       " + d.email,
      "Telefon:      " + d.telefon,
      "Modell:       " + d.modell,
      "Anzahl:       " + d.menge,
      "",
      "Nachricht:",
      d.nachricht || "-",
      "",
      "Datenschutz akzeptiert: ja",
    ];
    const body = lines.join("\r\n");
    const subject = "Offertanfrage: " + d.organisation + " (" + (d.modell || "Beratung") + ")";
    const from = env.MAIL_FROM || "formular@edelstahl-abfalleimer.ch";
    const to = env.MAIL_TO;

    const raw = [
      "From: Edelstahl-Abfalleimer.ch <" + from + ">",
      "To: " + to,
      "Reply-To: " + d.email,
      "Subject: =?UTF-8?B?" + b64(subject) + "?=",
      "Message-ID: <" + crypto.randomUUID() + "@edelstahl-abfalleimer.ch>",
      "Date: " + new Date().toUTCString(),
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      wrap76(b64(body)),
    ].join("\r\n");

    try {
      await env.OFFERTE_MAIL.send(new EmailMessage(from, to, raw));
    } catch (e) {
      return reply(false, 502);
    }
    return reply(true, 200);
  },
};
