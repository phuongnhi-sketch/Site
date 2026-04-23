/**
 * DASHBOARDVIEW.JS - TRANG TỔNG QUAN
 */

import { store } from '../store.js';

export const DashboardView = {
    render: async () => {
        const { user } = store.getState();
        
        // Mock stats data
        const stats = [
            { label: 'Bản nháp', count: 5, status: 'draft', icon: '📝' },
            { label: 'Đã nộp', count: 12, status: 'submitted', icon: '📩' },
            { label: 'Đang duyệt', count: 8, status: 'under-review', icon: '🔍' },
            { label: 'Khảo sát', count: 3, status: 'survey', icon: '📋' },
            { label: 'Hoàn thành', count: 45, status: 'completed', icon: '✅' }
        ];

        const statsHtml = stats.map(stat => `
            <div class="stat-card glass glass-glow animate-fade-in" data-status="${stat.status}" style="border-bottom: 4px solid var(--accent-${stat.status === 'under-review' ? 'amber' : (stat.status === 'submitted' ? 'blue' : (stat.status === 'completed' ? 'emerald' : 'rose'))})">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-info">
                    <span class="stat-count">${stat.count}</span>
                    <span class="stat-label">${stat.label}</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="dashboard-page animate-fade-in">
                <div class="page-header">
                    <h1>Tổng quan hệ thống</h1>
                    <p>Chào mừng trở lại, ${user?.name}. Đây là tình trạng các hồ sơ hiện tại.</p>
                </div>
                
                <div class="stats-grid">
                    ${statsHtml}
                </div>

                <div class="dashboard-content-grid">
                    <div class="content-card glass">
                        <h3>Hoạt động gần đây</h3>
                        <div class="activity-list">
                            <div class="activity-item">
                                <span class="time">10:30 AM</span>
                                <span class="desc">Chị Nhi đã duyệt hồ sơ <strong>MB001</strong></span>
                            </div>
                            <div class="activity-item">
                                <span class="time">09:15 AM</span>
                                <span class="desc">Team MB nộp hồ sơ mới <strong>MB005</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        // Any interactions on the dashboard
    }
};
