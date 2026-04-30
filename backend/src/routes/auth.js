const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  sendOTP,
  verifyOTP,
  register,
  login,
  checkEmailExists,
} = require('../controllers/authController');

// Validation rules
const sendOTPValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  validate,
];

const verifyOTPValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
  validate,
];

const registerValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').optional().trim(),
  validate,
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  body('notificationToken').optional(),
  validate,
];

const checkEmailValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  validate,
];

// Routes
router.post('/send-otp', sendOTPValidation, sendOTP);
router.post('/verify-otp', verifyOTPValidation, verifyOTP);
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/check-email', checkEmailValidation, checkEmailExists);

module.exports = router;
