"# This script renders `user_manual.html` to PDF using Microsoft Edge in headless mode.
" | Out-Null

$outputPath = "e:\Kikich\Gamification\Questify_User_Manual.pdf"
$sourceHtml = "e:\Kikich\Gamification\user_manual.html"

function Find-EdgeExecutable {
    $candidates = @(
        "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
        "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
        "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    )
    foreach ($p in $candidates) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

$edge = Find-EdgeExecutable
if (-not $edge) {
    Write-Error "Microsoft Edge executable not found. Please install Edge or update the script with the path to msedge.exe."
    exit 1
}

if (-not (Test-Path $sourceHtml)) {
    Write-Error "Source HTML not found: $sourceHtml"
    exit 1
}

$resolved = (Resolve-Path $sourceHtml).ProviderPath -replace '\\','/'
$escapedSource = "file:///$resolved"

$args = @(
    '--headless',
    '--disable-gpu',
    '--print-to-pdf-no-header',
    "--print-to-pdf=$outputPath",
    '--no-sandbox',
    $escapedSource
)

Write-Host "Running Edge to print HTML -> PDF"
$process = Start-Process -FilePath $edge -ArgumentList $args -NoNewWindow -PassThru -Wait
$exitCode = $process.ExitCode
if ($exitCode -eq 0 -and (Test-Path $outputPath)) {
    Write-Host "Created PDF at $outputPath"
} else {
    Write-Error "Edge failed to create PDF. Exit code: $exitCode"
}

