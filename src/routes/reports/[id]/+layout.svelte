<script lang="ts">
  import { page } from '$app/stores'

  let { data } = $props()
  // $inspect(data)
  function newUrl(view: 'events' | 'timeline' | 'table') {
    const url = new URL($page.url)
    const params = url.searchParams
    if (view === 'table') params.delete('view')
    else params.set('view', view)
    return url
  }
</script>

<div class="flex grow flex-col gap-4">
  <div class="flex items-center gap-2">
    <div class="flex grow items-center">
      Report: {$page.params.id}
    </div>
    <a
      href={newUrl('table').toString()}
      class="border-b-4 border-transparent"
      class:border-primary-foreground={!$page.url.searchParams.get('view')}
    >
      Table
    </a>
    <!-- <a
			href="{$page.url.pathname}?{newParams('timeline')}"
			class="border-b-4 border-transparent"
			class:border-primary-foreground={$page.url.searchParams.get('view') === 'timeline'}>Timeline</a> -->
    <a
      href={newUrl('events').toString()}
      class="border-b-4 border-transparent"
      class:border-primary-foreground={$page.url.searchParams.get('view') === 'events'}
    >
      Events
    </a>
  </div>
  <slot />
</div>
