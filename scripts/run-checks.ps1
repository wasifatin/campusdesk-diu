Write-Host "=== SEC-04: Checking for NEXT_PUBLIC ==="
$np = Get-ChildItem -Recurse -File | Where-Object { 
    $_.FullName -notmatch '[\\/](node_modules|\.next|\.git)[\\/]' 
} | Select-String -Pattern 'NEXT_PUBLIC'
if ($np) {
    $np | ForEach-Object { Write-Host "FOUND: $($_.Path):$($_.LineNumber): $($_.Line)" }
} else {
    Write-Host "PASSED: Zero NEXT_PUBLIC occurrences."
}

Write-Host "`n=== SEC-34: Checking dangerouslySetInnerHTML, innerHTML, eval ==="
$xss = Get-ChildItem -Recurse -File | Where-Object { 
    $_.FullName -notmatch '[\\/](node_modules|\.next|\.git)[\\/]' -and
    $_.Extension -match '\.(tsx?|jsx?|html)$'
} | Select-String -Pattern 'dangerouslySetInnerHTML|innerHTML|eval\('
if ($xss) {
    $xss | ForEach-Object { Write-Host "FOUND: $($_.Path):$($_.LineNumber): $($_.Line)" }
} else {
    Write-Host "PASSED: Zero dangerouslySetInnerHTML, innerHTML, or eval() calls."
}

Write-Host "`n=== SEC-09: Client Bundle Scan (.next/static) ==="
if (Test-Path '.next/static') {
    $hits = Get-ChildItem -Recurse -File '.next/static' | Select-String -Pattern 'AI_API_KEY|generativelanguage\.googleapis\.com|api\.openai\.com|api\.groq\.com'
    if ($hits) {
        Write-Host "LEAK DETECTED in .next/static:" $hits.Count
    } else {
        Write-Host "PASSED: Zero AI keys, provider URLs, or secrets in client bundle .next/static"
    }
} else {
    Write-Host ".next/static does not exist yet."
}
