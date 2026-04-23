/**
 * AUTHSERVICE.JS - XỬ LÝ XÁC THỰC (MOCK)
 */

import { store } from '../store.js';

const MOCK_USERS = [
    { email: 'admin@site.com', password: '123', name: 'Nhi Admin', role: 'ADMIN', region: 'ALL' },
    { email: 'mb_north@site.com', password: '123', name: 'MB Miền Bắc', role: 'MB', region: 'NORTH' },
    { email: 'mb_south@site.com', password: '123', name: 'MB Miền Nam', role: 'MB', region: 'SOUTH' },
    { email: 'bod@site.com', password: '123', name: 'Sếp BOD', role: 'BOD', region: 'ALL' },
    { email: 'project@site.com', password: '123', name: 'Dự án Team', role: 'PROJECT', region: 'ALL' }
];

export const AuthService = {
    login: (email, password) => {
        return new Promise((resolve, reject) => {
            // Fake network delay
            setTimeout(() => {
                const user = MOCK_USERS.find(u => u.email === email && u.password === password);
                
                if (user) {
                    store.setState({ user });
                    localStorage.setItem('site_poc_user', JSON.stringify(user));
                    resolve(user);
                } else {
                    reject('Email hoặc mật khẩu không đúng!');
                }
            }, 1000);
        });
    },

    logout: () => {
        store.setState({ user: null });
        localStorage.removeItem('site_poc_user');
        window.location.href = '/login';
    },

    checkAuth: () => {
        const savedUser = localStorage.getItem('site_poc_user');
        if (savedUser) {
            store.setState({ user: JSON.parse(savedUser) });
            return true;
        }
        return false;
    }
};
