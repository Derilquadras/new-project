const UserSchema= require('../models/userModel')
const {registerValidation, loginValidation} = require('../controllers/validateUser')


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.createOne = async(req,res)=>{

 const {error} = registerValidation(req.body);
 if(error) return res.status(400).json(error.details[0].message)

//if User exist
    const userExist = await UserSchema.findOne({email:req.body.email})    
    if(userExist) return res.status(400).json({message:'Email already exists'})

//hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)


    const user =  new UserSchema({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
            profilePicture:req.body.profilePicture,
            phoneNumber:req.body.phoneNumber,
            skills:req.body.skills,
            role:req.body.role,
            active:req.body.active,
            description:req.body.description

    });
    try{
        const savedusers = await user.save()
        res.status(201).json({staus:"success",data:savedusers});

    }catch(err){
        res.status(400).send({message: err})

    }
}

exports.getAll = async (req,res)=>{
    try{
         const { page = 1, limit = 10 } = req.query;

        const count = await UserSchema.countDocuments();
        const users = await UserSchema.find()
                  .sort(req.query.sort)
                .limit(limit * 1)
                .skip((page -1) * limit)
        res.status(200).json({status:"success",limit:limit,currentPage: page,count:count,data:users }) 
        
      
    }catch(err){
        res.status(400).json({message: err})
    }
}

exports.login =  async(req,res)=>{

    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    //if User doesnt exist
    const user = await UserSchema.findOne({email:req.body.email})    
    if(!user) return res.status(400).send('Email or password is wrong')

    //password is correct
    const validPass = await bcrypt.compare(req.body.password,user.password)
    if(!validPass) return res.status(400).send('Email or password is wrong')

    //create and assign a token
    const token = jwt.sign({_id: user._id },process.env.TOKEN_SECRET,{expiresIn:"3d"})
    res.header('auth-token',token).status(200).send(`${token} loggen in successfully`)
 
}

exports.register = async(req,res)=>{

    const {error} = registerValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message)
   
   //if User exist
       const userExist = await UserSchema.findOne({email:req.body.email})    
       if(userExist) return res.status(400).json({message:'Email already exists'})
   
   //hash the password
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(req.body.password, salt)
   
   
       const user =  new UserSchema({
               name:req.body.name,
               email:req.body.email,
               password:hashedPassword,
               profilePicture:req.body.profilePicture,
               phoneNumber:req.body.phoneNumber,
               skills:req.body.skills,
               role:req.body.role,
               active:req.body.active,
               description:req.body.description
   
       });
       try{
           const savedusers = await user.save()
           res.status(201).json({staus:"success",data:savedusers});
   
       }catch(err){
           res.status(400).send({message: err})
   
       }
   }
   