import Loan from '../models/Loan.js';

// Create a new loan record
export const applyForLoan = async (req, res) => {
  const { bankName, principalAmount, interestRate, tenureMonths, monthlyEmi, totalPayable } = req.body;

  try {
    const loan = await Loan.create({
      user: req.user._id, // Comes from the auth middleware
      bankName,
      principalAmount,
      interestRate,
      tenureMonths,
      monthlyEmi,
      totalPayable,
      remainingBalance: totalPayable,
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all loans for the logged-in user
export const getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id }).sort('-createdAt');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process an EMI Payment
export const makePayment = async (req, res) => {
  const { amountPaid, principalCovered, interestCovered } = req.body;
  
  try {
    const loan = await Loan.findById(req.params.id);
    
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to pay this loan' });
    }

    // Update balances
    loan.amountPaidSoFar += amountPaid;
    loan.remainingBalance -= amountPaid;
    
    if (loan.remainingBalance <= 0) {
      loan.remainingBalance = 0;
      loan.status = 'Closed';
    }

    // Add to history array
    loan.paymentHistory.push({
      amountPaid,
      principalCovered,
      interestCovered,
      status: 'Paid'
    });

    await loan.save();
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};