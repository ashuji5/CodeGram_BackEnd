const {getPost, createPost, updatePost, deletePost, likePost, getUserPost, commentPost, followUser, getFriend, unFollowUser, getUser, getDoubt, getDoubtById, postDoubt, postAnswer} = require('../controllers/postController')
const expressRouter = require('express').Router;
const auth = require("../middleware/auth");
const router = expressRouter();

router.get('/',auth, getPost);
router.post('/', auth, createPost);
router.get('/:id', auth, getUserPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/comment',auth,  commentPost);
router.put('/:id/follow',auth, followUser );
router.put('/:id/unfollow', auth,unFollowUser );
router.get('/profile/:username', getUser);
router.get('/friends/:userId', getFriend);
router.get('/doubt', auth, getDoubt)
router.get('/doubt/:id',auth, getDoubtById)
router.post('/doubt',auth, postDoubt);
router.post('doubt/:id',auth,postAnswer )


module.exports = router;