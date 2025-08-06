import { emailTemplates } from "@/templates/index";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASS,
  },
});

const emailService = {
  async sendVerificationEmail({
    email,
    verificationLink,
  }: {
    email: string;
    verificationLink: string;
  }) {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "🔐 Verify Your Email - KwarTala",
      html: emailTemplates.verifyEmail({ email, verificationLink }),
    });
  },
};

export default emailService;
