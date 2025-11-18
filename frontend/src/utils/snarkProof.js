import * as snarkjs from 'snarkjs'

let wasmBuffer = null
let zkeyBuffer = null

export async function loadSnarkArtifacts() {
  if (!wasmBuffer) {
    const wasmResponse = await fetch('/static/auth.wasm')
    wasmBuffer = await wasmResponse.arrayBuffer()
  }
  
  if (!zkeyBuffer) {
    const zkeyResponse = await fetch('/static/auth_proving_key.zkey')
    zkeyBuffer = await zkeyResponse.arrayBuffer()
  }
  
  return { wasmBuffer, zkeyBuffer }
}

export async function generateProof(g0, secretX, commitmentY) {
  try {
    const { wasmBuffer, zkeyBuffer } = await loadSnarkArtifacts()
    
    const input = {
      g0: g0.toString(),
      Y: commitmentY.toString(),
      X: secretX.toString(),
    }
    
    console.log('[SNARK] Generating proof with input:', {
      g0: input.g0,
      Y: input.Y,
      X: '***REDACTED***'
    })
    
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      new Uint8Array(wasmBuffer),
      new Uint8Array(zkeyBuffer)
    )
    
    console.log('[SNARK] Proof generated successfully')
    console.log('[SNARK] Public signals:', publicSignals)
    
    return { proof, publicSignals }
  } catch (error) {
    console.error('[SNARK] Proof generation failed:', error)
    throw new Error(`zkSNARK proof generation failed: ${error.message}`)
  }
}

export async function verifyProofLocally(proof, publicSignals) {
  try {
    const vkeyResponse = await fetch('/static/auth_verification_key.json')
    const vkey = await vkeyResponse.json()
    
    const result = await snarkjs.groth16.verify(vkey, publicSignals, proof)
    return result
  } catch (error) {
    console.error('[SNARK] Local verification failed:', error)
    return false
  }
}

