import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const userProfile = props => {
  const {firstName, lastName, phone, email} = props.user

  return (
    <div>
      <h3>User Profile</h3>
      <div>First Name: {firstName}</div>
      <div>Last Name: {lastName}</div>
      <div>Phone: {phone}</div>
      <div>Email: {email}</div>
      <div id="link">
        <Link to="/edit">Edit Profile</Link>
        <Link to="/history">Order History</Link>
      </div>
    </div>
  )
}

const mapState = state => {
  return {
    user: state.user
  }
}

export default connect(mapState)(userProfile)
