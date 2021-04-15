const db = require("../models");

const index = async (req,res) =>{
  try {
    const products = await db.Product.find({})
    res.status(200).json({products})
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}

const show = async(req,res) =>{
  try {
    const product = await db.Product.findById(req.params.id)
    res.status(200).json({product})
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}

const create = async(req,res)=>{
  try {
    const user = await db.User.findById(req.body.user)
    if (!user) throw Error('User does not exist');

    const newProduct = await db.Product.create(req.body);

    user.created_products.push(newProduct._id);
    await user.save();

    res.status(201).json({product: newProduct})
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}

const update = async(req,res)=>{
  try {
    const product = await db.Product.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true})
    res.status(200).json({product}) 
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}

module.exports = {
  index,
  show,
  create,
  update,
  // destroy,
  // findById  
}