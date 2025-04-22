import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponseLoading, setAiResponseLoading] = useState(false);
  const [tempComment, setTempComment] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/post/${slug}`);
        setBlog(res.data);
        if (res.data.comments) {
          setComments(res.data.comments);
        }
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

    try {
      const tempCommentObj = {
        _id: `temp-${Date.now()}`,
        name: name || "Anonymous",
        text: newComment,
        createdAt: new Date().toISOString(),
        responses: [],
        isTemp: true
      };
      
      setComments(prevComments => [tempCommentObj, ...prevComments]);
      setTempComment(tempCommentObj);
      
      setNewComment("");
      setName("");
      
      setAiResponseLoading(true);
      
      const response = await axios.post("http://localhost:3000/api/comment", {
        blog: blog._id,
        name: tempCommentObj.name,
        text: tempCommentObj.text
      });
      
      setComments(prevComments => 
        prevComments
          .filter(c => c._id !== tempCommentObj._id)
          .concat([response.data])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      
      setTempComment(null);
      setAiResponseLoading(false);
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to submit comment. Please try again.");
      
      if (tempComment) {
        setComments(prevComments => prevComments.filter(c => c._id !== tempComment._id));
        setTempComment(null);
      }
      
      setAiResponseLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!blog) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Header */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">SoulScript</h1>
        <Link 
          to="/"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition">
          Back to Home
        </Link>
      </nav>        

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Title + Meta */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold">{blog.title}</h2>
          <p className="text-sm text-gray-600 mt-2">
            By <span className="font-semibold">{blog.author}</span> •{" "}
            {new Date(blog.publishedAt).toLocaleDateString()}
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
                <div key={comment._id || index} className="border p-4 rounded-md shadow-sm">
                  <div className="text-sm font-medium">{comment.name}</div>
                  <div className="text-xs text-gray-400 mb-2">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                  <p>{comment.text}</p>

                  {/* AI Response Loading Indicator */}
                  {comment.isTemp && aiResponseLoading && (
                    <div className="mt-4 pl-4 border-l-2 border-blue-300 bg-blue-50 text-sm rounded-md p-3">
                      <div className="flex items-center">
                        <span className="font-semibold text-blue-800">SoulScript AI:</span>
                        <div className="ml-2 flex space-x-1">
                          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Display AI responses if available */}
                  {comment.responses && comment.responses.length > 0 && 
                    comment.responses.map((response, idx) => (
                      <div key={idx} className="mt-4 pl-4 border-l-2 border-blue-300 bg-blue-50 text-sm rounded-md p-3">
                        <strong className="text-blue-800">{response.responderName || "SoulScript AI"}:</strong>
                        <p>{response.text}</p>
                      </div>
                    ))
                  }
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