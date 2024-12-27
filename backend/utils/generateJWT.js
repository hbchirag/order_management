const jwt = require('jsonwebtoken');

const generateJWT = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role_id: user.role_id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Set token expiry to 1 hour
};

module.exports = generateJWT;
