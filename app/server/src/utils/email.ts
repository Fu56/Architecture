import nodemailer from "nodemailer";
import { env } from "../config/env";

export const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465, // Use SSL for port 465
  auth:
    env.smtp.user && env.smtp.pass
      ? { user: env.smtp.user, pass: env.smtp.pass }
      : undefined,
});

export const sendNotificationEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  if (!env.smtp.host) {
    console.warn("SMTP host not configured. Email not sent.");
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: env.smtp.from || `"Architectural Vault" <fuadabdela95@gmail.com>`,
      to,
      bcc: "fuadabdela95@gmail.com",
      subject: `[VAULT] ${subject}`,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    });
    console.log(`Email dispatched to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to dispatch email to ${to}:`, error);
  }
};

const emailStyle = `
    style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a202c; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;"
`;

const headerStyle = `
    style="background: #0f172a; color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; margin-bottom: 30px;"
`;

const buttonStyle = `
    display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;
`;

export const getApprovalHtml = (
  userName: string,
  resourceTitle: string,
  comment?: string
) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle}>
            <h1 style="margin:0; font-size: 24px; letter-spacing: 2px;">RESOURCE LIVE</h1>
        </div>
        <p>Dear ${userName},</p>
        <p>Your contribution "<strong>${resourceTitle}</strong>" has passed technical validation and is now live in the repository.</p>
        ${
          comment
            ? `<div style="background: #f8fafc; padding: 15px; border-left: 4px solid #4f46e5; margin: 20px 0;"><strong>Admin Directive:</strong> ${comment}</div>`
            : ""
        }
        <p>Thank you for strengthening the architectural Vault.</p>
        <a href="${env.baseUrl}/browse" ${buttonStyle}>View in Vault</a>
    </div>
    `;
};

export const getRejectionHtml = (
  userName: string,
  resourceTitle: string,
  reason?: string
) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle} style="background: #be123c;">
            <h1 style="margin:0; font-size: 24px; letter-spacing: 2px;">ACTION REQUIRED</h1>
        </div>
        <p>Dear ${userName},</p>
        <p>Unfortunately, your submission "<strong>${resourceTitle}</strong>" was neutralized and not approved.</p>
        ${
          reason
            ? `<div style="background: #fff1f2; padding: 15px; border-left: 4px solid #be123c; margin: 20px 0;"><strong>Reason for Rejection:</strong> ${reason}</div>`
            : ""
        }
        <p>Please address the issues flagged above and re-transmit the asset.</p>
    </div>
    `;
};

export const getRegistrationHtml = (
  userName: string,
  email: string,
  password?: string
) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle}>
            <h1 style="margin:0; font-size: 24px; letter-spacing: 2px;">WELCOME TO THE MATRIX</h1>
        </div>
        <p>Dear ${userName},</p>
        <p>Your identity has been verified and registered on the Digital Architectural Platform.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Login Node:</strong> ${email}</p>
            ${
              password
                ? `<p style="margin: 5px 0;"><strong>Access Cipher:</strong> <code style="background: #edf2f7; padding: 2px 5px;">${password}</code></p>`
                : ""
            }
        </div>
        <p>Please secure your terminal and update your access cipher upon first entry.</p>
        <a href="${env.baseUrl}/login" ${buttonStyle}>Access Terminal</a>
    </div>
    `;
};

export const getGenericHtml = (title: string, message: string) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle}>
            <h1 style="margin:0; font-size: 24px; letter-spacing: 2px;">${title.toUpperCase()}</h1>
        </div>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <p>Please access your dashboard for further details.</p>
    </div>
    `;
};
