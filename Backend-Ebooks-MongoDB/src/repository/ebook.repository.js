import Ebook from "../model/ebook.model.js";

class EbookRepository {
    async createEbook(user_id, { title, description, cover_image, category, chapters }) {
        try {
            const ebook = { title, description, cover_image, category, chapters };
            const createdEbook = await Ebook.create({ ...ebook, author: user_id });
            return createdEbook;
        } catch (error) {
            console.error("Error creating ebook:", error);
            throw error;
        }
    }

    async getEbookById(ebookId) {
        try {
            const ebook = await Ebook.findById(ebookId).populate('author', 'username email');
            return ebook;
        } catch (error) {
            console.error("Error fetching ebook:", error);
            throw error;
        }
    }

    async getAllEbooks() {
        try {
            const ebooks = await Ebook.find().populate('author', 'username email');
            return ebooks;
        } catch (error) {
            console.error("Error fetching ebooks:", error);
            throw error;
        }
    }

    async updateEbook(ebookId, updateData) {
        try {
            const updatedEbook = await Ebook.findByIdAndUpdate(ebookId, updateData, { new: true });
            return updatedEbook;
        } catch (error) {
            console.error("Error updating ebook:", error);
            throw error;
        }
    }

    async deleteEbook(ebookId) {
        try {
            const deletedEbook = await Ebook.findByIdAndDelete(ebookId);
            return deletedEbook;
        } catch (error) {
            console.error("Error deleting ebook:", error);
            throw error;
        }
    }

    async getAllEbooksByUser(userId) {
        try {
            const ebooks = await Ebook.find({ author: userId }).populate('author', 'username email');
            return ebooks;
        } catch (error) {
            console.error("Error fetching ebooks by user:", error);
            throw error;
        }
    }

    async addLike(ebookId, userId) {
        try {
            const ebook = await Ebook.findByIdAndUpdate(ebookId, { $addToSet: { likes: userId } }, { new: true });
            return ebook;
        } catch (error) {
            console.error("Error adding like:", error);
            throw error;
        }
    }

    async removeLike(ebookId, userId) {
        try {
            const ebook = await Ebook.findByIdAndUpdate(ebookId, { $pull: { likes: userId } }, { new: true });
            return ebook;
        } catch (error) {
            console.error("Error removing like:", error);
            throw error;
        }
    }
}

const ebookRepository = new EbookRepository();
export default ebookRepository;