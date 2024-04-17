<script lang="ts">
  import type { PageData, ActionData } from './$types'
  import Form from './form.svelte'

  interface Props {
    data: PageData
    form: ActionData
  }

  let { data }: Props = $props()
</script>

<div class="flex size-full place-content-center place-items-start pt-6">
  <Form data={data.form} />
</div>
