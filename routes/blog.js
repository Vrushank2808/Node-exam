const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', optionalAuth, blogController.getAllArticles);

// Protected routes
router.get('/my-articles', authenticateToken, blogController.getMyArticles);
router.get('/create', authenticateToken, requireAdmin, blogController.renderCreateForm);

// Article creation route
router.post('/create', authenticateToken, requireAdmin, upload.single('image'), blogController.createArticle);
router.get('/edit/:id', authenticateToken, requireAdmin, blogController.renderEditForm);
router.post('/edit/:id', authenticateToken, requireAdmin, upload.single('image'), blogController.updateArticle);
router.post('/delete/:id', authenticateToken, requireAdmin, blogController.deleteArticle);
router.get('/article/:id', optionalAuth, blogController.getArticleById);
router.post('/article/:id/comment', authenticateToken, blogController.addComment);

module.exports = router;
