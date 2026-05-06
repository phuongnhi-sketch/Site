import './globals.js';
import { Router } from './router.js';
import { LoginView } from './views/LoginView.js';
import { DashboardView } from './views/DashboardView.js';
import { SiteListView } from './views/SiteListView.js';
import { CreateSiteView } from './views/CreateSiteView.js';
import { SettingsView as AdminSettingsView } from './views/AdminSettingsView.js';
import { UserManagementView } from './views/UserManagementView.js';
import { MapView } from './views/MapView.js';
import { DetailView as SiteDetailView } from './views/SiteDetailView.js';
import { NotificationView } from './views/NotificationView.js';

// Global attach for inline handlers (legacy support for demo.html markup)
window.DashboardView = DashboardView;
window.SiteListView = SiteListView;
window.CreateSiteView = CreateSiteView;
window.AdminSettingsView = AdminSettingsView;
window.UserManagementView = UserManagementView;
window.MapView = MapView;

// Define hash-based routes
const routes = [
    { path: '#login', view: LoginView, protected: false },
    { path: '#dashboard', view: DashboardView, protected: true },
    { path: '#sites', view: SiteListView, protected: true },
    { path: '#create', view: CreateSiteView, protected: true },
    { path: '#settings', view: AdminSettingsView, protected: true },
    { path: '#users', view: UserManagementView, protected: true },
    { path: '#map', view: MapView, protected: true },
    { path: '#detail', view: SiteDetailView, protected: true },
    { path: '#notifs', view: NotificationView, protected: true }
];

document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router(routes);
});
