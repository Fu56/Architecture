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
  html?: string,
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
    style="background: #0f172a; color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; margin-bottom: 30px; border-bottom: 4px solid #4f46e5;"
`;

const footerStyle = `
    style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;"
`;

const buttonStyle = `
    display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;
`;

export const getApprovalHtml = (
  userName: string,
  resourceTitle: string,
  resourceId: string | number,
  comment?: string,
) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle}>
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #818cf8; text-transform: uppercase;">Contribution Logic Verified</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">RESOURCE LIVE</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>Your contribution "<strong>${resourceTitle}</strong>" has passed technical validation and is now live in the global repository.</p>
            ${
              comment
                ? `<div style="background: #f8fafc; padding: 20px; border-left: 4px solid #4f46e5; margin: 25px 0; border-radius: 0 8px 8px 0;">
                     <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 900; color: #4f46e5; text-transform: uppercase; letter-spacing: 1px;">Admin Directive</p>
                     <p style="margin: 0; font-weight: 500;">${comment}</p>
                   </div>`
                : ""
            }
            <p style="margin-top: 30px;">Thank you for strengthening the architectural Vault.</p>
            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/resources/${resourceId}" ${buttonStyle}>View Asset in Vault</a>
            </div>
            <div ${footerStyle}>Automated Synchronization Protocol | Level 3 Security</div>
        </div>
    </div>
    `;
};

export const getRejectionHtml = (
  userName: string,
  resourceTitle: string,
  reason?: string,
) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle} style="background: #450a0a; border-bottom-color: #be123c;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #fb7185; text-transform: uppercase;">Validation Protocol Failed</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">ACTION REQUIRED</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>Unfortunately, your submission "<strong>${resourceTitle}</strong>" was neutralized and not approved for repository integration.</p>
            ${
              reason
                ? `<div style="background: #fff1f2; padding: 20px; border-left: 4px solid #be123c; margin: 25px 0; border-radius: 0 8px 8px 0;">
                     <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 900; color: #be123c; text-transform: uppercase; letter-spacing: 1px;">Neutralization Logic</p>
                     <p style="margin: 0; font-weight: 500;">${reason}</p>
                   </div>`
                : ""
            }
            <p style="margin-top: 30px;">Please address the issues flagged above and re-transmit the asset through the main terminal.</p>
            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/dashboard" ${buttonStyle} style="background-color: #be123c;">Access Portal Dashboard</a>
            </div>
            <div ${footerStyle}>Automated Security Protocol | Level 4 Alert</div>
        </div>
    </div>
    `;
};

export const getRegistrationHtml = (
  userName: string,
  email: string,
  password?: string,
) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle}>
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #818cf8; text-transform: uppercase;">New Entity Verified</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">WELCOME TO ARCHIVULT</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>Your identity has been verified and registered on the Digital Architectural Platform. You now have active node status.</p>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Username (Email)</p>
                    <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 15px; font-weight: bold; color: #0f172a;">${email}</p>
                </div>
                ${
                  password
                    ? `<div>
                         <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Access Key (Password)</p>
                         <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 15px; font-weight: bold; color: #4f46e5;">${password}</p>
                       </div>`
                    : ""
                }
            </div>

            <div style="padding: 20px; background: #eef2ff; border-radius: 12px; border: 1px solid #e0e7ff; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 13px; color: #3730a3; font-weight: 500;">
                    <strong>Next Action Protocol:</strong> Use the secure link below to establish a connection and update your access key upon first entry.
                </p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/login" ${buttonStyle}>Establish System Access</a>
            </div>
            
            <p style="margin-top: 40px; font-size: 12px; color: #64748b; text-align: center;">
                Security Warning: Never share your access key with unauthorized entities.
            </p>
            <div ${footerStyle}>System Architect Level 0 | Root Authorization</div>
        </div>
    </div>
    `;
};

export const getGenericHtml = (title: string, message: string) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle}>
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #818cf8; text-transform: uppercase;">Intelligence Transmission</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">${title.toUpperCase()}</h1>
        </div>
        <div style="padding: 0 20px;">
            <div style="font-size: 16px; line-height: 1.8; color: #334155;">
                ${message.replace(/\n/g, "<br>")}
            </div>
            <p style="margin-top: 30px;">Please access your dashboard for further details and required actions.</p>
            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/dashboard" ${buttonStyle}>Access Portal</a>
            </div>
            <div ${footerStyle}>Automated Relay Protocol | Level 2 Priority</div>
        </div>
    </div>
    `;
};

export const getAuthorityGrantHtml = (
  userName: string,
  email: string,
  password?: string,
  role?: string,
) => {
  return `
    <div ${emailStyle} style="border: 2px solid #6366f1;">
        <div ${headerStyle} style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #a5b4fc; text-transform: uppercase;">Elevated Matrix Access</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">AUTHORITY GRANTED</h1>
            <p style="margin-top: 5px; opacity: 0.8; font-size: 11px; font-weight: bold; letter-spacing: 2px;">LEVEL: ${role?.toUpperCase() || "ELEVATED"}</p>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>Your authority has been successfully elevated. You have been appointed as a <strong>${role || "Department Head"}</strong> with terminal access to system command modules.</p>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e0e7ff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">System ID (Email)</p>
                    <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 15px; font-weight: bold; color: #0f172a;">${email}</p>
                </div>
                ${
                  password
                    ? `<div>
                         <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Access Key (Password)</p>
                         <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 15px; font-weight: bold; color: #4f46e5;">${password}</p>
                       </div>`
                    : ""
                }
            </div>
            
            <div style="padding: 20px; background: #eef2ff; border-radius: 12px; font-size: 13px; color: #3730a3; border: 1px solid #e0e7ff;">
                <strong style="text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Immediate Action Protocol:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; line-height: 1.6;">
                    <li>Login to the Admin Dashboard console</li>
                    <li>Verify your unit authority metrics</li>
                    <li>Initialize secondary units (Admins, Faculty, Students)</li>
                </ul>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/login" ${buttonStyle}>Initialize Command Console</a>
            </div>

            <p style="margin-top: 40px; font-size: 12px; color: #64748b; text-align: center;">This is a system-generated alert from the System Architect Level 0.</p>
            <div ${footerStyle}>Authority Matrix Protocol | Root Authorization</div>
        </div>
    </div>
    `;
};
