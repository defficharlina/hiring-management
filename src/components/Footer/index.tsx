import { GithubOutlined, LinkedinOutlined, TwitterOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="modern-footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <span className="footer-logo-icon">💼</span>
                            </div>
                            <h3>Job Portal</h3>
                        </div>
                        <p className="footer-description">
                            Platform terpercaya untuk menemukan peluang karir terbaik dan menghubungkan talenta dengan perusahaan impian.
                        </p>
                        <div className="footer-social">
                            <a href="/" className="social-link">
                                <GithubOutlined />
                            </a>
                            <a href="/" className="social-link">
                                <LinkedinOutlined />
                            </a>
                            <a href="/" className="social-link">
                                <TwitterOutlined />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><a href="/jobs">Browse Jobs</a></li>
                            <li><a href="/home">About Us</a></li>
                            <li><a href="/home">How It Works</a></li>
                            <li><a href="/home">FAQ</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">For Employers</h4>
                        <ul className="footer-links">
                            <li><a href="/admin/jobs">Post a Job</a></li>
                            <li><a href="/admin/jobs">Manage Jobs</a></li>
                            <li><a href="/home">Pricing</a></li>
                            <li><a href="/home">Resources</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Contact Us</h4>
                        <ul className="footer-contact">
                            <li>
                                <EnvironmentOutlined className="contact-icon" />
                                <span>Jakarta, Indonesia</span>
                            </li>
                            <li>
                                <PhoneOutlined className="contact-icon" />
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li>
                                <MailOutlined className="contact-icon" />
                                <span>info@jobportal.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-divider"></div>
                    <div className="footer-bottom-content">
                        <p className="footer-copyright">
                            © {currentYear} Job Portal. All rights reserved.
                        </p>
                        <div className="footer-legal">
                            <a href="/home">Privacy Policy</a>
                            <span className="separator">•</span>
                            <a href="/home">Terms of Service</a>
                            <span className="separator">•</span>
                            <a href="/home">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
