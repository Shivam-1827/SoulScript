import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/api/posts');
        
        const sorted = response.data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        setIsLoading(false);
        setBlogs(sorted);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">SoulScript</h1>
        <Link 
          to="/post"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition">
          Create New Blog
        </Link>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {blogs.length > 0 ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
                <p className="text-gray-600 mt-2">{blog.description}</p>
                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-block mt-4 text-purple-700 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <h2 className="text-center text-xl font-medium text-gray-500">No Blogs Found</h2>
        )}
      </div>
    </div>
  );
};

export default Home;