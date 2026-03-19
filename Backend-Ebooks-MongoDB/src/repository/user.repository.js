import User from "../model/user.model.js";

class UserRepository {

    async createUser({ username, email, password, role }) {
        try {
            const user = { username, email, password, role };
            const createdUser = await User.create(user);
            return createdUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    async updateUser(userId, updateData) {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async addLikedEbook(userId, ebookId) {
        try {
            const user = await User.findByIdAndUpdate(userId, { $addToSet: { likedEbooks: ebookId } }, { new: true });
            return user;
        } catch (error) {
            console.error("Error adding liked ebook:", error);
            throw error;
        }
    }

    async removeLikedEbook(userId, ebookId) {
        try {
            const user = await User.findByIdAndUpdate(userId, { $pull: { likedEbooks: ebookId } }, { new: true });
            return user;
        } catch (error) {
            console.error("Error removing liked ebook:", error);
            throw error;
        }
    }
}

const userRepository = new UserRepository();
export default userRepository;