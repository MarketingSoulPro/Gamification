Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('screenshot-notes.png')
$img.Save('screenshot-notes.jpg',[System.Drawing.Imaging.ImageFormat]::Jpeg)
$img.Dispose()
Write-Host 'saved'