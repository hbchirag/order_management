const bcrypt = require('bcrypt');

// Hash the password
const hashPassword = async (password) => {
  const saltRounds = 10; // Define the number of salt rounds for hashing
  return bcrypt.hash(password, saltRounds);
};

// Compare password with hashed password
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
