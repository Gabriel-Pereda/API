const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Get User model without redefining it
const getUserModel = () => {
  try {
    return mongoose.model('User');
  } catch (error) {
    // If accessed before model is defined, return null
    return null;
  }
};

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = getUserModel();
    
    if (!User) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;