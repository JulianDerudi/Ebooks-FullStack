import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // El nombre de usuario debe ser único
    email: { type: String, required: true, unique: true },    // El correo electrónico debe ser único
    password: { type: String, required: true },               // La contraseña es obligatoria
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // El rol del usuario (admin o user)
    profilePicture: { type: Buffer, required: false }, // Foto de perfil como buffer
    likedEbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ebook' }] // Libros que le dieron like
});

const User = mongoose.model('User', userSchema);

export default User;