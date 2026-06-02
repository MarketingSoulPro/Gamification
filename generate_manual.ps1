$output = "e:\Kikich\Gamification\Mobile_App_User_Manual.pdf"

function EncodePdfString($s) {
    return $s -replace '\\', '\\\\' -replace '\(', '\\(' -replace '\)', '\\)'
}

$pages = @()

# Page 1: Cover
$pages += @"
q
0.95 0.65 0.30 rg
50 300 740 200 re
f
0.80 0.90 0.45 rg
60 520 160 160 re
f
0 0 0 RG
4 w
50 300 740 200 re S
60 520 160 160 re S
BT
/F2 44 Tf
120 580 Td
(My App User Manual) Tj
ET
BT
/F1 18 Tf
120 535 Td
(A warm guide for every user.) Tj
ET
BT
/F1 14 Tf
120 500 Td
(Page 1) Tj
ET
q
0.25 0.70 0.95 rg
80 560 30 0 360 arc
f
Q
0 0 0 rg
BT
/F1 12 Tf
68 545 Td
(Welcome!) Tj
ET
"@

# Page 2: Table of Contents
$pages += @"
BT
/F2 30 Tf
70 530 Td
(Table of Contents) Tj
ET
BT
/F1 14 Tf
70 490 Td
(1. Getting Started ...... 3) Tj
ET
BT
/F1 14 Tf
70 470 Td
(2. Main Features ...... 4) Tj
ET
BT
/F1 14 Tf
70 450 Td
(3. Settings ...... 5) Tj
ET
BT
/F1 14 Tf
70 430 Td
(4. Troubleshooting ...... 6) Tj
ET
BT
/F1 12 Tf
70 390 Td
(Use bright labels to find key actions quickly.) Tj
ET
BT
/F2 16 Tf
70 360 Td
(Tip: Keep this manual beside your device.) Tj
ET
"@

# Page 3: Getting Started
$pages += @"
q
0.20 0.70 0.65 rg
40 220 380 260 re
f
0.00 0.00 0.00 RG
2 w
40 220 380 260 re S
q
0.90 0.95 0.70 rg
60 360 22 0 360 arc
f
0 0 0 RG
0.8 w
60 360 22 0 360 arc S
Q
BT
/F2 18 Tf
70 460 Td
(Screenshot 1) Tj
ET
BT
/F1 12 Tf
70 440 Td
(Tap the bright start button.) Tj
ET
Q
BT
/F2 18 Tf
430 520 Td
(Getting Started) Tj
ET
BT
/F1 14 Tf
430 490 Td
(Step 1: Open the app.) Tj
ET
BT
/F1 12 Tf
430 470 Td
(Your home screen will appear softly.) Tj
ET
BT
/F1 14 Tf
430 450 Td
(Step 2: Choose Continue.) Tj
ET
BT
/F1 12 Tf
430 430 Td
(You are ready for your first adventure.) Tj
ET
BT
/F2 12 Tf
430 390 Td
(Tip: If the app asks for access, say yes.) Tj
ET
BT
/F2 12 Tf
430 360 Td
(Need help? Turn the page for a quick guide.) Tj
ET
"@

# Page 4: Main Features
$pages += @"
q
0.99 0.73 0.58 rg
40 220 380 260 re
f
0.00 0.00 0.00 RG
2 w
40 220 380 260 re S
q
0.95 0.55 0.60 rg
80 420 24 0 360 arc
f
0 0 0 RG
0.8 w
80 420 24 0 360 arc S
Q
BT
/F2 18 Tf
70 460 Td
(Screenshot 2) Tj
ET
BT
/F1 12 Tf
70 440 Td
(See the fun dashboard and rewards.) Tj
ET
Q
BT
/F2 18 Tf
430 520 Td
(Main Features) Tj
ET
BT
/F1 14 Tf
430 490 Td
(Step 1: Tap the main menu.) Tj
ET
BT
/F1 12 Tf
430 470 Td
(Explore tasks, progress, and rewards.) Tj
ET
BT
/F1 14 Tf
430 450 Td
(Step 2: Use bright labels to move fast.) Tj
ET
BT
/F1 12 Tf
430 430 Td
(Each button is easy to find.) Tj
ET
BT
/F2 12 Tf
430 390 Td
(Important: Save your progress often.) Tj
ET
"@

