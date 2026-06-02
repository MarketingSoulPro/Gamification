Add-Type -AssemblyName System.Drawing

$images = @('screenshot-dashboard.png','screenshot-quests.png','screenshot-settings.png','screenshot-shop.png','screenshot-notes.png')
foreach ($img in $images) {
    $src = Join-Path (Get-Location) $img
    if (-not (Test-Path $src)) { Write-Host "Skipping missing $img"; continue }
    $bmp = [System.Drawing.Image]::FromFile($src)
    $maxWidth = 1000
    $ratio = [math]::Min(1, $maxWidth / $bmp.Width)
    $newW = [int]($bmp.Width * $ratio)
    $newH = [int]($bmp.Height * $ratio)
    $thumb = New-Object System.Drawing.Bitmap $newW, $newH
    $g = [System.Drawing.Graphics]::FromImage($thumb)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($bmp, 0,0, $newW, $newH)
    $g.Dispose()
    $out = [System.IO.Path]::ChangeExtension($src, '.small.jpg')
    $thumb.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $thumb.Dispose()
    $bmp.Dispose()
    Write-Host "Saved $out"
}
