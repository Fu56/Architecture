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
    // Fallback log for development
    console.log(`[Email Mock] To: ${to} | Subject: ${subject} | Body: ${text}`);
    return;
  }
  try {
    // Log for debugging regardless of success
    console.log(`[Email Attempt] Sending to ${to} | Subject: ${subject}`);

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
    // Log the content anyway so dev can proceed
    console.log(
      `[Email Fallback Log] To: ${to} | Subject: ${subject} | Body: ${text}`,
    );
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
  reviewerName?: string,
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
              reviewerName
                ? `
            <div style="background: #f0fdf4; padding: 16px 20px; border-left: 4px solid #22c55e; margin: 20px 0; border-radius: 0 8px 8px 0; display: flex; align-items: center; gap: 10px;">
              <p style="margin: 0; font-size: 11px; font-weight: 900; color: #166534; text-transform: uppercase; letter-spacing: 1px;">Reviewed & Approved by</p>
              <p style="margin: 6px 0 0 0; font-size: 15px; font-weight: 800; color: #15803d;">${reviewerName}</p>
            </div>`
                : ""
            }
            ${
              comment
                ? `<div style="background: #f8fafc; padding: 20px; border-left: 4px solid #4f46e5; margin: 25px 0; border-radius: 0 8px 8px 0;">
                     <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 900; color: #4f46e5; text-transform: uppercase; letter-spacing: 1px;">Department Head Note</p>
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
  reviewerName?: string,
) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle} style="background: #450a0a; border-bottom-color: #be123c;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #fb7185; text-transform: uppercase;">Validation Protocol Failed</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">ACTION REQUIRED</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>Unfortunately, your submission "<strong>${resourceTitle}</strong>" was reviewed and requires revisions before it can be approved for repository integration.</p>
            ${
              reviewerName
                ? `
            <div style="background: #fef2f2; padding: 16px 20px; border-left: 4px solid #dc2626; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 11px; font-weight: 900; color: #991b1b; text-transform: uppercase; letter-spacing: 1px;">Reviewed by</p>
              <p style="margin: 6px 0 0 0; font-size: 15px; font-weight: 800; color: #b91c1c;">${reviewerName}</p>
            </div>`
                : ""
            }
            ${
              reason
                ? `<div style="background: #fff1f2; padding: 20px; border-left: 4px solid #be123c; margin: 25px 0; border-radius: 0 8px 8px 0;">
                     <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 900; color: #be123c; text-transform: uppercase; letter-spacing: 1px;">Revision Required</p>
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
  status?: string,
) => {
  const isPending = status === "pending_approval";

  return `
    <div ${emailStyle} style="border: 2px solid #EEB38C; max-width: 600px; margin: 0 auto; background: #white; border-radius: 12px; overflow: hidden;">
        <div ${headerStyle} style="background: #5A270F; color: white; padding: 40px 30px; text-align: center; border-bottom: 4px solid #DF8142;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #EEB38C; text-transform: uppercase;">
                ${isPending ? "NODE PROVISIONED" : "NODE INTEGRATION COMPLETE"}
            </p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px; color: white;">
                ${isPending ? "APPROVAL PENDING" : "REGISTRATION FINISHED"}
            </h1>
        </div>
        <div style="padding: 30px 40px; background: white;">
            <p style="font-size: 16px; color: #5A270F; font-weight: bold;">Salutations, ${userName},</p>
            <p style="font-size: 14px; color: #6C3B1C; line-height: 1.6;">
                ${
                  isPending
                    ? "The architectural registry has provisioned your identity. Your credentials have been generated, but your node is currently awaiting authorization from the Department Head."
                    : "The architectural registry has successfully synchronized your identity. Your digital workspace is now initialized and ready for deployment within the Nexus system."
                }
            </p>
            
            <div style="background: #EFEDED; padding: 25px; border-radius: 16px; margin: 30px 0; border: 1px solid #D9D9C2;">
                <div style="margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 10px; font-weight: 900; color: #92664A; text-transform: uppercase; letter-spacing: 2px;">Access Endpoint (Email)</p>
                    <p style="margin: 5px 0 0 0; font-family: 'Courier New', monospace; font-size: 16px; font-weight: 900; color: #5A270F;">${email}</p>
                </div>
                ${
                  password
                    ? `<div>
                         <p style="margin: 0; font-size: 10px; font-weight: 900; color: #92664A; text-transform: uppercase; letter-spacing: 2px;">Authorization Key (Password)</p>
                         <p style="margin: 5px 0 0 0; font-family: 'Courier New', monospace; font-size: 16px; font-weight: 900; color: #DF8142;">${password}</p>
                       </div>`
                    : ""
                }
            </div>

            <div style="padding: 20px; background: #DF814210; border-radius: 12px; border: 1px solid #DF814230; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 13px; color: #5A270F; font-weight: 600; text-align: center;">
                    ${
                      isPending
                        ? "<strong>Security Protocol:</strong> Access is restricted until Department Head approval. You will receive a synchronization signal once authorized."
                        : "<strong>System Access Established:</strong> You can now access all library resources, architectural designs, and assignment modules."
                    }
                </p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/login" style="display: inline-block; padding: 16px 32px; background-color: #DF8142; color: white; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 14px rgba(223, 129, 66, 0.3);">
                    ${isPending ? "View Login Terminal" : "Initialize System Entry"}
                </a>
            </div>
            
            <p style="margin-top: 40px; font-size: 11px; color: #92664A; text-align: center; font-weight: bold; font-style: italic;">
                Security Protocol: Ensure your credentials are kept within secure containment.
            </p>
            <div ${footerStyle} style="border-top: 1px solid #D9D9C2; color: #92664A; font-weight: 900;">Nexus Registry Protocol | Level 1 Authorization</div>
        </div>
    </div>
    `;
};

