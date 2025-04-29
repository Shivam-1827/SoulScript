# SoulScript

SoulScript is a modern, full-stack blog platform that features AI-powered comment responses to enhance user engagement. The platform allows users to create, read, and interact with blog posts through a clean, intuitive interface.

Live Demo: [https://soulscript-iota.vercel.app/](https://soulscript-iota.vercel.app/)

![SoulScript Screenshot](https://i.imgur.com/your-screenshot-url.png) <!-- Replace with an actual screenshot of your application -->

## Features

- **Blog Creation**: Users can easily create new blog posts with titles, descriptions, content, and featured images
- **Responsive Design**: Clean, modern UI that works across devices
- **AI-Powered Comments**: Automated AI responses to user comments using Google's Gemini 1.5 Flash model
- **Real-time Comment System**: Instant feedback with loading indicators for AI responses
- **Markdown Support**: Rich text formatting for blog content
- **Slug-based URLs**: SEO-friendly URL structure

## Technology Stack

### Frontend
- React.js with React Router for client-side routing
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose for data modeling
- Google Gemini API for AI-powered responses

## Project Structure

```
soulscript/
├── soulScript-backend/      # Backend Node.js application
│   ├── db.js                # Database models and schemas
│   ├── dbConnect.js         # Database connection setup
│   ├── index.js             # Express server and API routes
│   └── .env                 # Environment variables (not included in repo)
├── soulScript-frontend/     # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx     # Homepage component
│   │   │   ├── Blog.jsx     # Blog post display component
│   │   │   └── Post.jsx     # Blog creation component
│   │   └── App.jsx          # Main application component
```

## Setup Instructions

### Prerequisites
- Node.js and npm
- MongoDB instance (local or Atlas)
- Google Gemini API key

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory: `cd soulScript-backend`
3. Install dependencies: `npm install`
4. Create a `.env` file with the following variables:
   ```
   PORT=3000
   DATABASE_URL=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. Start the server: `npm start`

### Frontend Setup
1. Navigate to the frontend directory: `cd soulScript-frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application should now be running at `http://localhost:5173`

## API Endpoints

- `GET /api/posts` - Get all blog posts
- `GET /api/post/:slug` - Get a specific blog post by slug
- `POST /api/post` - Create a new blog post
- `POST /api/comment` - Add a comment to a blog post (triggers AI response)

## Deployment

The application is deployed on Vercel at [https://soulscript-iota.vercel.app/](https://soulscript-iota.vercel.app/).

### Deployment Instructions
1. Deploy the backend to a service like Heroku, Render, or Railway
2. Update the API base URL in the frontend code
3. Deploy the frontend to Vercel:
   - Connect your GitHub repository to Vercel
   - Configure build settings
   - Deploy

## Future Enhancements

- User authentication and profiles
- Rich text editor for blog content
- Comment threading and replies
- Social sharing options
- Enhanced AI interactions
- Search functionality
- Categories and tags

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
