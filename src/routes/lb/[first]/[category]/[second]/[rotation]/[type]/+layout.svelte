<script lang="ts">
  import { page } from '$app/stores'
  import { assets, resolveRoute } from '$app/paths'
  import {
    leaderboard_group_by,
    normalize_leaderboard_string,
    match_leaderboard,
    bannerMap,
    currentImageBanner,
    FACTION_IMAGE_PATHS,
    getBannerMapKey,
    get_seasons,
    normalize_string,
    LEADERBOARD_TYPE,
  } from '$lib/leaderboard/utils'
  import type { LeaderboardData } from '$lib/leaderboard/types'
  import type { MouseEventHandler } from 'svelte/elements'

  let { data } = $props()
  let { season, type, category, rotation, first, second } = $derived($page.params)

  let seasons: ReturnType<typeof get_seasons> | undefined = $state()

  let leaderboards: LeaderboardData[] | undefined = $state()
  $inspect(leaderboards)

  let leaderboard: LeaderboardData | undefined = $state()
  $inspect(leaderboard)

  const rotations = $derived([...new Set(leaderboards?.map((lb) => lb.Rotation))])
  $inspect(rotations)

  let group_by_category = $derived(
    leaderboard_group_by(
      leaderboards?.filter((lb) =>
        match_leaderboard(lb, {
          FirstLevelCategory: leaderboard?.FirstLevelCategory,
        }),
      ),
    ),
  )
  $inspect(group_by_category)

  let currentIndex = 0
  let bannerImgSrc = $derived(currentImageBanner(getBannerMapKey(first), currentIndex))

  $effect(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % FACTION_IMAGE_PATHS.length
    }, 15000)

    if ($page.params.first !== 'factionwar') clearInterval(interval)
    return () => clearInterval(interval)
  })

  $effect(() => {
    setLeaderboard(data)
  })

  async function setLeaderboard(d: typeof data) {
    const lbs = await d.lbs
    leaderboards = lbs.leaderboards
    leaderboard = lbs.lb
    seasons = get_seasons(lbs.seasons)
  }

  function closeDialogs(e?: MouseEvent & { currentTarget: HTMLElement & EventTarget }) {
    const d = e?.currentTarget?.closest('details')
    document.querySelectorAll('details').forEach((detail) => {
      if (d === detail) return
      if (detail.open) detail.open = false
    })
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape') closeDialogs()
  }}
/>

<div
  class="relative grid max-h-fit w-full grid-flow-row grid-cols-[minmax(min-content,1fr)] grid-rows-[repeat(3,min-content)] gap-2 bg-base-300 px-2 py-2 contain-paint md:grid-cols-[repeat(2,minmax(min-content,1fr))] md:grid-rows-[repeat(2,min-content),repeat(2,minmax(min-content,1fr))] lg:grid-cols-[20rem,1fr] lg:grid-rows-[min-content,58rem]"
