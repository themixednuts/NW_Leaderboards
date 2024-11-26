<script lang="ts">
  import { page } from '$app/stores'
  import {
    leaderboard_group_by,
    normalize_leaderboard_string,
    match_leaderboard,
    getBannerMapKey,
    get_seasons,
    normalize_string,
    LEADERBOARD_TYPE,
  } from '$lib/leaderboard/utils'
  import { Button } from '@/shadcn/components/ui/button'
  import * as DropdownMenu from '@/shadcn/components/ui/dropdown-menu'
  import ScrollArea from '@/shadcn/components/ui/scroll-area/scroll-area.svelte'
  import { cn } from '@/shadcn/utils.js'
  import type { LayoutData } from './$types.js'
  import { toast } from 'svelte-sonner'
  import type { Snippet } from 'svelte'
  import Banner from '@/leaderboard/banner.svelte'

  interface Props {
    data: LayoutData
    children: Snippet
  }

  let { data, children }: Props = $props()
  let { season, type, category, rotation, first, second } = $derived($page.params)
  let displayName = $derived($page.url.searchParams.get('q'))

  let seasons: ReturnType<typeof get_seasons> | undefined = $derived(get_seasons(data.seasons))
  let leaderboard = $derived(
    data.leaderboards.find((lb) =>
      match_leaderboard(lb, {
        //@ts-expect-error
        FirstLevelCategory: first,
        Category: category,
        SecondLevelCategory: second,
        //@ts-expect-error
        Rotation: rotation,
        CharacterLeaderboard: type === 'character' ? true : undefined,
        FactionLeaderboard: type === 'faction' ? true : undefined,
        GroupLeaderboard: type === 'group' ? true : undefined,
        CompanyLeaderboard: type === 'company' ? true : undefined,
        //@ts-expect-error
        DisplayName: displayName,
      }),
    ),
  )

  const rotations = $derived([...new Set(data.leaderboards?.map((lb) => lb.Rotation))])

  let group_by_category = $derived(
    leaderboard_group_by(
      data.leaderboards?.filter((lb) =>
        match_leaderboard(lb, {
          FirstLevelCategory: leaderboard?.FirstLevelCategory,
        }),
      ),
    ),
  )

  $effect(() => {
    if (!data.session?.user)
      toast.info('Want your character name shown?', {
        description:
          'Login and upload your game.log file to claim a character and change it to public for others to see!',
      })
  })
</script>

<div
  class="relative grid max-h-fit w-full grid-flow-row grid-cols-[minmax(min-content,1fr)] grid-rows-[repeat(3,min-content)] gap-2 px-2 py-2 contain-paint md:grid-cols-[repeat(2,minmax(min-content,1fr))] md:grid-rows-[repeat(2,min-content),repeat(2,minmax(min-content,1fr))] lg:grid-cols-[20rem,1fr] lg:grid-rows-[15rem,58rem]"
