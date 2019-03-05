import React, {Component} from 'react'
import axios from 'axios'
import {CardElement, injectStripe} from 'react-stripe-elements'

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#495057',
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
        '::placeholder': {}
      },
      invalid: {
        color: '#9e2146'
      }
    }
  }
}

class CheckoutForm extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit() {
    let {token} = await this.props.stripe.createToken({name: 'Ross S'})
    console.log(token)
    let response = await axios.post(
      `/api/orders/${this.props.user.id}/charge`,
      {token: token.id}
    )

    if (response.ok) console.log('Purchase Complete!')
  }
  render() {
    return (
      <div className="checkout">
        <div
          style={{paddingLeft: '5px', paddingRight: '5px', background: 'white'}}
        >
          <CardElement {...createOptions()} />
        </div>
        <button type="button" onClick={this.handleSubmit}>
          Pay
        </button>
      </div>
    )
  }
}

export default injectStripe(CheckoutForm)
