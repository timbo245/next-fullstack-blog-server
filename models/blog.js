import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      max: 320
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      required: true
    },
    content: {
      type: {},
      required: true
    },
    category: {
      type: String
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const BlogModel = mongoose.model('Blog', blogSchema);
export { BlogModel };
