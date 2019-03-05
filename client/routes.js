import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  EditUser,
  ProductList,
  SingleProduct,
  Cart,
  UserProfile,
  Checkout,
  EditProduct,
  History
} from './components'
import {me, getCart, getCartLocal} from './store'

/**`
 * COMPONENT
 */
class Routes extends Component {
  async componentDidMount() {
    if (!localStorage.getItem('cart')) {
      localStorage.setItem(
        'cart',
        JSON.stringify([
          {id: 1, productId: 1, itemQuantity: 4, orderStatus: false},
          {id: 2, productId: 2, itemQuantity: 5, orderStatus: false}
        ])
      )
      localStorage.setItem('nextCartId', 3)
    }

    await this.props.me()
    this.props.isLoggedIn ? this.props.getCart() : this.props.getCartLocal()
  }

  render() {
    const {isLoggedIn, isAdmin} = this.props
    return (
      <Switch>
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/cart" component={Cart} />
            {isAdmin && (
              <Route path="/products/:productId/edit" component={EditProduct} />
            )}
            <Route path="/products/:productId" component={SingleProduct} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/edit" component={EditUser} />
            <Route path="/checkedout" component={Checkout} />
            <Route path="/history" component={History} />
            <Route component={ProductList} />
          </Switch>
        )}
        {/* Routes placed here are available to all visitors */}
        <Route path="/cart" component={Cart} />
        <Route exact path="/products" component={ProductList} />
        <Route path="/products/:productId" component={SingleProduct} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        {/* Displays our Login component as a fallback */}
        <Route component={ProductList} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    isAdmin: state.user.isAdmin
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(
  connect(mapState, {me, getCart, getCartLocal})(Routes)
)

/**
 * PROP TYPES
 */
Routes.propTypes = {
  //loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
