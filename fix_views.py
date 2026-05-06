import os
import re

views_dir = 'src/js/views'
for f_name in os.listdir(views_dir):
    if not f_name.endswith('.js'): continue
    path = os.path.join(views_dir, f_name)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix imports
    content = content.replace("from '../services/", "from '../../services/")
    content = content.replace("from '../store.js'", "from '../store.js'")
    
    # In UserManagementView.js
    if f_name == 'UserManagementView.js':
        content = content.replace('window.showUserModal = (id) => {', 'window.showUserModal = async (id) => {')
        content = content.replace('window.saveUserModal = () => {', 'window.saveUserModal = async () => {')
        content = content.replace('window.deleteUser = (id) => {', 'window.deleteUser = async (id) => {')
        content = content.replace('handleRoute();', 'if(window.router) window.router.handleRoute();')
        
    # Same for others if they have similar handlers
    if f_name == 'SiteDetailView.js':
        content = content.replace('window.addComment = () => {', 'window.addComment = async () => {')
        content = content.replace('window.updateStatus = (s) => {', 'window.updateStatus = async (s) => {')
        content = content.replace('window.updateMPSA = () => {', 'window.updateMPSA = async () => {')
        content = content.replace('window.createV2 = () => {', 'window.createV2 = async () => {')
        content = content.replace('window.deleteSite = () => {', 'window.deleteSite = async () => {')
        content = content.replace('handleRoute();', 'if(window.router) window.router.handleRoute();')
        
    if f_name == 'CreateSiteView.js':
        content = content.replace('window.saveSite = () => {', 'window.saveSite = async () => {')
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
# Fix components
comps_dir = 'src/js/components'
for f_name in os.listdir(comps_dir):
    if not f_name.endswith('.js'): continue
    path = os.path.join(comps_dir, f_name)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("from '../services/", "from '../../services/")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
