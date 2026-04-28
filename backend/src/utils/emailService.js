const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Foodflow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Foodflow Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ Foodflow</h1>
              <p>Your verification code is here!</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for choosing Foodflow! Your one-time verification code is:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <p>This code will expire in <strong>5 minutes</strong>.</p>
              <p>If you didn't request this code, please ignore this email or contact our support team.</p>
              <p style="margin-top: 30px;">
                <strong>Need Help?</strong><br>
                Email: support@xova.pro<br>
                Phone: +919693747328
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Foodflow. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Foodflow - Your Verification Code
        
        Hello,
        
        Your one-time verification code is: ${otp}
        
        This code will expire in 5 minutes.
        
        If you didn't request this code, please ignore this email.
        
        Need Help?
        Email: support@xova.pro
        Phone: +919693747328
        
        © ${new Date().getFullYear()} Foodflow. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending OTP email to ${email}:`, error.message);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

module.exports = {
  sendOTPEmail,
  createTransporter,
};
