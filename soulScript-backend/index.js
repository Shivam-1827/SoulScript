const express = require("express");
const cors = require("cors");
const dbConnect = require("./dbConnect");
const {Blog, Comment} = require("./db");
// const Comment = require("./commentSchema");
// const { Configuration, OpenAIApi } = require("openai");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
dbConnect();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

app.get("/", (req, res) => {
  res.send("Hi there");
});

// Create Blog
app.post("/api/post", async (req, res) => {
  try {
    const { title, image, description, content, author } = req.body;
    if (!title || !description || !content || !author)
      return res.status(400).json({ message: "Missing required field" });

    const slug = slugify(title);
    const blog = await Blog.create({
      title,
      image,
      description,
      content,
      author,
      slug,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error while creating blog" });
  }
});

// Get all blogs (sorted newest first)
// app.get("/api/posts", async (req, res) => {
//   try {
//     const blogs = await Blog.find().sort({ publishedAt: -1 });
//     if (!blogs) return res.status(404).json({ message: "No blogs found" });
//     res.status(200).json(blogs);
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error while fetching blogs" });
//   }
// });

app.get("/api/posts", async (req, res) => {
    try {
        const blogs = await Blog.find();
        if(!blogs){
            return res.status(404).json({
                messgae: "No blogs found"
            })
        }
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error while fetching blogs",
        });
    }
});

// Get blog by slug + comments
app.get("/api/post/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comments = await Comment.find({ blog: blog._id }).sort({ createdAt: -1 });
    res.status(200).json({ ...blog.toObject(), comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error while fetching blog" });
  }
});

// Post comment and get AI response
app.post("/api/comment", async (req, res) => {
  try {
    const { blog, name, text } = req.body;
    if (!blog || !text) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const comment = await Comment.create({
      name: name || "Anonymous",
      text,
      blog,
    });

    // Generate AI response
    const aiPrompt = `A reader commented: "${text}". Reply as a helpful, friendly assistant.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: aiPrompt }],
      max_tokens: 100,
    });

    const aiReply = completion.data.choices[0].message.content;

    // Push AI response to comment
    comment.responses.push({
      text: aiReply,
      isAI: true,
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error("AI Response Error:", error);
    res.status(500).json({ message: "Error processing comment or AI response" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at PORT: ${PORT}`);
});
