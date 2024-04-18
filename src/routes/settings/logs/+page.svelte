<script lang="ts">
  import * as Table from '@/shadcn/components/ui/table'

  let { data } = $props()
</script>

{#await data.logs}
  Loading...
{:then logs}
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>ID</Table.Head>
        <Table.Head>Gamemode</Table.Head>
        <Table.Head>Subtmitted</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each logs as log}
        <Table.Row>
          <Table.Cell>
            <a href="/reports/{log.id}">
              {log.id}
            </a>
          </Table.Cell>
          <Table.Cell>{log.gameModeId}</Table.Cell>
          <Table.Cell>{log.submittedAt}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
{/await}
