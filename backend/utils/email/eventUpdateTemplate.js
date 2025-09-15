export function eventUpdateTemplate({
  title: eventTitle = "Event",
  organizerName = "Organizer",
  start: startTime = "",
  end: endTime = "",
  location = "",
  description = "",
  viewUrl = "guthib.com",
} = {}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Event Updated</title>
  </head>
  <body style="margin:0;background-color:#f3f4f6;font-family:Arial, Helvetica, sans-serif;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(16,24,40,0.08);">
            <tr>
              <td style="padding:24px 28px;background: linear-gradient(90deg,#f59e0b,#facc15); color:#ffffff;">
                <h1 style="margin:0;font-size:20px;line-height:1.2;font-weight:700;">
                  ${escapeHtml(eventTitle)} Updated
                </h1>
                <p style="margin:6px 0 0;font-size:13px;opacity:0.95;">
                  Updated by ${escapeHtml(organizerName)}
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
                  ${
                    description
                      ? `<tr>
                          <td style="padding-bottom:12px;">
                            <strong style="display:block;font-size:14px;margin-bottom:6px;color:#0f172a;">Details</strong>
                            <div style="font-size:14px;color:#374151;line-height:1.4;">
                              ${escapeHtml(description)}
                            </div>
                          </td>
                        </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding-top:18px;padding-bottom:8px;">
                      <a href="${encodeURI(
                        viewUrl
                      )}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#f59e0b;text-decoration:none;color:#ffffff;font-weight:600;font-size:14px;">
                        View Updated Event
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:20px;border-top:1px solid #fef3c7;">
                      <p style="margin:0;font-size:12px;color:#6b7280;">
                        This event has been updated. Please review the changes above and adjust your schedule if needed.
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
                <div>Need help? Contact <a href="mailto:support@merndev.site" style="color:#f59e0b;text-decoration:none;">support@merndev.site</a></div>
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
