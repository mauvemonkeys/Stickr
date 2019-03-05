import React, {Component} from 'react'
import axios from 'axios'
import Product from './product'
import {connect} from 'react-redux'
import {gotProductFromServer} from '../store/product'

class ProductList extends Component {
  _isMounted = false

  constructor() {
    super()
    this.state = {
      products: []
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleDispatchProduct = this.handleDispatchProduct.bind(this)
  }

  async componentDidMount() {
    this._isMounted = true
    const {data: products} = await axios.get('/api/products')
    if (this._isMounted) {
      this.setState({products})
    }
  }

  handleClick(productId) {
    this.props.history.push(`/products/${productId}`)
  }

  handleDispatchProduct(productId) {
    this.props.dispatchProduct(productId)
  }

  render() {
    return (
      <div id="product-container">
        {this.state.products.map(pt => (
          <Product
            key={pt.id}
            product={pt}
            handleClick={this.handleClick}
            handleDispatchProduct={this.handleDispatchProduct}
            isAdmin={this.props.user.isAdmin}
          />
        ))}
      </div>
    )
  }

  componentWillUnmount() {
    this._isMounted = false
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchProduct: productId => dispatch(gotProductFromServer(productId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
