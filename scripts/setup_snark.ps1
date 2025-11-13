param(
    [string]$CircomPath = "circom",
    [string]$SnarkjsPath = "snarkjs",
    [string]$Circuit = "circuits/auth.circom",
    [string]$BuildDir = "build",
    [string]$CircuitName = "auth"
)

# Ensure build directory exists
if (-not (Test-Path $BuildDir)) {
    New-Item -ItemType Directory -Path $BuildDir | Out-Null
}

$wasmDir = Join-Path $BuildDir "$CircuitName" + "_js"
$r1csPath = Join-Path $BuildDir "$CircuitName.r1cs"
$wasmPath = Join-Path $wasmDir "$CircuitName.wasm"
$zkeyPath = Join-Path $BuildDir "$CircuitName_final.zkey"
$verificationKeyPath = Join-Path "keys" "${CircuitName}_verification_key.json"
$provingKeyPath = Join-Path "keys" "${CircuitName}_proving_key.zkey"

Write-Host "[1/5] Compiling circuit with circom..."
& $CircomPath $Circuit --r1cs --wasm --sym -o $BuildDir
if ($LASTEXITCODE -ne 0) {
    throw "circom compilation failed."
}

Write-Host "[2/6] Running Powers of Tau ceremony (Groth16 phase 1)..."
$ptauPath = Join-Path $BuildDir "powersOfTau28_hez_final.ptau"
$ptauIntermediate = Join-Path $BuildDir "powersOfTau28_intermediate.ptau"
if (-not (Test-Path $ptauPath)) {
    & $SnarkjsPath powersoftau new bn128 12 $ptauIntermediate -v
    if ($LASTEXITCODE -ne 0) {
        throw "snarkjs powersoftau new failed."
    }
    & $SnarkjsPath powersoftau contribute $ptauIntermediate $ptauIntermediate --name="Initial Contributor" -v
    if ($LASTEXITCODE -ne 0) {
        throw "snarkjs powersoftau contribute failed."
    }
    Write-Host "[3/6] Preparing phase 2..."
    & $SnarkjsPath powersoftau prepare phase2 $ptauIntermediate $ptauPath -v
    if ($LASTEXITCODE -ne 0) {
        throw "snarkjs powersoftau prepare phase2 failed."
    }
}

Write-Host "[4/6] Generating Groth16 proving/verification keys..."
$tempZkey = Join-Path $BuildDir "$CircuitName_0000.zkey"
& $SnarkjsPath groth16 setup $r1csPath $ptauPath $tempZkey
if ($LASTEXITCODE -ne 0) {
    throw "snarkjs groth16 setup failed."
}

& $SnarkjsPath zkey contribute $tempZkey $zkeyPath --name="Key Contributor" -v
if ($LASTEXITCODE -ne 0) {
    throw "snarkjs zkey contribute failed."
}

Write-Host "[5/6] Exporting verification key..."
& $SnarkjsPath zkey export verificationkey $zkeyPath $verificationKeyPath
if ($LASTEXITCODE -ne 0) {
    throw "snarkjs export verification key failed."
}

Copy-Item $zkeyPath $provingKeyPath -Force

Write-Host "[6/6] Setup complete!"
Write-Host "Setup complete. Artifacts stored in '$BuildDir' and 'keys'."
