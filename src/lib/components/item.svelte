<script lang="ts">
	import { EquippableSlotTypesBg, GetRomanFromNumber, type Paperdoll } from '$lib/utils'
	import type { HTMLAttributes } from 'svelte/elements'
	import { twMerge } from 'tailwind-merge'

	let {
		class: className,
		type,
		paperdoll,
		showTier = true,
		...rest
	} = $props<
		HTMLAttributes<HTMLDivElement> & {
			type?: string
			paperdoll: Paperdoll[]
			showTier?: boolean
		}
	>()

	let item = $derived(paperdoll.find((slot) => slot.slotName === type))
</script>

<div
	class={twMerge(
		'relative grid aspect-square size-full place-content-center place-items-center overflow-clip bg-contain bg-center bg-no-repeat ',
		className
	)}
	{...rest}>
	<img
		loading="lazy"
		src="/lyshineui/images/equipment/equipmentbg.png"
		class="col-start-1 row-start-1 aspect-square"
		alt="" />
	{#if !item?.itemIcon}
		<img
			loading="lazy"
			src="/lyshineui/images/equipment/{EquippableSlotTypesBg[item?.slotId!]}.png"
			class="col-start-1 row-start-1 aspect-square opacity-20"
			alt="" />
	{/if}
	<div
		class:bg-item-rarity-0={item?.itemId && item?.rarity === 0 && !item.isNamed}
		class:bg-item-rarity-1={item?.rarity === 1 && !item.isNamed}
		class:bg-item-rarity-2={item?.rarity === 2 && !item.isNamed}
		class:bg-item-rarity-3={item?.rarity === 3 && !item.isNamed}
		class:bg-item-rarity-4={item?.rarity === 4 && !item.isNamed}
		class:bg-item-rarity-named-0={item?.itemId && item?.rarity === 0 && item.isNamed}
		class:bg-item-rarity-named-1={item?.rarity === 1 && item.isNamed}
		class:bg-item-rarity-named-2={item?.rarity === 2 && item.isNamed}
		class:bg-item-rarity-named-3={item?.rarity === 3 && item.isNamed}
		class:bg-item-rarity-named-4={item?.rarity === 4 && item.isNamed}
		class="relative col-start-1 row-start-1 flex aspect-square size-[90%] place-content-center place-items-center place-self-center bg-contain bg-center bg-no-repeat">
		{#if item?.itemIcon}
			<a
				href="https://nwdb.info/db/item/{item.itemId}?gs={item.gearscore}&perks={item.perks.join(',').toLowerCase()}"
				class=" flex aspect-square size-full items-center justify-center"
				target="_blank">
				<img loading="lazy" src="/{item?.itemIcon.toLowerCase().replace('.dds', '.png')}" alt="" class="size-[90%]" />
			</a>
			{#if showTier}
				<div class="absolute left-1 top-0 text-sm italic text-stone-300">{GetRomanFromNumber(item.tier)}</div>
			{/if}
			{#if item.quantity > 1}
				<div class="absolute bottom-0 right-1">{item.quantity}</div>
			{/if}
		{/if}
	</div>
</div>
