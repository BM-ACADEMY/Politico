module.exports = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f1f5f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .header {
      background: #000000; /* Black header */
      padding: 30px 20px;
      text-align: center;
      color: #ffffff; /* White text */
    }
    .header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
      color: #334155;
    }
    .content p {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .otp {
      display: inline-block;
      padding: 16px 28px;
      font-size: 36px;
      font-weight: 700;
      background-color: #f1f5f9;
      border-radius: 8px;
      color: #1e3a8a;
      letter-spacing: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    .footer {
      background: #f8fafc;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Politico Password Reset</h2>
    </div>
    <div class="content">
      <p>You requested a password reset for your Politico account.</p>
      <p>Here’s your One-Time Password:</p>
      <div class="otp">${otp}</div>
      <p>This code is valid for 10 minutes.<br/>If you didn’t request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; 2025 Politico. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
