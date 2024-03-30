<script lang="ts">
  import { enhance } from '$app/forms'
  import { toast } from 'svelte-sonner'
  import type { PageData, ActionData } from './$types'

  interface Props {
    data: PageData
    form: ActionData
  }

  let { data, form }: Props = $props()

  $effect(() => {
    if (!form) return

    if (form.success) {
      switch (form.type) {
        case 'gamelog':
          form.upsert.forEach((character) => {
            toast.success('Successfully Uploaded', {
              description: character.name,
            })
          })
          break
      }
    }

    if (!form.success) {
      toast.error('Error', {
        description: form.message,
      })
    }
  })
</script>

<div class="pt-6">
  <form action="?/gamelog" method="post" use:enhance enctype="multipart/form-data" class="">
    <input type="file" name="file" id="file" />
    <button type="submit" class="">Submit</button>
  </form>
</div>
