import jwt from "jsonwebtoken";

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
}

export { generateToken, verifyToken };
