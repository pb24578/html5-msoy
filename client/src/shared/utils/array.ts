/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray array to split
 * @param chunkSize Size of every group
 */
export function chunkArray<T>(myArray: Array<T>, chunkSize: number) {
  if (!myArray) return [[]];
  const arrayLength = myArray.length;
  const tempArray = [];

  for (let index = 0; index < arrayLength; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize);
    tempArray.push(myChunk);
  }

  return tempArray;
}
