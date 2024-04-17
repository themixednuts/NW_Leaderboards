<script lang="ts">
  import { Command as CommandPrimitive } from 'cmdk-sv'
  import { cn } from '$lib/shadcn/utils.js'

  type $$Props = CommandPrimitive.CommandProps
  let { value = $bindable(), class: className, ...restProps }: $$Props = $props()
</script>

<CommandPrimitive.Root
  class={cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', className)}
  bind:value
  {...restProps}
>
  <slot />
</CommandPrimitive.Root>
