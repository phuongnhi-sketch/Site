import { SiteService } from '../../services/siteService.js';
import { FormService } from '../../services/formService.js';
import { UserService } from '../../services/userService.js';
import { NotificationService } from '../../services/notificationService.js';
import { store } from '../store.js';

export const SettingsView = {
            render: async () => {
                const fs = await FormService.getFields(true);
                return `
                    <div class="animate-fade-in" style="max-width:850px">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2.5rem">
                            <h1 style="font-family:var(--font-heading)">⚙� Quản lý thông tin biểu mẫu</h1>
                            <button class="btn-primary" style="padding:0.8rem 1.5rem; border-radius:12px;" onclick="window.addField()">+ Thêm cột mới</button>
                        </div>
                        <div style="margin-top:2rem">
                            ${fs.map(f => `
                                <div class="glass" style="display:flex; justify-content:space-between; align-items:center; padding:1.2rem; border-radius:14px; margin-bottom:10px; ${!f.is_active ? 'opacity:0.4' : ''}">
                                    <div><strong>${f.label}</strong> <small style="color:var(--accent-blue)">${f.type}</small></div>
                                    <div><button onclick="window.tf('${f.id}',${!f.is_active})" class="btn-ghost">${f.is_active ? '🗑️ Ẩn' : '🔄 Hiện'}</button></div>
                                </div>`).join('')}
                        </div>
                    </div>`;
            }
        }
