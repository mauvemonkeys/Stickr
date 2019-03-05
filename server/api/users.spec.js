/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')

describe('User routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/users/', () => {
    const Henry = {
      email: 'HenryGod@gmail.com'.toLowerCase(),
      password: '666',
      firstName: 'Henry',
      lastName: 'God',
      phone: '66612357'
    }

    beforeEach(() => {
      return User.create({
        email: 'HenryGod@gmail.com'.toLowerCase(),
        password: '666',
        firstName: 'Henry',
        lastName: 'God',
        phone: '66612357'
      })
    })

    it('GET /api/users/:id', async () => {
      const res = await request(app)
        .get('/api/users/1')
        .expect(200)

      expect(res.body).to.be.an('object')
      expect(res.body.email).to.be.equal(Henry.email)
      expect(res.body).to.deep.include({
        email: 'HenryGod@gmail.com'.toLowerCase(),
        firstName: 'Henry',
        lastName: 'God',
        phone: '66612357'
      })
    })
    // TODO: Add supertest session
    /*
    it('PUT /api/users/:id/edit', async () => {
      const updateInfo = {
        email: 'gut@gmail.com',
        password: '888',
        firstName: 'Chao',
        lastName: 'Dog',
        phone: 888888888
      }
      const res = await request(app)
        .put('/api/users/1/edit')
        .send(updateInfo)
        .expect(200)

      expect(res.body).to.be.an('object')
      expect(res.body.email).to.be.equal(updateInfo.email)
      expect(res.body).to.deep.include({
        email: 'gut@gmail.com',
        firstName: 'Chao',
        lastName: 'Dog',
        phone: 888888888
      })
    })
    */
    it('POST /api/users', async () => {
      const newUser = {
        email: 'boss@gmail.com',
        password: '999',
        firstName: 'Dog',
        lastName: 'Chao',
        phone: '99999999'
      }
      const res = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200)

      expect(res.body).to.be.an('object')
      expect(res.body.email).to.be.equal(newUser.email)
      expect(res.body).to.deep.include({
        email: 'boss@gmail.com',
        firstName: 'Dog',
        lastName: 'Chao',
        phone: '99999999'
      })
    })
  })
})
