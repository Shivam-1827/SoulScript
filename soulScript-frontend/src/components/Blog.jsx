import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/post/${slug}`);
        setBlog(res.data);
        setComments(res.data.comments || []);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    const commentData = {
      name: name || "Anonymous",
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    // Add comment to UI immediately
    setComments([commentData, ...comments]);
    setNewComment("");
    setName("");

    try {
      // Send comment to backend
      await axios.post(`http://localhost:3000/api/comment/${slug}`, commentData);

      // Generate AI response
      const aiResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant replying to blog comments." },
          { role: "user", content: commentData.text }
        ],
      }, {
        headers: {
          Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with env variable in production
          "Content-Type": "application/json"
        }
      });

      const aiText = aiResponse.data.choices[0].message.content.trim();

      const updatedComment = {
        ...commentData,
        response: aiText
      };

      // Update the comment with AI response in UI
      setComments(prev => {
        const [first, ...rest] = prev;
        return [updatedComment, ...rest];
      });

      // Optional: Save AI response to backend
      await axios.post(`http://localhost:3000/api/comment/${slug}/response`, {
        commentText: commentData.text,
        response: aiText,
      });

    } catch (err) {
      console.error("Error submitting comment or generating AI response:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!blog) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 shadow">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SoulScript</h1>
          <a href="/" className="text-sm underline hover:text-gray-200">Back to Home</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Title + Meta */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold">{blog.title}</h2>
          <p className="text-sm text-gray-600 mt-2">
            By <span className="font-semibold">{blog.author}</span> •{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Featured Image */}
        {blog.image && (
          <div className="mb-6">
            <img src={blog.image} alt="Featured" className="w-full rounded-md shadow" />
            <p className="text-xs text-gray-500 mt-2 italic text-center">(featured image)</p>
          </div>
        )}

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Social Sharing */}
        <div className="mb-10">
          <p className="text-sm text-gray-600">Share this post:</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-blue-500 hover:underline">Twitter</a>
            <a href="#" className="text-blue-700 hover:underline">Facebook</a>
            <a href="#" className="text-green-600 hover:underline">WhatsApp</a>
          </div>
        </div>

        {/* Comments Section */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Comments</h3>

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Your name (optional)"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            <textarea
              placeholder="Write a comment..."
              className="w-full p-2 border rounded h-24"
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </button>
          </form>

          {/* Show Comments */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className="border p-4 rounded-md shadow-sm">
                  <div className="text-sm font-medium">{comment.name}</div>
                  <div className="text-xs text-gray-400 mb-2">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                  <p>{comment.text}</p>

                  {comment.response && (
                    <div className="mt-4 pl-4 border-l-2 border-blue-300 bg-blue-50 text-sm rounded-md">
                      <strong className="text-blue-800">AI Response:</strong>
                      <p>{comment.response}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogPost;
