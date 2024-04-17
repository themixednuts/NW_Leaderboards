<script lang="ts">
	import type { PageData } from '../../routes/profile/characters/$types'
	import Item from './item.svelte'

	let { character } = $props<{ character: Awaited<PageData['characters']>[number] }>()

	let paperdoll = $derived(character?.paperdoll)
</script>

<div class="flex flex-nowrap overflow-x-scroll border-2">
	<Item class="min-w-10" type="head" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="chest" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="hands" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="legs" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="feet" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="off-hand-option-1" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="main-hand-option-1" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="main-hand-option-2" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="amulet" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="ring" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="token" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="heart-gem-slot" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="cartridge-ammo1" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="arrow-ammo" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="quickslot-1" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="quickslot-2" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="quickslot-3" {paperdoll} showTier={false} />
	<Item class="min-w-10" type="quickslot-4" {paperdoll} showTier={false} />
</div>
