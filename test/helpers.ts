export function givenHash(hashBinString: string) {
  return [parseInt(hashBinString, 2), hashBinString.length];
}
