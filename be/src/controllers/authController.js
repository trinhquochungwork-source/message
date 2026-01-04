import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Seccsion from '../models/Seccsion.js';

const ACCESS_TOKEN_TTL = '30m'; //* thường dưới 15 phút
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 1000; //*thường dưới 14 ngày
// ! Đăng ký
export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;
        if (!username || !password || !email || !firstName || !lastName) {
            return res
                .status(400)
                .json({ message: 'Không thể thiếu username,password,email,firstName và lastName' });
        }

        //* Kiểm tra xem username tồn tại chưa
        const duplicate = await User.findOne({ username });
        if (duplicate) {
            return res.status(409).json({ message: 'username đã tồn tại !' });
        }
        //* mã hóa passowrd
        const hashedPassword = await bcrypt.hash(password, 10);
        //* tạo user mới
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName}${lastName}`,
        });
        //* return
        return res.sendStatus(204);
    } catch (error) {
        console.log('Lỗi khi gọi signUp', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
//! Đăng nhập signUp
export const signIn = async (req, res) => {
    try {
        // * lấy từ input
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Thiếu username hoặc password ' });
        }
        //* lấy hashedPassword trong db để so với password input
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'user hoặc password không chính xác ! ' });
        }
        //* Kiểm tra password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: 'user name hoặc password không chính xác !' });
        }

        //* Nếu khớp thì tạo accessToken với JWT
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_TTL,
        });

        //* Tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        //* Tạo sesion mới để lưu resfreh token
        await Seccsion.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });
        //* Trả refresh tooken về cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', // be,fe deploy riêng
            maxAge: REFRESH_TOKEN_TTL,
        });
        //* Trả aceess token về trong res
        return res
            .status(200)
            .json({ message: `User:${user.displayName} đã logged in !`, accessToken });
    } catch (error) {
        console.log('Lỗi khi gọi signIn', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

//* Đăng xuất
export const signOut = async (req, res) => {
    try {
        //* lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if (token) {
            //* Xóa refresh tokeb trong session
            await Seccsion.deleteOne({ refreshToken: token });
            //* Xóa cookie
            res.clearCookie('refreshToken');
        }
        return res.sendStatus(204);
    } catch (error) {
        console.log('Lỗi khi gọi signIn', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
