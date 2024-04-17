<script lang="ts">
  import { Command as CommandPrimitive } from 'cmdk-sv'
  import { cn } from '$lib/shadcn/utils.js'

  type $$Props = CommandPrimitive.EmptyProps
  let { class: className = undefined, ...restProps }: $$Props = $props()
</script>

<CommandPrimitive.Empty class={cn('py-6 text-center text-sm', className)} {...restProps}>
  <slot />
</CommandPrimitive.Empty>
