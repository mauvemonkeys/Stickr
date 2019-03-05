/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const session = require('supertest-session')
const db = require('../db')
const app = require('../index')
const User = db.model('user')

describe('auth routes', () => {
  const Henry = {
    email: 'HenryGod@gmail.com'.toLowerCase(),
    password: '666',
    firstName: 'Henry',
    lastName: 'God',
    phone: '66612357'
  }
  beforeEach(async () => {
    await db.sync({force: true})
    return User.create(Henry)
  })

  describe('/auth/login', () => {
    it('POST /auth/login logs in user successfully', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({email: 'HenryGod@gmail.com'.toLowerCase(), password: '666'})
        .expect(200)

      console.log(res.body)
      expect(res.body).to.be.an('object')
      expect(res.body.id).to.be.equal(1)
      expect(res.body.email).to.be.equal(Henry.email)
      expect(res.body).to.deep.include({
        email: 'HenryGod@gmail.com'.toLowerCase(),
        firstName: 'Henry',
        lastName: 'God',
        phone: '66612357'
      })
    })

    it('POST /auth/login does not log in user with incorrect password', async () => {
      await request(app)
        .post('/auth/login')
        .send({email: 'HenryGod@gmail.com'.toLowerCase(), password: '6666'})
        .expect(401)
    })

    it("POST /auth/login does not log in user that doesn't exist", async () => {
      await request(app)
        .post('/auth/login')
        .send({
          email: 'AbbeyMondshein@gmail.com'.toLowerCase(),
          password: 'sdfsdfsfd'
        })
        .expect(401)
    })
  })

  describe('/auth/signup', () => {
    const Ross = {
      email: 'ross@gmail.com',
      password: '555',
      firstName: 'Ross',
      lastName: 'Sicherman',
      phone: '66612357'
    }

    it('POST /auth/signup signs up user successfully', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send(Ross)
        .expect(200)

      expect(res.body).to.be.an('object')
      expect(res.body.id).to.be.equal(2)
      expect(res.body.email).to.be.equal(Ross.email)
      expect(res.body).to.deep.include({
        email: 'ross@gmail.com',
        firstName: 'Ross',
        lastName: 'Sicherman',
        phone: '66612357'
      })
    })

    it('POST /auth/signup does not sign up user with email that exists in database for another user', async () => {
      await request(app)
        .post('/auth/signup')
        .send(Henry)
        .expect(401)
    })
  })

  describe('/auth/me', () => {
    it('GET /auth/me returns logged in user', async () => {
      const sessionApp = session(app)
      await sessionApp
        .post('/auth/login')
        .send({email: 'HenryGod@gmail.com'.toLowerCase(), password: '666'})

      const res = await sessionApp.get('/auth/me').expect(200)

      expect(res.body).to.be.an('object')
      expect(res.body.id).to.be.equal(1)
      expect(res.body.email).to.be.equal(Henry.email)
      expect(res.body).to.deep.include({
        email: 'HenryGod@gmail.com'.toLowerCase(),
        firstName: 'Henry',
        lastName: 'God',
        phone: '66612357'
      })
    })
  })

  describe('/auth/blahblah', () => {
    it('GET /auth/blahblah returns 404', async () => {
      await request(app)
        .get('/auth/blahblah')
        .expect(404)
    })
  })
})
