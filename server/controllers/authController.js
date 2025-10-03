const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit alphanumeric OTP
const generateOTP = () => {
  const digits = process.env.OTP_CHARACTERS;
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
};

exports.register = async (req, res) => {
  const { name, phone, email, password, roleId, ward } = req.body;

  try {
    // Validate input
    if (!name || !phone || !password || !roleId) {
      return res
        .status(400)
        .json({ message: 'Name, phone, password, and role are required' });
    }

    // Check if phone or email already exists
    const existingUser = await User.findOne({
      $or: [{ phone }, { email: email ? email.toLowerCase() : null }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Phone or email already registered' });
    }

    // Create new user
    const user = new User({
      name,
      phone,
      email: email ? email.toLowerCase() : null,
      password,
      role: roleId,
      ward: ward || null,
      status: 'active',
      isEmailVerified: !email, // Verified if no email provided
    });

    // Send OTP if email is provided
    // if (email) {
    //   const otp = generateOTP();
    //   user.emailVerificationOTP = otp;
    //   user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    //   const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to: email,
    //     subject: 'Verify Your Email',
    //     html: require('../emailTemplates/Emailverifyotp')(otp), // Use otpEmail consistently
    //   };
    //   await transporter.sendMail(mailOptions);
    // }

    await user.save();

    res.status(201).json({
      message: email
        ? 'User registered successfully. Please verify your email.'
        : 'User registered successfully',
      email: email || null,
    });
  } catch (error) {
    console.error('Register - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, phone, password } = req.body;
  console.log(req.body);
  try {
    // Validate input
    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: 'Email or phone and password are required' });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: email ? email.toLowerCase() : null }, { phone }],
    }).populate({
      path: 'role',
      select: 'role_id name',
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check email verification if email exists
    if (user.email && !user.isEmailVerified) {
      // Generate and send OTP
      const otp = generateOTP(); // Fixed: Changed otp_MY to otp
      user.emailVerificationOTP = otp;
      user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verify Your Email',
        html: require('../emailTemplates/Emailverifyotp')(otp), // Use otpEmail consistently
      };
      await transporter.sendMail(mailOptions);

      return res.status(401).json({
        message: 'Please verify your email to continue',
        email: user.email,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'role',
        select: 'role_id name',
      })
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.role) {
      return res.status(500).json({ message: 'Role not found for user' });
    }

    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        ward: user.ward,
        status: user.status,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('getUserInfo - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: require('../emailTemplates/otpEmail')(otp),
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Forgot Password - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationOTP: otp,
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    user.isEmailVerified = true;
    await user.save();
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify OTP - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the new password
    user.password = newPassword; // Set plain password to trigger pre-save hook
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.resendVerificationOTP = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const otp = generateOTP();
    user.emailVerificationOTP = otp;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: require('../emailTemplates/Emailverifyotp')(otp), // Use otpEmail consistently
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP resent to email' });
  } catch (error) {
    console.error('Resend OTP - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};