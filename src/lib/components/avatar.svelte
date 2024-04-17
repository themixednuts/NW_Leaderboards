<script lang="ts">
	import { page } from '$app/stores'
	import * as Avatar from '$lib/shadcn/components/ui/avatar'
	import { Button } from '$lib/shadcn/components/ui/button'
	import * as DropdownMenu from '$lib/shadcn/components/ui/dropdown-menu'
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { SignIn } from '@auth/sveltekit/components'

	let { characters } = $props<(typeof $page)['data']['characters']>()
</script>

{#if $page.data.session?.user}
	{@const user = $page.data.session.user}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} variant="link" class="flex items-center justify-center rounded-full">
				<Avatar.Root>
					<Avatar.Image src={user.image} alt="avatar" />
				</Avatar.Root>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="mt-1">
			<DropdownMenu.Group>
				<DropdownMenu.Label>{user.name}</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<a href={'/profile'} class="h-full w-full">Profile</a>
				</DropdownMenu.Item>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>Characters</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#await characters then characters}
							{#each characters as character}
								<DropdownMenu.Item>
									<a href="/profile/characters/{character.id}" class="h-full w-full">
										{character.name}
									</a>
								</DropdownMenu.Item>
							{/each}
							{#if characters.length}
								<DropdownMenu.Separator />
								<DropdownMenu.Item>
									<a href={'/profile/characters'} class="h-full w-full">All</a>
								</DropdownMenu.Item>
							{:else}
								<DropdownMenu.Item>No Characters</DropdownMenu.Item>
							{/if}
						{/await}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<!-- <DropdownMenu.Item>Settings</DropdownMenu.Item> -->
				<DropdownMenu.Item>
					<a href={'/upload'} class="h-full w-full">Upload</a>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => signOut()}>Sign Out</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
	<Button onclick={() => signIn('discord')}>Sign In</Button>
{/if}
