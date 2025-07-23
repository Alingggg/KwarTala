import { userRepository } from "#repositories";

const userService = {
  async createUser(userData) {
    return userRepository.create(userData);
  },

  async findUserById(id) {
    return userRepository.findById(id);
  },

  async findUserByEmail(email) {
    return userRepository.findByEmail(email);
  },

  async updateUser(id, userData) {
    return userRepository.update(id, userData);
  },

  async deleteUser(id) {
    return userRepository.delete(id);
  },
};

export default userService;
