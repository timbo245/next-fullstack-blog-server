import express from 'express';
import { register, login } from '../controllers/auth.js';
import { requireSignIn, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// router.get('/', time);
// router.get('/about', about);

// REGISTER //
router.post('/register', register);
router.post('/login', login);

// RESTRICTED ROUTE //
router.get('/user-secret', requireSignIn, (req, res) => {
  res.json({ message: 'You got access to the user-secret page' });
});
router.get('/admin-secret', requireSignIn, isAdmin, (req, res) => {
  res.json({ message: 'You got access to the admin secret route' });
});

export default router;
