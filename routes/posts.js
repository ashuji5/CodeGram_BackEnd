const {getPost, createPost, updatePost, deletePost, likePost, getUserPost, commentPost} = require('../controllers/postController')
const expressRouter = require('express').Router;
const auth = require("../middleware/auth");
const router = expressRouter();

router.get('/',auth, getPost);
router.post('/', auth, createPost);
router.get('/:id', auth, getUserPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/comment',  commentPost);

module.exports = router;