>
  {#if leaderboards}
    <div
      class="col-span-full row-span-1 row-start-1 flex size-full max-h-60 place-content-center border-2 border-base-100 p-2 lg:col-start-2 lg:place-self-start"
    >
      <a href="/lb" class="grid w-full grid-cols-1 grid-rows-1 overflow-clip border-2 border-stone-500">
        <img
          loading="lazy"
          src={`${assets}${bannerImgSrc}`}
          alt=""
          class="col-start-1 row-start-1 w-full object-cover"
        />
        <div
          class="col-start-1 row-start-1 mb-6 ml-6 self-end justify-self-start border-b-2 border-inherit text-xl text-white sm:text-4xl md:text-6xl"
        >
          {getBannerMapKey(first || 'Mutated Expeditions')}
        </div>
      </a>
    </div>
    <div
      class="col-span-full col-start-1 row-start-2 grid h-full w-full grid-cols-[repeat(2,minmax(min-content,1fr))] grid-rows-3 place-items-center border-2 border-base-100 p-2 md:col-span-1 md:col-start-1 lg:row-start-1 lg:row-end-2"
    >
      <div class="join col-span-full row-start-1 grid w-full min-w-fit grid-cols-subgrid gap-1 self-end rounded-none">
        <details class="dropdown">
          <summary class="btn join-item btn-xs w-full capitalize sm:btn-md" onclick={closeDialogs}>
            {rotation}
          </summary>
          <ul class="menu dropdown-content z-[1] w-52 bg-base-100 p-2 shadow">
            {#each rotations as rotation}
              <li>
                <a
                  href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]', {
                    first,
                    category,
                    second,
                    rotation: rotation.toLowerCase(),
                    type,
                    season,
                  })}
                  onclick={() => closeDialogs()}
                  class="rounded-none capitalize"
                >
                  {rotation}
                </a>
              </li>
            {/each}
          </ul>
        </details>
        {#if seasons}
          <details class="dropdown">
            <summary class="btn join-item btn-xs w-full sm:btn-md" onclick={closeDialogs}>
              {seasons.find((s) => season === s.id)?.label || seasons[0].label}
            </summary>
            <ul class="menu dropdown-content z-[1] w-52 bg-base-100 p-2 shadow">
              {#each seasons as season}
                <li>
                  <a
                    href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]', {
                      first,
                      category,
                      second,
                      rotation,
                      type,
                      season: season.id,
                    })}
                    onclick={() => closeDialogs()}
                    class="rounded-none"
                  >
                    {season.label}
                  </a>
                </li>
              {/each}
            </ul>
          </details>
        {/if}
      </div>
      <div class="join col-span-full row-start-2 w-full min-w-fit rounded-none">
        <a
          class="btn join-item btn-xs h-full grow text-center ring-inset sm:btn-md hover:ring"
          class:ring={type === 'faction'}
          class:btn-disabled={!leaderboards?.find((lb) =>
            match_leaderboard(lb, { FactionLeaderboard: true, FirstLevelCategory: leaderboard?.FirstLevelCategory }),
          )}
          href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]', {
            first,
            category,
            second,
            rotation,
            type: 'faction',
            season,
          })}
        >
          Faction
        </a>
        <a
          class="btn join-item btn-xs h-full grow text-center ring-inset sm:btn-md hover:ring"
          class:ring={type === 'company'}
          class:btn-disabled={!leaderboards?.find((lb) =>
            match_leaderboard(lb, { CompanyLeaderboard: true, FirstLevelCategory: leaderboard?.FirstLevelCategory }),
          )}
          href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]', {
            first,
            category,
            second,
            rotation,
            type: 'company',
            season,
          })}
        >
          Company
        </a>
        <a
          class="btn join-item btn-xs h-full grow text-center ring-inset sm:btn-md hover:ring"
          class:ring={type === 'character'}
          class:btn-disabled={!leaderboards?.find((leaderboard) =>
            match_leaderboard(leaderboard, { CharacterLeaderboard: true }),
          )}
          href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]', {
            first,
            category,
            second,
            rotation,
            type: 'character',
            season,
          })}
        >
          Character
        </a>
      </div>
      <div class="col-span-full w-full self-start">
        {#if leaderboards && leaderboard?.DisplayName}
          {@const lbs = leaderboards.filter((lb) =>
            match_leaderboard(lb, {
              DataSheetCategory: leaderboard?.DataSheetCategory,
              SecondLevelCategory: leaderboard?.SecondLevelCategory,
              CharacterLeaderboard: leaderboard?.CharacterLeaderboard,
              CompanyLeaderboard: leaderboard?.CompanyLeaderboard,
              FactionLeaderboard: leaderboard?.FactionLeaderboard,
              GroupLeaderboard: leaderboard?.GroupLeaderboard,
              GameMode: leaderboard?.GameMode,
              Rotation: leaderboard?.Rotation,
            }),
          )}
          <!-- {@debug lbs} -->
          {#if lbs.length > 1}
            <details class="dropdown w-full">
              <summary class="btn join-item btn-xs w-full rounded-none sm:btn-md" onclick={closeDialogs}>
                {leaderboard?.DisplayName}
              </summary>
              <ul class="menu dropdown-content z-[1] w-52 bg-base-100 p-2 shadow">
                {#each lbs as leaderboard}
                  <li>
                    <a
                      href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]?q=[name]', {
                        first,
                        category,
                        second,
                        rotation,
                        type,
                        season,
                        name: normalize_leaderboard_string(leaderboard, 'DisplayName'),
                      })}
                      onclick={() => closeDialogs()}
                      class="rounded-none"
                    >
                      {leaderboard.DisplayName}
                    </a>
                  </li>
                {/each}
              </ul>
            </details>
          {/if}
        {/if}
      </div>
    </div>
    <div
      class="col-span-full col-start-1 row-start-3 row-end-4 flex h-64 w-full max-w-full flex-col gap-4 overflow-y-auto overflow-x-clip border-2 border-base-100 bg-base-300 py-2 uppercase contain-paint md:col-start-2 md:row-start-2 md:row-end-3 lg:col-span-1 lg:col-start-1 lg:row-span-full lg:row-start-2 lg:h-full"
    >
      {#if group_by_category?.length}
        {#each group_by_category as [cat, category_leaderboards]}
          <div class="flex grow-0 flex-col gap-2 px-2">
            <div class="flex flex-nowrap border-b-2 border-base-100 bg-base-300 px-2 text-xl">
              {@html cat?.replace('/lyshineui/images', 'https://cdn.nwdb.info/db/images/live/v35')}
            </div>
            {#if category_leaderboards}
              {#each category_leaderboards as [secondlevelcategory, secondlevelcategory_leaderboards]}
                {@const lb =
                  secondlevelcategory_leaderboards?.find((lb) =>
                    match_leaderboard(lb, {
                      //@ts-ignore-error
                      [LEADERBOARD_TYPE[type]]: true,
                      //@ts-ignore-error
                      FirstLevelCategory: first,
                      // SecondLevelCategory: second,
                      Category: category,
                      //@ts-ignore-error
                      Rotation: rotation,
                    }),
                  ) || secondlevelcategory_leaderboards?.[0]}
                {#if lb}
                  <a
                    class="text-md btn flex w-full grow rounded-none border-4 border-transparent p-0 text-left hover:link hover:animate-[pulse_1.5s_ease-in-out_infinite] hover:border-l-primary"
                    class:border-l-primary={match_leaderboard(lb, {
                      //@ts-ignore-error
                      [LEADERBOARD_TYPE[type]]: true,
                      //@ts-ignore-error
                      FirstLevelCategory: first,
                      SecondLevelCategory: second,
                      Category: category,
                      //@ts-ignore-error
                      Rotation: rotation,
                    })}
                    class:btn-disabled={!match_leaderboard(lb, {
                      //@ts-ignore-error
                      [LEADERBOARD_TYPE[type]]: true,
                    })}
                    href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]', {
                      first,
                      category: normalize_string(cat),
                      second: normalize_leaderboard_string(lb, 'SecondLevelCategory'),
                      rotation: normalize_leaderboard_string(lb, 'Rotation'),
                      type,
                      season,
                    })}
                  >
                    <div class=" w-full whitespace-break-spaces pl-2">
                      {secondlevelcategory}
                    </div>
                  </a>
                {/if}
              {/each}
            {/if}
          </div>
        {/each}
      {/if}
    </div>
    <div
      class="relative col-span-full row-span-2 row-start-4 grid h-full w-full grid-cols-1 place-self-start border-2 border-base-100 md:row-span-full md:row-start-3 lg:col-start-2 lg:row-start-2"
    >
      <slot />
    </div>
  {/if}
</div>

<style>
  /* .my-grid {
    grid-template-rows:
      minmax(15vh, 0.3fr) min-content minmax(15vh, min-content)
      minmax(35vh, 1fr);
    grid-template-columns: repeat(2, minmax(min-content, auto)) repeat(2, minmax(min-content, 1fr));
  } */
</style>
