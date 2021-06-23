const expressRouter = require('express').Router;
const {signin, signup} = require('../controllers/userController');


const router = expressRouter();

router.post('/signin', signin);
router.post('/signup', signup);

module.exports = router;