'use strict'

const db = require('../server/db')
const {Product} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const products = await Promise.all([
    Product.create({
      name: 'Netscape',
      description: 'A really old, slow, monopolized browser',
      imageUrl:
        'https://vignette.wikia.nocookie.net/logopedia/images/2/24/Netscape_logo_1994.png/revision/latest?cb=20170823172309',
      price: 50
    }),
    Product.create({
      name: 'Geocities',
      description:
        'A place to host your homepage on the world wide web. ZOINKS!',
      imageUrl:
        'https://www.lifewire.com/thmb/Q6yIetcu-37r_B0aXu3P_X4nxWY=/640x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/geocities-57fa9de05f9b586c357e9734.jpg',
      price: 10
    }),
    Product.create({
      name: 'Angelfire',
      description:
        'A much cooler place to host your homepage on the world wide web. WOWZERS!',
      imageUrl: 'https://cdn.worldvectorlogo.com/logos/angelfire.svg',
      price: 25
    }),
    Product.create({
      name: 'Internet Explorer',
      description: 'The most forced way to access the world wide web',
      imageUrl:
        'https://vignette.wikia.nocookie.net/logopedia/images/0/03/Internet_Explorer_5_logo.png/revision/latest/scale-to-width-down/200?cb=20180319023708',
      price: 15
    })
  ])
  console.log(`seeded ${products.length} products`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed