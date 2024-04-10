<script lang="ts">
  import * as Form from '@/shadcn/components/ui/form/index'
  import { Input } from '@/shadcn/components/ui/input'
  import SuperDebug, { fileProxy, superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'
  import { gameLogFormSchema } from './schema'
  import { dev } from '$app/environment'
  import { toast } from 'svelte-sonner'
  import type { PageData } from './$types'

  interface Props {
    data: PageData['form']
  }

  let { data }: Props = $props()

  let form = superForm(data, {
    validators: zodClient(gameLogFormSchema),
    invalidateAll: false,
    onUpdated: ({ form }) => {
      if (form.valid) {
        if (form.message?.upsert)
          form.message.upsert.forEach((character) => {
            toast.success('Successfully Uploaded', { description: character.name })
          })
      }
      if (!form.valid) {
        toast.error('Error', {
          description: form.message?.message,
        })
      }
    },
  })

  let formData = form.form
  let enhance = form.enhance
  let file = fileProxy(formData, 'file')
</script>

<form
  action="?/gamelog"
  method="post"
  use:enhance
  enctype="multipart/form-data"
  class="flex items-center justify-center gap-2"
>
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

<div class="absolute bottom-10 w-full min-w-fit max-w-xl">
  <SuperDebug data={$formData} display={dev} theme="vscode" />
</div>
