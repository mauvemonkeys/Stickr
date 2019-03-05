const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

const verifyUser = (req, res, next) => {
  if (req.params.id && (!req.user || Number(req.params.id) !== req.user.id)) {
    let err = new Error('Forbidden')
    err.status = 403
    return next(err)
  }
  next()
}

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:id/edit', verifyUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!req.body.password || !req.body.password.trim()) {
      delete req.body.password
    }
    const updatedUser = await user.update(req.body)
    await updatedUser.save()
    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone || null
    })
    res.json({
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone
    })
  } catch (error) {
    next(error)
  }
})