export const getGenericHtml = (
  userName: string,
  title: string,
  message: string,
) => {
  return `
    <div ${emailStyle}>
        <div ${headerStyle}>
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #818cf8; text-transform: uppercase;">Intelligence Transmission</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">${title.toUpperCase()}</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Salutations, ${userName},</p>
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

export const getAccountAuthorizationHtml = (userName: string) => {
  return `
    <div ${emailStyle} style="border: 2px solid #5A270F; max-width: 600px; margin: 0 auto; background: #white; border-radius: 12px; overflow: hidden;">
        <div ${headerStyle} style="background: #2A1205; color: white; padding: 40px 30px; text-align: center; border-bottom: 4px solid #DF8142;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #DF8142; text-transform: uppercase;">Node Logic Verified</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px; color: white;">ACCOUNT AUTHORIZED</h1>
        </div>
        <div style="padding: 30px 40px; background: white;">
            <p style="font-size: 16px; color: #5A270F; font-weight: bold;">Greetings, ${userName},</p>
            <p style="font-size: 14px; color: #6C3B1C; line-height: 1.6;">
                The Department Head has successfully verified your credentials and authorized your node for full system integration. Your access to the Nexus is now active.
            </p>
            
            <div style="padding: 20px; background: #EFEDED; border-radius: 12px; border: 1px solid #D9D9C2; margin: 30px 0; text-align: center;">
                <p style="margin: 0; font-size: 13px; color: #5A270F; font-weight: 600;">
                    You can now log in using the credentials previously transmitted to your node address.
                </p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/login" style="display: inline-block; padding: 16px 32px; background-color: #5A270F; color: white; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 14px rgba(90, 39, 15, 0.3);">Initialize Nexus Entry</a>
            </div>
            
            <div ${footerStyle} style="border-top: 1px solid #D9D9C2; color: #92664A; font-weight: 900;">Nexus Security Protocol | Authority Confirmed</div>
        </div>
    </div>
    `;
};

export const getPasswordResetHtml = (resetUrl: string) => {
  return `
    <div ${emailStyle} style="border: 2px solid #eab308;">
        <div ${headerStyle} style="background: #422006; border-bottom: 4px solid #ca8a04;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #fde047; text-transform: uppercase;">Security Protocol Initiated</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">RESET ACCESS KEY</h1>
        </div>
        <div style="padding: 0 20px;">
            <p><strong>Identity Verification Required.</strong></p>
            <p>A request has been logged to reset the access key (password) for your node account. If this request was not initiated by you, ignore this transmission.</p>
            
            <div style="padding: 20px; background: #fefce8; border-radius: 12px; border: 1px solid #fef9c3; margin: 30px 0;">
                <p style="margin: 0; font-size: 13px; color: #854d0e; font-weight: 500;">
                    <strong>Protocol:</strong> Click the secure link below to proceed with key reconfiguration.
                </p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <a href="${resetUrl}" ${buttonStyle} style="background-color: #ca8a04;">Reset Password</a>
            </div>

            <p style="margin-top: 40px; font-size: 12px; color: #64748b; text-align: center;">Link expires in 1 hour for security purposes.</p>
            <div ${footerStyle}>Security Matrix Protocol | Level 1 Alert</div>
        </div>
    </div>
    `;
};

export const getNewsletterSubscriptionHtml = (email: string) => {
  return `
    <div ${emailStyle} style="border: 2px solid #DF8142;">
        <div ${headerStyle} style="background: #5A270F; border-bottom: 4px solid #DF8142;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #EEB38C; text-transform: uppercase;">Nexus Transmission Verified</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">WELCOME TO THE STUDIO</h1>
        </div>
        <div style="padding: 0 20px;">
            <p><strong>Intelligence Feed Initialized.</strong></p>
            <p>Your node address <strong>${email}</strong> has been successfully integrated into our architectural matrix. You will now receive high-fidelity updates on project milestones, resource drops, and technical briefings.</p>
            
            <div style="padding: 20px; background: #EFEDED; border-radius: 12px; border: 1px solid #D9D9C2; margin: 30px 0;">
                <p style="margin: 0; font-size: 13px; color: #5A270F; font-weight: 500;">
                    <strong>Thank You:</strong> We appreciate your dedication to architectural synergy. Your presence strengthens the global vault.
                </p>
            </div>

            <p style="margin-top: 40px; font-size: 12px; color: #64748b; text-align: center;">You can unsubscribe from the matrix at any time through your terminal settings.</p>
            <div ${footerStyle}>Studio Digest Protocol | Level 1 Intelligence</div>
        </div>
    </div>
    `;
};

export const getNewsletterAdminAlertHtml = (subscriberEmail: string) => {
  return `
    <div ${emailStyle} style="border: 2px solid #5A270F;">
        <div ${headerStyle} style="background: #2A1205;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #DF8142; text-transform: uppercase;">Registry Growth Detected</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">NEW SUBSCRIBER</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>An external entity has joined the architectural network.</p>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Node Identifier</p>
                <p style="margin: 10px 0 0 0; font-size: 20px; font-weight: 900; color: #5A270F;">${subscriberEmail}</p>
            </div>

            <p>Authorization is not required for this Resource level, but the registry has been updated to include this communication frequency.</p>
            
            <div ${footerStyle}>Registry Protocol | Admin Intelligence Layer</div>
        </div>
    </div>
    `;
};

export const getRatingNotificationHtml = (
  authorName: string,
  raterName: string,
  resourceTitle: string,
  rating: number,
  resourceId: string | number,
) => {
  return `
    <div ${emailStyle} style="border: 2px solid #DF8142;">
        <div ${headerStyle} style="background: #5A270F; border-bottom: 4px solid #DF8142;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #EEB38C; text-transform: uppercase;">Valuation Matrix Update</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">NEW RATING</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${authorName},</p>
            <p>Your architectural contribution "<strong>${resourceTitle}</strong>" has received a new technical valuation.</p>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Evaluator</p>
                <p style="margin: 5px 0 15px 0; font-size: 16px; font-weight: 800; color: #5A270F;">${raterName}</p>
                
                <div style="display: flex; justify-content: center; gap: 5px; margin-top: 15px;">
                    ${Array.from({ length: 5 })
                      .map(
                        (_, i) => `
                        <span style="font-size: 24px; color: ${
                          i < rating ? "#DF8142" : "#e2e8f0"
                        };">★</span>
                    `,
                      )
                      .join("")}
                </div>
                <p style="margin: 10px 0 0 0; font-size: 11px; font-weight: 900; color: #DF8142; text-transform: uppercase; letter-spacing: 1px;">Valuation: ${rating} Stars</p>
            </div>

            <p style="font-size: 14px; color: #64748b; font-style: italic; text-align: center;">
                ${raterName} is rate this resource ${resourceTitle}
            </p>

            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/resources/${resourceId}" ${buttonStyle} style="background-color: #DF8142; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Inspect Asset Metrics</a>
            </div>
            
            <div ${footerStyle}>Automated Valuation Protocol | Level 2 Intelligence</div>
        </div>
    </div>
    `;
};

// ─── Archive Notification ──────────────────────────────────────────────────
export const getArchiveNotificationHtml = (
  userName: string,
  resourceTitle: string,
  reviewerName?: string,
  reason?: string,
) => {
  return `
    <div ${emailStyle} style="border: 2px solid #b45309;">
        <div ${headerStyle} style="background: #431407; border-bottom: 4px solid #d97706;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #fbbf24; text-transform: uppercase;">System Archive Protocol</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">RESOURCE ARCHIVED</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>Your resource "<strong>${resourceTitle}</strong>" has been moved to the system archive and is no longer publicly visible in the repository.</p>
            ${
              reviewerName
                ? `
            <div style="background: #fffbeb; padding: 16px 20px; border-left: 4px solid #d97706; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 11px; font-weight: 900; color: #92400e; text-transform: uppercase; letter-spacing: 1px;">Action taken by</p>
              <p style="margin: 6px 0 0 0; font-size: 15px; font-weight: 800; color: #b45309;">${reviewerName}</p>
            </div>`
                : ""
            }
            ${
              reason
                ? `
            <div style="background: #fffbeb; padding: 20px; border-left: 4px solid #d97706; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 900; color: #b45309; text-transform: uppercase; letter-spacing: 1px;">Archive Reason</p>
                <p style="margin: 0; font-weight: 500;">${reason}</p>
            </div>`
                : ""
            }
            <p style="margin-top: 30px;">If you believe this was done in error, please contact the Department Head directly.</p>
            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/dashboard" ${buttonStyle} style="background-color: #d97706;">View Your Dashboard</a>
            </div>
            <div ${footerStyle}>Automated Archive Protocol | Level 3 Security</div>
        </div>
    </div>
    `;
};

// ─── Restore Notification ──────────────────────────────────────────────────
export const getRestoreNotificationHtml = (
  userName: string,
  resourceTitle: string,
  resourceId: string | number,
  reviewerName?: string,
) => {
  return `
    <div ${emailStyle} style="border: 2px solid #0ea5e9;">
        <div ${headerStyle} style="background: #0c4a6e; border-bottom: 4px solid #0ea5e9;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #7dd3fc; text-transform: uppercase;">Resource Restoration Protocol</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">RESOURCE RESTORED</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>Great news — your resource "<strong>${resourceTitle}</strong>" has been successfully restored from the archive and is now live again in the repository.</p>
            ${
              reviewerName
                ? `
            <div style="background: #f0f9ff; padding: 16px 20px; border-left: 4px solid #0ea5e9; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 11px; font-weight: 900; color: #075985; text-transform: uppercase; letter-spacing: 1px;">Restored by</p>
              <p style="margin: 6px 0 0 0; font-size: 15px; font-weight: 800; color: #0369a1;">${reviewerName}</p>
            </div>`
                : ""
            }
            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/resources/${resourceId}" ${buttonStyle} style="background-color: #0ea5e9;">View Your Resource</a>
            </div>
            <div ${footerStyle}>Restoration Protocol | Level 2 Authorization</div>
        </div>
    </div>
    `;
};

// ─── Representation Assignment Notification ────────────────────────────────────
export const getRepresentationAssignedHtml = (
  userName: string,
  deptHeadName: string,
  task: string,
) => {
  return `
    <div ${emailStyle} style="border: 2px solid #7c3aed;">
        <div ${headerStyle} style="background: linear-gradient(135deg, #3b0764 0%, #6d28d9 100%); border-bottom: 4px solid #7c3aed;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #c4b5fd; text-transform: uppercase;">Authority Delegation Protocol</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">REPRESENTATION ASSIGNED</h1>
            <p style="margin-top: 8px; opacity: 0.8; font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #ddd6fe;">TASK: ${task.toUpperCase()}</p>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>You have been officially designated as a <strong>Departmental Representative</strong> by the Department Head. You are now authorized to act on their behalf for the specified operational scope.</p>

            <div style="background: #f5f3ff; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #ede9fe;">
                <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 900; color: #7c3aed; text-transform: uppercase; letter-spacing: 1px;">Delegated By</p>
                <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 800; color: #4c1d95;">${deptHeadName}</p>
                <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 900; color: #7c3aed; text-transform: uppercase; letter-spacing: 1px;">Assigned Task Scope</p>
                <p style="margin: 0; font-size: 16px; font-weight: 800; color: #5b21b6;">${task}</p>
            </div>

            <div style="padding: 20px; background: #ede9fe; border-radius: 12px; border: 1px solid #ddd6fe; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 13px; color: #4c1d95; font-weight: 600;">
                    <strong>Protocol Notice:</strong> Your actions within the assigned scope are being logged and attributed under the Department Head's authority. Exercise this access with care.
                </p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/dashboard" style="display: inline-block; padding: 16px 32px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);">Access Your Dashboard</a>
            </div>

            <p style="margin-top: 40px; font-size: 11px; color: #7c3aed; text-align: center; font-weight: bold; font-style: italic;">
                This is a system-generated alert. Representation is active until revoked by the Department Head.
            </p>
            <div ${footerStyle}>Authority Delegation Protocol | Temporary Clearance Active</div>
        </div>
    </div>
    `;
};

// ─── Representation Period Ended Notification ────────────────────────────────────
export const getRepresentationRemovedHtml = (
  userName: string,
  deptHeadName: string,
) => {
  return `
    <div ${emailStyle} style="border: 2px solid #0ea5e9;">
        <div ${headerStyle} style="background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); border-bottom: 4px solid #0ea5e9;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #7dd3fc; text-transform: uppercase;">Authority Delegation Protocol</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">REPRESENTATION CONCLUDED</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>The <strong>Departmental Representation Period</strong> assigned by the Department Head has officially concluded. The delegation link has been severed, but your task-specific access permissions remain fully active.</p>

            <div style="background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #bae6fd; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 900; color: #0369a1; text-transform: uppercase; letter-spacing: 1px;">Representation Period Closed By</p>
                <p style="margin: 0; font-size: 18px; font-weight: 800; color: #0c4a6e;">${deptHeadName}</p>
            </div>

            <div style="padding: 20px; background: #ecfdf5; border-radius: 12px; border: 1px solid #a7f3d0; margin-bottom: 30px; border-left: 4px solid #10b981;">
                <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 900; color: #065f46; text-transform: uppercase; letter-spacing: 1px;">✅ Your Access Status</p>
                <p style="margin: 0; font-size: 13px; color: #047857; font-weight: 600;">
                    Your assigned task permissions are <strong>still active</strong>. You may continue performing your designated functions independently. Contact the Department Head if you have any questions about your current access level.
                </p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/dashboard" style="display: inline-block; padding: 16px 32px; background-color: #0369a1; color: white; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 14px rgba(3, 105, 161, 0.3);">Access Your Dashboard</a>
            </div>

            <p style="margin-top: 40px; font-size: 11px; color: #0369a1; text-align: center; font-weight: bold; font-style: italic;">
                This is a system-generated alert. Your assigned permissions remain in effect until explicitly updated.
            </p>
            <div ${footerStyle}>Authority Delegation Protocol | Representation Concluded</div>
        </div>
    </div>
    `;
};

// ─── Announcement / Broadcast Notification ─────────────────────────────────
export const getAnnouncementHtml = (title: string, body: string) => {
  return `
    <div ${emailStyle} style="border: 2px solid #d97706;">
        <div ${headerStyle} style="background: #451a03; border-bottom: 4px solid #d97706;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #fbbf24; text-transform: uppercase;">System Broadcast</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">${title.toUpperCase()}</h1>
        </div>
        <div style="padding: 30px 40px; background: white;">
            <div style="background: #fffbeb; padding: 24px; border-radius: 12px; border: 1px solid #fef3c7; margin-bottom: 30px;">
                <div style="font-size: 14px; color: #78350f; line-height: 1.8; white-space: pre-wrap;">
                    ${body.replace(/\n/g, "<br>")}
                </div>
            </div>
            <div style="text-align: center; margin-top: 40px;">
                <a href="${env.baseUrl}/dashboard" style="display: inline-block; padding: 14px 28px; background-color: #d97706; color: white; text-decoration: none; border-radius: 10px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);">Access Portal</a>
            </div>
            <div ${footerStyle}>Architectural Vault Broadcast Protocol | System Intelligence Layer</div>
        </div>
    </div>
    `;
};

// ─── Suspension Notification ──────────────────────────────────────────────────
export const getSuspendedHtml = (
  userName: string,
  reviewerName: string,
  reason?: string,
) => {
  return `
    <div ${emailStyle} style="border: 2px solid #be123c;">
        <div ${headerStyle} style="background: #450a0a; border-bottom-color: #be123c;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #fb7185; text-transform: uppercase;">Node Terminated</p>
            <h1 style="margin:0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">ACCOUNT SUSPENDED</h1>
        </div>
        <div style="padding: 0 20px;">
            <p>Dear ${userName},</p>
            <p>We are writing to inform you that your system connectivity to the Architectural Vault has been suspended by the administration.</p>
            
            <div style="background: #fef2f2; padding: 16px 20px; border-left: 4px solid #dc2626; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 11px; font-weight: 900; color: #991b1b; text-transform: uppercase; letter-spacing: 1px;">Action Authorized by</p>
              <p style="margin: 6px 0 0 0; font-size: 15px; font-weight: 800; color: #b91c1c;">${reviewerName}</p>
            </div>
            
            ${
              reason
                ? `<div style="background: #fff1f2; padding: 20px; border-left: 4px solid #be123c; margin: 25px 0; border-radius: 0 8px 8px 0;">
                     <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 900; color: #be123c; text-transform: uppercase; letter-spacing: 1px;">Reason for Suspension</p>
                     <p style="margin: 0; font-weight: 500;">${reason}</p>
                   </div>`
                : ""
            }
            <p style="margin-top: 30px;">If you believe this is an error, please contact the Department Head or Super Administrator to appeal this decision.</p>
            <div ${footerStyle}>Automated Security Protocol | Critical Alert</div>
        </div>
    </div>
    `;
};
