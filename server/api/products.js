const express = require('express')
const router = express.Router()
const {Product} = require('../db/models')

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll()
    res.send(products)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      let err = new Error('Product not found')
      err.status = 404
      return next(err)
    }
    res.send(product)
  } catch (err) {
    next(err)
  }
})

module.exports = router