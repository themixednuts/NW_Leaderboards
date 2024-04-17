<script lang="ts">
  import { Progress } from '$lib/shadcn/components/ui/progress'
  import * as Table from '$lib/shadcn/components/ui/table'

  interface Props {
    headers?: { text: string; class?: string }[]
    rows?: { cells: { text: string | number; class?: string; total?: number }[] }[]
  }
  let { headers, rows }: Props = $props()
</script>

{#if headers?.length && rows?.length}
  <div class="flex items-center justify-center border-2 bg-opacity-60 p-1 shadow-2xl backdrop-blur-sm">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          {#each headers as header}
            <Table.Head class={header.class}>{header.text}</Table.Head>
          {/each}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each rows as row}
          <Table.Row>
            {#each row.cells as cell, k}
              <Table.Cell class={cell.class}>
                {#if typeof cell.text === 'number' && cell.total}
                  {@const ratio = (cell.text / cell.total) * 100}

                  <p>
                    {ratio.toFixed(2)}%
                  </p>
                  <Progress value={ratio} class="h-4 rounded-none" />
                  <div class="absolute right-3 mix-blend-difference">
                    {Math.floor(cell.text)}
                  </div>
                {:else if !isNaN(+cell.text)}
                  {((+cell.text ?? 0) * 100).toFixed(2)}%
                {:else}
                  {cell.text}
                {/if}
              </Table.Cell>
            {/each}
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
{/if}
