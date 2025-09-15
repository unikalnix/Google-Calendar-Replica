export function eventInvitationTemplate({
  title: eventTitle = "New Event",
  organizerName = "Organizer",
  start: startTime = "",
  end: endTime = "",
  location = "",
  description = "",
  rsvpUrl = "guthib.com",
  viewUrl = "guthib.com",
} = {}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Event Invitation</title>
  </head>
  <body style="margin:0;background-color:#f3f4f6;font-family:Arial, Helvetica, sans-serif;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(16,24,40,0.08);">
            <tr>
              <td style="padding:24px 28px;background: linear-gradient(90deg,#2563eb,#06b6d4); color:#ffffff;">
                <h1 style="margin:0;font-size:20px;line-height:1.2;font-weight:700;">
                  ${escapeHtml(eventTitle)}
                </h1>
                <p style="margin:6px 0 0;font-size:13px;opacity:0.95;">
                  Invitation from ${escapeHtml(organizerName)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px;">
                      <strong style="display:block;font-size:14px;margin-bottom:6px;color:#0f172a;">When</strong>
                      <div style="font-size:14px;color:#374151;">
                        ${escapeHtml(startTime)} ${
    endTime ? ` — ${escapeHtml(endTime)}` : ""
  }
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;">
                      <strong style="display:block;font-size:14px;margin-bottom:6px;color:#0f172a;">Where</strong>
                      <div style="font-size:14px;color:#374151;">
                        ${escapeHtml(location || "Online / To be confirmed")}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;">
                      <strong style="display:block;font-size:14px;margin-bottom:6px;color:#0f172a;">Details</strong>
                      <div style="font-size:14px;color:#374151;line-height:1.4;">
                        ${escapeHtml(
                          description || "No additional details provided."
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:18px;padding-bottom:8px;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <a href="${encodeURI(
                              rsvpUrl
                            )}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#10b981;text-decoration:none;color:#ffffff;font-weight:600;font-size:14px;">
                              RSVP
                            </a>
                          </td>
                          <td style="width:10px;"></td>
                          <td>
                            <a href="${encodeURI(
                              viewUrl
                            )}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:transparent;border:1px solid #e6e9ef;color:#374151;text-decoration:none;font-weight:600;font-size:14px;">
                              View event
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:20px;border-top:1px solid #eef2ff;">
                      <p style="margin:0;font-size:12px;color:#6b7280;">
                        If you cannot attend, please ignore this email or update your RSVP on the event page.
                      </p>
                      <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">
                        Sent by ${escapeHtml(organizerName)} • ${escapeHtml(
    location || "merndev.site"
  )}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 20px;background:#fafafa;font-size:12px;color:#9ca3af;text-align:center;">
                <div>Need help? Contact <a href="mailto:support@merndev.site" style="color:#2563eb;text-decoration:none;">support@merndev.site</a></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
