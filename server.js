const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const ensureDirs = require('./utils/ensureDirs');

// Ensure all required directories exist on startup
ensureDirs();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static folder setup
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// MongoDB Connection
const dbURI = 'mongodb://localhost:27017/blog';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
    .catch(err => console.log('Database connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const { checkUser } = require('./middleware/auth');

app.use('/auth', authRoutes);
app.use('/', blogRoutes);

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/articles');
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
