import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentDate: { type: Date, default: Date.now },
  amountPaid: { type: Number, required: true },
  principalCovered: { type: Number, required: true },
  interestCovered: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Late', 'Missed'], default: 'Paid' }
});

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bankName: { type: String, required: true },
  principalAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  monthlyEmi: { type: Number, required: true },
  
  // Tracking progress
  totalPayable: { type: Number, required: true },
  amountPaidSoFar: { type: Number, default: 0 },
  remainingBalance: { type: Number, required: true },
  
  status: { type: String, enum: ['Active', 'Closed', 'Defaulted'], default: 'Active' },
  
  // Embedded array of individual payments
  paymentHistory: [paymentSchema]
}, { timestamps: true });

export default mongoose.model('Loan', loanSchema);