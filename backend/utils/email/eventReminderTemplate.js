function eventReminderTemplate({
  title = "Upcoming Event",
  start,
  end,
  location = "",
  organizerName = "Organizer",
  viewUrl = "guthib.com",
} = {}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Event Reminder</title>
  </head>
  <body style="margin:0;background-color:#f9fafb;font-family:Arial, Helvetica, sans-serif;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(16,24,40,0.08);">
            <!-- Header -->
            <tr>
              <td style="padding:20px 28px;background: linear-gradient(90deg,#f59e0b,#ef4444); color:#ffffff;">
                <h1 style="margin:0;font-size:20px;line-height:1.2;font-weight:700;">
                  ⏰ Reminder: ${escapeHtml(title)}
                </h1>
                <p style="margin:6px 0 0;font-size:13px;opacity:0.95;">
                  Organized by ${escapeHtml(organizerName)}
                </p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:24px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px;">
                      <strong style="display:block;font-size:14px;margin-bottom:6px;color:#0f172a;">Starts</strong>
                      <div style="font-size:14px;color:#374151;">
                        ${escapeHtml(new Date(start).toLocaleString())}
                      </div>
                    </td>
                  </tr>
                  ${
                    end
                      ? `<tr>
                          <td style="padding-bottom:12px;">
                            <strong style="display:block;font-size:14px;margin-bottom:6px;color:#0f172a;">Ends</strong>
                            <div style="font-size:14px;color:#374151;">
                              ${escapeHtml(new Date(end).toLocaleString())}
                            </div>
                          </td>
                        </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding-bottom:12px;">
                      <strong style="display:block;font-size:14px;margin-bottom:6px;color:#0f172a;">Location</strong>
                      <div style="font-size:14px;color:#374151;">
                        ${escapeHtml(location || "Online / To be confirmed")}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:18px;">
                      <a href="${encodeURI(
                        viewUrl
                      )}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#2563eb;text-decoration:none;color:#ffffff;font-weight:600;font-size:14px;">
                        View Event
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:20px;border-top:1px solid #eef2ff;">
                      <p style="margin:0;font-size:12px;color:#6b7280;">
                        This is an automated reminder sent before your event starts. Don’t miss it!
                      </p>
                      <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">
                        Sent by ${escapeHtml(organizerName)} • ${escapeHtml(
    location
  )}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
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

export { eventReminderTemplate };
