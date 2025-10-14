import { sha256 } from "./hashing"

export const timingSafeCompare = async (
  a: string | object | boolean,
  b: string | object | boolean,
  hashFunction?: Function
): Promise<boolean> => {
  if (!hashFunction || typeof hashFunction !== 'function') {
    hashFunction = sha256;
  }

  const [resultA, resultB] = await Promise.all([hashFunction(a), hashFunction(b)])

  if (!resultA || !resultB) {
    return false
  }

  return resultA === resultB && a === b
}