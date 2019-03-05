const router = require('express').Router()
const {User, Product} = require('../db/models')
module.exports = router

router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.findAll()
    res.send(products)
  } catch (err) {
    next(err)
  }
})

router.put('/products/:productId', async (req, res, next) => {
  try {
    const product = await Product.findOne({where: {id: req.params.productId}})
    await product.update(req.body)
    res.send(product)
  } catch (err) {
    next(err)
  }
})
