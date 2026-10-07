const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnectedToMongo } = require('../config/db');
const store = require('../utils/dataStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bit_transport_portal_jwt_secret_key_2026_super_secure');
    
    if (getIsConnectedToMongo()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
      }
      req.user = user;
    } else {
      const user = store.users.find(u => u._id === decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
      }
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message
    });
  }
};

module.exports = { protect };
