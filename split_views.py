import re
import os

with open('demo.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if css_match:
    with open('src/assets/css/main.css', 'w', encoding='utf-8') as f:
        f.write(css_match.group(1).strip())
    print("Extracted CSS")

# Extract Views
views = ['DashboardView', 'SiteListView', 'DetailView', 'CreateSiteView', 'SettingsView', 'UserManagementView', 'MapView']

for i in range(len(views)):
    view = views[i]
    # Find the start of the view
    pattern = r'const ' + view + r' = \{.*?(?=const (?:' + '|'.join(views) + r') = \{|window\.|// ---|\Z)'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        view_content = match.group(0).strip()
        # Clean up any trailing commas or semicolons at the very end if we want
        # view_content = re.sub(r';$', '', view_content)
        
        out_content = f"""import {{ SiteService }} from '../services/siteService.js';
import {{ FormService }} from '../services/formService.js';
import {{ UserService }} from '../services/userService.js';
import {{ NotificationService }} from '../services/notificationService.js';
import {{ store }} from '../store.js';

export {view_content}
"""
        # Save to file
        filename = f'src/js/views/{view}.js'
        if view == 'DetailView': filename = 'src/js/views/SiteDetailView.js'
        if view == 'SettingsView': filename = 'src/js/views/AdminSettingsView.js'
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(out_content)
        print(f"Extracted {view}")
    else:
        print(f"Could not find {view}")
