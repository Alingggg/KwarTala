const emailTemplates = {
  verifyEmail({
    email,
    verificationLink,
  }: {
    email: string;
    verificationLink: string;
  }) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #2C3E50; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">
          <!-- Header with App Branding -->
          <div style="background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <div style="background: #F8F9FA; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px; font-weight: bold; color: #2C3E50;">K</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">KwarTala</h1>
            <p style="color: #BDC3C7; margin: 10px 0 0 0; font-size: 14px;">Manage your finances with ease</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: #F8F9FA; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="color: #2C3E50; margin-top: 0; font-size: 22px; font-weight: bold;">Welcome to KwarTala! 🎉</h2>
            <p style="margin: 20px 0; color: #2C3E50; font-size: 16px;">We're excited to have you join our community. To get started, please verify your email address.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2C3E50; margin: 20px 0;">
              <p style="margin: 0; color: #2C3E50;"><strong>Email:</strong> ${email}</p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="display: inline-block; background: #2C3E50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #2C3E50; font-size: 14px; margin: 20px 0 0 0;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; color: #2C3E50; font-size: 12px; background: white; padding: 10px; border-radius: 4px; margin: 10px 0;">
              ${verificationLink}
            </p>
          </div>
          
          <!-- Security Notice -->
          <div style="background: #FFF3CD; padding: 20px; border-radius: 8px; border-left: 4px solid: #8B4513; margin: 20px 0;">
            <h3 style="color: #8B4513; margin-top: 0; font-size: 16px;">⚠️ Security Notice</h3>
            <p style="color: #8B4513; margin: 10px 0; font-size: 14px;">If you didn't create an account with KwarTala, please ignore this email.</p>
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
