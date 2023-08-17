import { BlogModel } from '../models/blog.js';
import slugify from 'slugify';
import fs from 'fs';
import sharp from 'sharp';

export const create = async (req, res) => {
  try {
    //  console.log('req.fields => ', req.fields);
    //  console.log('req.files => ', req.files);
    const { title, content, category } = req.fields;
    const { path, type } = req.files.image;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'Category is required.' });
    }

    if (!path || !type) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    const blog = new BlogModel({
      title,
      slug: slugify(title),
      content,
      category,
      postedBy: req.user._id
    });

    const existingBlog = await BlogModel.findOne({ slug: slugify(title) });
    if (existingBlog) {
      return res
        .status(400)
        .json({ error: 'Title is already taken. Please create a new title.' });
    }
    // Save image in local directory
    const imageFileName = `${blog._id}.${type.split('/')[1]}`; // image/png
    //  fs.copyFileSync(path, `./uploads/${imageFileName}`);
    await sharp(path).resize(1200).toFile(`./uploads/${imageFileName}`);

    blog.image = imageFileName;

    // Save Blog
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error creating blog post.' });
  }
};

export const read = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await BlogModel.findOne({ slug }).populate('postedBy', 'name');
    res.json(blog);
  } catch (error) {
    console.log(error);
    return res.send(500).json({ error: 'Error fetching blog post' });
  }
};

export const allBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find()
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.log(error);
    return res.send(500).json({ error: 'Error fetching blog posts' });
  }
};

export const blogUpdate = async (req, res) => {
  try {
    //  console.log('req.fields => ', req.fields);
    //  console.log('req.files => ', req.files);
    const { title, content, category } = req.fields;
    // const { path, type } = req.files.image;
    const { slug } = req.params;

    // if (!title || !title.trim()) {
    //   return res.status(400).json({ error: 'Title is required.' });
    // }

    // if (!content || !content.trim()) {
    //   return res.status(400).json({ error: 'Content is required.' });
    // }

    // if (!category || !category.trim()) {
    //   return res.status(400).json({ error: 'Category is required.' });
    // }

    // if (!path || !type) {
    //   return res.status(400).json({ error: 'Image is required.' });
    // }

    // Check for existing blog
    const blog = await BlogModel.findOne({ slug });
    if (!blog) {
      return res.status(400).json({ error: 'Blog not found' });
    }

    // Check if image is updated
    if (req.files.image) {
      fs.unlinkSync(`./uploads/${blog._id}.${blog.image.split('.')[1]}`);
      const imageFileName = `${blog._id}.${type.split('/')[1]}`; // image/png
      // fs.copyFileSync(path, `./uploads/${imageFileName}`);
      await sharp(path).resize(1200).toFile(`./uploads/${imageFileName}`);
      blog.image = imageFileName;
    }

    (blog.title = title),
      (blog.slug = slugify(title)),
      (blog.content = content),
      (blog.category = category);

    // Save Blog
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error updating blog post.' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await BlogModel.findOneAndDelete({ slug });
    fs.unlinkSync(`./uploads/${blog._id}.${blog.image.split('.')[1]}`);
    res.json({ message: 'Deleted Successfully!' });
  } catch (error) {
    return res.status(400).json({ error: 'Error deleting blog post.' });
  }
};
