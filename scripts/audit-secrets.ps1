$files = Get-ChildItem -Recurse -File | Where-Object { 
    $_.FullName -notmatch '[\\/](node_modules|\.next|\.git)[\\/]' -and 
    $_.Name -ne 'package-lock.json' 
}
foreach ($f in $files) {
    $matches = Select-String -Path $f.FullName -Pattern 'api[_-]?key|secret|token|password|sk-|AIza'
    foreach ($m in $matches) {
        $l = $m.Line.Trim()
        if ($l.Length -gt 110) { $l = $l.Substring(0, 110) + '...' }
        Write-Host "$($f.Name):$($m.LineNumber): $l"
    }
}

