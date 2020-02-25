import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GOT_PRODUCT = 'GOT_PRODUCT'
const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
/**
 * INITIAL STATE
 */
const defaultProduct = {}

/**
 * ACTION CREATORS
 */
export const gotProduct = product => ({type: GOT_PRODUCT, product})
export const updateProduct = product => ({type: UPDATE_PRODUCT, product})

/**
 * THUNK CREATORS
 */
export const gotProductFromServer = productId => async dispatch => {
  try {
    const {data: product} = await axios.get(`/api/products/${productId}`)
    dispatch(gotProduct(product))
    history.push(`/products/${productId}/edit`)
  } catch (err) {
    console.error(err)
  }
}
export const updateProductToServer = product => async dispatch => {
  try {
    const {data: updatedProduct} = await axios.put(
      `/api/admin/products/${product.id}`,
      product
    )
    dispatch(updateProduct(updatedProduct))
    history.push(`/products/${product.id}`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultProduct, action) {
  switch (action.type) {
    case GOT_PRODUCT:
      return action.product
    case UPDATE_PRODUCT:
      return {...state, ...action.product}
    default:
      return state
  }
}
