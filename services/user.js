class UserService {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }

    createUser(name, email) {
        const newUser = { id: this.nextId++, name, email };
        this.users.push(newUser);
        return newUser;
    }

    getUserById(userId) {
        return this.users.find(user => user.id === userId);
    }

    findByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    updateUser(userId, name, email) {
        const user = this.getUserById(userId);
        if (user) {
            user.name = name;
            user.email = email;
            return user;
        }
        return null;
    }

    deleteUser(userId) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            return true;
        }
        return false;
    }

    getAllUsers() {
        return this.users;
    }
}


module.exports.userService = new UserService();