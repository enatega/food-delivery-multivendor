const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/emailService');
const { generateToken } = require('../middleware/auth');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generate OTP
    const otp = generateOTP();

    // Set expiry time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete any existing unused OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail, isUsed: false });

    // Create new OTP record
    const otpRecord = await OTP.create({
      email: normalizedEmail,
      otp,
      expiresAt,
    });

    // Send OTP via email
    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // Still allow the flow, but log the error
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      data: {
        email: normalizedEmail,
        expiresInSeconds: 300, // 5 minutes
      },
    });
  } catch (error) {
    console.error('Send OTP error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
    });
  }
};

// @desc    Verify OTP and create/login user
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp,
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user
      user = await User.create({
        email: normalizedEmail,
        isVerified: true,
        userType: 'default',
      });
    } else {
      // Update existing user
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Verification successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          userType: user.userType,
        },
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.',
    });
  }
};

// @desc    Register user with email and password
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user with password
    const user = await User.create({
      email: normalizedEmail,
      password,
      name: name || '',
      isVerified: true,
      userType: 'default',
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          userType: user.userType,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to register. Please try again.',
    });
  }
};

// @desc    Login user with email and password
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, notificationToken } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user with password
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update notification token if provided
    if (notificationToken) {
      user.notificationToken = notificationToken;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          userType: user.userType,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to login. Please try again.',
    });
  }
};

// @desc    Check if email exists
// @route   POST /api/auth/check-email
// @access  Public
const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    res.status(200).json({
      success: true,
      data: {
        exists: !!user,
        user: user
          ? {
              _id: user._id,
              email: user.email,
              userType: user.userType,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Check email error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to check email. Please try again.',
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  register,
  login,
  checkEmailExists,
};