# Page 5: Settings
$pages += @"
q
0.95 0.80 0.55 rg
40 220 380 260 re
f
0.00 0.00 0.00 RG
2 w
40 220 380 260 re S
q
0.98 0.78 0.37 rg
100 430 20 0 360 arc
f
0 0 0 RG
0.8 w
100 430 20 0 360 arc S
Q
BT
/F2 18 Tf
70 460 Td
(Screenshot 3) Tj
ET
BT
/F1 12 Tf
70 440 Td
(Check the cozy settings panel.) Tj
ET
Q
BT
/F2 18 Tf
430 520 Td
(Settings) Tj
ET
BT
/F1 14 Tf
430 490 Td
(Step 1: Open Settings.) Tj
ET
BT
/F1 12 Tf
430 470 Td
(Adjust sound, notifications, and colors.) Tj
ET
BT
/F1 14 Tf
430 450 Td
(Step 2: Tap Save.) Tj
ET
BT
/F1 12 Tf
430 430 Td
(Your choices stay in place.) Tj
ET
BT
/F2 12 Tf
430 390 Td
(Tip: Use gentle colors for a calm screen.) Tj
ET
"@

# Page 6: Troubleshooting
$pages += @"
q
0.88 0.90 0.40 rg
40 220 380 260 re
f
0.00 0.00 0.00 RG
2 w
40 220 380 260 re S
q
0.95 0.95 0.55 rg
90 430 20 0 360 arc
f
0 0 0 RG
0.8 w
90 430 20 0 360 arc S
Q
BT
/F2 18 Tf
70 460 Td
(Screenshot 4) Tj
ET
BT
/F1 12 Tf
70 440 Td
(Find help if something feels stuck.) Tj
ET
Q
BT
/F2 18 Tf
430 520 Td
(Troubleshooting) Tj
ET
BT
/F1 14 Tf
430 490 Td
(Step 1: Check your connection.) Tj
ET
BT
/F1 12 Tf
430 470 Td
(Restart the app if it pauses.) Tj
ET
BT
/F1 14 Tf
430 450 Td
(Step 2: Try again calmly.) Tj
ET
BT
/F1 12 Tf
430 430 Td
(You can always return to the home screen.) Tj
ET
BT
/F2 12 Tf
430 390 Td
(Tip: If something still goes wrong, ask a friend.) Tj
ET
"@

# Build PDF objects
$objs = @()
$objs += "%PDF-1.4`n"
$objs += "1 0 obj<</Type /Catalog /Pages 2 0 R>>`nendobj`n"
$objs += "2 0 obj<</Type /Pages /Kids [3 0 R 4 0 R 5 0 R 6 0 R 7 0 R 8 0 R] /Count 6>>`nendobj`n"

for ($i = 0; $i -lt 6; $i++) {
    $pageNum = 3 + $i
    $contentNum = 11 + $i
    $objs += "$pageNum 0 obj<</Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Contents $contentNum 0 R /Resources <</Font <</F1 9 0 R /F2 10 0 R>>>>>>`nendobj`n"
}

$objs += "9 0 obj<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>`nendobj`n"
$objs += "10 0 obj<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold>>`nendobj`n"

for ($i = 0; $i -lt 6; $i++) {
    $content = $pages[$i]
    $byteLength = [System.Text.Encoding]::ASCII.GetByteCount($content)
    $objs += "$(11 + $i) 0 obj<</Length $byteLength>>`nstream`n$content`nendstream`nendobj`n"
}

# Compose file and calculate xref offsets
$byteList = New-Object System.Collections.Generic.List[byte]
foreach ($obj in $objs) {
    $bytes = [System.Text.Encoding]::ASCII.GetBytes($obj)
    $byteList.AddRange($bytes)
}

$xrefStart = $byteList.Count
$offsets = @()
$pos = 0
foreach ($obj in $objs) {
    $offsets += $pos
    $pos += [System.Text.Encoding]::ASCII.GetByteCount($obj)
}

$header = @()  # will include header and xref after objects
$xref = "xref`n0 $($objs.Count + 1)`n0000000000 65535 f `n"
for ($i = 0; $i -lt $offsets.Count; $i++) {
    $xref += "{0:D10} 00000 n `n" -f $offsets[$i]
}

$trailer = "trailer<</Size $($objs.Count + 1)/Root 1 0 R>>`nstartxref`n$xrefStart`n%%EOF`n"
$byteList.AddRange([System.Text.Encoding]::ASCII.GetBytes($xref))
$byteList.AddRange([System.Text.Encoding]::ASCII.GetBytes($trailer))

[System.IO.File]::WriteAllBytes($output, $byteList.ToArray())
Write-Host "Created PDF at $output"
