module.exports = (otp, verificationLink) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #f4f4f4; padding: 20px; text-align: center; }
      .content { padding: 20px; background: #fff; border: 1px solid #ddd; }
      .otp { font-size: 24px; font-weight: bold; color: #2c3e50; text-align: center; margin: 20px 0; }
      .button { display: inline-block; padding: 10px 20px; background: #3498db; color: #fff; text-decoration: none; border-radius: 5px; }
      .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Email Verification</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>Please verify your email address to complete your registration.</p>
        <p>Your One-Time Password (OTP) is:</p>
        <div class="otp">${otp}</div>
        <p>Alternatively, you can click the button below to verify your email:</p>
        <p style="text-align: center;">
          <a href="${verificationLink}" class="button">Verify Email</a>
        </p>
        <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 Politico. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;