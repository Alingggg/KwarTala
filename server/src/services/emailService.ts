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
    subject,
    mainTitle,
    mainText,
    buttonLabel,
  }: {
    email: string;
    verificationLink: string;
    subject: string;
    mainTitle: string;
    mainText: string;
    buttonLabel: string;
  }) {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject,
      html: emailTemplates.verifyEmail({
        verificationLink,
        mainTitle,
        mainText,
        buttonLabel,
      }),
    });
  },
};

export default emailService;
