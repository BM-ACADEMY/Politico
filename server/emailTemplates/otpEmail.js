module.exports = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #e5e7eb; /* Light grey background */
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff; /* White card */
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #d1d5db; /* Subtle border */
      box-shadow: 0 6px 16px rgba(0,0,0,0.1); /* Card shadow */
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
      bgcolor: #f9fafb; /* Slightly grey content area */
      color: #374151; /* Dark grey text */
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
      background-color: #f9fafb; /* Slightly grey box */
      border-radius: 8px;
      color: #1e3a8a; /* Indigo text */
      letter-spacing: 6px;
      border: 1px solid #cbd5e1; /* Border */
      box-shadow: 0 3px 8px rgba(0,0,0,0.08); /* Shadow */
    }
    .footer {
      background: #f9fafb;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #6b7280; /* Muted grey */
      border-top: 1px solid #e2e8f0;
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
