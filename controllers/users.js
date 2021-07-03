const db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library')

const client = new OAuth2Client(process.env.OAuth2Client_ID)

/**
 * @route   GET /api/v1/users
 * @desc    Returns all of the users
 * @access  Public
 */
const index = async (req,res)=>{
  try {
    const users = await db.User.find({}).populate('created_products')
    res.status(200).json({users})
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
};

/**
 * @route   GET /api/v1/users/:id
 * @desc    Returns User of given ID
 * @access  Public
 */
const show = async(req,res) =>{
  try {
    const user = await db.User.findById(req.params.id).populate(['cart','created_products'])
    res.status(200).json({user})
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}

/**
 * @route   POST /v1/api/users
 * @desc    Creates and Logs in User
 * @access  Public
 */
const create = async (req,res)=>{
  const {email, password, name} = req.body;

  if (!name || !email || !password){
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await db.User.findOne({email});
    if (user) throw Error('User under this email already exist');

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(password,salt);
    if (!hash) throw Error('Something went wrong hashing the password');

    const newUser = new db.User({
      name,
      email,
      password:hash
    });

    const savedUser = await newUser.save();
    if(!savedUser) throw Error('Something went wrong trying to save the user');

    const token = jwt.sign({id: savedUser._id},process.env.jwtSecret,{ expiresIn: 86400});

    res.status(200).json({
      token,
      user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email
      }
    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/**
 * @route   POST /v1/api/users/login
 * @desc    Logs in User
 * @access  Public
 */
const login = async(req,res)=>{
  const {email, password} = req.body;

  if (!email || !password){
      return res.status(400).json({ msg: 'Please enter all fields' });
  }
  try {
    const user = await db.User.findOne({email});
    if (!user) throw Error("User does not exist");

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) throw Error("Invalid Credentials")

    const token = jwt.sign({id:user._id},process.env.jwtSecret,{ expiresIn: 86400});
    if(!token) throw Error("Could not sign Token");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * @route   POST /v1/api/users/makeAdmin
 * @desc    Once the user is logged in they can submit a post request with the secret key to make themselves admin
 * @access  Public
 */
const makeAdmin = async(req,res) =>{
  try {
    const user = await db.User.findById(req.user.id)
    if(!user) throw Error("User does not exist");
    
    if(req.body.secretKey !=process.env.secretKey) throw Error("Wrong Secret Key ");
    user.role = "ADMIN"
    const savedUser = await user.save()
    res.status(200).json({savedUser});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

/**
 * @route   POST /v1/api/users/googleLogin
 * @desc    Logs in User through Google
 * @access  Public
 */
const googleLogin = async(req,res)=>{
  try{

    console.log("Trying to login using google")
    const { tokenId } = req.body;
    const response = await client.verifyIdToken({idToken:tokenId, audience:process.env.OAuth2Client_ID});
    const {name, email, email_verified } = response.payload;

    if(email_verified){
      const user = await db.User.findOne({email}).exec()
      
      if (user){
        const token = jwt.sign({id:user._id},process.env.jwtSecret,{ expiresIn: 86400});
        if(!token) throw Error("Could not sign Token");
        res.status(200).json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
          }
        });

      }else{
        console.log("Creating new user")
        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong with bcrypt');

        const hash = await bcrypt.hash(process.env.BADPASSWORD+Date.now(),salt);
        if (!hash) throw Error('Something went wrong hashing the password');
        
        let newUser = await new db.User({
          name,
          email,
          password:hash
        });
        newUser = await newUser.save();
        const savedUser = await newUser.save();
        if(!savedUser) throw Error('Something went wrong trying to save the user');

        const token = jwt.sign({id: savedUser._id},process.env.jwtSecret,{ expiresIn: 86400});

        res.status(200).json({
          token,
          user: {
              id: savedUser.id,
              name: savedUser.name,
              email: savedUser.email,
              role: user.role,
              token
          }
        });
      }
    }
  }catch(error){
    res.status(400).json({ msg: error.message });
  }
}

/**
 * @route   POST /v1/api/users/createAdmin
 * @desc    Creates an admin off the bat
 * @access  Public
 */
//
const createAdmin = async (req,res)=> {
  const {email, password, name} = req.body;

  if (!name || !email || !password){
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await db.User.findOne({email});
    if (user) throw Error('User under this email already exist');

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(password,salt);
    if (!hash) throw Error('Something went wrong hashing the password');

    const newUser = new db.User({
      name,
      email,
      password:hash,
      role:"ADMIN"
    });

    const savedUser = await newUser.save();
    if(!savedUser) throw Error('Something went wrong trying to save the user');

    const token = jwt.sign({id: savedUser._id},process.env.jwtSecret,{ expiresIn: 86400});

    res.status(200).json({
      token,
      user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email
      }
    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

//Helper Function
const createUser = async(res,name,email,password)=>{
  try {
    
    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');
    
    const hash = await bcrypt.hash(password);
    if (!hash) throw Error('Something went wrong hashing the password');
    
    let newUser = await new db.User({
      name,
      email,
      password:hash
    });
    newUser = await newUser.save();
    const savedUser = await newUser.save();
    if(!savedUser) throw Error('Something went wrong trying to save the user');
    
    const token = jwt.sign({id: savedUser._id},process.env.jwtSecret,{ expiresIn: 86400});
    
    return res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({ msg: error.message });
  }
}

module.exports = {
  index,
  show,
  create,
  login,
  createAdmin,
  makeAdmin,
  googleLogin
  // update,
  // destroy,
}