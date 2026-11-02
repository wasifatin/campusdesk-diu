Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path (Get-Location) "logo.jpg"
$destDark = Join-Path (Get-Location) "logo-dark.png"
$destPublicDark = Join-Path (Get-Location) "public\logo-dark.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$bmp = New-Object System.Drawing.Bitmap($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $src.Height; $y++) {
    for ($x = 0; $x -lt $src.Width; $x++) {
        $c = $src.GetPixel($x, $y)
        # If white / near-white background
        if ($c.R -gt 210 -and $c.G -gt 210 -and $c.B -gt 210) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
        # If dark navy artwork ("Campus", graduation cap, desk outline)
        elseif ($c.R -lt 85 -and $c.G -lt 95 -and $c.B -lt 140) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        }
        else {
            $bmp.SetPixel($x, $y, $c)
        }
    }
}

$bmp.Save($destDark, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($destPublicDark, [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$bmp.Dispose()
Write-Output "FINISHED_LOGO_DARK"

