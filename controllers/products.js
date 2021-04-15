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

module.exports = {
  index,
  show,
  // create,
  // update,
  // destroy,
  // findById  
}