import jwt from "jsonwebtoken";

const generateRefreshToken = (id:any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRY2! });
};

module.exports = { generateRefreshToken };
