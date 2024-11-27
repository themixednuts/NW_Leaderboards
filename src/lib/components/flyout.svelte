<script lang="ts">
  import { Tooltip } from 'bits-ui'
  import type { getCharacterById, getCompanyById } from '@/server/db/gamedata/helpers'
  import { cn } from '@/shadcn/utils'
  import { normalize_name } from '@/utils'
  import type { PageData } from '../../routes/lb/[first]/[category]/[second]/[rotation]/[type]/[season]/[page]/$types'

  interface Props {
    data: Awaited<ReturnType<typeof getCharacterById>> | Awaited<ReturnType<typeof getCompanyById>>
  }

  let { data }: Props = $props()
</script>

<Tooltip.Root openDelay={0} disableHoverableContent>
  <Tooltip.Trigger>
    <div class="flex shrink-0 place-content-center gap-2">
      <div
        class="grid aspect-square size-6 shrink-0 place-content-center place-items-center overflow-clip border contain-paint mask-size-contain mask-position-center mask-composite-add"
        class:rounded-[50%]={data.type === 'character'}
        class:bg-faction-background-1={data.factionId === 1 && data.type === 'character'}
        class:bg-faction-background-2={data.factionId === 2 && data.type === 'character'}
        class:bg-faction-background-3={data.factionId === 3 && data.type === 'character'}
        class:border-faction-background-1-dark={data.factionId === 1}
        class:border-faction-background-2-dark={data.factionId === 2}
        class:border-faction-background-3-dark={data.factionId === 3}
        style={data.type === 'company'
          ? `mask-image: url('/${data.backgroundImagePath?.toLowerCase().replace('dds', 'png')}');`
          : ''}
      >
        {#if data.type === 'character'}
          <img
            loading="lazy"
            src="/{data.backgroundImagePath?.toLowerCase().replace('dds', 'png')}"
            alt="/"
            class="col-start-1 row-start-1 aspect-square"
          />
          <img
            loading="lazy"
            src="/{data.midgroundImagePath?.toLowerCase().replace('dds', 'png')}"
            alt=""
            class="col-start-1 row-start-1 aspect-square"
          />
          <img
            loading="lazy"
            src="/{data.foregroundImagePath?.toLowerCase().replace('dds', 'png')}"
            alt=""
            class="col-start-1 row-start-1 aspect-square"
          />
        {:else}
          <div
            class={cn(
              ` col-start-1 row-start-1 size-6 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-add mask-mode-luminance`,
            )}
            style="background: {data.backgroundColor}; mask-image: url('/{data.backgroundImagePath
              ?.toLowerCase()
              .replace('dds', 'png')}');"
          ></div>
          <div
            class={cn(
              ` col-start-1 row-start-1 size-6 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-add mask-mode-luminance`,
            )}
            style="background: {data.foregroundColor}; mask-image: url('/{data.foregroundImagePath
              ?.toLowerCase()
              .replace('dds', 'png')}');"
          ></div>
        {/if}
      </div>
      {#if data.name}
        <a href="/{data.type}/{normalize_name(data.name)}/{data.type === 'company' ? 'members' : ''}">
          {data.name}
        </a>
      {/if}
    </div>
  </Tooltip.Trigger>
  <Tooltip.Content side="top" align="start" class="shadow-4xl shadow-transparent">
    <div
      class="relative grid min-w-52 shrink-0 grid-cols-[min-content,auto] grid-rows-4 gap-x-2 rounded-lg shadow-2xl backdrop-blur-sm"
    >
      <div
        class="col-start-1 row-span-full grid aspect-square size-16 place-content-center place-items-center overflow-clip bg-card mask-size-contain mask-position-center"
        class:rounded-[50%]={data.type === 'character'}
        class:border-2={data.type === 'character'}
        class:bg-faction-background-1={data.factionId === 1 && data.type === 'character'}
        class:bg-faction-background-2={data.factionId === 2 && data.type === 'character'}
        class:bg-faction-background-3={data.factionId === 3 && data.type === 'character'}
        class:border-faction-background-1-dark={data.factionId === 1}
        class:border-faction-background-2-dark={data.factionId === 2}
        class:border-faction-background-3-dark={data.factionId === 3}
        style={data.type === 'company'
          ? `mask-image: url('/${data.backgroundImagePath?.toLowerCase().replace('dds', 'png')}');`
          : ''}
      >
        {#if data.type === 'character'}
          <img
            loading="lazy"
            src="/{data.backgroundImagePath?.toLowerCase().replace('dds', 'png')}"
            alt="/"
            class="col-start-1 row-start-1 aspect-square"
          />
          {#if data.midgroundImagePath}
            <img
              loading="lazy"
              src="/{data.midgroundImagePath?.toLowerCase().replace('dds', 'png')}"
              alt=""
              class="col-start-1 row-start-1 aspect-square"
            />
          {/if}

          <img
            loading="lazy"
            src="/{data.foregroundImagePath?.toLowerCase().replace('dds', 'png')}"
            alt=""
            class="col-start-1 row-start-1 aspect-square"
          />
        {:else}
          <div
            class={cn(
              `col-start-1 row-start-1 size-16 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-add mask-mode-luminance`,
            )}
            style="background: {data.backgroundColor}; mask-image: url('/{data.backgroundImagePath
              ?.toLowerCase()
              .replace('dds', 'png')}');"
          ></div>
          <div
            class={cn(
              ` col-start-1 row-start-1 size-16 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-add mask-mode-luminance`,
            )}
            style="background: {data.foregroundColor}; mask-image: url('/{data.foregroundImagePath
              ?.toLowerCase()
              .replace('dds', 'png')}');"
          ></div>
        {/if}
      </div>
      <div class="col-start-2">
        <a href="/{data.type}/{normalize_name(data.name)}">
          {data.name}
        </a>
      </div>
      {#if data.type === 'character'}
        <div
          class="absolute bottom-6 left-0 aspect-square rounded-full drop-shadow-lg before:absolute before:left-1/2 before:-z-10 before:aspect-square before:size-6 before:-translate-x-1/2 before:rotate-45 before:border-2 before:border-stone-600 before:bg-black before:shadow-lg before:backdrop-blur"
        >
          {data.level}
        </div>
      {/if}
      <div class="col-start-2 row-start-2 text-xs">
        {#if data.type === 'character'}
          {data.guild?.name}
        {:else if data.type === 'company' && data.guildmaster}
          Guild Master: {data.guildmaster?.name}
        {/if}
      </div>
    </div>
  </Tooltip.Content>
</Tooltip.Root>
