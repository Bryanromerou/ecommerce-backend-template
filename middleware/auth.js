const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
  const token = req.header('x-auth-token');

  // Checking for a token
  if(!token)
      return res.status(401).json({msg:'No token, authorization denied'})

  try{
      // Will decode the token and save it to the decoded object
      const decoded = jwt.verify(token, config.get('jwtSecret'));
      req.user = decoded;
      next();
  }catch(e){
      return res.status(400).json({msg:'Token is not valid'})
  }
}

module.exports = auth;