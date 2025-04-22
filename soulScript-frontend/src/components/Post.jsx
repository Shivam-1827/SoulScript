import axios from "axios";
import { useState } from "react";

const Post = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handlePublish = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post("http://localhost:3000/api/post", {
        title,
        image,
        description,
        content,
        author,
      });

      console.log("Post created:", response.data);
      window.location.href = "/";
    } catch (error) {
      console.error("Error publishing blog:", error);
      alert("Error publishing blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-center items-center">
        <h1 className="text-2xl font-bold text-purple-700">SoulScript</h1>
      </nav>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto mt-10 bg-white shadow p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">Create a New Blog</h2>
        <form onSubmit={handlePublish} className="space-y-5">

          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              placeholder="Enter title"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Image URL</label>
            <small className="text-sm text-gray-500 italic ml-1">(upload image URL)</small>
            <input
              type="text"
              placeholder="Enter image URL"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              placeholder="Enter description"
              required
              rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">Content</label>
            <textarea
              placeholder="Enter content"
              required
              rows="6"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">Author</label>
            <input
              type="text"
              placeholder="Enter author"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
          >
            Publish
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
