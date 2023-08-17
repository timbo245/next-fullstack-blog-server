import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.js';

export const requireSignIn = (req, res, next) => {
  try {
    // Verify Token
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ADMIN
export const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user.role !== 'Admin') {
      return res.status(401).json({ error: 'Not Authorized' });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Not Authorized' });
  }
};
