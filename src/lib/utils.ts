export function replaceLynshineSrc(src?: string) {
  if (!src) return src
  const lowersrc = src.toLowerCase()
  const idx = src.indexOf("lyshine")
  if (src[idx - 1] === "/")
    return lowersrc.replace(
      '/lyshineui/images',
      'https://cdn.nwdb.info/db/images/live/v35',
    )
  return lowersrc.replace(
    'lyshineui/images',
    'https://cdn.nwdb.info/db/images/live/v35',
  )
}
export function appendPngToSrc(htmlString: string): string {
  // Use a regular expression to find and modify the src attribute
  const modifiedHtmlString = htmlString.replace(/(src="[^"]*")/g, (match, src) => {
    // Append ".png" to the src attribute
    return `${src.slice(0, -1)}.png"`;
  });

  return modifiedHtmlString;
}
