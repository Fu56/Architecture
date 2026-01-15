import nodemailer from "nodemailer";
import { env } from "../config/env";

export const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
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
    await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};

export const getApprovalHtml = (
  userName: string,
  resourceTitle: string,
  comment?: string
) => {
  return `
        <h1>Resource Approved!</h1>
        <p>Dear ${userName},</p>
        <p>Your resource "<strong>${resourceTitle}</strong>" has been approved and is now live on the platform.</p>
        ${comment ? `<p><strong>Admin Comment:</strong> ${comment}</p>` : ""}
        <p>Thank you for contributing to the Digital Library!</p>
    `;
};

export const getRejectionHtml = (
  userName: string,
  resourceTitle: string,
  reason?: string
) => {
  return `
        <h1>Resource Rejected</h1>
        <p>Dear ${userName},</p>
        <p>Unfortunately, your resource "<strong>${resourceTitle}</strong>" was not approved for the library.</p>
        ${
          reason
            ? `<p><strong>Reason for Rejection:</strong> ${reason}</p>`
            : ""
        }
        <p>You can re-upload the resource after addressing the issues mentioned above.</p>
    `;
};
export const getGenericHtml = (title: string, message: string) => {
  return `
        <h1>${title}</h1>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <p>Access your dashboard for more details.</p>
    `;
};
