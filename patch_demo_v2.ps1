$htmlPath = "d:\AI\Site_Management\demo.html"
$newMapPath = "d:\AI\Site_Management\new_map_view_fixed.js"

$utf8NoBom = New-Object System.Text.UTF8Encoding $False
$html = [System.IO.File]::ReadAllText($htmlPath, $utf8NoBom)
$newMap = [System.IO.File]::ReadAllText($newMapPath, $utf8NoBom)

# 1. Inject Map CSS
$mapCss = @'
        /* MAP DASHBOARD STYLES */
        .map-layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; height: calc(100vh - 200px); min-height: 600px; }
        .map-visual { background: white; border-radius: 24px; padding: 2rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-soft); border: 1px solid var(--border-glass); }
        .map-region { fill: #e2e8f0; stroke: #fff; stroke-width: 0.5; transition: 0.3s; cursor: pointer; }
        .map-region:hover { fill: var(--accent-azure); filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.4)); }
        #north-region .map-region { fill: #dbeafe; }
        #south-region .map-region { fill: #fef3c7; }
        #north-region:hover .map-region { fill: #93c5fd; }
        #south-region:hover .map-region { fill: #fcd34d; }
        .map-stats-panel { display: flex; flex-direction: column; gap: 1.5rem; }
        .stats-group { background: white; padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border-glass); box-shadow: var(--shadow-soft); }
        .stats-group h3 { font-family: var(--font-heading); color: var(--primary-color); margin-bottom: 1rem; font-size: 1.1rem; }
        .stats-grid { display: grid; grid-template-columns: 1fr; gap: 0.8rem; }
        .stat-card { padding: 1rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .stat-card.complete { background: #f0fdf4; border: 1px solid #dcfce7; }
        .stat-card.other { background: #eff6ff; border: 1px solid #dbeafe; }
        .stat-card.rejected { background: #fef2f2; border: 1px solid #fee2e2; }
        .stat-card .label { font-size: 0.8rem; font-weight: 600; color: #64748b; }
        .stat-card .value { font-size: 1.2rem; font-weight: 700; color: var(--primary-color); }
        .map-hint { padding: 1rem; background: #f8fafc; border-radius: 12px; font-size: 0.85rem; color: #64748b; border: 1px dashed #cbd5e1; }
        .detail-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
        .btn-back { background: white; border: 1px solid #ddd; padding: 0.6rem 1.2rem; border-radius: 10px; cursor: pointer; font-weight: 600; transition: 0.2s; }
        .btn-back:hover { background: #f8fafc; border-color: var(--accent-blue); color: var(--accent-blue); }
        .google-map-mock { height: 500px; background: #f1f5f9 url('https://www.google.com/maps/about/images/mymaps/mymaps-desktop-16x9.png'); background-size: cover; border-radius: 24px; position: relative; border: 4px solid white; box-shadow: var(--shadow-soft); display: flex; align-items: center; justify-content: center; }
        .map-overlay { background: rgba(255,255,255,0.9); padding: 2rem; border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid white; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
'@

$styleTag = "</style>"
$firstStyleIndex = $html.IndexOf($styleTag)
if ($firstStyleIndex -ge 0) {
    $html = $html.Insert($firstStyleIndex, $mapCss)
}

# 2. Replace MapView logic using markers
$startMarker = "        const MapView = {"
$endMarker = "        // --- GLOBAL ACTIONS ---"

$startIndex = $html.IndexOf($startMarker)
$endIndex = $html.IndexOf($endMarker)

if ($startIndex -ge 0 -and $endIndex -gt $startIndex) {
    $before = $html.Substring(0, $startIndex)
    $after = $html.Substring($endIndex)
    $html = $before + $newMap + "`r`n`r`n        " + $after
}

# 3. Update handleRoute navigation
$html = $html.Replace("else if (hash === '#map') { m.innerHTML = MapView.render(); MapView.init(); }", "else if (hash === '#map') MapView.render();")

[System.IO.File]::WriteAllText($htmlPath, $html, $utf8NoBom)
Write-Output "Successfully patched demo.html v3"
