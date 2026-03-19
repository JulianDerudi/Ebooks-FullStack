import express from 'express';
import multer from 'multer';
import userRepository from '../repository/user.repository.js';
import ebookRepository from '../repository/ebook.repository.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Configurar multer para subir imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB límite

const formatEbookForProfile = (ebook) => {
    const ebookObject = ebook.toObject ? ebook.toObject() : { ...ebook };
    return {
        ...ebookObject,
        cover_image: ebookObject.cover_image ? ebookObject.cover_image.toString('base64') : null,
        likes: Array.isArray(ebookObject.likes) ? ebookObject.likes.map(like => like.toString()) : [],
    };
};

// Obtener perfil de usuario (cualquiera puede ver)
router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await userRepository.getUserById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Obtener ebooks publicados
        const publishedEbooks = (await ebookRepository.getAllEbooksByUser(req.params.userId)).map(formatEbookForProfile);

        // Obtener ebooks que le dieron like
        const likedEbooks = (await ebookRepository.getAllEbooks())
            .filter(ebook => ebook.likes.some(like => like.toString() === req.params.userId))
            .map(formatEbookForProfile);

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture ? user.profilePicture.toString('base64') : null
            },
            publishedEbooks,
            likedEbooks
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Obtener perfil del usuario autenticado
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await userRepository.getUserById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Obtener ebooks publicados
        const publishedEbooks = (await ebookRepository.getAllEbooksByUser(req.userId)).map(formatEbookForProfile);

        // Obtener ebooks que le dieron like
        const likedEbooks = (await ebookRepository.getAllEbooks())
            .filter(ebook => ebook.likes.some(like => like.toString() === req.userId))
            .map(formatEbookForProfile);

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture ? user.profilePicture.toString('base64') : null
            },
            publishedEbooks,
            likedEbooks
        });
    } catch (error) {
        console.error('Error fetching authenticated user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Actualizar perfil (solo el propio usuario)
router.put('/profile', authMiddleware, upload.single('profilePicture'), async (req, res) => {
    try {
        const updateData = {};

        if (req.body.username) updateData.username = req.body.username;
        if (req.body.email) updateData.email = req.body.email;
        if (req.file) updateData.profilePicture = req.file.buffer;

        const user = await userRepository.updateUser(req.userId, updateData);
        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture ? user.profilePicture.toString('base64') : null
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;