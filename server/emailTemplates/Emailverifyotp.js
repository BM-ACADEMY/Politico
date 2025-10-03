module.exports = (otp) => `

    <div style="
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:12px;
      overflow:hidden;
      border:1px solid #d1d5db;
      box-shadow:0 6px 16px rgba(0,0,0,0.1);
      font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        background:#000000;
        padding:30px 20px;
        text-align:center;
        color:#ffffff;
      ">
        <h2 style="margin:0;font-size:24px;font-weight:600;">
          Politico Verification Email OTP
        </h2>
      </div>

      <div style="padding:30px 20px;text-align:center;color:#374151;">
        <p style="font-size:16px;margin-bottom:20px;">
          You requested a verification otp for your Politico account.
        </p>
        <p style="font-size:16px;margin-bottom:20px;">
          Here’s your One-Time Password:
        </p>
        <div style="
          display:inline-block;
          padding:16px 28px;
          font-size:36px;
          font-weight:700;
          background-color:#f9fafb;
          border-radius:8px;
          color:#1e3a8a;
          letter-spacing:6px;
          border:1px solid #cbd5e1;
          box-shadow:0 3px 8px rgba(0,0,0,0.08);
        ">
          ${otp}
        </div>
        <p style="font-size:16px;margin-top:20px;">
          This code is valid for 10 minutes.<br/>
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>

      <div style="
        background:#f9fafb;
        padding:15px;
        text-align:center;
        font-size:12px;
        color:#6b7280;
        border-top:1px solid #e2e8f0;
      ">
        &copy; 2025 Politico. All rights reserved.
      </div>
    </div>
`;
