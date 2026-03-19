import express from 'express';
import path from 'path';
import cors from 'cors';
import connectToMongoDB from "./config/mongoDB.config.js";
import userRoutes from './routes/user.routes.js';
import ebookRoutes from './routes/ebook.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Para manejar imágenes base64 grandes
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
connectToMongoDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ebooks', ebookRoutes);

// Servir archivos estáticos del frontend
app.use(express.static('../Frontend-Ebooks-MongoDB/dist'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'Ebooks API is running' });
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.resolve('..', 'Frontend-Ebooks-MongoDB', 'dist', 'index.html'));
});

// Iniciar servidor con manejo de EADDRINUSE
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`Port ${port} in use, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
}

startServer(PORT);