>
  {#if data.leaderboards}
    <!-- class="col-span-full row-span-1 row-start-1 flex size-full max-h-60 place-content-center border-2 p-2 lg:col-start-2 lg:place-self-start" -->
    <Banner
      href="/lb"
      label={getBannerMapKey(first)}
      class="col-span-full row-span-1 row-start-1 size-full max-h-60 lg:col-start-2 lg:place-self-start"
    />
    <div
      class="col-span-full col-start-1 row-start-2 grid h-full w-full grid-cols-[repeat(2,minmax(min-content,1fr))] grid-rows-3 place-items-center border-2 p-2 md:col-span-1 md:col-start-1 lg:row-start-1 lg:row-end-2"
    >
      <div class="col-span-full grid grid-cols-subgrid self-end">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button variant="outline" builders={[builder]} class=" w-full capitalize">
              {rotation}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {#each rotations as rotation}
              <DropdownMenu.Item>
                <a
                  href={`/lb/${first}/${category}/${second}/${rotation.toLowerCase()}/${type}/${season}/1`}
                  class="rounded-none capitalize"
                >
                  {rotation}
                </a>
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        {#if seasons}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button variant="outline" builders={[builder]} class="w-full capitalize">
                {seasons.find((s) => season === s.id)?.label || seasons[0].label}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {#each seasons as season}
                <DropdownMenu.Item>
                  <a
                    href={`/lb/${first}/${category}/${second}/${rotation}/${type}/${season.id}/1`}
                    class="self size-full rounded-none"
                  >
                    {season.label}
                  </a>
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {/if}
      </div>

      <div class="col-span-full row-start-2 grid w-full min-w-fit grid-flow-col rounded-none">
        <Button
          variant="outline"
          class={cn('', {
            'pointer-events-none opacity-30': !data.leaderboards?.find((lb) =>
              match_leaderboard(lb, { FactionLeaderboard: true, FirstLevelCategory: leaderboard?.FirstLevelCategory }),
            ),
            'ring ring-inset ring-ring': type === 'faction',
          })}
          href={`/lb/${first}/${category}/${second}/${rotation}/faction/${season}/1`}
        >
          Faction
        </Button>
        <Button
          variant="outline"
          class={cn('', {
            'pointer-events-none opacity-30': !data.leaderboards?.find((lb) =>
              match_leaderboard(lb, { CompanyLeaderboard: true, FirstLevelCategory: leaderboard?.FirstLevelCategory }),
            ),
            'ring ring-inset ring-ring': type === 'company',
          })}
          href={`/lb/${first}/${category}/${second}/${rotation}/company/${season}/1`}
        >
          Company
        </Button>
        <Button
          variant="outline"
          class={cn('', {
            'pointer-events-none opacity-30': !data.leaderboards?.find((leaderboard) =>
              match_leaderboard(leaderboard, { CharacterLeaderboard: true }),
            ),
            'ring ring-inset ring-ring': type === 'character',
          })}
          href={`/lb/${first}/${category}/${second}/${rotation}/character/${season}/1`}
        >
          Character
        </Button>
      </div>
      <div class="col-span-full w-full self-start">
        {#if data.leaderboards && leaderboard?.DisplayName}
          {@const lbs = data.leaderboards.filter((lb) =>
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                <Button variant="outline" builders={[builder]} class="w-full capitalize">
                  {leaderboard?.DisplayName}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {#each lbs as leaderboard}
                  <DropdownMenu.Item>
                    <a
                      href={`/lb/${first}/${category}/${second}/${rotation}/${type}/${season}/1?q=${normalize_leaderboard_string(leaderboard, 'DisplayName')}`}
                      class="rounded-none"
                    >
                      {leaderboard.DisplayName}
                    </a>
                  </DropdownMenu.Item>
                {/each}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          {/if}
        {/if}
      </div>
    </div>
    <ScrollArea
      class="col-span-full col-start-1 row-start-3 row-end-4 flex h-64 w-full max-w-full flex-col gap-4 overflow-y-auto overflow-x-clip border-2  uppercase contain-paint md:col-start-2 md:row-start-2 md:row-end-3 lg:col-span-1 lg:col-start-1 lg:row-span-full lg:row-start-2 lg:h-full"
    >
      {#if group_by_category?.length}
        {#each group_by_category as [cat, category_leaderboards] (cat)}
          <div class="flex grow-0 flex-col">
            <div class="flex grow flex-nowrap gap-2 px-2 pt-2 text-left text-xl">
              {@html cat?.replace('/lyshineui/images', 'https://cdn.nwdb.info/db/images/live/v35')}
            </div>
            {#if category_leaderboards}
              {#each category_leaderboards as [secondlevelcategory, secondlevelcategory_leaderboards] (cat + secondlevelcategory)}
                {@const lb =
                  secondlevelcategory_leaderboards?.find((lb) =>
                    match_leaderboard(lb, {
                      //@ts-ignore-error
                      [LEADERBOARD_TYPE[type]]: true,
                      //@ts-ignore-error
                      FirstLevelCategory: first,
                      //@ts-ignore-error
                      Rotation: rotation,
                    }),
                  ) ?? secondlevelcategory_leaderboards?.[0]}
                {#if lb}
                  <Button
                    variant="outline"
                    class={cn(
                      'flex justify-start border-l-4 border-transparent  hover:animate-[pulse_1.5s_ease-in-out_infinite] hover:border-l-primary',
                      {
                        'border-l-blue-bright': match_leaderboard(lb, {
                          //@ts-ignore-error
                          [LEADERBOARD_TYPE[type]]: true,
                          //@ts-ignore-error
                          FirstLevelCategory: first,
                          SecondLevelCategory: second,
                          Category: category,
                          //@ts-ignore-error
                          Rotation: rotation,
                        }),
                        'pointer-events-none opacity-30': !match_leaderboard(lb, {
                          //@ts-ignore-error
                          [LEADERBOARD_TYPE[type]]: true,
                        }),
                      },
                    )}
                    href={`/lb/${first}/${normalize_string(cat)}/${normalize_leaderboard_string(lb, 'SecondLevelCategory')}/${normalize_leaderboard_string(lb, 'Rotation')}/${type}/${season}/1`}
                  >
                    {secondlevelcategory}
                  </Button>
                {/if}
              {/each}
            {/if}
          </div>
        {/each}
      {/if}
    </ScrollArea>
    <div
      class="relative col-span-full row-span-2 row-start-4 grid h-full w-full grid-cols-1 place-self-start border-2 md:row-span-full md:row-start-3 lg:col-start-2 lg:row-start-2"
    >
      {@render children()}
    </div>
  {/if}
</div>
