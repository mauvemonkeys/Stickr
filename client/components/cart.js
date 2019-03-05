import React, {Component} from 'react'
import CartLine from './cartLine'
import {connect} from 'react-redux'
import axios from 'axios'
import {clearCart} from '../store/cart'
import {Elements, StripeProvider} from 'react-stripe-elements'
import CheckoutForm from './checkoutForm'

class Cart extends Component {
  constructor() {
    super()

    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick() {
    this.props.history.push('/checkedout')
    await axios.put(`/api/orders/${this.props.user.id}/checkout`)
    this.props.checkoutOrders()
  }

  render() {
    const {user, history} = this.props

    return (
      <div id="cart">
        <h2>Cart</h2>
        <ul>
          {this.props.cart.map(cl => <CartLine key={cl.id} cartLine={cl} />)}
        </ul>
        <div>
          Total:{' '}
          {this.props.cart.reduce(
            (total, cartLine) =>
              total + cartLine.product.price * cartLine.itemQuantity,
            0
          )}{' '}
        </div>
        <div>
          <StripeProvider apiKey="pk_test_QorOLkP9hIdDgJ1rJICv33A8">
            <Elements>
              <CheckoutForm user={this.props.user} />
            </Elements>
          </StripeProvider>
        </div>
        <div>
          {user.id ? (
            <button type="button" onClick={this.handleClick}>
              CHECKOUT
            </button>
          ) : (
            <button type="button" onClick={() => history.push('/login')}>
              CHECKOUT
            </button>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  checkoutOrders: () => dispatch(clearCart())
})

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
