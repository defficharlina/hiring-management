import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const handleLogOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.replace('/');
};

const Navbar = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const role = localStorage.getItem('userRole') || '';
        setUserRole(role);
    }, []);

    const adminItems: MenuProps['items'] = [
        {
            label: 'Home',
            key: '/home'
        },
        {
            label: 'Job List',
            key: '/admin/jobs'
        },
        {
            label: 'Profile',
            key: '/profile'
        },
        {
            label: 'Logout',
            key: '/',
            onClick: handleLogOut
        },
    ];

    const userItems: MenuProps['items'] = [
        {
            label: 'Home',
            key: '/home'
        },
        {
            label: 'Job List',
            key: '/jobs'
        },
        {
            label: 'Profile',
            key: '/profile'
        },
        {
            label: 'Logout',
            key: '/',
            onClick: handleLogOut
        },
    ];

    const items = userRole === 'admin' ? adminItems : userItems;

    const onClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };

    return (
        <Menu onClick={onClick} items={items} mode={'horizontal'}/>
    );
};

export default Navbar;