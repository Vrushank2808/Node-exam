const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Get all articles (public)
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author')
            .populate('comments')
            .sort({ createdAt: -1 });

        res.render('articleList', {
            articles,
            user: req.user || null,
            title: 'All Articles'
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).render('error', {
            message: 'Error fetching articles'
        });
    }
};

// Get user's articles
const getMyArticles = async (req, res) => {
    try {
        const articles = await Article.find({ author: req.user.userId })
            .populate('author')
            .populate('comments')
            .sort({ createdAt: -1 });

        res.render('myArticles', {
            articles,
            user: req.user,
            title: 'My Articles'
        });
    } catch (error) {
        console.error('Error fetching user articles:', error);
        res.status(500).render('error', {
            message: 'Error fetching your articles'
        });
    }
};

// Render create article form
const renderCreateForm = (req, res) => {
    res.render('articleForm', {
        article: null,
        user: req.user,
        title: 'Create New Article',
        action: '/create'
    });
};

// Create new article
const createArticle = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const author = req.user.userId;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).render('articleForm', {
                article: req.body,
                user: req.user,
                title: 'Create New Article',
                action: '/create',
                error: 'Title and content are required'
            });
        }

        const article = new Article({
            title,
            content,
            author,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
            image: req.file ? `/uploads/${req.file.filename}` : null
        });

        await article.save();

        // Add article to user's articles array
        await User.findByIdAndUpdate(
            req.user.userId,
            { $push: { articles: article._id } }
        );

        res.redirect('/my-articles');
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).render('articleForm', {
            article: null,
            user: req.user,
            title: 'Create New Article',
            action: '/create',
            error: 'Error creating article. Please try again.'
        });
    }
};

// Render edit article form
const renderEditForm = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).render('error', {
                message: 'Article not found'
            });
        }

        // Check if user owns the article
        if (article.author.toString() !== req.user.userId) {
            return res.status(403).render('error', {
                message: 'You can only edit your own articles'
            });
        }

        res.render('articleForm', {
            article,
            user: req.user,
            title: 'Edit Article',
            action: `/edit/${article._id}`
        });
    } catch (error) {
        console.error('Error fetching article for edit:', error);
        res.status(500).render('error', {
            message: 'Error fetching article'
        });
    }
};

// Update article
const updateArticle = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).render('error', {
                title: 'Article Not Found',
                message: 'The article you are trying to edit does not exist.'
            });
        }

        // Check if user owns the article
        if (article.author.toString() !== req.user.userId) {
            return res.status(403).render('error', {
                title: 'Access Denied',
                message: 'You can only edit your own articles.'
            });
        }

        // Validate required fields
        if (!title || !content) {
            return res.status(400).render('articleForm', {
                article: { ...article.toObject(), title, content, tags },
                user: req.user,
                title: 'Edit Article',
                action: `/edit/${article._id}`,
                error: 'Title and content are required'
            });
        }

        let imageUrl = article.image;

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Update article fields
        article.title = title;
        article.content = content;
        article.tags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
        article.image = imageUrl;
        article.updatedAt = Date.now();

        await article.save();
        res.redirect('/my-articles');
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).render('articleForm', {
            article: null,
            user: req.user,
            title: 'Edit Article',
            action: `/edit/${req.params.id}`,
            error: 'Error updating article. Please try again.'
        });
    }
};

// Delete article
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).render('error', {
                message: 'Article not found'
            });
        }

        // Check if user owns the article
        if (article.author.toString() !== req.user.userId) {
            return res.status(403).render('error', {
                message: 'You can only delete your own articles'
            });
        }

        // Delete associated comments
        await Comment.deleteMany({ article: article._id });

        // Remove article from user's articles array
        await User.findByIdAndUpdate(
            req.user.userId,
            { $pull: { articles: article._id } }
        );

        // Delete the article
        await Article.findByIdAndDelete(req.params.id);

        res.redirect('/my-articles');
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).render('error', {
            message: 'Error deleting article'
        });
    }
};

// Get single article by ID
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            });

        if (!article) {
            return res.status(404).render('error', {
                message: 'Article not found'
            });
        }

        res.render('articleItem', {
            article,
            user: req.user || null,
            title: article.title
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).render('error', {
            message: 'Error fetching article'
        });
    }
};

// Add comment to article
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const articleId = req.params.id;

        const comment = new Comment({
            content,
            author: req.user.userId,
            article: articleId
        });

        await comment.save();

        // Add comment to article
        await Article.findByIdAndUpdate(
            articleId,
            { $push: { comments: comment._id } }
        );

        res.redirect(`/article/${articleId}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.redirect(`/article/${req.params.id}`);
    }
};

module.exports = {
    getAllArticles,
    getMyArticles,
    renderCreateForm,
    createArticle,
    renderEditForm,
    updateArticle,
    deleteArticle,
    getArticleById,
    addComment
};
