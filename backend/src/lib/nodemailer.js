import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

// Resend needs a verified domain to send to real users. Gmail SMTP can time out
// on hosts that block SMTP ports, so Gmail API is the no-domain production path.
const requestedProvider = process.env.EMAIL_PROVIDER?.toLowerCase();
const hasEmailJsConfig =
  !!process.env.EMAILJS_SERVICE_ID && !!process.env.EMAILJS_TEMPLATE_ID && !!process.env.EMAILJS_PUBLIC_KEY;
const hasSendGridConfig =
  !!process.env.SENDGRID_API_KEY && !!(process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER);
const hasGmailApiConfig =
  !!process.env.EMAIL_USER &&
  !!process.env.GMAIL_CLIENT_ID &&
  !!process.env.GMAIL_CLIENT_SECRET &&
  !!process.env.GMAIL_REFRESH_TOKEN;
const hasVerifiedResendSender =
  !!process.env.RESEND_API_KEY &&
  !!process.env.RESEND_FROM_EMAIL &&
  !process.env.RESEND_FROM_EMAIL.includes("@resend.dev");
const useGmailApi =
  requestedProvider === "gmail-api" ||
  (requestedProvider === "gmail" && hasGmailApiConfig) ||
  (!requestedProvider && !hasEmailJsConfig && !hasSendGridConfig && hasGmailApiConfig);
const useEmailJs =
  requestedProvider === "emailjs" || (!requestedProvider && hasEmailJsConfig);
const useSendGrid =
  !useEmailJs && (requestedProvider === "sendgrid" || (!requestedProvider && hasSendGridConfig));
const useResend =
  !useEmailJs &&
  !useSendGrid &&
  !useGmailApi &&
  (requestedProvider === "resend" || (!requestedProvider && hasVerifiedResendSender));
const useGmailSmtp =
  requestedProvider === "gmail-smtp" ||
  (requestedProvider === "gmail" && !hasGmailApiConfig) ||
  (!useEmailJs && !useSendGrid && !useGmailApi && !useResend);
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "Chatty <onboarding@resend.dev>";
const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER;
const hasGmailConfig = !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS;

let transporter;

if (useGmailSmtp) {
  if (!hasGmailConfig) {
    console.warn("Gmail SMTP selected, but EMAIL_USER or EMAIL_PASS is missing.");
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    lookup: (hostname, options, callback) => {
      const opts = typeof options === "object" ? { ...options, family: 4 } : { family: 4 };
      return dns.lookup(hostname, opts, callback);
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  if (hasGmailConfig) {
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully (Gmail SMTP)");
    } catch (error) {
      console.error("SMTP connection verification failed (Gmail SMTP):", error.message);
    }
  }
}

const getOtpEmailHtml = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background-color: #f9fafb; border-radius: 12px;">
    <h2 style="color: #1f2937; text-align: center; margin-bottom: 8px;">Email Verification</h2>
    <p style="color: #6b7280; text-align: center; margin-bottom: 24px;">Use the code below to verify your email address</p>
    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #6366f1;">${otp}</span>
    </div>
    <p style="color: #9ca3af; font-size: 13px; text-align: center;">This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
  </div>
`;

const getOtpEmailText = (otp) =>
  `Your Chatty verification code is ${otp}. This code expires in 5 minutes. Do not share it with anyone.`;

const stripHeaderValue = (value) => String(value ?? "").replace(/[\r\n]/g, "").trim();

const encodeBase64Url = (value) =>
  Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const getGmailApiAccessToken = async () => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail token error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
};

const sendOtpEmailWithGmailApi = async (email, otp) => {
  if (!hasGmailApiConfig) {
    throw new Error(
      "Gmail API is not configured. Set EMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN."
    );
  }

  const boundary = `chatty_otp_${Date.now().toString(36)}`;
  const fromEmail = stripHeaderValue(process.env.EMAIL_USER);
  const toEmail = stripHeaderValue(email);
  const message = [
    `From: "Chatty" <${fromEmail}>`,
    `To: ${toEmail}`,
    "Subject: Your Verification Code - Chatty",
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    getOtpEmailText(otp),
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    getOtpEmailHtml(otp),
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");

  const accessToken = await getGmailApiAccessToken();
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: encodeBase64Url(message),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail API send error (${response.status}): ${errorText}`);
  }
};

const sendOtpEmailWithSendGrid = async (email, otp) => {
  if (!hasSendGridConfig) {
    throw new Error("SendGrid is not configured. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL.");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email }],
        },
      ],
      from: {
        email: sendGridFromEmail,
        name: "Chatty",
      },
      subject: "Your Verification Code - Chatty",
      content: [
        {
          type: "text/plain",
          value: getOtpEmailText(otp),
        },
        {
          type: "text/html",
          value: getOtpEmailHtml(otp),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API error (${response.status}): ${errorText}`);
  }
};

const sendOtpEmailWithEmailJs = async (email, otp) => {
  if (!hasEmailJsConfig) {
    throw new Error("EmailJS is not configured. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY.");
  }

  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: email,
      otp,
      app_name: "Chatty",
      subject: "Your Verification Code - Chatty",
      message: getOtpEmailText(otp),
    },
  };

  if (process.env.EMAILJS_PRIVATE_KEY) {
    payload.accessToken = process.env.EMAILJS_PRIVATE_KEY;
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS API error (${response.status}): ${errorText}`);
  }
};

export const sendOtpEmail = async (email, otp) => {
  if (useEmailJs) {
    console.log("Sending email via EmailJS API...");
    await sendOtpEmailWithEmailJs(email, otp);
  } else if (useSendGrid) {
    console.log("Sending email via SendGrid API...");
    await sendOtpEmailWithSendGrid(email, otp);
  } else if (useGmailApi) {
    console.log("Sending email via Gmail API...");
    await sendOtpEmailWithGmailApi(email, otp);
  } else if (useResend) {
    // Production (Render): Use Resend HTTP API (Port 443 - never blocked by Render)
    console.log("Sending email via Resend API (Production)...");
    const response = await fetch("https://api.resend.com/emails", {

      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [email],
        subject: "Your Verification Code - Chatty",
        html: getOtpEmailHtml(otp),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API error (${response.status}): ${errorText}`);
    }
  } else {
    if (!hasGmailConfig) {
      throw new Error("Gmail SMTP is not configured. Set EMAIL_USER and EMAIL_PASS in environment variables.");
    }

    console.log("Sending email via Gmail SMTP...");
    const mailOptions = {
      from: `"Chatty" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code - Chatty",
      html: getOtpEmailHtml(otp),
    };

    await transporter.sendMail(mailOptions);
  }
};
