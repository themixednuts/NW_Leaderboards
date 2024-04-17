<script lang="ts">
  import * as Form from '@/shadcn/components/ui/form/index'
  import { Input } from '@/shadcn/components/ui/input'
  import SuperDebug, { fileProxy, superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'
  import { formSchema } from './schema'
  import { dev } from '$app/environment'
  import { toast } from 'svelte-sonner'
  import type { PageData } from './$types'

  interface Props {
    data: PageData['form']
  }

  let { data }: Props = $props()

  let form = superForm(data, {
    validators: zodClient(formSchema),
    invalidateAll: false,
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Successfully Uploaded', { description: form.message })
      }
      if (!form.valid) {
        console.log(form)
        toast.error('Error', {
          description: form.message,
        })
      }
    },
    onError: (err) => {
      toast.error('Error', {
        description: err.result.error.message,
      })
    },
  })

  let formData = form.form
  let enhance = form.enhance
  let files = fileProxy(formData, 'files')
</script>

<form method="post" use:enhance enctype="multipart/form-data" class="flex items-center justify-center gap-2">
  <Form.Field {form} name="files">
    <Form.Control let:attrs>
      <Form.Label>Upload a combat log file.</Form.Label>
      <Input type="file" {...attrs} accept={'application/json'} bind:files={$files} />
    </Form.Control>
    <!-- <Form.Description>You can find game.log in your 'AppData/local/AGS' directory</Form.Description> -->
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button type="submit" class="">Submit</Form.Button>
</form>

<div class="absolute bottom-10 w-full min-w-fit max-w-xl">
  <SuperDebug data={$formData} display={dev} theme="vscode" />
</div>
