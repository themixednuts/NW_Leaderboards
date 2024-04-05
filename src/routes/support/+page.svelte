<script lang="ts">
  import { Question, DiscordLogo } from 'phosphor-svelte'
</script>

<div class="flex grow flex-col place-items-center gap-10 p-2">
  <div class="flex flex-col">
    <a href="https://discord.gg/2QCFwyE9Yr" target="_blank" class="flex place-items-center gap-2 whitespace-nowrap">
      <DiscordLogo class="size-10  motion-safe:animate-[bounce_1s_ease-in-out_20.5]" />
    </a>
    <div class="flex gap-1">
      If you have questions visit
      <a
        href="https://discord.gg/2QCFwyE9Yr"
        target="_blank"
        class="link flex place-items-center gap-2 whitespace-nowrap"
      >
        NWDB discord
      </a>
      for now and ask for @mixednuts or @jakel
    </div>
  </div>
  <p class="max-w-[35rem]">
    This iteration we are going with an "opt-in" method for character visibility. If you want your character to be
    public go to your <a href="/settings/characters">characters</a>
    page in settings. Make sure you're logged in!
  </p>
</div>
