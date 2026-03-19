import express from 'express';
import multer from 'multer';
import ebookRepository from '../repository/ebook.repository.js';
import userRepository from '../repository/user.repository.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Configurar multer para subir imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB límite

const formatEbook = (ebook) => {
    const ebookObject = ebook.toObject ? ebook.toObject() : { ...ebook };
    return {
        ...ebookObject,
        cover_image: ebookObject.cover_image ? ebookObject.cover_image.toString('base64') : null,
        likes: Array.isArray(ebookObject.likes) ? ebookObject.likes.map(like => like.toString()) : [],
    };
};

// Obtener todos los ebooks
router.get('/', async (req, res) => {
    try {
        const ebooks = await ebookRepository.getAllEbooks();
        const ebooksWithImages = ebooks.map(formatEbook);
        res.json(ebooksWithImages);
    } catch (error) {
        console.error('Error fetching ebooks:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Obtener ebook por ID
router.get('/:id', async (req, res) => {
    try {
        const ebook = await ebookRepository.getEbookById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ message: 'Ebook not found' });
        }
        res.json(formatEbook(ebook));
    } catch (error) {
        console.error('Error fetching ebook:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Crear ebook (requiere autenticación)
router.post('/', authMiddleware, upload.single('cover_image'), async (req, res) => {
    try {
        const { title, description, category, chapters } = req.body;
        const cover_image = req.file ? req.file.buffer : null;

        const ebook = await ebookRepository.createEbook(req.userId, {
            title,
            description,
            cover_image,
            category,
            chapters: chapters ? JSON.parse(chapters) : [] // Permitir ebooks sin capítulos iniciales
        });

        res.status(201).json(formatEbook(ebook));
    } catch (error) {
        console.error('Error creating ebook:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Actualizar ebook (solo el autor)
router.put('/:id', authMiddleware, upload.single('cover_image'), async (req, res) => {
    try {
        const ebook = await ebookRepository.getEbookById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ message: 'Ebook not found' });
        }

        // Handle both populated and non-populated author fields
        const ebookAuthorId = ebook.author?._id ? ebook.author._id.toString() : ebook.author?.toString();
        if (ebookAuthorId !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updateData = {};
        if (req.body.title) updateData.title = req.body.title;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.category) updateData.category = req.body.category;
        if (req.body.chapters) updateData.chapters = JSON.parse(req.body.chapters);
        if (req.file) updateData.cover_image = req.file.buffer;

        const updatedEbook = await ebookRepository.updateEbook(req.params.id, updateData);
        res.json(formatEbook(updatedEbook));
    } catch (error) {
        console.error('Error updating ebook:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Dar like a un ebook
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const ebook = await ebookRepository.addLike(req.params.id, req.userId);
        await userRepository.addLikedEbook(req.userId, req.params.id);
        res.json({ message: 'Like added' });
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Quitar like a un ebook
router.delete('/:id/like', authMiddleware, async (req, res) => {
    try {
        const ebook = await ebookRepository.removeLike(req.params.id, req.userId);
        await userRepository.removeLikedEbook(req.userId, req.params.id);
        res.json({ message: 'Like removed' });
    } catch (error) {
        console.error('Error removing like:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Eliminar ebook (solo el autor)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const ebook = await ebookRepository.getEbookById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ message: 'Ebook not found' });
        }

        // Handle both populated and non-populated author fields
        const ebookAuthorId = ebook.author?._id ? ebook.author._id.toString() : ebook.author?.toString();
        if (ebookAuthorId !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await ebookRepository.deleteEbook(req.params.id);
        res.json({ message: 'Ebook deleted' });
    } catch (error) {
        console.error('Error deleting ebook:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;