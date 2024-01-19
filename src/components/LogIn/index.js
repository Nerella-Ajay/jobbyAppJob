import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LogIn extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showSubmitError: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const userDetails = {username: usernameInput, password: passwordInput}
    const apiUrl = `https://apis.ccbp.in/login`
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUserNameField = () => {
    const {usernameInput} = this.state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          id="username"
          type="text"
          value={usernameInput}
          placeholder="Username"
          className="username-input-field"
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {passwordInput} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={passwordInput}
          placeholder="Password"
          className="password-input-field"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            className="login-website-logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <div className="input-container">{this.renderUserNameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button className="login-button" type="submit">
            Login
          </button>
          {showSubmitError && <p className="error_msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LogIn
