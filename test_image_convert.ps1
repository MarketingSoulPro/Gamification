Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('screenshot-dashboard.png')
$img.Save('screenshot-dashboard-test.jpg',[System.Drawing.Imaging.ImageFormat]::Jpeg)
Write-Host 'ok'