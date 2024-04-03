<script lang="ts">
  import * as Form from '@/shadcn/components/ui/form/index'
  import { Input } from '@/shadcn/components/ui/input'
  import SuperDebug, { fileProxy, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'
  import { gameLogFormSchema, type GameLogFormSchema } from './schema'
  import { dev } from '$app/environment'

  interface Props {
    data: SuperValidated<Infer<GameLogFormSchema>>
  }

  let { data }: Props = $props()

  let form = superForm(data, {
    validators: zodClient(gameLogFormSchema),
    invalidateAll: false,
  })

  let formData = form.form
  let enhance = form.enhance
  let file = fileProxy(formData, 'file')
</script>

<form action="?/gamelog" method="post" use:enhance enctype="multipart/form-data" class="flex items-center gap-2">
  <Form.Field {form} name="file">
    <Form.Control let:attrs>
      <Form.Label>Upload Game.log</Form.Label>
      <Input type="file" {...attrs} bind:files={$file} />
    </Form.Control>
    <Form.Description>You can find game.log in your 'AppData/local/AGS' directory</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button type="submit" class="">Submit</Form.Button>
</form>

{#if dev}
  <div class="absolute bottom-10 w-full min-w-fit max-w-xl">
    <SuperDebug data={$formData} />
  </div>
{/if}
