$lines = Get-Content 'd:\AI\Site_Management\demo.html'
# We want to remove the garbage from line 436 to 486 (1-indexed)
# 1-indexed 436 is index 435
# 1-indexed 486 is index 485
$newLines = $lines[0..434] + $lines[486..($lines.Count-1)]
$utf8NoBom = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllLines('d:\AI\Site_Management\demo.html', $newLines, $utf8NoBom)
Write-Output "Successfully removed garbage lines"
