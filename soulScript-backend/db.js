const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: {
    type: String,
    default:
      "https://st4.depositphotos.com/17828278/24401/v/450/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg",
  },
  description: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true },
  author: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now },
});

const responseSchema = new mongoose.Schema({
  responderName: {
    type: String,
    default: "SoulScript AI",
  },
  text: {
    type: String,
    required: true,
  },
  isAI: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Anonymous",
    },
    text: {
      type: String,
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    responses: [responseSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Blog, Comment }; // ✅ Exporting both
