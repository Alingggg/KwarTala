const emailTemplates = {
  verifyEmail({
    verificationLink,
    mainTitle,
    mainText,
    buttonLabel,
  }: {
    verificationLink: string;
    mainTitle: string;
    mainText: string;
    buttonLabel: string;
  }) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${mainTitle}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #2C3E50; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">
          <!-- Main Content -->
          <div style="background: #F8F9FA; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="color: #2C3E50; margin-top: 0; font-size: 22px; font-weight: bold;">${mainTitle}</h2>
            <p style="margin: 20px 0; color: #2C3E50; font-size: 16px;">${mainText}</p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="display: inline-block; background: #2C3E50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
                ${buttonLabel}
              </a>
            </div>
            
            <p style="color: #2C3E50; font-size: 14px; margin: 20px 0 0 0;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; color: #2C3E50; font-size: 12px; background: white; padding: 10px; border-radius: 4px; margin: 10px 0;">
              ${verificationLink}
            </p>
          </div>
          
          <!-- General Security Notice -->
          <div style="background: #FFF3CD; padding: 20px; border-radius: 8px; border-left: 4px solid #8B4513; margin: 20px 0;">
            <h3 style="color: #8B4513; margin-top: 0; font-size: 16px;">⚠️ Security Notice</h3>
            <p style="color: #8B4513; margin: 10px 0; font-size: 14px;">
              If you did not request this action or believe this email was sent to you by mistake, please ignore it.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E0E0E0;">
            <p style="color: #7F8C8D; font-size: 12px; margin: 5px 0;">© 2025 KwarTala. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;
  },
};

export default emailTemplates;
