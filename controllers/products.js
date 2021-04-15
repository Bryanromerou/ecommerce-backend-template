const db = require("../models");

/**
 * @route   GET /api/v1/products
 * @desc    Returns all of the products
 * @access  Public
 */
const index = async (req,res) =>{
  try {
    const products = await db.Product.find({})
    res.status(200).json({products})
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}

/**
 * @route   GET /api/v1/products/:id
 * @desc    Returns Product with given ID
 * @access  Public
 */
const show = async(req,res) =>{
  try {
    const product = await db.Product.findById(req.params.id)
    res.status(200).json({product})
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}

/**
 * @route   POST /api/v1/products
 * @desc    Creates Product associated with given User ID
 * @access  Public --NEED TO CHANGE SO THAT ONLY ADMINS ARE ABLE TO ADD PRODUCTS
 */
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


/**
 * @route   PUT /api/v1/products/:id
 * @desc    Edits Product
 * @access  Public --NEED TO CHANGE SO THAT ONLY ADMINS ARE ABLE TO ADD PRODUCTS
 */
const update = async(req,res)=>{
  try {
    const product = await db.Product.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true})
    res.status(200).json({product}) 
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Deletes Product from Database
 * @access  Public --NEED TO CHANGE SO THAT ONLY ADMINS ARE ABLE TO ADD PRODUCTS
 */
const destroy = async(req,res)=>{
  try {
    const productId = req.params.id;
    const deletedProduct = await db.Product.findByIdAndDelete(productId)
    const productPublisher = await db.User.findOne({'created_products':productId})
    await productPublisher.created_products.remove(productId)
    await productPublisher.save()
    res.status(200).json({deletedProduct}) 
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
}