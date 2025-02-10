import React from 'react' 
import './footer.css'
import logo from '../Assets/logo.png'
import Instagram_logo from '../Assets/Instagram_icon.png'
import facebook_icon from '../Assets/facebook_icon.png'
import twitter_icon from '../Assets/twitter_logo.png'
import { Link } from 'react-router-dom';

const Footer = () =>{
  return (
        <div className='footer'>
            <div className="footer-logo">
                <img src={logo} alt="" />
                <p>BK Library</p>
            </div>
            <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/book">Books</Link></li>
                <li>About</li>
                <li>Contact</li>
            </ul>
            <div className="footer-social-icon">
                <div className="footer-icons-container">
                    <img src={Instagram_logo } alt="" />
                </div>
                <div className="footer-icons-container">
                    <img src={facebook_icon} alt="" />
                </div>
                <div className="footer-icons-container">
                    <img src={twitter_icon} alt="" />
                </div>
            </div>
            <div className="footer-copyright">
                <hr />
                <p>Copyright @2025 - All Right Reserved</p>
            </div>
        </div>
    )
}

export default Footer