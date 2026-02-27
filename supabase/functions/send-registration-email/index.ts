// supabase/functions/send-registration-email/index.ts
//
// Supabase Edge Function — triggered via a Database Webhook
// whenever a new row is inserted into the `registrations` table.
//
// It sends a confirmation email to the registrant with:
//   • A thank-you message
//   • Their unique referral code
//   • A shareable registration link containing the referral code

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "ENGG Reunion <reunion@engg2006.com>";
const SITE_URL = Deno.env.get("SITE_URL") || "https://niteshchand.github.io/engg-2002-2006-reunion";

interface RegistrationRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  branch: string;
  city: string;
  country: string;
  referral_code: string;
  referral_code_used: string | null;
  created_at: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: RegistrationRecord;
  old_record: RegistrationRecord | null;
}

function buildEmailHtml(record: RegistrationRecord): string {
  const { full_name, referral_code, branch, city, country } = record;
  const firstName = full_name.split(" ")[0];
  const shareLink = `${SITE_URL}/register?ref=${referral_code}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5f8b 100%); padding:32px 40px; text-align:center;">
              <span style="font-size:36px;">🎓</span>
              <h1 style="margin:12px 0 0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">
                ENGG 2002–2006 Reunion
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 24px;">
              <h2 style="margin:0 0 8px; color:#1e3a5f; font-size:20px;">
                Welcome aboard, ${firstName}! 🎉
              </h2>
              <p style="margin:0 0 20px; color:#4a5568; font-size:15px; line-height:1.7;">
                Thank you for registering for the <strong>ENGG 2002–2006 Reunion</strong>!
                We're thrilled to have you join us. Twenty years of memories deserve an
                unforgettable celebration — and it won't be the same without you.
              </p>

              <!-- Registration Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; border-radius:12px; padding:20px; margin-bottom:24px;">
                <tr><td style="padding:20px;">
                  <p style="margin:0 0 4px; color:#718096; font-size:12px; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Your Details</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                    <tr>
                      <td style="padding:6px 0; color:#718096; font-size:14px; width:100px;">Name</td>
                      <td style="padding:6px 0; color:#1e3a5f; font-size:14px; font-weight:600;">${full_name}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0; color:#718096; font-size:14px;">Branch</td>
                      <td style="padding:6px 0; color:#1e3a5f; font-size:14px; font-weight:600;">${branch}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0; color:#718096; font-size:14px;">Location</td>
                      <td style="padding:6px 0; color:#1e3a5f; font-size:14px; font-weight:600;">${city}, ${country}</td>
                    </tr>
                  </table>
                </td></tr>
              </table>

              <!-- Referral Code -->
              <div style="text-align:center; margin-bottom:28px;">
                <p style="margin:0 0 8px; color:#718096; font-size:12px; text-transform:uppercase; letter-spacing:1px; font-weight:600;">
                  Your Referral Code
                </p>
                <div style="display:inline-block; background:linear-gradient(135deg,#1e3a5f,#2d5f8b); color:#ffffff; font-size:26px; font-weight:700; letter-spacing:4px; padding:14px 32px; border-radius:12px; font-family:'Courier New',monospace;">
                  ${referral_code}
                </div>
                <p style="margin:10px 0 0; color:#a0aec0; font-size:13px;">
                  Share this code with batchmates so they can register too!
                </p>
              </div>

              <!-- Share Button -->
              <div style="text-align:center; margin-bottom:32px;">
                <a href="${shareLink}" 
                   target="_blank"
                   style="display:inline-block; background:#f5a623; color:#1e3a5f; font-weight:700; font-size:15px; text-decoration:none; padding:14px 36px; border-radius:50px; box-shadow:0 4px 16px rgba(245,166,35,0.35);">
                  🔗 Share Registration Link
                </a>
                <p style="margin:12px 0 0; color:#a0aec0; font-size:12px;">
                  Or copy this link: <br />
                  <a href="${shareLink}" style="color:#2d5f8b; word-break:break-all;">${shareLink}</a>
                </p>
              </div>

              <hr style="border:none; border-top:1px solid #e2e8f0; margin:0 0 24px;" />

              <p style="margin:0; color:#4a5568; font-size:14px; line-height:1.7;">
                Got questions? Reply to this email or reach out to us at
                <a href="mailto:reunion@engg2006.com" style="color:#2d5f8b; font-weight:600;">reunion@engg2006.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc; padding:24px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="margin:0; color:#a0aec0; font-size:12px;">
                &copy; ${new Date().getFullYear()} ENGG 2002–2006 Reunion. All rights reserved.
              </p>
              <p style="margin:8px 0 0; color:#cbd5e0; font-size:11px;">
                You received this email because you registered at
                <a href="${SITE_URL}" style="color:#2d5f8b;">${SITE_URL}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

serve(async (req: Request) => {
  // Only accept POST (webhook delivery)
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload: WebhookPayload = await req.json();

    // Safety: only process inserts on the registrations table
    if (payload.type !== "INSERT" || payload.table !== "registrations") {
      return new Response(
        JSON.stringify({ message: "Ignored — not an INSERT on registrations" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const record = payload.record;
    const html = buildEmailHtml(record);

    // Send email via Resend API
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [record.email],
        subject: `🎓 You're in, ${record.full_name.split(" ")[0]}! ENGG Reunion Registration Confirmed`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error("Resend API error:", emailRes.status, errBody);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: errBody }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailData = await emailRes.json();
    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ message: "Confirmation email sent", emailId: emailData.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
