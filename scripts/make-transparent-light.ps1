Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path (Get-Location) "logo.jpg"
$destTrans = Join-Path (Get-Location) "logo-transparent.png"
$destPublicTrans = Join-Path (Get-Location) "public\logo-transparent.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$bmp = New-Object System.Drawing.Bitmap($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $src.Height; $y++) {
    for ($x = 0; $x -lt $src.Width; $x++) {
        $c = $src.GetPixel($x, $y)
        # If white / near-white background
        if ($c.R -gt 215 -and $c.G -gt 215 -and $c.B -gt 215) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
        else {
            $bmp.SetPixel($x, $y, $c)
        }
    }
}

$bmp.Save($destTrans, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($destPublicTrans, [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$bmp.Dispose()
Write-Output "FINISHED_LOGO_TRANSPARENT"

