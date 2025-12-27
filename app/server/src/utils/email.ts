import nodemailer from 'nodemailer';
import { env } from '../config/env';

export const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    auth: env.smtp.user && env.smtp.pass ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
});

export const sendApprovalEmail = async (to: string, subject: string, html: string) => {
    if (!env.smtp.host) return;
    await transporter.sendMail({ from: env.smtp.from, to, subject, html });
};
