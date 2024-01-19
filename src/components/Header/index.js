import {withRouter, Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <ul className="nav-list-container">
        <li className="logo-container">
          <Link to="/">
            <img
              className="website-logo"
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            />
          </Link>
        </li>

        <li className="nav-links-container">
          <Link to="/" className="nav-link">
            <h1 className="nav-to-name">Home</h1>
            <AiFillHome className="nav-icon" />
          </Link>
          <Link to="/jobs" className="nav-link">
            <h1 className="nav-to-name">Jobs</h1>
            <BsBriefcaseFill className="nav-icon" />
          </Link>
        </li>

        <li className="nav-buttons-container">
          <FiLogOut className="nav-icon" onClick={onClickLogout} />
          <button
            type="button"
            className="logout-btn"
            onClick={onClickLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
