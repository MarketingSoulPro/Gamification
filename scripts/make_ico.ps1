$pngPath = "e:\Kikich\Gamification\img\logo.png"
$icoPath = "e:\Kikich\Gamification\img\logo.ico"

if (-not (Test-Path $pngPath)) {
    Write-Error "Source PNG not found at $pngPath"
    exit 1
}

$pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
$pngSize = $pngBytes.Length

# Create 22-byte ICO header
$header = New-Object byte[] 22
$header[0] = 0x00 # Reserved
$header[1] = 0x00
$header[2] = 0x01 # Type = 1 (Icon)
$header[3] = 0x00
$header[4] = 0x01 # Image count = 1
$header[5] = 0x00

# Directory Entry
$header[6] = 0x00 # Width (0 = 256)
$header[7] = 0x00 # Height (0 = 256)
$header[8] = 0x00 # Color Palette count
$header[9] = 0x00 # Reserved
$header[10] = 0x01 # Color planes = 1
$header[11] = 0x00
$header[12] = 0x20 # Bits per pixel = 32
$header[13] = 0x00

# Size of PNG (4 bytes, little endian)
$header[14] = [byte]($pngSize -band 0xFF)
$header[15] = [byte](($pngSize -shr 8) -band 0xFF)
$header[16] = [byte](($pngSize -shr 16) -band 0xFF)
$header[17] = [byte](($pngSize -shr 24) -band 0xFF)

# Offset to PNG (4 bytes, little-endian, always 22 = 0x16)
$header[18] = 0x16
$header[19] = 0x00
$header[20] = 0x00
$header[21] = 0x00

$icoBytes = New-Object byte[] ($pngSize + 22)
[System.Array]::Copy($header, 0, $icoBytes, 0, 22)
[System.Array]::Copy($pngBytes, 0, $icoBytes, 22, $pngSize)

[System.IO.File]::WriteAllBytes($icoPath, $icoBytes)
Write-Host "Created ICO file at $icoPath"
