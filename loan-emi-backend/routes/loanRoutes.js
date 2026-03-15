import express from 'express';
import { applyForLoan, getUserLoans, makePayment } from '../controllers/loanController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to all loan routes
router.use(protect); 

router.route('/').post(applyForLoan).get(getUserLoans);
router.post('/:id/pay', makePayment);

// THIS IS THE LINE YOU ARE MISSING
export default router;