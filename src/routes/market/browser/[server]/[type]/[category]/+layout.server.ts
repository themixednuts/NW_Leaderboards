import type { LayoutServerLoad } from './$types'
import filters from '$lib/assets/filter.json'
import { getCraftingLocale } from '$lib/server/locales'
import { categoryWeights } from '$lib/utils'
import type { Config } from '@sveltejs/adapter-vercel'

const config: Config = {
  runtime: 'edge'

}
export const load = (async ({ params: { category }, url: { searchParams }}) => {
  const family = searchParams.get('family')
  // const group = searchParams.get('group')
  const craftingLocales = await getCraftingLocale()
  let filter
  if (category && category.toLowerCase() !== 'all') {
    for (const catKey in filters) {
      if (catKey.toLowerCase() === category.toLowerCase()) {
        //@ts-expect-error
        const familyKeys = Object.keys(filters[catKey])
        const filterList = []
        for (const famKey of familyKeys) {
          const str = `CategoryData_${famKey.replace('@', '')}`.toLowerCase()
          const displayName = craftingLocales[str]
          filterList.push([famKey, displayName])
        }
        filter = filterList
        for (const familyKey of familyKeys) {
          if (family && family.toLowerCase() === familyKey.toLowerCase()) {
            //@ts-expect-error
            const groups = filters[catKey][familyKey]
            const filterList = []
            for (const group of groups) {
              const str = `${group.replace('@', '')}_GroupName`.toLowerCase()
              const displayName = craftingLocales[str]
              filterList.push([group, displayName])
            }
            filter = filterList
          }
        }
      }
    }
  } else {
    const filterList = []
    for (const filterkey in filters) {
      const str = `CategoryData_${filterkey}`.toLowerCase()
      const displayName = craftingLocales[str]

      filterList.push([filterkey, displayName])
    }
    filter = filterList
    //@ts-expect-error
    filter.sort((a, b) => categoryWeights[b[0]?.toLowerCase()] - categoryWeights[a[0]?.toLowerCase()])
  }

  return {
    filter: filter as unknown as [string, string],
  }
}) satisfies LayoutServerLoad
