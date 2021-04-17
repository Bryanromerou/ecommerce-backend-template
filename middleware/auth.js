const jwt = require('jsonwebtoken');
const db = require("../models");

const auth = (req,res,next)=>{
  const token = req.header('x-auth-token');

  // Checking for a token
  if(!token)
      return res.status(401).json({msg:'No token, authorization denied'})
  try{
      // Will decode the token and save it to the decoded object
      const decoded = jwt.verify(token,process.env.jwtSecret);
      req.user = decoded;
      next();
  }catch(e){
      return res.status(400).json({msg:'Token is not valid'})
  }
}

const admin = async (req,res,next) =>{
    try {
        const user = await db.User.findById(req.user.id)
        if (user.role === "ADMIN"){
            console.log("You are an Admin and you are able to proceed")
            next();
        }else{
            console.log("Not an Admin")
            return res.status(401).json({msg:'User is not an admin, authorization denied'})
        }
    } catch (error) {
        return res.status(400).json({msg:error})        
    }
}

module.exports = {auth,admin};