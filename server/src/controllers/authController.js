const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnectedToMongo } = require('../config/db');
const store = require('../utils/dataStore');

const BIT_EMAIL_DOMAIN = '@bitsathy.ac.in';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'bit_transport_portal_jwt_secret_key_2026_super_secure',
    { expiresIn: '30d' }
  );
};

// Helper to validate BIT institutional domain
const isBitEmail = (email) => {
  return email && email.toLowerCase().trim().endsWith(BIT_EMAIL_DOMAIN);
};

// @desc    Login Staff / Faculty / Admin with institutional @bitsathy.ac.in email
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Username (email) and password.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Enforce @bitsathy.ac.in domain restriction
    if (!isBitEmail(normalizedEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Access Restricted: Only @bitsathy.ac.in institutional accounts are authorized.'
      });
    }

    let user = null;

    if (getIsConnectedToMongo()) {
      user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const isAdmin = normalizedEmail.includes('admin') || normalizedEmail.includes('transport');
        const namePart = normalizedEmail.split('@')[0].replace('.', ' ').toUpperCase();

        user = await User.create({
          name: namePart,
          email: normalizedEmail,
          password: hashedPassword,
          role: isAdmin ? 'ADMIN' : 'FACULTY',
          department: 'CSE',
          employeeId: `BIT-${Math.floor(1000 + Math.random() * 9000)}`,
          designation: isAdmin ? 'Transport Administrator' : 'Staff / Faculty'
        });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid password. Please verify your credentials.'
          });
        }
      }
    } else {
      // Embedded Fallback Store
      user = store.users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const isAdmin = normalizedEmail.includes('admin') || normalizedEmail.includes('transport');
        const namePart = normalizedEmail.split('@')[0].replace('.', ' ').toUpperCase();

        user = {
          _id: `usr_${Date.now()}`,
          name: namePart,
          email: normalizedEmail,
          password: hashedPassword,
          role: isAdmin ? 'ADMIN' : 'FACULTY',
          department: 'CSE',
          employeeId: `BIT-${Math.floor(1000 + Math.random() * 9000)}`,
          phone: '+91 98401 12233',
          designation: isAdmin ? 'Transport Administrator' : 'Staff / Faculty Member',
          createdAt: new Date()
        };
        store.users.push(user);
      } else {
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid password. Please verify your credentials (default: bit12345).'
          });
        }
      }
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        phone: user.phone,
        designation: user.designation
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Google / BIT Institutional Single Sign-On (SSO)
// @route   POST /api/auth/google-sso
// @access  Public
exports.googleSSO = async (req, res) => {
  try {
    const { email, name = 'BIT Staff Member' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google institutional email is required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isBitEmail(normalizedEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Access Restricted: Only @bitsathy.ac.in institutional accounts are authorized.'
      });
    }

    let user = null;

    if (getIsConnectedToMongo()) {
      user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const defaultPassword = await bcrypt.hash('bit12345', salt);
        const isAdmin = normalizedEmail.includes('admin') || normalizedEmail.includes('transport');

        user = await User.create({
          name: name || normalizedEmail.split('@')[0].toUpperCase(),
          email: normalizedEmail,
          password: defaultPassword,
          role: isAdmin ? 'ADMIN' : 'FACULTY',
          department: 'CSE',
          employeeId: `BIT-${Math.floor(1000 + Math.random() * 9000)}`,
          designation: isAdmin ? 'Transport Administrator' : 'Staff / Faculty Member'
        });
      }
    } else {
      user = store.users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        const salt = bcrypt.genSaltSync(10);
        const defaultPassword = bcrypt.hashSync('bit12345', salt);
        const isAdmin = normalizedEmail.includes('admin') || normalizedEmail.includes('transport');

        user = {
          _id: `usr_${Date.now()}`,
          name: name || normalizedEmail.split('@')[0].toUpperCase(),
          email: normalizedEmail,
          password: defaultPassword,
          role: isAdmin ? 'ADMIN' : 'FACULTY',
          department: 'CSE',
          employeeId: `BIT-${Math.floor(1000 + Math.random() * 9000)}`,
          phone: '+91 98401 12233',
          designation: isAdmin ? 'Transport Administrator' : 'Staff / Faculty Member',
          createdAt: new Date()
        };
        store.users.push(user);
      }
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: `Authenticated via BIT Google SSO as ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        phone: user.phone,
        designation: user.designation
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Google SSO authentication failed',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};
