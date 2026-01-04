import jwt from 'jsonwebtoken';
import User from '../models/User.js';
//* Authorization xác minh user là ai */
export const protectedRoute = (req, res, next) => {
    try {
        //* Lấy token từ header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'Không tìm thấy access token ' });
        }
        //* xác nhận token hợp lệ
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodeUser) => {
            if (err) {
                console.error(err);
                return res.status(403).json({ message: 'Access token hết hạn hoặc không đúng' });
            }
            //* Tìm user
            const user = await User.findById(decodeUser.userId).select('-hashedPassword');
            if (!user) {
                return res.status(404).json({
                    message: 'Người dùng không tồn tại ',
                });
            }
            //* Trả user vào trong req
            req.user = user;
            next();
        });
    } catch (error) {
        console.log('Lỗi khi xác thực JWT trong authMiddleware', error);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
