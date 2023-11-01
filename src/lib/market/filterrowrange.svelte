<script lang="ts">
    export let id: string
</script>

<div class="flex flex-col">
  <div class="uppercase">{id} Range</div>
  <div class="flex place-content-center place-items-center gap-2">
    <div>
      <label for="{id}_min" class="label">Minimum</label>
      <input type="number" id="{id}_min" name="{id}_min" class="input outline-1 opacity-80 outline-slate-600 rounded-none" title="Numbers Only" step="{id === 'price' ? '.01' : ''}"/>
    </div>
    <div>
      <label for="{id}_max" class="label">Maximum</label>
      <input type="number" id="{id}_max" name="{id}_max" class="input rounded-none opacity-80" title="Numbers Only" step="{id === 'price' ? '.01' : '' }" />
    </div>
  </div>
</div>
