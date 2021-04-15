const db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const index = async (req,res)=>{
  try {
    const users = await db.User.find({}).populate('created_products')
    res.status(200).json({users})
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
};
const show = async(req,res) =>{
  try {
    const user = await db.User.findById(req.params.id).populate(['cart','created_products'])
    res.status(200).json({user})
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}
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

  res.send("create")
};

module.exports = {
  index,
  show,
  create,
  // update,
  // destroy,
}