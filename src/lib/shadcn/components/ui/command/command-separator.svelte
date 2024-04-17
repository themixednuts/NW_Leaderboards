<script lang="ts">
  import { Command as CommandPrimitive } from 'cmdk-sv'
  import { cn } from '$lib/shadcn/utils.js'

  type $$Props = CommandPrimitive.SeparatorProps
  let { class: className = undefined, ...restProps }: $$Props = $props()
</script>

<CommandPrimitive.Separator class={cn('-mx-1 h-px bg-border', className)} {...restProps} />
