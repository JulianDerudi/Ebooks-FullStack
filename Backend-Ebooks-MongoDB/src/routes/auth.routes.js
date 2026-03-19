import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repository/user.repository.js';
import ENVIRONMENT from '../config/environment.config.js';

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = await userRepository.createUser({
            username,
            email,
            password: hashedPassword
        });

        // Generar token
        const token = jwt.sign({ userId: user._id }, ENVIRONMENT.JWT_SECRET || 'secret', { expiresIn: '30d' });

        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generar token
        const token = jwt.sign({ userId: user._id }, ENVIRONMENT.JWT_SECRET || 'secret', { expiresIn: '30d' });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;