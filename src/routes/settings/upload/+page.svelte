<script lang="ts">
  import { toast } from 'svelte-sonner'
  import type { PageData, ActionData } from './$types'
  import Form from './form.svelte'

  interface Props {
    data: PageData
    form: ActionData
  }

  let { data, form }: Props = $props()
  $effect(() => {
    if (!form?.form) return
    const { form: formData } = form
    if (formData.valid) {
      switch (formData.message.type) {
        case 'gamelog':
          formData.message?.upsert.forEach((character) => {
            toast.success('Successfully Uploaded', {
              description: character.name,
            })
          })
          break
      }
    }
    if (!formData.valid) {
      toast.error('Error', {
        description: formData.message,
      })
    }
  })
</script>

<div class="flex size-full place-content-center place-items-start pt-6">
  <Form data={data.form} />
</div>
