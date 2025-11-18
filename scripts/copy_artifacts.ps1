# Copy zkSNARK artifacts to static directory for web access

Write-Host "Copying zkSNARK artifacts to static directory..." -ForegroundColor Cyan

# Create static directory if it doesn't exist
$staticDir = "static"
if (-not (Test-Path $staticDir)) {
    New-Item -ItemType Directory -Path $staticDir | Out-Null
    Write-Host "Created static directory" -ForegroundColor Green
}

# Copy WASM file
$wasmSource = "build\auth_js\auth.wasm"
$wasmDest = "static\auth.wasm"
if (Test-Path $wasmSource) {
    Copy-Item $wasmSource $wasmDest -Force
    Write-Host "✓ Copied auth.wasm" -ForegroundColor Green
} else {
    Write-Host "✗ WASM file not found: $wasmSource" -ForegroundColor Red
    Write-Host "  Run 'pwsh scripts\setup_snark.ps1' first" -ForegroundColor Yellow
}

# Copy proving key
$zkeySource = "keys\auth_proving_key.zkey"
$zkeyDest = "static\auth_proving_key.zkey"
if (Test-Path $zkeySource) {
    Copy-Item $zkeySource $zkeyDest -Force
    Write-Host "✓ Copied auth_proving_key.zkey" -ForegroundColor Green
} else {
    Write-Host "✗ Proving key not found: $zkeySource" -ForegroundColor Red
    Write-Host "  Run 'pwsh scripts\setup_snark.ps1' first" -ForegroundColor Yellow
}

# Copy verification key
$vkeySource = "keys\auth_verification_key.json"
$vkeyDest = "static\auth_verification_key.json"
if (Test-Path $vkeySource) {
    Copy-Item $vkeySource $vkeyDest -Force
    Write-Host "✓ Copied auth_verification_key.json" -ForegroundColor Green
} else {
    Write-Host "✗ Verification key not found: $vkeySource" -ForegroundColor Red
    Write-Host "  Run 'pwsh scripts\setup_snark.ps1' first" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done! Artifacts are ready for web interface." -ForegroundColor Cyan
Write-Host "You can now start the API server with: python api_server.py" -ForegroundColor Gray

