import { hashPassword, comparePassword } from '../helpers/auth.js';
import { UserModel } from '../models/user.js';
import validator from 'email-validator';
import jwt from 'jsonwebtoken';

// REGISTER USER //
export const register = async (req, res) => {
  try {
    //   console.log(req.body);
    // destructure req.body
    const { name, email, password } = req.body;
    console.log(password);

    // Validation
    if (!name || name.trim === '') {
      return res.status(400).json({ error: 'Name is required!' });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({ error: 'Please enter a valid email!' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password should be at least 6 characters long!' });
    }

    // Check if user exists already
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'Email is already taken.' });

    // hash password
    const hashedPassword = await hashPassword(password);

    // create and save user
    const user = await new UserModel({
      name,
      email,
      password: hashedPassword
    }).save();

    // Generate JWT

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Reset user password to undefined so it is not sent with response
    user.password = undefined;

    // send response
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Something went wrong.' });
  }
};

// LOGIN USER //
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: 'User does not exist! Please Register!' });
    }
    // compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Wrong Password!' });
    }
    // create jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    user.password = undefined;
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Something went wrong.' });
  }
};
