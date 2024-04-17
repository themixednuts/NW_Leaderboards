<script lang="ts">
	import { page } from '$app/stores'
	import * as Card from '$lib/shadcn/components/ui/card'
	import { steamAppIdMap, type WorldsData } from '$lib/utils'
	import type { PageData } from '../../routes/profile/$types'
	import Item from './item.svelte'

	type Props = {
		character: Awaited<PageData['characters']>[number]
	}

	let { character } = $props<Props>()

	let paperdoll = $state(character.paperdoll)
	let breakpoint = $derived((character.character.equipLoad! / 500) * 100)

	function gradientBreakpoint(breakpoint: number) {
		return `from-[${breakpoint}%] to-[${breakpoint}%]`
	}
</script>

<Card.Root class="flex h-full w-fit min-w-max place-content-center place-items-center">
	<Card.Content
		class="grid size-full min-w-max auto-rows-[2rem] grid-cols-[repeat(12,2rem)] gap-0 place-self-center p-2">
		<div
			class="col-span-full col-start-1 row-span-3 row-start-1 grid grid-cols-subgrid grid-rows-subgrid overflow-clip border-b-2">
			<div class="relative col-span-3 col-start-1 row-span-3 row-start-1 overflow-clip">
				<div
					class="relative size-full overflow-clip rounded-[50%] border-2 border-faction-background-1-dark"
					class:border-faction-background-1-dark={character.faction?.id === 1}>
					<img
						loading="lazy"
						src="/{character.character.backgroundImagePath?.toLowerCase().replace('.dds', '.png')}"
						alt=""
						class="absolute left-0 top-0 size-full rounded-[50%] bg-[{character.character.backgroundColor?.replace(
							' ',
							''
						)}]" />
					<img
						loading="lazy"
						src="/{character.character.midgroundImagePath?.toLowerCase().replace('.dds', '.png')}"
						alt=""
						class="absolute left-0 top-0 size-full rounded-[50%] bg-[{character.character.backgroundColor?.replace(
							' ',
							''
						)}]" />
				</div>
				<div
					class="absolute bottom-[-0.25rem] left-3 rounded-full text-lg drop-shadow-lg backdrop-blur before:absolute before:left-1/2 before:-z-10 before:h-full before:w-[150%] before:-translate-x-1/2 before:rotate-45 before:border-2 before:border-stone-500 before:bg-black before:shadow-lg before:backdrop-blur">
					{character.character.level}
				</div>
			</div>
			<div class="col-span-full col-start-4 row-span-1 row-start-1 truncate">
				<a href="/profile/characters/{character.character.id}">
					{character.character.name}
				</a>
				-
				<small class="">
					{#await $page.data.worldsData as WorldsData then worldsData}
						{worldsData?.servers?.find((server) => server.worldId === character.character.worldId)?.worldName}
					{/await}
				</small>
			</div>
			<div class="col-span-5 col-start-4 row-start-3">{character.faction?.name}</div>
			<div class="col-span-full col-start-[-4] row-span-2 row-start-2 flex items-end justify-end text-xl font-medium">
				{character.character.powerLevel}
			</div>
			{#if character.character.steamAppId && steamAppIdMap[character.character.steamAppId as keyof typeof steamAppIdMap] !== 'Live'}
				<div
					class="relative col-start-[-2] row-start-1 flex rotate-45 items-center justify-center capitalize before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:h-3/5 before:w-[500%] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-gray-600">
					{steamAppIdMap[character.character.steamAppId! as keyof typeof steamAppIdMap]}
				</div>
			{/if}
		</div>
		<!-- {#if character.character.equipLoad}
			<div class="col-start-3 row-span-12 row-start-5 ml-1 w-1/4 border-2 bg-gradient-to-t from-red-500" />
		{/if} -->
		<Item class="col-span-2 col-start-1 row-span-2 row-start-5" type="head" {paperdoll} />
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
		<Item class="row-start-15 col-span-2 col-start-[-3] row-span-2" type="token" {paperdoll} />
	</Card.Content>
</Card.Root>
