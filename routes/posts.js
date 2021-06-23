const {getPost, createPost, updatePost, deletePost, likePost} = require('../controllers/postController')
const expressRouter = require('express').Router;

const router = expressRouter();

router.get('/', getPost);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/likePost', likePost);

module.exports = router;