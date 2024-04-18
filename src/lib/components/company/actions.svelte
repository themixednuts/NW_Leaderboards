<script lang="ts">
  import Ellipsis from 'lucide-svelte/icons/ellipsis'
  import * as DropdownMenu from '$lib/shadcn/components/ui/dropdown-menu'
  import { Button } from '$lib/shadcn/components/ui/button'
  import type { getCompanyWithMembersByName } from '@/server/db/gamedata/helpers'
  import { Input } from '@/shadcn/components/ui/input'
  import { page } from '$app/stores'
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms'
  import { characters } from '@/schemas/gamedata'
  import { formSchema, type FormSchema } from '@routes/company/[name]/members/schema'
  import { zodClient } from 'sveltekit-superforms/adapters'
  import { toast } from 'svelte-sonner'
  import { base } from '$app/paths'

  interface Props {
    character: NonNullable<Awaited<ReturnType<typeof getCompanyWithMembersByName>>>['characters'][number]
    userRank: typeof characters.$inferSelect.guildRank | undefined
  }

  let { character, userRank }: Props = $props()
  let rank = $state(character?.guildRank)

  let form = $state(
    superForm($page.data.form as SuperValidated<Infer<FormSchema>, string>, {
      validators: zodClient(formSchema),
      invalidateAll: true,
      id: character.name,
      onError: ({ result: { status, error } }) => {
        if (status) toast.error(status.toString(), { description: error.message })
      },
      onUpdated: ({ form: { valid, message } }) => {
        if (valid && message) {
          toast.success('Updated Rank', {
            description: message,
          })
          // rank = message
        }
        if (!valid) {
          toast.error('Failed to update', {
            description: `Rank for ${character.name} failed. Reverted back to ${character.guildRank}`,
          })
          rank = character.guildRank
        }
      },
      onSubmit: ({ formData }) => {
        formData.set('name', character.name)
        formData.set('guildRank', rank)
      },
    }),
  )

  let formEl: HTMLFormElement | undefined = $state()

  let { enhance } = form
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
      <span class="sr-only">Open menu</span>
      <Ellipsis class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item
        on:click={() =>
          navigator.clipboard.writeText(`${$page.url.host}/character/${character.name.replace(' ', '_')}`)}
      >
        Copy character link
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    {#if userRank === 'consul' || userRank === 'governor'}
      <DropdownMenu.Separator />
      <DropdownMenu.Sub>
        <form method="post" action="?/rank" bind:this={formEl} use:enhance>
          <DropdownMenu.SubTrigger>Rank</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.RadioGroup bind:value={rank}>
              <DropdownMenu.RadioItem onclick={() => formEl?.requestSubmit()} value="consul" class="w-full">
                Consul
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem onclick={() => formEl?.requestSubmit()} value="officer" class="w-full">
                Officer
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem onclick={() => formEl?.requestSubmit()} value="settler" class="w-full">
                Settler
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </form>
      </DropdownMenu.Sub>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
