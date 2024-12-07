import { Request, Response } from "express";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from "googleapis";
import { body, ValidationChain, validationResult } from "express-validator";

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_USER = process.env.GMAIL_USER;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Create a transporter using nodemailer with OAuth2
async function createTransporter() {
  // Get the new access token dynamically using the refresh token
  const { token } = await oAuth2Client.getAccessToken();
  console.log(token);

  if (!token) {
    throw new Error("Failed to retrieve access token");
  }
  const smtpOptions: SMTPTransport.Options = {
    host: "smtp.gmail.com",
    port: 465, // Use 587 for STARTTLS, 465 for SSL/TLS
    secure: true, // true for 465, false for 587
    auth: {
      type: "OAuth2",
      user: GMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: token,
    },
  };
  return nodemailer.createTransport(smtpOptions);
}

export async function sendSupportEmail(req: Request, res: Response) {
  const currentUserId = req.user?.id;
  const { content, contactEmail } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  if (!currentUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const mailOptions = {
    from: `"Support" <${GMAIL_USER}>`,
    to: SUPPORT_EMAIL,
    subject: "Linkeem Support Request",
    text: `Message from: ${contactEmail}\n\nUser Id: ${currentUserId}\n\n${content}`,
  };

  try {
    // Create transporter and send the email
    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    res.json({ message: "Email Sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
}

export const validateSupportEmail = [
  body("content")
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long."),

  body("contactEmail").isEmail().withMessage("A valid email is required."),
] as ValidationChain[];
