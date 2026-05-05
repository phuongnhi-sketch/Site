$htmlPath = "d:\AI\Site_Management\demo.html"
$utf8NoBom = New-Object System.Text.UTF8Encoding $False
$html = [System.IO.File]::ReadAllText($htmlPath, $utf8NoBom)

$oldBlock = @"
            getLatestData: (site) => {
                return site.v2_data || site.answers || {};
            }
        };
"@

$newBlock = @"
            getLatestData: (site) => {
                return site.v2_data || site.answers || {};
            },
            getStats: () => {
                const ss = SiteService.getSites();
                const stats = {
                    north: { FINISH: 0, SURVEY: 0, SITEPACK: 0, DEAL: 0, REJECTED: 0, SUBMITTED: 0 },
                    south: { FINISH: 0, SURVEY: 0, SITEPACK: 0, DEAL: 0, REJECTED: 0, SUBMITTED: 0 }
                };
                ss.forEach(s => {
                    const reg = (s.region || 'SOUTH').toUpperCase();
                    const group = reg.includes('NORTH') ? 'north' : 'south';
                    let st = s.status;
                    if (st === 'GATE1') st = 'SURVEY';
                    else if (st === 'GATE2') st = 'SITEPACK';
                    else if (st === 'GATE3') st = 'DEAL';
                    if (stats[group] && stats[group][st] !== undefined) {
                        stats[group][st]++;
                    } else if (stats[group] && st === 'SUBMITTED') {
                        stats[group].SUBMITTED++;
                    }
                });
                return stats;
            }
        };
"@

if ($html.Contains($oldBlock)) {
    $html = $html.Replace($oldBlock, $newBlock)
    [System.IO.File]::WriteAllText($htmlPath, $html, $utf8NoBom)
    Write-Output "Successfully added getStats to SiteService"
} else {
    Write-Error "Could not find the target block in demo.html"
    # Fallback to a simpler search if exact match fails
    $simpleOld = "return site.v2_data || site.answers || {};`r`n            }`r`n        };"
    if ($html.Contains($simpleOld)) {
         Write-Output "Found with simpler match (likely CRLF issues)"
         $html = $html.Replace($simpleOld, $newBlock)
         [System.IO.File]::WriteAllText($htmlPath, $html, $utf8NoBom)
    }
}
