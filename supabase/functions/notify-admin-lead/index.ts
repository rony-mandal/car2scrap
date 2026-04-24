// Notify admin of a new lead via email (using Resend if RESEND_API_KEY is set,
// otherwise just logs the lead so the admin can pick it up from the dashboard).
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.1/cors";

const ADMIN_EMAIL = "car2scrap01@gmail.com";
const FROM = "car2scrap <onboarding@resend.dev>";

interface Lead {
  name: string;
  phone: string;
  city: string;
  car_category: string;
  car_model?: string;
  year: number;
  condition: string;
  estimated_price_min?: number;
  estimated_price_max?: number;
  source?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const lead = (await req.json()) as Lead;

    const subject = `🚗 New Lead: ${lead.name} (${lead.city}) — ${lead.car_model || lead.car_category}`;
    const html = `
      <h2>New car2scrap lead</h2>
      <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
        <tr><td><b>Name</b></td><td>${escape(lead.name)}</td></tr>
        <tr><td><b>Phone</b></td><td>+91 ${escape(lead.phone)}</td></tr>
        <tr><td><b>City</b></td><td>${escape(lead.city)}</td></tr>
        <tr><td><b>Car</b></td><td>${escape(lead.car_model || lead.car_category)} · ${lead.year} · ${escape(lead.condition)}</td></tr>
        ${lead.estimated_price_min ? `<tr><td><b>Quote</b></td><td>₹${lead.estimated_price_min} – ₹${lead.estimated_price_max}</td></tr>` : ""}
        <tr><td><b>Source</b></td><td>${escape(lead.source ?? "website")}</td></tr>
      </table>
      <p>Open the admin dashboard to manage this lead.</p>
    `;

    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (resendKey) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [ADMIN_EMAIL],
          subject,
          html,
        }),
      });
      if (!r.ok) console.error("Resend error", await r.text());
    } else {
      console.log("[notify-admin-lead] No RESEND_API_KEY set. Lead:", lead);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200, // never block the lead insert
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escape(s: string): string {
  return String(s ?? "").replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
