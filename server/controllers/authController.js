const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: '30d',
  });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { fullName, phoneNumber, address, ebConnectionNumber, gasConnectionNumber, propertyPhoneNumber, password } = req.body;
    
    // Validate inputs
    if (!fullName || !phoneNumber || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create user (password is hashed automatically in the model)
    const user = await User.create({ 
      fullName, 
      phoneNumber, 
      address, 
      ebConnectionNumber, 
      gasConnectionNumber, 
      propertyPhoneNumber, 
      password 
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.fullName,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Please provide phone and password' });
    }

    const user = await User.findOne({ phoneNumber });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.fullName,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Assuming admin uses "admin" as username/phonenumber for login
    const user = await User.findOne({ phoneNumber: username, role: 'admin' });

    // Fallback: if no admin exists, create a default one if credentials match "admin"/"admin123"
    if (!user && username === 'admin' && password === 'admin123') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const adminUser = await User.create({
            fullName: 'System Admin',
            phoneNumber: 'admin',
            address: 'HQ',
            ebConnectionNumber: 'N/A',
            gasConnectionNumber: 'N/A',
            propertyPhoneNumber: 'N/A',
            password: hashedPassword,
            role: 'admin'
        });
        return res.json({
            _id: adminUser._id,
            fullName: adminUser.fullName,
            role: adminUser.role,
            token: generateToken(adminUser._id, adminUser.role),
        });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
