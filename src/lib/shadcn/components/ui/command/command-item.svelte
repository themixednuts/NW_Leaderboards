<script lang="ts">
  import { Command as CommandPrimitive } from 'cmdk-sv'
  import { cn } from '$lib/shadcn/utils.js'

  type $$Props = CommandPrimitive.ItemProps

  let { asChild = false, class: className = undefined, ...restProps }: $$Props = $props()
</script>

<CommandPrimitive.Item
  {asChild}
  class={cn(
    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    className,
  )}
  {...restProps}
  let:action
  let:attrs
>
  <slot {action} {attrs} />
</CommandPrimitive.Item>
