import express from 'express';
import dotenv from 'dotenv';
import { connectBD } from './libs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//* middleware
app.use(express.json());
app.use(cookieParser());
//*publicRoutes
app.use('/api/auth', authRoute);
//* privateRoutes
app.use(protectedRoute);
app.use('/api/users', userRoute);
connectBD().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at: ${PORT}`);
    });
});
