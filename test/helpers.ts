export function givenHash(hashBinString: string): [number, number] {
  return [parseInt(hashBinString, 2), hashBinString.length];
}
