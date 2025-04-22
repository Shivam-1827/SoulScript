const express = require("express");
const cors = require("cors");
const axios = require("axios"); 
const dbConnect = require("./dbConnect");
const {Blog, Comment} = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
dbConnect();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
// console.log(GEMINI_API_KEY)

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

app.get("/", (req, res) => {
  res.send("Hi there");
});

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

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful assistant named SoulScript AI who replies to blog comments with brief, friendly responses. A reader commented: "${text}". Respond to this comment in a helpful, engaging way.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const aiReply = response.data.candidates[0].content.parts[0].text;

      comment.responses.push({
        responderName: "SoulScript AI",
        text: aiReply,
        isAI: true,
      });

      await comment.save();
      
      const updatedComment = await Comment.findById(comment._id);
      res.status(201).json(updatedComment);
    } catch (aiError) {
      console.error("AI Response Error:", aiError.response?.data || aiError.message);
      
      res.status(201).json(comment);
    }
  } catch (error) {
    console.error("Comment Error:", error);
    res.status(500).json({ message: "Error processing comment" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at PORT: ${PORT}`);
});