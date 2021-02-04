const router = require('express').Router();

const {getAll, postOne} = require('../controllers/userController')


router
    .route('/')
    .get(getAll)

router
    .route('/:id')
   // .get(getOne)







module.exports = router ;