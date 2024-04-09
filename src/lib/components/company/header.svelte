<script lang="ts">
  import type { getCompanyWithMembersByName } from '@/server/db/gamedata/helpers'

  import { cn } from '@/shadcn/utils'
  interface Props {
    guild: NonNullable<Awaited<ReturnType<typeof getCompanyWithMembersByName>>>
  }

  let { guild }: Props = $props()
</script>

<div
  class={cn(
    'flex h-64 w-full flex-row flex-nowrap place-content-start place-items-center gap-10 rounded-2xl border-2 bg-gradient-to-br to-transparent to-60% p-6',
    {
      'from-faction-background-1-dark': guild.factionId === 1,
      'from-faction-background-2-dark': guild.factionId === 2,
      'from-faction-background-3-dark': guild.factionId === 3,
    },
  )}
>
  <div
    class="grid size-24 place-content-center place-items-center bg-black drop-shadow-2xl mask-size-contain mask-position-center"
    style="mask-image: url('/{guild.backgroundImagePath?.replace('dds', 'png')}');"
  >
    <div
      class={cn(
        ` col-start-1 row-start-1 size-24 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-add mask-mode-luminance`,
      )}
      style="background: {guild.backgroundColor}; mask-image: url('/{guild.backgroundImagePath?.replace(
        'dds',
        'png',
      )}');"
    />
    <div
      class={cn(
        ` col-start-1 row-start-1 size-24 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-add mask-mode-luminance`,
      )}
      style="background: {guild.foregroundColor}; mask-image: url('/{guild.foregroundImagePath?.replace(
        'dds',
        'png',
      )}');"
    />
  </div>
  <div class="flex flex-col place-content-start whitespace-nowrap px-2">
    <div class="text-xl font-bold text-white drop-shadow">
      {guild.name}
    </div>
    {#if guild.guildmaster}
      <div class="text-sm drop-shadow">
        Governor: {guild.guildmaster.name}
      </div>
    {/if}
  </div>
  <div class="ml-auto flex flex-col">
    <div>
      <span class="font-bold text-white">Members</span>
      <div class="text-sm">{guild.numPlayers}</div>
    </div>
    <div>
      <span class="font-bold text-white">Claims</span>
      <div class="text-sm">{guild.numClaims}</div>
    </div>
  </div>
</div>
