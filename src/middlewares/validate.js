
const { validationResult } = require('express-validator');
const validate = (req, res , next) =>{
   let result =  validationResult(req);
   if(!result.isEmpty()){
    return res.status(400).json({errors : result.array()})
   }
   next();
}

module.exports={validate}