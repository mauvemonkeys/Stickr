import axios from 'axios'
import history from '../history'
import {setCartLogin, getCartLocal, setCart} from './cart'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const UPDATE_USER = 'UPDATE_USER'
const CLEAR_USER_ERROR = 'CLEAR_USER_ERROR'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const updateUser = user => ({type: UPDATE_USER, user})
export const clearUserError = () => ({type: CLEAR_USER_ERROR})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    const user = res.data
    return dispatch(getUser(user || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (
  email,
  password,
  method,
  firstName,
  lastName,
  phone
) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {
      email,
      password,
      firstName,
      lastName,
      phone
    })
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    res.data.phone = res.data.phone || ''
    await dispatch(getUser(res.data))
    if (method === 'signup') {
      dispatch(setCart())
    } else if (method === 'login') {
      dispatch(setCartLogin())
    }
    history.push('/products')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    dispatch(getCartLocal())
    history.push('/products')
  } catch (err) {
    console.error(err)
  }
}

export const editUser = ({
  email,
  password,
  firstName,
  lastName,
  phone
}) => async (dispatch, getState) => {
  try {
    const id = getState().user.id
    const userInfo = {email, firstName, password, lastName, phone}
    await axios.put(`api/users/${id}/edit`, userInfo)
    dispatch(updateUser(userInfo))
    history.push('/profile')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    case UPDATE_USER:
      let updatedUser = {}
      for (let key in action.user) {
        if (action.user[key] !== '' && action.user[key] !== 0) {
          updatedUser[key] = action.user[key]
        }
      }
      return {...state, ...updatedUser}
    case CLEAR_USER_ERROR:
      if (state.error) {
        return {...state, error: ''}
      }
      return state
    default:
      return state
  }
}
