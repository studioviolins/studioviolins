import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import type { SizingSelection } from "@/components/instrument/height-sizes";
import { BUSINESS } from "@/components/site/business";

/**
 * Server only (imported by actions.ts). Emails a contact-form message to Nick over SMTP, with the visitor's
 * address as Reply-To so he can answer straight from his inbox. Nothing is stored on the website.
 *
 * Messages go to violins@studioviolins.co.uk (BUSINESS.email, confirmed as the inbox on 22 Nov 2026) and are sent
 * from that same address, unless CONTACT_TO or CONTACT_FROM says otherwise. Configure the sending account with
 * environment variables on the host (see .env.example): CONTACT_SMTP_HOST, CONTACT_SMTP_PORT (465 or 587),
 * CONTACT_SMTP_USER, CONTACT_SMTP_PASS. If any of host, user or password is missing the message is NOT sent and
 * the visitor is told so — never a false success.
 *
 * Development only: CONTACT_DEV_OUTBOX=1 writes each message as an .eml file in output/dev-outbox/ instead of
 * sending it, to check the form end to end. It is ignored in production.
 */

/** `phone`: empty when the visitor left it blank. `sizing`: the height the visitor chose on the slider (and the suggested size, when there is one), or null. */
type Message = { name: string; email: string; phone: string; message: string; sizing: SizingSelection | null };
export type DeliveryResult = { ok: true } | { ok: false; reason: "not-configured" | "send-failed" };

function compose(message: Message, to: string, from: string) {
  return {
    from: { name: "Studio Violins website", address: from },
    to,
    replyTo: { name: message.name, address: message.email },
    subject: `Website message from ${message.name}`,
    text: [
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      // optional: only when the visitor gave one
      ...(message.phone ? [`Phone: ${message.phone}`] : []),
      "",
      // Added by the website from the height slider, kept apart from what the visitor wrote.
      ...(message.sizing
        ? [
            "From the website’s height guide:",
            `Player’s height: ${message.sizing.height.plain}`,
            ...(message.sizing.suggestedSize
              ? [
                  `Suggested violin size: ${message.sizing.suggestedSize} (a starting suggestion, not a confirmed fit)`,
                  ...(message.sizing.betweenSizes
                    ? [
                        `Between ${message.sizing.betweenSizes[0]} and ${message.sizing.betweenSizes[1]}: the smaller size is suggested.`,
                      ]
                    : []),
                ]
              : []),
            "",
          ]
        : []),
      "Message:",
      message.message,
      "",
      "—",
      "Sent from the contact form on the Studio Violins website. Reply to this email to answer directly.",
    ].join("\n"),
  };
}

export async function deliverContactMessage(message: Message): Promise<DeliveryResult> {
  const env = process.env;

  if (env.NODE_ENV !== "production" && env.CONTACT_DEV_OUTBOX === "1") {
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "unix" });
    const info = await transport.sendMail(compose(message, env.CONTACT_TO || BUSINESS.email, env.CONTACT_FROM || BUSINESS.email));
    const dir = path.join(process.cwd(), "output", "dev-outbox");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}.eml`), info.message as Buffer);
    console.info("[contact] Development outbox: message written to output/dev-outbox (not sent).");
    return { ok: true };
  }

  const { CONTACT_SMTP_HOST: host, CONTACT_SMTP_USER: user, CONTACT_SMTP_PASS: pass } = env;
  const to = env.CONTACT_TO || BUSINESS.email;
  const from = env.CONTACT_FROM || BUSINESS.email;
  if (!host || !user || !pass) {
    console.error(
      "[contact] Message not sent: the sending account isn't configured (CONTACT_SMTP_HOST, CONTACT_SMTP_USER, CONTACT_SMTP_PASS). See .env.example.",
    );
    return { ok: false, reason: "not-configured" };
  }

  const port = Number(env.CONTACT_SMTP_PORT || 465);
  try {
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    await transport.sendMail(compose(message, to, from));
    return { ok: true };
  } catch (error) {
    console.error("[contact] Message not sent:", error instanceof Error ? error.message : error);
    return { ok: false, reason: "send-failed" };
  }
}
