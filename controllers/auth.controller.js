import asyncHandler from '../utils/asyncHandler.js';
import appError from '../utils/appError.js';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail, getUserByUsername } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        throw new appError('All fields are required', 400);
    }

    const emailExisting = await getUserByEmail(email);
    const usernameExisting = await getUserByUsername(username);
    if (emailExisting) {
        throw new appError('Email already exists', 400);
    }
    if (usernameExisting) {
        throw new appError('Username already exists', 400);
    }

    const userRole=role && ['admin','moderator','user'].includes(role)? role : 'user';
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashedPassword, username, userRole);
    const token = generateToken(newUser);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        },
        token,
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new appError('All fields are required', 400);
    }

    const user = await getUserByEmail(email);
    if (!user) {
        throw new appError('Email does not exists', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new appError('Invalid Email or Password', 401);
    }

    const token = generateToken(user);

    res.status(201).json({
        message: 'User Logged-in successfully',
        user: {
            id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        token,
    });
})