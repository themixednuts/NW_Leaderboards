export function formatNumberToSI(number: number) {
  const units = ['', 'K', 'M', 'B', 'T']
  const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3)
  const value = number / Math.pow(1000, unitIndex)

  return value.toFixed(2) + units[unitIndex]
}

export function addPNG(string: string) {
  const regex = /<img.*?src="(.*?)".*?>/i;
  const matches = regex.exec(string);
  if (!matches) return string

  const srcAttributeValue = matches[1];

  // Append .png to the src attribute value
  const modifiedSrc = '/' + srcAttributeValue + '.png';
  const modifiedString = string.replace(srcAttributeValue, modifiedSrc);
  return modifiedString
} 
