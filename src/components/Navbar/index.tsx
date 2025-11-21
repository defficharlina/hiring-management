import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HomeOutlined, UnorderedListOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import './Navbar.css';

const handleLogOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.replace('/');
};

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole, setUserRole] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const role = localStorage.getItem('userRole') || '';
        const user = localStorage.getItem('username') || '';
        setUserRole(role);
        setUsername(user);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="modern-navbar">
            <div className="navbar-container">
                <div className="navbar-brand" onClick={() => navigate('/home')}>
                    <div className="brand-logo">
                        <span className="logo-icon">💼</span>
                    </div>
                    <span className="brand-text">Job Portal</span>
                </div>

                <div className="navbar-menu">
                    <button 
                        className={`nav-item ${isActive('/home') ? 'active' : ''}`}
                        onClick={() => navigate('/home')}
                    >
                        <HomeOutlined className="nav-icon" />
                        <span>Home</span>
                    </button>
                    
                    <button 
                        className={`nav-item ${isActive(userRole === 'admin' ? '/admin/jobs' : '/jobs') ? 'active' : ''}`}
                        onClick={() => navigate(userRole === 'admin' ? '/admin/jobs' : '/jobs')}
                    >
                        <UnorderedListOutlined className="nav-icon" />
                        <span>Job List</span>
                    </button>
                </div>

                <div className="navbar-actions">
                    <div className="user-info">
                        <UserOutlined className="user-icon" />
                        <span className="username">{username}</span>
                        {userRole === 'admin' && <span className="user-badge">Admin</span>}
                    </div>
                    <button className="logout-btn" onClick={handleLogOut}>
                        <LogoutOutlined className="nav-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;