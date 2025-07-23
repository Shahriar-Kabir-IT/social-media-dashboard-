const jwt = require('jsonwebtoken');
const { User } = require('../models');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim(),
        role 
      } 
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Incorrect email or password' 
      });
    }

    const token = signToken(user.id);
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ status: 'success' });
};

exports.checkAuth = (req, res) => {
  res.status(200).json({ 
    status: 'success',
    data: req.user 
  });
};