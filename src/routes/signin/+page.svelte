<script lang="ts">
  import { Button } from '$lib/shadcn/components/ui/button/index.js'
  import * as Card from '$lib/shadcn/components/ui/card/index.js'
  import { signIn } from '@auth/sveltekit/client'
</script>

<div class="flex grow place-content-center place-items-center">
  <Card.Root class="">
    <Card.Header>
      <Card.Title class="text-2xl">Login</Card.Title>
      <Card.Description>Discord Authentication</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="grid gap-4">
        <Button variant="outline" class="w-full" onclick={() => signIn('discord', { callbackUrl: '/lb' })}>
          Login with Discord
        </Button>
      </div>
    </Card.Content>
  </Card.Root>
</div>
