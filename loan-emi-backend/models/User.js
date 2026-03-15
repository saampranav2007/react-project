import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // ADDED: These must perfectly match what React is sending!
  phone: { type: String, required: true, unique: true },
  panCard: { type: String, required: true, unique: true, uppercase: true },
  
  password: { type: String, required: true },
  cibilScore: { 
    type: Number, 
    default: function() {
      // Mock CIBIL Score generation between 600 and 850 for testing
      return Math.floor(Math.random() * (850 - 600 + 1)) + 600;
    }
  },
  monthlyIncome: { type: Number, required: true },
}, { timestamps: true });

// Password hashing middleware before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);