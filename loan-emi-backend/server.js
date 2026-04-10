import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import loanRoutes from './routes/loanRoutes.js';

dotenv.config();
connectDB();

const app = express();


app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://react-project-kf6u.onrender.com" 
    ],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
// ==========================================

app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
