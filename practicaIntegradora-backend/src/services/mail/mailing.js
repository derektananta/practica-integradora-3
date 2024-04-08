import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

const { MAIL_PASS, MAIL_USER, JWT_KEY } = config

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    }
});


const secretKey = JWT_KEY;

const generateToken = (email) => {
    return jwt.sign({ email }, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded.email;
    } catch (error) {
        return null;
    }
};

export { generateToken, verifyToken };

