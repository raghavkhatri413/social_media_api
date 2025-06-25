import asyncHandler from '../utils/asyncHandler.js';
import appError from '../utils/appError.js';
import bcrypt, { hash } from 'bcrypt';
import { createUser, getUserByEmail, getUserByUsername } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashedPassword, username);
    const token = generateToken(newUser);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
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
            id: user.id,
            username: user.username,
            email: user.email,
        },
        token,
    });
})