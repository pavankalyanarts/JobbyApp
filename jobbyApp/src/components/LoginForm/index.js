import {Redirect} from 'react-router-dom'

import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  constructor() {
    super()
    this.state = {username: '', password: '', isInvalid: false, errorMsg: ''}
  }

  onUserInputName = event => {
    this.setState({username: event.target.value})
  }

  onUserInputPassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({isInvalid: true, errorMsg})
  }

  onUserLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, isInvalid, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <div className="login-form-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-img"
          />
          <form className="login-form" onSubmit={this.onUserLogin}>
            <label htmlFor="userInput" className="label-name">
              USERNAME
            </label>
            <br />
            <input
              type="text"
              className="input-box"
              id="userInput"
              value={username}
              onChange={this.onUserInputName}
              placeholder="Username"
            />
            <br />
            <label htmlFor="passwordInput" className="label-name">
              PASSWORD
            </label>
            <br />
            <input
              type="password"
              className="input-box"
              id="passwordInput"
              value={password}
              onChange={this.onUserInputPassword}
              placeholder="Password"
            />
            <br />
            <button className="login-btn" type="submit">
              Login
            </button>
            {isInvalid && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
