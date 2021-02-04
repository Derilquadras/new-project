const router = require('express').Router();
const verify = require('../middlewears/verifyToken');
const {getAll, createOne, login, register} = require('../controllers/userController')
const upload = require('../middlewears/imageUpload');

router
    .route('/')
    .get(getAll)
    .post(upload.single('profilePicture'),createOne);

// router
//     .route('/:id')
//    // .get(getOne)

router.post('/login',login)
router.post('/register',register)







module.exports = router ;