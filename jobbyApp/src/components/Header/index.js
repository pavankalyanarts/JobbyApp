import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const logoutAccount = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-header-container">
      <ul className="nav-content-container">
        <li className="logo-link">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="nav-logo-img"
            />
          </Link>
        </li>
        <li className="nav-links-lg-container">
          <Link to="/" className="link-text">
            <p>Home</p>
          </Link>
          <Link to="/jobs" className="link-text">
            <p>Jobs</p>
          </Link>
        </li>
        <li className="nav-links-sm-container">
          <Link to="/">
            <AiFillHome
              size={16}
              style={{color: '#ffffff', marginRight: '18px'}}
            />
          </Link>

          <Link to="/jobs">
            <BsFillBriefcaseFill
              size={16}
              style={{color: '#ffffff', marginRight: '18px'}}
            />
          </Link>
        </li>
        <li>
          <FiLogOut size={18} onClick={logoutAccount} className="logout-btn" />
          <button
            type="button"
            className="logout-lg-btn"
            onClick={logoutAccount}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
