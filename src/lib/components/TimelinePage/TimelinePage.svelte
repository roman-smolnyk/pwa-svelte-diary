<script lang="ts">
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<div data-component="TimelinePage" class="p-5 flex flex-row overflow-y-auto">
  {#each diaryStore.notes as note (note.id)}
    <Card.Root class="w-full">
      <Card.Content>
        <p class="text-muted-foreground text-xs">{note.date}</p>
        <p class="truncate">{note.content}</p>
      </Card.Content>
    </Card.Root>
  {:else}
    <div>Empty</div>
  {/each}
</div>
