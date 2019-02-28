import React, {Component} from 'react'
import axios from 'axios'

export default class SingleProduct extends Component {
  constructor() {
    super()
    this.state = {
      product: {},
      user: {},
      itemQuantity: 1
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.increment = this.increment.bind(this)
    this.decrement = this.decrement.bind(this)
  }

  async componentDidMount() {
    const productId = this.props.match.params.productId
    const {data: product} = await axios.get(`/api/products/${productId}`)
    const {data: user} = await axios.get('/auth/me')
    this.setState({product, user})
  }

  async handleSubmit(evt) {
    evt.preventDefault()
    console.log('clicked')
    const productId = this.props.match.params.productId
    const userId = this.state.user.id
    // console.log('+++==========>', this.state.product, '====', productId, '===userId', userId)
    const newOrder = {
      ...this.state.product,
      itemQuantity: this.state.itemQuantity
    }

    await axios.post(`/api/orders/${userId}/product/${productId}`, newOrder)
  }

  handleChange(evt) {
    console.log(evt.target.value)

    this.setState({
      itemQuantity: evt.target.value
    })
  }

  increment() {
    this.setState({
      itemQuantity: this.state.itemQuantity + 1
    })
  }

  decrement() {
    if (this.state.itemQuantity > 1) {
      this.setState({
        itemQuantity: this.state.itemQuantity - 1
      })
    }
  }

  render() {
    const {name, imageUrl, price, description} = this.state.product
    return (
      <div className="single-product-div">
        <div className="row-gap">
          <h1>{name}</h1>
        </div>
        <div className="row-gap">
          <img src={imageUrl} />
        </div>
        <div className="row-gap">${price}</div>
        <div className="row-gap">{description}</div>
        <div>{this.state.itemQuantity}</div>
        <button onClick={() => this.decrement()}>-</button>
        <button onClick={() => this.increment()}>+</button>
        <br />
        <button type="submit" onClick={this.handleSubmit}>
          Add to cart
        </button>
      </div>
    )
  }
}
