$svgPath = "src/assets/vietnam.svg"
$svgContent = [System.IO.File]::ReadAllText($svgPath)

$northProvinces = @(
    'Lai Chu', 'Lo Cai', 'H Giang', 'Cao B?ng', 'Son La', 'Yn Bi', 'Tuyn Quang', 'L?ng Son', 'Qu?ng Ninh',
    'Ha Bnh', 'H Ty', 'Ninh Bnh', 'Thi Bnh', 'Thanh Ha', 'Ngh? An', 'H Tinh', 'Qu?ng Bnh',
    'B?c K?n', 'B?c Giang', 'B?c Ninh', 'H?i Duong', 'H Nam', 'Hung Yn', 'Nam D?nh', 'Ph Th?', 'Thi Nguyn',
    'Vinh Phc', 'Di?n Bin', 'H N?i', 'H?i Phng'
)

$northPaths = New-Object System.Collections.Generic.List[string]
$southPaths = New-Object System.Collections.Generic.List[string]

$regex = [regex]'<path\s+[^>]*d="([^"]*)"\s+[^>]*title="([^"]*)"\s+[^>]*id="([^"]*)"\s*\/?>'
$matches = $regex.Matches($svgContent)

foreach ($match in $matches) {
    $d = $match.Groups[1].Value
    $title = $match.Groups[2].Value
    $id = $match.Groups[3].Value
    
    $isNorth = $false
    foreach ($p in $northProvinces) {
        if ($title -like "*$p*") {
            $isNorth = $true
            break
        }
    }
    
    $region = if ($isNorth) { "NORTH" } else { "SOUTH" }
    # Use single quotes for JS strings to avoid conflict with SVG double quotes if any (though we escape them below)
    $pathHtml = "                                    <path d=""$d"" title=""$title"" id=""$id"" class=""map-region"" onclick=""MapView.zoomRegion('$region')"" />"
    
    if ($isNorth) {
        $northPaths.Add($pathHtml)
    } else {
        $southPaths.Add($pathHtml)
    }
}

$northPathsStr = [string]::Join("`n", $northPaths)
$southPathsStr = [string]::Join("`n", $southPaths)

# Use SINGLE QUOTED heredoc for the JS template part to avoid PowerShell expansion
# We will manually inject the paths using a placeholder
$jsTemplate = @'
        const MapView = {
            viewState: 'OVERVIEW',
            selectedRegion: null,

            render: () => {
                const user = store.getState().user;
                const stats = SiteService.getStats();
                const container = document.getElementById('m-view');
                
                if (MapView.viewState === 'OVERVIEW') {
                    container.innerHTML = MapView.renderOverview(stats, user);
                } else {
                    container.innerHTML = MapView.renderRegionDetail();
                }
            },

            renderOverview: (stats, user) => {
                const canViewNorth = user.role === 'ADMIN' || user.role === 'BOD_L1' || (user.role === 'MB' && user.id.includes('north'));
                const canViewSouth = user.role === 'ADMIN' || user.role === 'BOD_L1' || (user.role === 'MB' && user.id.includes('south'));

                return `
                    <div class="map-layout">
                        <div class="map-visual">
                            <svg viewBox="0 0 400 850" style="width:100%; height:100%">
                                <g id="north-region" style="opacity: ${canViewNorth ? 1 : 0.3}; cursor: ${canViewNorth ? 'pointer' : 'not-allowed'}">
NORTH_PATHS_PLACEHOLDER
                                </g>
                                <g id="south-region" style="opacity: ${canViewSouth ? 1 : 0.3}; cursor: ${canViewSouth ? 'pointer' : 'not-allowed'}">
SOUTH_PATHS_PLACEHOLDER
                                </g>
                            </svg>
                        </div>
                        
                        <div class="map-stats-panel">
                            <div class="stats-group">
                                <h3>Northern Region</h3>
                                <div class="stats-grid">
                                    <div class="stat-card complete">
                                        <span class="label">Complete</span>
                                        <span class="value">${stats.north.FINISH}</span>
                                    </div>
                                    <div class="stat-card other">
                                        <span class="label">In Progress</span>
                                        <span class="value">${stats.north.SURVEY + stats.north.SITEPACK + stats.north.DEAL}</span>
                                    </div>
                                    <div class="stat-card rejected">
                                        <span class="label">Rejected</span>
                                        <span class="value">${stats.north.REJECTED}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="stats-group">
                                <h3>Southern Region</h3>
                                <div class="stats-grid">
                                    <div class="stat-card complete">
                                        <span class="label">Complete</span>
                                        <span class="value">${stats.south.FINISH}</span>
                                    </div>
                                    <div class="stat-card other">
                                        <span class="label">In Progress</span>
                                        <span class="value">${stats.south.SURVEY + stats.south.SITEPACK + stats.south.DEAL}</span>
                                    </div>
                                    <div class="stat-card rejected">
                                        <span class="label">Rejected</span>
                                        <span class="value">${stats.south.REJECTED}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="map-hint">
                                <i class="fas fa-info-circle"></i> Click on a region to view detailed site pipeline
                            </div>
                        </div>
                    </div>
                `;
            },

            zoomRegion: (region) => {
                const user = store.getState().user;
                if (user.role === 'MB') {
                    if (region === 'NORTH' && !user.id.includes('north')) return;
                    if (region === 'SOUTH' && !user.id.includes('south')) return;
                }
                MapView.selectedRegion = region;
                MapView.viewState = 'DETAIL';
                MapView.render();
            },

            backToOverview: () => {
                MapView.viewState = 'OVERVIEW';
                MapView.selectedRegion = null;
                MapView.render();
            },

            renderRegionDetail: () => {
                return `
                    <div class="detail-header">
                        <button class="btn-back" onclick="MapView.backToOverview()">
                            <i class="fas fa-arrow-left"></i> Back to Vietnam Map
                        </button>
                        <h2 style="margin-top:1.5rem; color:var(--primary-color)">${MapView.selectedRegion === 'NORTH' ? 'Northern Region' : 'Southern Region'} Detail Map</h2>
                    </div>
                    <div id="google-map-placeholder" class="google-map-mock" style="margin-top:2rem">
                        <div class="map-overlay" style="text-align:center; color:#94a3b8">
                            <i class="fas fa-map-marked-alt" style="font-size:3rem; margin-bottom:1rem"></i>
                            <p>Detailed Google Map for ${MapView.selectedRegion} would load here</p>
                            <span class="status-pill status-COMPLETE" style="margin-top:1rem; display:inline-block">Live View Connected</span>
                        </div>
                    </div>
                `;
            }
        };

        window.refreshMap = () => {
            if (MapView.render) MapView.render();
        };
'@

$mapCode = $jsTemplate.Replace("NORTH_PATHS_PLACEHOLDER", $northPathsStr).Replace("SOUTH_PATHS_PLACEHOLDER", $southPathsStr)

$utf8NoBom = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText("new_map_view_fixed.js", $mapCode, $utf8NoBom)
