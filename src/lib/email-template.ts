import type { BlogPost } from "./blog";

export function renderEmail(post: BlogPost, unsubscribeUrl: string): string {
  const issueNum = String(post.issue).padStart(3, "0");

  const storiesHtml = post.stories
    .map(
      (story, i) => `
      <tr>
        <td style="padding: 0 0 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding-bottom: 8px;">
                <span style="display: inline-block; background: #1e2a3a; color: #60a5fa; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; padding: 3px 8px; border-radius: 3px;">${story.tag}</span>
              </td>
            </tr>
            <tr>
              <td style="font-size: 18px; font-weight: 600; color: #fafafa; line-height: 1.35; padding-bottom: 12px;">
                <span style="color: #3b82f6; opacity: 0.6; font-size: 12px; font-family: 'JetBrains Mono', monospace; margin-right: 8px;">${String(i + 1).padStart(2, "0")}</span>
                ${story.title}
              </td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #a3a3a3; line-height: 1.75; padding-bottom: 16px;">
                ${story.body.map((p) => `<p style="margin: 0 0 8px 0;">${p}</p>`).join("")}
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-left: 2px solid #3b82f6; background: rgba(59,130,246,0.05); border-radius: 0 6px 6px 0;">
                  <tr>
                    <td style="padding: 14px 16px;">
                      <p style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #3b82f6; opacity: 0.7; font-family: 'JetBrains Mono', monospace;">Jarrett's take</p>
                      <p style="margin: 0; font-size: 14px; color: #a3a3a3; line-height: 1.65; font-style: italic;">${story.take}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title.split("\n")[0]} — It's All Love Weekly</title>
</head>
<body style="margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, 'Inter', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom: 32px; border-bottom: 1px solid #262626;">
              <p style="margin: 0 0 16px 0; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #fafafa;">jarrett<span style="color: #3b82f6;">.</span>love</p>
              <p style="margin: 0 0 4px 0;">
                <span style="display: inline-block; font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #3b82f6; background: #1e2a3a; padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(59,130,246,0.2); font-family: 'JetBrains Mono', monospace;">Issue #${issueNum}</span>
                <span style="font-size: 13px; color: #525252; font-family: 'JetBrains Mono', monospace; margin-left: 12px;">${post.date}</span>
              </p>
              <h1 style="margin: 16px 0 12px 0; font-size: 24px; font-weight: 600; line-height: 1.25; color: #fafafa; white-space: pre-line;">${post.title}</h1>
              <p style="margin: 0; font-size: 16px; color: #a3a3a3; line-height: 1.6;">${post.summary}</p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 24px 0 24px 0; border-bottom: 1px solid #1c1c1c;">
              <p style="margin: 0; font-size: 15px; color: #a3a3a3; line-height: 1.8;">${post.intro}</p>
            </td>
          </tr>

          <!-- Stories -->
          <tr>
            <td style="padding: 32px 0 0 0;">
              <p style="margin: 0 0 24px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #525252; font-family: 'JetBrains Mono', monospace;">This week's stories</p>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                ${storiesHtml}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 0 0 0; border-top: 1px solid #262626;">
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
