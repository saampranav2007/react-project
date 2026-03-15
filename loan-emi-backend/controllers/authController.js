import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  // 🛡️ THE FIX: Extract phone and panCard from the React payload!
  const { name, email, password, monthlyIncome, phone, panCard } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 🛡️ THE FIX: Pass phone and panCard into the database creation method!
    const user = await User.create({ name, email, password, monthlyIncome, phone, panCard });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      cibilScore: user.cibilScore, // Send back the generated CIBIL score
      token: generateToken(user._id),
    });
  } catch (error) {
    // If MongoDB throws an error (like a duplicate PAN), this sends it back to React!
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        cibilScore: user.cibilScore,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};