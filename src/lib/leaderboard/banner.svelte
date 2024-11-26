<script lang="ts">
  import { cn } from '$lib/shadcn/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements'
  import { BANNER_MAP, FACTION_IMAGE_PATHS } from './utils'

  interface Props extends HTMLAnchorAttributes {
    children?: Snippet
    label: keyof BANNER_MAP
  }

  let { class: className, children, label, ...restProps }: Props = $props()

  let idx = $state(0)
  let src = $derived(label === 'Faction War' ? BANNER_MAP[label](idx) : BANNER_MAP[label])
  $effect(() => {
    const interval = setInterval(() => {
      idx = (idx + 1) % FACTION_IMAGE_PATHS.length
    }, 15000)

    if (label !== 'Faction War') clearInterval(interval)
    return () => clearInterval(interval)
  })
</script>

<a
  {...restProps}
  class={cn(
    'grid grid-cols-1 grid-rows-1 border-2 border-stone-500 contain-paint after:col-start-1 after:row-start-1 after:size-[calc(100%-0.5rem)] after:place-self-center after:border-2 after:border-stone-500 after:border-opacity-65',
    className,
  )}
>
  <img loading="lazy" {src} alt="label" class="col-start-1 row-start-1 size-full object-cover object-left-top" />

  <div
    class=" col-start-1 row-start-1 max-w-[80%] self-end justify-self-start border-inherit pb-4 pl-4 text-xl text-white underline underline-offset-4 sm:text-4xl md:text-6xl"
  >
    {label}
  </div>
  {#if children}
    {@render children()}
  {/if}
</a>
