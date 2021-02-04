
const Joi = require('@hapi/joi')

const registerValidation = data =>{
    const schema = Joi.object({
        name:Joi.string().required().min(3).max(30),
        email:Joi.string().email().required(),
        password:Joi.string().min(6).required(),
        profilePicture:Joi.string(),
        phoneNumber:Joi.number().min(10),
        skills:Joi.string(),
        role:Joi.string(),
        active:Joi.boolean(),
        description:Joi.string()
    })
    return schema.validate(data)
}
    
    
const loginValidation = data =>{
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(6).required()
                    
    })
    return schema.validate(data)
}



module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation