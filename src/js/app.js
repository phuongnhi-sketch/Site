/**
 * APP.JS - ĐIỂM KHỞI CHẠY HỆ THỐNG
 */

import { Router } from './router.js';
import { LoginView } from './views/LoginView.js';
import { DashboardView } from './views/DashboardView.js';

import { SiteListView } from './views/SiteListView.js';
import { CreateSiteView } from './views/CreateSiteView.js';
import { AdminSettingsView } from './views/AdminSettingsView.js';

// Define routes
const routes = [
    { path: '/login', view: LoginView, protected: false },
    { path: '/dashboard', view: DashboardView, protected: true },
    { path: '/sites', view: SiteListView, protected: true },
    { path: '/sites/create', view: CreateSiteView, protected: true },
    { path: '/settings', view: AdminSettingsView, protected: true },
    { path: '/', view: DashboardView, protected: true }
];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new Router(routes);
});
