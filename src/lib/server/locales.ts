// import { JSDOM } from 'jsdom'

export async function getCraftingLocale(){
  const xml = await fetch(
  'https://raw.githubusercontent.com/new-world-tools/localization/main/javelindata_craftingcategories.loc.xml',
).then((res) => res.text())
const parser = new DOMParser()
const document = parser.parseFromString(xml, 'text/xml') 
const strings = document.querySelectorAll('string')
const craftingLocales: { [k: string]: string | null } = {}
strings.forEach((ele) => {
  const key = ele.getAttribute('key')
  if (key) craftingLocales[key.toLowerCase()] = ele.textContent
})
return craftingLocales
}

