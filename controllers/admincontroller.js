const UserSchema= require('../models/userModel')
const {registerValidation, loginValidation} = require('../controllers/validateUser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { on } = require('../models/userModel')
//const { catch } = require('../connection')

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

   exports.deactivate = async (req, res) => {
    try {
        await UserSchema.findByIdAndUpdate(req.params.id, {
            active: false
        });

        res.status(204).json({
            status: "success",
            data: null
        });


    } catch (error) {
        res.status(400).send({message: err})
    }
};


exports.searchUser = async(req,res)=>{
    try{
         const { page = 1, limit = 10 } = req.query;
         const users = await UserSchema.find({
                 name: { $regex: req.query.str, $options: "$i" },
               }).sort(req.query.sort)
                 .limit(limit * 1)
                 .skip((page -1) * limit)
           
        
        res.status(200).json
        ({
            status:'success',data:{
                limit :limit,
                count: UserSchema.length,
                users,
                totalPages: Math.ceil(count / limit),
                currentPage: page
        }});
    }catch(err){
        res.status(500).json({message: err})
    }
}

exports.chartData = async (req,res)=>{
    try{
        //const doc = await UserSchema.find().select('-_id skills ')
        const doc = await UserSchema.find()
        
        //const hasAdmin = doc.map(user => user.skillfilter((us)=>us=="node.js"))
        // const hasAdmin = doc.map(ob =>ob.skills).filter(us=>us=="node.js")
        
        const node = doc.filter((item) => {
            const filter = 'node.js';
            return (item.skills.indexOf(filter) >= 0);
        });
        const mongodb = doc.filter((item) => {
            const filter = "mongodb";
            return (item.skills.indexOf(filter) >= 0);
        });
        const vue = doc.filter((item) => {
            const filter = "vue.js";
            return (item.skills.indexOf(filter) >= 0);
        });
        const c = doc.filter((item) => {
            const filter = "c";
            return (item.skills.indexOf(filter) >= 0);
        });
        const sql = doc.filter((item) => {
            const filter = "sql";
            return (item.skills.indexOf(filter) >= 0);
        });
 
    //    res.status(200).json({
    //     status:'success',data:{
    //         node :node.length,
    //         mongodb: mongodb.length,
    //         vue:vue.length,
    //         c:c.length,
    //         sql:sql.length
    // }})
        res.render('dashboard',{node: node.length,mongodb:mongodb.length,vue:vue.length,c:c.length,sql:sql.length})

    }catch(error){
        console.log(error)
    }
    
}