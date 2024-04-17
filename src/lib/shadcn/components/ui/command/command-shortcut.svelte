<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/shadcn/utils.js'

  type $$Props = HTMLAttributes<HTMLSpanElement>
  let { class: className = undefined, ...restProps }: $$Props = $props()
</script>

<span class={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...restProps}>
  <slot />
</span>
