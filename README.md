# BlogApp - Full-Stack Blog Application

A modern, full-featured blog application built with Node.js, Express, MongoDB, and JWT authentication.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Admin/User)
- Secure password hashing with bcryptjs
- Protected routes and middleware

### 📝 Blog Management
- Create, read, update, and delete articles
- User-specific article management
- Tag system for categorizing articles
- Comment system for user engagement

### 👥 Multi-user Support
- User registration and login
- Personal article dashboard
- Author attribution for articles and comments

### 🎨 Modern UI/UX
- Responsive design for all devices
- Glassmorphism theme with gradient backgrounds
- Clean, modern interface
- Smooth animations and transitions

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Template Engine**: EJS
- **Styling**: Custom CSS with modern design principles
- **Security**: bcryptjs for password hashing, cookie-parser for secure cookies

## Installation & Setup

1. **Clone the repository**
   ```bash
   cd "Node exam"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system (default: mongodb://localhost:27017)

4. **Run the application**
   ```bash
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── blogController.js    # Blog CRUD operations
├── middleware/
│   └── auth.js             # JWT verification middleware
├── models/
│   ├── User.js             # User model with roles
│   ├── Article.js          # Article model
│   └── Comment.js          # Comment model
├── routes/
│   ├── auth.js             # Authentication routes
│   └── blog.js             # Blog routes
├── views/
│   ├── partials/
│   │   ├── head.ejs        # HTML head partial
│   │   └── navbar.ejs      # Navigation bar
│   ├── articleList.ejs     # All articles page
│   ├── myArticles.ejs      # User's articles page
│   ├── articleForm.ejs     # Create/edit article form
│   ├── articleItem.ejs     # Single article view
│   ├── login.ejs           # Login page
│   ├── register.ejs        # Registration page
│   └── error.ejs           # Error page
├── public/
│   └── css/
│       └── style.css       # Custom styles
├── package.json
├── server.js               # Main server file
└── README.md
```

## API Routes

### Authentication Routes
- `GET /auth/login` - Login page
- `GET /auth/register` - Registration page
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Blog Routes
- `GET /` - All articles (public)
- `GET /my-articles` - User's articles (protected)
- `GET /create` - Create article form (protected)
- `POST /create` - Create new article (protected)
- `GET /edit/:id` - Edit article form (protected)
- `POST /edit/:id` - Update article (protected)
- `POST /delete/:id` - Delete article (protected)
- `GET /article/:id` - Single article view
- `POST /article/:id/comment` - Add comment (protected)

## User Roles

### Regular User
- Create, edit, and delete their own articles
- View all articles
- Comment on articles
- Manage their profile

### Admin
- All user permissions
- Additional administrative privileges
- Special admin badge in navigation

## Security Features

- Password hashing with bcryptjs
- JWT tokens stored in HTTP-only cookies
- Protected routes with authentication middleware
- Role-based access control
- Input validation and sanitization

## Database Schema

### User Model
- username (unique)
- email (unique)
- password (hashed)
- role (admin/user)
- articles (array of article references)

### Article Model
- title
- content
- author (user reference)
- tags (array of strings)
- comments (array of comment references)
- timestamps

### Comment Model
- content
- author (user reference)
- article (article reference)
- timestamps

## Getting Started

1. Register a new account or login with existing credentials
2. Browse all articles on the homepage
3. Create your first article using the "Write Article" button
4. Manage your articles from the "My Articles" page
5. Engage with other users by commenting on articles

## Development

To run in development mode with auto-restart:
```bash
npm install -g nodemon
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
