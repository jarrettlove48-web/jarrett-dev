export function renderWelcomeEmail(unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to It's All Love Weekly</title>
</head>
<body style="margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, 'Inter', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 15px; color: #fafafa;">jarrett<span style="color: #3b82f6;">.</span>love</p>
            </td>
          </tr>

          <!-- Welcome -->
          <tr>
            <td style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #fafafa; line-height: 1.3;">You're in.</h1>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #a3a3a3; line-height: 1.7;">
                Welcome to <strong style="color: #fafafa;">It's All Love Weekly</strong> — every Friday I break down the 5 biggest stories in tech, markets, and building. No fluff. Just what's actually happening, with my take on it.
              </p>
              <p style="margin: 0; font-size: 16px; color: #a3a3a3; line-height: 1.7;">
                Your first drop lands next Friday morning. In the meantime, check out the latest issue on the site.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 40px;">
              <a href="https://jarrett.love/weekly-drop" style="display: inline-block; background: #3b82f6; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 8px;">Read the latest issue &rarr;</a>
            </td>
          </tr>

          <!-- What to expect -->
          <tr>
            <td style="padding: 24px 0; border-top: 1px solid #262626;">
              <p style="margin: 0 0 16px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #525252; font-family: 'JetBrains Mono', monospace;">What to expect</p>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
                    <span style="color: #3b82f6; margin-right: 8px;">&#8226;</span> 5 stories every Friday — AI, space, crypto, SaaS, builder culture
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
                    <span style="color: #3b82f6; margin-right: 8px;">&#8226;</span> My unfiltered take on each one
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
                    <span style="color: #3b82f6; margin-right: 8px;">&#8226;</span> Links to every source so you can go deeper
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
                    <span style="color: #3b82f6; margin-right: 8px;">&#8226;</span> No spam. Unsubscribe anytime.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 0 0 0; border-top: 1px solid #262626;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #525252; font-family: 'JetBrains Mono', monospace;">jarrett<span style="color: #3b82f6;">.</span>love — It's All Love</p>
              <p style="margin: 0; font-size: 12px; color: #525252;">
                <a href="${unsubscribeUrl}" style="color: #525252; text-decoration: underline;">Unsubscribe</a>
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
