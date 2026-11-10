import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { getSecrets } from './config.js';

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function simpleHtml(title: string, lines: string[]): string {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#111;max-width:560px;margin:auto">
<h2>${escapeHtml(title)}</h2>${lines.map((l) => `<p>${escapeHtml(l)}</p>`).join('')}</body></html>`;
}

/** Sends an email via SendGrid (if enabled) or SMTP. Returns false when no provider is configured. */
export async function sendMail(msg: MailMessage): Promise<boolean> {
  const s = await getSecrets();
  try {
    if (s.sendGridEnabled && s.sendGridKey && s.sendGridFrom) {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { authorization: `Bearer ${s.sendGridKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: msg.to }] }],
          from: { email: s.sendGridFrom, name: s.sendGridFromName },
          subject: msg.subject,
          content: [{ type: 'text/plain', value: msg.text }, ...(msg.html ? [{ type: 'text/html', value: msg.html }] : [])],
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`SendGrid responded ${res.status}`);
      return true;
    }
    if (env.SMTP_HOST && s.smtpUser) {
      const transport = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: s.smtpPassword ? { user: s.smtpUser, pass: s.smtpPassword } : undefined,
      });
      await transport.sendMail({
        from: env.MAIL_FROM ?? (s.smtpFromName ? `"${s.smtpFromName}" <${s.smtpUser}>` : s.smtpUser),
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
      });
      return true;
    }
    logger.warn({ to: msg.to, subject: msg.subject }, 'Email not sent: no email provider configured');
    return false;
  } catch (err) {
    logger.error({ err, subject: msg.subject }, 'Failed to send email');
    return false;
  }
}
