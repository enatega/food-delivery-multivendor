const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      select: false,
    },
    userType: {
      type: String,
      enum: ['default', 'google', 'facebook', 'apple'],
      default: 'default',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    notificationToken: {
      type: String,
      default: '',
    },
    addresses: [
      {
        label: String,
        address: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
        phone: String,
        location: {
          type: {
            type: String,
            enum: ['Point'],
          },
          coordinates: {
            type: [Number], // [longitude, latitude]
          },
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if it's modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
