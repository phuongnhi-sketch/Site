import { SiteService, STATUS_LABELS } from '../services/siteService.js';
import { FormService } from '../services/formService.js';
import { NotificationService } from '../services/notificationService.js';
import { UserService } from '../services/userService.js';
import { supabase } from '../services/supabaseClient.js';
import { store } from './store.js';

window.STATUS_LABELS = STATUS_LABELS;

        // --- LIGHTBOX LOGIC ---
        window.currentLightboxIndex = 0;
        window.currentLightboxImages = [];

        window.openLightbox = (index, images) => {
            window.currentLightboxIndex = index;
            window.currentLightboxImages = images;
            const modal = document.getElementById('lightbox');
            const img = document.getElementById('lightbox-img');
            const counter = document.getElementById('lightbox-counter');

            modal.style.display = 'flex';
            img.src = images[index];
            counter.innerText = `${index + 1} / ${images.length}`;

            // Lock scrolling
            document.body.style.overflow = 'hidden';
        };

        window.openSiteLightbox = async (siteId, index) => {
            const ss = await SiteService.getSites();
            const s = ss.find(item => item.id === siteId);
            if (!s) return;
            const imgs = [s.thumb, ...(s.inner_images || [])];
            window.openLightbox(index, imgs);
        };

        window.closeLightbox = () => {
            document.getElementById('lightbox').style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        window.navLightbox = (dir) => {
            window.currentLightboxIndex += dir;
            if (window.currentLightboxIndex >= window.currentLightboxImages.length) window.currentLightboxIndex = 0;
            if (window.currentLightboxIndex < 0) window.currentLightboxIndex = window.currentLightboxImages.length - 1;

            const img = document.getElementById('lightbox-img');
            const counter = document.getElementById('lightbox-counter');
            img.src = window.currentLightboxImages[window.currentLightboxIndex];
            counter.innerText = `${window.currentLightboxIndex + 1} / ${window.currentLightboxImages.length}`;
        };

        // Keyboard shortcuts for Lightbox
        window.addEventListener('keydown', (e) => {
            const lb = document.getElementById('lightbox');
            if (lb && lb.style.display === 'flex') {
                if (e.key === 'ArrowLeft') window.navLightbox(-1);
                if (e.key === 'ArrowRight') window.navLightbox(1);
                if (e.key === 'Escape') window.closeLightbox();
            }
        });

        window.refreshMap = () => {
            if (MapView.render) MapView.render();
        };

        // --- GLOBAL ACTIONS ---
        const resizeImage = (file, callback) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width; let height = img.height; const MAX = 800;
                    if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } }
                    else { if (height > MAX) { width *= MAX / height; height = MAX; } }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
                    callback(canvas.toDataURL('image/jpeg', 0.6));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };

        window.save = async (st) => {
            const u = store.getState().user;
            let currentThumb = window.lastB64;
            if (!currentThumb) {
                const imgEl = document.getElementById('p-img');
                if (imgEl && imgEl.src && imgEl.src.startsWith('data:image')) {
                    currentThumb = imgEl.src;
                } else if (window.currentId) {
                    const existingSite = (await SiteService.getSites()).find(s => s.id === window.currentId);
                    if (existingSite) currentThumb = existingSite.thumb;
                }
            }

            const ans = {};
            (await FormService.getFields()).forEach(f => {
                if (f.type === 'checkboxes') {
                    const checkboxes = document.querySelectorAll(`input[name="${f.id}"]:checked`);
                    ans[f.id] = Array.from(checkboxes).map(cb => cb.value).join(', ');
                } else {
                    const el = document.getElementById(f.id);
                    ans[f.id] = el ? el.value : '';
                }
            });

            if (st === 'SUBMITTED') {
                const missing = [];
                const invalidNum = [];
                (await FormService.getFields()).forEach(f => {
                    const val = ans[f.id] ? ans[f.id].toString().trim() : '';
                    if (f.req && val === '') missing.push(f.label);
                    if (val !== '' && f.num) {
                        const sanitized = val.replace(/,/g, '');
                        if (isNaN(Number(sanitized))) invalidNum.push(f.label);
                    }
                });
                if (!currentThumb || currentThumb.includes('unsplash.com')) {
                    missing.push('Ảnh mặt tiền thật (1 ảnh Thumbnail)');
                }

                if (missing.length > 0) {
                    alert('LỖI: Chưa thể nộp hồ sơ!\nBạn cần điền đầy đủ các thông tin bắt buộc sau:\n\n- ' + missing.join('\n- '));
                    return; // Abort
                }
                if (invalidNum.length > 0) {
                    alert('LỖI ĐỚNH DẠNG SỐ!\nCác cột sau BẮT BUỘC PHẢI LÀ SỐ (bạn không được gõ chữ "tr" hay "m2" vào ô này, chỉ gõ số, có thể dùng dấu phẩy cho hàng ngàn):\n\n- ' + invalidNum.join('\n- '));
                    return; // Abort
                }
            }

            const ss = (await SiteService.getSites());
            const exSite = window.currentId ? ss.find(s => s.id === window.currentId) : null;

            const site = {
                id: window.currentId || Date.now().toString(),
                owner_id: exSite ? (exSite.owner_id || exSite.owner) : u.id,
                owner: exSite ? (exSite.owner_id || exSite.owner) : u.id,
                owner_name: exSite ? exSite.owner_name : u.name,
                region: exSite ? exSite.region : (u.role === 'ADMIN' ? (document.getElementById('admin-region')?.value || 'ALL') : u.region),
                date: exSite ? exSite.date : new Date().toLocaleDateString(),
                status: (st === 'UPDATE_V2' && exSite) ? (exSite.status || 'GATE3') : st,
                thumb: currentThumb || (exSite ? exSite.thumb : 'https://images.unsplash.com/photo-1582410118839-959c86940d99?w=400&h=400'),
                inner_images: window.currentInnerImages || (exSite ? exSite.inner_images : []),
                name: (st === 'UPDATE_V2' && exSite) ? exSite.name : (ans['f1'] || 'Site mới'),
                brand: (st === 'UPDATE_V2' && exSite) ? exSite.brand : (ans['f0'] || '---'),
                price: (st === 'UPDATE_V2' && exSite) ? exSite.price : (parseFloat(ans['f2_2']?.toString().replace(/,/g, '')) || 0),
                answers: (st === 'UPDATE_V2' && exSite) ? JSON.parse(JSON.stringify(exSite.answers)) : JSON.parse(JSON.stringify(ans)),
                v2_data: (st === 'UPDATE_V2') ? JSON.parse(JSON.stringify(ans)) : (exSite ? JSON.parse(JSON.stringify(exSite.v2_data)) : null),
                current_mpsa: exSite ? exSite.current_mpsa : null,
                code: (st === 'SUBMITTED' || st === 'GATE1' || st === 'UPDATE_V2') ? (exSite?.code || 'MB-' + Math.floor(Math.random() * 9000 + 1000)) : (exSite ? exSite.code : '')
            };
            if (await SiteService.save(site)) {
                alert('Đã lưu hồ sơ thành công!');
                window.editingV2 = false;
                window.currentId = null;
                location.hash = (st === 'UPDATE_V2') ? '#detail?id=' + site.id : '#sites';
            }
        };

        window.prevMulti = async (input) => {
            if (!input.files) return;
            window.currentInnerImages = window.currentInnerImages || [];
            const prv = document.getElementById('multi-preview');
            // Reset ui in creation mode
            if (!window.currentId && window.currentInnerImages.length === 0) prv.innerHTML = '';

            for (let f of input.files) {
                resizeImage(f, (resizedB64) => {
                    window.currentInnerImages.push(resizedB64);
                    const img = document.createElement('img');
                    img.src = resizedB64;
                    img.style = "width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid #ddd;";
                    prv.appendChild(img);
                });
            }
        };

        window.prev = (i) => {
            if (i.files && i.files[0]) {
                resizeImage(i.files[0], (resizedB64) => {
                    window.lastB64 = resizedB64;
                    document.getElementById('p-img').src = resizedB64;
                    document.getElementById('p-ui').style.display = 'block';
                    document.getElementById('h-ui').style.display = 'none';
                });
            }
        };
        window.upStatus = async (id, st) => {
            if (confirm(`Bạn có chắc chắn muốn chuyển trạng thái sang bước [${STATUS_LABELS[st]}]?`)) {
                await SiteService.updateStatus(id, st, `Đã chuyển trạng thái sang ${STATUS_LABELS[st]}`);
                location.reload();
            }
        };
        window.siteFilters = { search: '', region: 'ALL', brand: 'ALL', status: 'ALL' };
        window.setFilter = (key, val) => { window.siteFilters[key] = val; if (window.router) window.router.handleRoute(); };

        window.doComment = async (id) => { const text = document.getElementById('msg').value; if (!text) return; await SiteService.addComment(id, text, store.getState().user.name); location.reload(); };
        window.unlock = async (id) => { await SiteService.updateStatus(id, 'DRAFT', 'Admin đã mở khóa bản ghi.'); alert('Đã mở khóa!'); location.reload(); };
        window.reqEdit = async (id) => { 
            const r = prompt('Lý do sửa:'); 
            if (r) { 
                const u = store.getState().user;
                await SiteService.addComment(id, `⚠️ YÊU CẦU SỬA: ${r}`, u.name); 
                alert('Đã gửi yêu cầu chỉnh sửa đến Admin!'); 
            } 
        };
        window.markAllRead = () => {
            const u = store.getState().user;
            const ns = NotificationService.getNotifs();
            ns.forEach(n => { if (n.uId === u.id) n.isRead = true; });
            localStorage.setItem('site_poc_notifs', JSON.stringify(ns));
            location.reload();
        };
        window.delSite = async (id) => { 
            if (confirm('Bạn có chắc chắn muốn xóa hồ sơ mặt bằng này? Hành động này không thể hoàn tác.')) { 
                const success = await SiteService.deleteSite(id);
                if (success) location.reload();
            } 
        };
        window.addField = () => { const l = prompt('Tên cột:'); if (l) { const t = prompt('Loại (text, select, textarea):', 'text') || 'text'; const fs = FormService.getFields(true); fs.push({ id: 'f' + Date.now(), label: l, type: t, is_active: true }); FormService.saveFields(fs); if (window.router) window.router.handleRoute(); } };
        window.mpsaPrompt = async (id) => { const v = prompt('Nhập MPSA mới (Số):'); if (v) { await SiteService.updateMPSA(id, v, ''); location.reload(); } };
        window.ver2 = async (id) => { if (confirm('Tạo Version 2 từ dữ liệu hiện tại?')) { await SiteService.createVersion2(id); alert('Đã tạo V2! Giờ bạn có thể chỉnh sửa Version 2.'); location.reload(); } };
        window.editV2 = (id) => { window.currentId = id; window.editingV2 = true; location.hash = '#create?id=' + id; };
        window.tf = (id, a) => { FormService.updateField(id, { is_active: a }); if (window.router) window.router.handleRoute(); };

        window.exportExcel = async (selectedIds = []) => {
            const u = store.getState().user;
            if (!selectedIds || selectedIds.length === 0) {
                selectedIds = Array.from(document.querySelectorAll('.site-checkbox:checked')).map(cb => cb.dataset.id);
            }
            let sites = (await SiteService.getSites());
            if (selectedIds && selectedIds.length > 0) {
                sites = sites.filter(s => selectedIds.includes(s.id));
            }
            const fields = (await FormService.getFields());
            const incQA = window.siteFilters?.includeQA;
            const verOpt = window.siteFilters?.exportVer || 'BOTH';

            let csv = '\uFEFF'; // BOM for Excel UTF-8
            // Header
            csv += 'Mã hệ thống,Code,Brand,Tên MB,Trạng thái,Vùng miền,Người nộp,Ngày nộp,Version,MPSA Estimate,';
            csv += fields.map(f => f.label.replace(/,/g, '')).join(',');
            if (incQA) csv += ',Lịch sử thảo luận (Q&A)';
            csv += '\n';

            sites.forEach(s => {
                const processRow = (data, ver) => {
                    const isMasked = (u.role === 'PROJECT' || (s.status === 'FINISH' && u.role !== 'ADMIN') || (s.status === 'REJECTED' && u.role !== 'ADMIN'));
                    let row = [
                        s.id, s.code, s.brand, s.name, STATUS_LABELS[s.status],
                        s.region, s.owner_name, s.date, ver,
                        isMasked ? '*******' : (s.current_mpsa || '0')
                    ].map(v => '"' + (v || '').toString().replace(/"/g, '""') + '"');

                    fields.forEach(f => {
                        let val = data[f.id] || '';
                        if (isMasked && (f.id === 'f2_1' || f.id === 'f2_2' || f.id === 'f7')) {
                            val = '*******';
                        }
                        row.push('"' + val.toString().replace(/"/g, '""') + '"');
                    });
                    if (incQA) {
                        const comments = (s.comments || []).map(c => `[${new Date(c.date).toLocaleDateString()} ${c.author}]: ${c.text}`).join(' | ');
                        row.push('"' + comments.replace(/"/g, '""') + '"');
                    }
                    return row.join(',') + '\n';
                };

                if (verOpt === 'BOTH') {
                    csv += processRow(s.answers || {}, 'V1 (Original)');
                    if (s.v2_data) csv += processRow(s.v2_data, 'V2 (Final)');
                } else {
                    const data = s.v2_data || s.answers || {};
                    csv += processRow(data, s.v2_data ? 'V2 (Final)' : 'V1 (Original)');
                }
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `Site_Report_${new Date().toLocaleDateString()}.csv`;
            link.click();
        };

        window.toggleAll = (master) => {
            document.querySelectorAll('.site-checkbox').forEach(cb => cb.checked = master.checked);
        };

        window.printSelected = async (forcedIds = null) => {
            const w = 1000;
            const h = 800;
            const left = (window.screen.width / 2) - (w / 2);
            const top = (window.screen.height / 2) - (h / 2);
            
            const win = window.open('', '_blank', `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`);
            if (!win) return alert('LỖI: Trình duyệt đã chặn cửa sổ bật lên (Popup). Vui lòng nhìn lên thanh địa chỉ trình duyệt, chọn "Luôn cho phép cửa sổ bật lên" rồi bấm In lại nhé!');
            
            win.document.write('<html><head><title>Đang chuẩn bị báo cáo...</title><style>body{display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#666;}</style></head><body><div><h2 style="margin-bottom:10px">⌛ Đang nạp dữ liệu báo cáo...</h2><p>Vui lòng đợi trong giây lát.</p></div></body></html>');

            const u = store.getState().user;
            let selectedIds = forcedIds;
            if (!selectedIds) {
                selectedIds = Array.from(document.querySelectorAll('.site-checkbox:checked')).map(cb => cb.dataset.id);
                if (selectedIds.length === 0) {
                    selectedIds = (await SiteService.getSites()).map(s => s.id);
                }
            }

            const allSites = await SiteService.getSites();
            const fields = await FormService.getFields();
            const incQA = window.siteFilters?.includeQA;

            let html = '<html><head><title>Báo cáo hồ sơ</title>';
            html += '<style>' +
                '@page { size: auto; margin: 10mm; } ' +
                'body{font-family:sans-serif; margin:0; padding:20px; color:#333;} ' +
                '.page-break{page-break-after:always; margin-bottom:30px;} ' +
                '.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px} ' +
                '.header h2{font-size:1.8rem; margin:0; font-weight:800;} ' +
                '.header .code{font-size:0.8rem; color:#999;} ' +
                '.sidebar-box{border:1px solid #f0f0f0; border-radius:16px; padding:20px; margin-bottom:20px; background:#fff; box-shadow: 0 4px 12px rgba(0,0,0,0.03); width:300px;} ' +
                '.sidebar-box h3{font-size:0.85rem; font-weight:800; margin-top:0; margin-bottom:15px; color:#111;} ' +
                '.sidebar-box label{font-size:0.65rem; font-weight:700; color:#999; text-transform:uppercase; display:block; margin-bottom:5px;} ' +
                '.mpsa-val{font-size:1.3rem; font-weight:800; color:#2563EB; margin-bottom:15px;} ' +
                '.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px 40px} ' +
                '.field label{font-size:0.7rem;color:#999;display:block;margin-bottom:2px;} ' +
                '.field p{margin:0;font-size:0.9rem;color:#111;font-weight:600;} ' +
                '.thumb-img{width:400px; height:300px; object-fit:cover; border-radius:12px; margin-bottom:20px; border:1px solid #f0f0f0} ' +
                '.ver-title{font-size:1.1rem; color:#2563EB; font-weight:800; margin:30px 0 15px 0; border-left:4px solid #2563EB; padding-left:12px; text-transform:uppercase;} ' +
                '.images-grid{display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;margin-top:20px} ' +
                '.images-grid img{height:100px;width:100%;object-fit:cover;border-radius:8px;border:1px solid #f0f0f0} ' +
                '</style>';
            html += '</head><body>';

            selectedIds.forEach((id, index) => {
                const site = allSites.find(s => s.id === id);
                if (!site) return;

                html += `<div class="${index < selectedIds.length - 1 ? 'page-break' : ''}">`;
                html += `<div class="header"><h2>#${index + 1}. ${site.name}</h2><span class="code">Mã: ${site.code}</span></div>`;
                
                html += `
                <div style="display:flex; gap:30px; align-items:flex-start; margin-bottom:20px">
                    <img src="${site.thumb}" class="thumb-img">
                    <div class="sidebar-box">
                        <h3>Phê duyệt & Thảo luận</h3>
                        <label>MPSA ESTIMATE</label>
                        <div class="mpsa-val">${site.current_mpsa ? parseFloat(site.current_mpsa).toLocaleString('en-US') + ' đ' : '---'}</div>
                        <label>TRẠNG THÁI HIỆN TẠI</label>
                        <div style="font-weight:800; font-size:1rem; color:#2563EB; background:#EFF6FF; padding:8px 12px; border-radius:8px; display:inline-block">${STATUS_LABELS[site.status]}</div>
                    </div>
                </div>`;

                const renderData = (data, sectionTitle, isV2 = false) => {
                    const isMasked = (u.role === 'PROJECT' || (site.status === 'FINISH' && u.role !== 'ADMIN') || (site.status === 'REJECTED' && u.role !== 'ADMIN'));
                    
                    html += `<div class="ver-title">${sectionTitle}</div><div class="grid">`;
                    fields.forEach(f => {
                        let v = data[f.id] || '';
                        if (isMasked && (f.id === 'f2_1' || f.id === 'f2_2' || f.id === 'f7')) v = '*******';
                        let displayVal = v || '---';
                        if (f.num && v && v !== '*******') {
                            const num = parseFloat(v.toString().replace(/,/g, ''));
                            if (!isNaN(num)) displayVal = num.toLocaleString('en-US');
                        }
                        html += `<div class="field"><label>${f.label}</label><p>${displayVal}</p></div>`;
                    });
                    html += '</div>';
                };

                const verOpt = window.siteFilters?.exportVer || 'BOTH';
                if (verOpt === 'BOTH') {
                    renderData(site.answers || {}, 'PHIÊN BẢN GỐC (V1)', false);
                    if (site.v2_data) renderData(site.v2_data, 'PHIÊN BẢN CHỐT DEAL (V2)', true);
                } else {
                    const data = site.v2_data || site.answers || {};
                    renderData(data, site.v2_data ? 'PHIÊN BẢN CHỐT DEAL (V2)' : 'PHIÊN BẢN GỐC (V1)', !!site.v2_data);
                }

                if (site.inner_images && site.inner_images.length > 0) {
                    html += '<div class="ver-title" style="color:#666; border-color:#ccc">Hình ảnh chi tiết</div><div class="images-grid">';
                    site.inner_images.forEach(img => html += `<img src="${img}">`);
                    html += '</div>';
                }

                if (incQA && site.comments && site.comments.length > 0) {
                    html += '<div class="ver-title" style="color:#666; border-color:#ccc">Lịch sử thảo luận</div>';
                    site.comments.forEach(c => {
                        html += `<div style="margin-bottom:8px;padding:10px;background:#f9f9f9;border-radius:8px;font-size:11px; border-left:3px solid #eee"><strong>${c.author}</strong>: ${c.text}</div>`;
                    });
                }
                html += '</div>';
            });

            html += '</body></html>';
            
            // Rewrite with actual content
            win.document.open();
            win.document.write(html);
            win.document.close();
            
            // Wait for images to be decoded before printing
            const imgs = win.document.querySelectorAll('img');
            const promises = Array.from(imgs).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
            });

            await Promise.all(promises);
            setTimeout(() => { win.print(); }, 500);
        };

        window.printDetail = (id) => {
            window.printSelected([id]);
        };

        window.doLogin = async () => {
            const uInput = document.getElementById('login-user').value.trim();
            const pInput = document.getElementById('login-pass').value;
            
            let email = uInput.includes('@') ? uInput.toLowerCase() : (uInput.toLowerCase() + '@system.com');
            
            console.log('Attempting login for:', email);
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password: pInput });
                if (error) throw error;
                
                // Lấy thông tin chính xác từ bảng users public
                const { data: dbUser, error: dbErr } = await supabase.from('users').select('*').eq('email', email).single();
                
                if (dbErr || !dbUser) {
                    throw new Error('Tài khoản Auth hợp lệ nhưng không tìm thấy trong database nội bộ.');
                }
                
                const uObj = {
                    id: dbUser.id,
                    name: dbUser.name,
                    role: dbUser.role,
                    region: dbUser.region,
                    brand: dbUser.brand,
                    email: dbUser.email
                };
                
                localStorage.setItem('site_poc_user', JSON.stringify(uObj));
                store.setState({ user: uObj });
                
                console.log('Login successful:', uObj.name);
                location.href = '#dashboard';
                location.reload();
            } catch (err) {
                console.error('Login error:', err);
                alert(`LỖI ĐĂNG NHẬP:\n${err.message || 'Sai tài khoản hoặc mật khẩu'}\n\nVui lòng kiểm tra lại thông tin.`);
            }
        };