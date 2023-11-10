
export async function getCraftingLocale() {
  const xml = await fetch(
    'https://raw.githubusercontent.com/new-world-tools/localization/main/javelindata_craftingcategories.loc.xml',
  ).then((res) => res.text())

  const lines = xml.split('\n').map(line => line.trim());

  // Initialize an object to store the parsed data
  const craftingLocales: { [k: string]: string } = {};

  // Iterate through each line to extract key and text content
  lines.forEach(line => {
    const keyMatch = /key="([^"]+)"/.exec(line);
    const textMatch = /<string.*?>([^<]+)<\/string>/.exec(line);

    if (keyMatch && textMatch) {
      const key = keyMatch[1].toLowerCase();
      const value = textMatch[1];
      craftingLocales[key] = value;
    }
  });

  return craftingLocales
}

