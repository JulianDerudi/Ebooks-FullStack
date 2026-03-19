import mongoose from "mongoose";

// Definicion del esquema para los ebooks
const ebookSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }, // El título debe ser único
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // referencia al usuario que creó el ebook, es obligatorio
    description: { type: String, required: false },        // La descripción es opcional
    cover_image: { type: Buffer, required: false }, // La imagen de portada como buffer
    category: { type: String, required: true },                    // La categoría es obligatoria
    chapters: [                                                    // Un ebook puede tener múltiples capítulos
        {
            title: { type: String, required: true },       // El título del capítulo es obligatorio
            content: { type: String, required: true },     // El contenido del capítulo es obligatorio
        },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Usuarios que dieron like
});


const Ebook = mongoose.model('Ebook', ebookSchema);

export default Ebook;