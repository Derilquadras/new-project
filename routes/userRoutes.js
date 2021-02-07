const router = require('express').Router();
const verify = require('../controllers/verifyToken');
const {getAll, createOne, deactivate, searchUser,chartData} = require('../controllers/admincontroller')
const { login, register} = require('../controllers/userController')
const upload = require('../middlewears/imageUpload');
const adminController = require('../controllers/admincontroller')




router.post('/login', login);
router.post('/register', upload.single('profilePicture'), register);


router.get('/dashboard',chartData)
router.use(verify.protect)


//only for admin for whatever below
router.use(verify.restrictTo('admin'));


router
    .route('/')
    .get(getAll)
    .post(upload.single('profilePicture'),createOne);



router.get('/search',searchUser)
router.delete('/:id', deactivate)
router.use(verify.restrictTo('admin'));





module.exports = router ;