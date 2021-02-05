const router = require('express').Router();
const verify = require('../controllers/verifyToken');
const {getAll, createOne, deactivate} = require('../controllers/admincontroller')
const { login, register} = require('../controllers/userController')
const upload = require('../middlewears/imageUpload');
const adminController = require('../controllers/admincontroller')




router.post('/login', login);
router.post('/register', upload.single('profilePicture'), register);


router.use(verify.protect)


// Only admin have permission to access for the below APIs 
router.use(verify.restrictTo('admin'));


router
    .route('/')
    .get(getAll)
    .post(upload.single('profilePicture'),createOne);



router.delete('/:id', deactivate)
router.use(verify.restrictTo('admin'));





module.exports = router ;