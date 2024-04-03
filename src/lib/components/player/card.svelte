<script lang="ts">
  import type { getCharacterById, getCharactersByUser } from '@/server/db/gamedata/helpers'
  import * as Card from '@/shadcn/components/ui/card'
  // import Item from '../equipment/item.svelte'
  import { cn } from '@/shadcn/utils'
  import Header from './header.svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface BaseVariant extends HTMLAttributes<HTMLDivElement> {
    character: NonNullable<Awaited<ReturnType<typeof getCharacterById>>>
    variant?: null
  }
  interface SmallVariant extends Omit<BaseVariant, 'variant'> {
    variant: 'sm'
    character: BaseVariant['character'] & { equipment: {} }
  }
  interface MediumVariant extends Omit<BaseVariant, 'variant'> {
    variant: 'md'
    character: SmallVariant['character'] & { paperdoll: {} }
  }
  interface LargeVariant extends Omit<BaseVariant, 'variant'> {
    variant: 'lg'
    character: MediumVariant['character'] & { talents: {} }
  }

  type Props = BaseVariant | SmallVariant | MediumVariant | LargeVariant
  let { character, variant, class: className, ...restProps }: Props = $props()
</script>

<div class="flex grow-0 gap-1">
  <Card.Root
    {...restProps}
    class={cn(
      'max-h-32',
      {
        'max-h-96': variant === 'sm',
      },
      className,
    )}
  >
    <Card.Header class="p-2">
      <Header {character} />
    </Card.Header>
    {#if variant}
      <Card.Content
        class="grid size-full min-w-max auto-rows-[2rem] grid-cols-[repeat(12,2rem)] gap-0 place-self-center p-2"
      >
        <!-- {#if character.character.equipLoad}
			<div class="col-start-3 row-span-12 row-start-5 ml-1 w-1/4 border-2 bg-gradient-to-t from-red-500" />
		{/if} -->
        <!-- <Item class="col-span-2 col-start-1 row-span-2 row-start-5" type="head" {paperdoll} />
    <Item class="col-span-2 col-start-1 row-span-2 row-start-7" type="chest" {paperdoll} />
    <Item class="col-span-2 col-start-1 row-span-2 row-start-9" type="hands" {paperdoll} />
    <Item class="col-span-2 col-start-1 row-span-2 row-start-11" type="legs" {paperdoll} />
    <Item class="col-span-2 col-start-1 row-span-2 row-start-13" type="feet" {paperdoll} />
    <Item class="row-start-15 col-span-2 col-start-1 row-span-2" type="off-hand-option-1" {paperdoll} />
    <Item class="col-span-2 col-start-[-3] row-span-2 row-start-5" type="main-hand-option-1" {paperdoll} />
    <Item class="col-span-2 col-start-[-3] row-span-2 row-start-7" type="main-hand-option-2" {paperdoll} />
    <Item class="col-span-2 col-start-[-9] row-span-2 row-start-13" type="quickslot-1" {paperdoll} />
    <Item class="row-start-15 col-span-2 col-start-[-9] row-span-2" type="quickslot-2" {paperdoll} />
    <Item class="col-span-2 col-start-[-7] row-span-2 row-start-13" type="quickslot-3" {paperdoll} />
    <Item class="row-start-15 col-span-2 col-start-[-7] row-span-2" type="quickslot-4" {paperdoll} />
    <Item class="col-span-2 col-start-[-5] row-span-2 row-start-11" type="heart-gem-slot" {paperdoll} />
    <Item class="col-span-2 col-start-[-5] row-span-2 row-start-13" type="cartridge-ammo1" {paperdoll} />
    <Item class="row-start-15 col-span-2 col-start-[-5] row-span-2" type="arrow-ammo" {paperdoll} />
    <Item class="col-span-2 col-start-[-3] row-span-2 row-start-11" type="amulet" {paperdoll} />
    <Item class="col-span-2 col-start-[-3] row-span-2 row-start-13" type="ring" {paperdoll} />
    <Item class="row-start-15 col-span-2 col-start-[-3] row-span-2" type="token" {paperdoll} /> -->
      </Card.Content>
    {/if}
  </Card.Root>
</div>
