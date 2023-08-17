import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/auth.js';

import formidable from 'express-formidable';
import {
  create,
  read,
  allBlogs,
  blogUpdate,
  deleteBlog
} from '../controllers/blog.js';

const router = express.Router();

router.post('/blog/create', requireSignIn, isAdmin, formidable(), create);
router.get('/blog/:slug', read);
router.get('/blogs', allBlogs);
router.put('/blog/:slug', requireSignIn, isAdmin, formidable(), blogUpdate);
router.delete('/blog/:slug', requireSignIn, isAdmin, deleteBlog);

export default router;
