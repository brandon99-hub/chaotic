const SNARK_FIELD_MODULUS = 21888242871839275222246405745257275088548364400416034343698204186575808495617n

export async function hashPasswordToField(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  const hashInt = BigInt('0x' + hashHex)
  return hashInt % SNARK_FIELD_MODULUS
}

export function reduceToField(value) {
  const bigValue = typeof value === 'bigint' ? value : BigInt(value)
  return bigValue % SNARK_FIELD_MODULUS
}

export function computeCommitment(g0, secretX) {
  const g0Big = typeof g0 === 'bigint' ? g0 : BigInt(g0)
  const xBig = typeof secretX === 'bigint' ? secretX : BigInt(secretX)
  return (g0Big * xBig) % SNARK_FIELD_MODULUS
}

