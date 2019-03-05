const express = require('express')
const router = express.Router()
const {Product, Order} = require('../db/models')
const stripe = require('stripe')('sk_test_PpLkvdYD7mbL5j0o8QWpRtST')

module.exports = router

router.param('userId', (req, res, next, userId) => {
  if (Number(userId) !== req.user.id) {
    let err = new Error('Forbidden')
    err.status = 403
    return next(err)
  }
  next()
})

router.get('/:userId', async (req, res, next) => {
  try {
    const orderLines = await Order.findAll({
      where: {userId: req.params.userId, orderStatus: false},
      include: [{model: Product}]
    })
    res.send(orderLines)
  } catch (err) {
    next(err)
  }
})

router.post('/:userId', async (req, res, next) => {
  try {
    const {cart} = req.body
    const orderPromises = []
    cart.forEach(cl => {
      orderPromises.push(
        Order.create({
          productId: cl.productId,
          userId: req.params.userId,
          itemQuantity: cl.itemQuantity
        })
      )
    })

    await Promise.all(orderPromises)

    const cartWithProductDetail = await Order.findAll({
      where: {userId: req.params.userId, orderStatus: false},
      include: [{model: Product}]
    })

    res.send(cartWithProductDetail)
  } catch (err) {
    next(err)
  }
})

// Product detail and or update quantity in cart
router.put('/:userId/products/:productId/:from', async (req, res, next) => {
  try {
    const result = await Order.findOrCreate({
      where: {
        userId: req.params.userId,
        orderStatus: false,
        productId: req.params.productId
      },
      defaults: {itemQuantity: req.body.itemQuantity},
      include: [{model: Product}]
    })

    let orderLine = result[0]
    const created = result[1]

    if (!created) {
      if (req.params.from === 'product') {
        orderLine.itemQuantity += req.body.itemQuantity
      } else if (req.params.from === 'cart') {
        orderLine.itemQuantity = req.body.itemQuantity
      }
      orderLine = await orderLine.save()
    } else {
      const product = await orderLine.getProduct()
      orderLine.dataValues.product = product
    }
    res.status(created ? 201 : 200).send({created, orderLine})
  } catch (err) {
    next(err)
  }
})

//Pay for Items
router.post('/:userId/charge', async (req, res, next) => {
  const orderLines = await Order.findAll({
    where: {
      orderStatus: false,
      userId: req.params.userId
    },
    include: [{model: Product}]
  })

  const orderTotal = orderLines.reduce((total, line) => {
    return total + line.itemQuantity * Number(line.product.price)
  }, 0)

  //try {
  let {status} = await stripe.charges.create({
    amount: orderTotal * 100,
    currency: 'usd',
    description: 'An example charge',
    source: req.body.token
  })

  res.json({status})
  //} catch (err) {
  //res.sendStatus(500)
  //}
})

//Checkout Items
router.put('/:userId/checkout', async (req, res, next) => {
  try {
    await Order.update(
      {
        orderStatus: true,
        orderTS: Date.now()
      },
      {
        where: {userId: req.params.userId, orderStatus: false}
      }
    )
    const orders = await Order.findAll({
      where: {userId: req.params.userId},
      include: [{model: Product}]
    })
    orders.map(order => {
      order.orderPrice = order.product.price
      order.save()
    })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/history', async (req, res, next) => {
  try {
    const orderLines = await Order.findAll({
      where: {userId: req.params.userId, orderStatus: true},
      include: [{model: Product}]
    })
    orderLines.map(order => {
      order.orderPrice = order.product.price
      order.dataValues.total = order.product.price * order.itemQuantity
    })

    res.send(orderLines)
  } catch (err) {
    next(err)
  }
})

// Product delete
router.delete('/:userId/products/:productId', async (req, res, next) => {
  try {
    await Order.destroy({
      where: {
        userId: req.params.userId,
        orderStatus: false,
        productId: req.params.productId
      }
    })
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
