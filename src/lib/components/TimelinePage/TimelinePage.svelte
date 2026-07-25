<script lang="ts">
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<div data-component="TimelinePage" class="p-5 overflow-y-auto flex flex-col gap-4">
  {#each diaryStore.notes as note (note.id)}
    <Card.Root class="w-full">
      <Card.Content class="flex flex-row gap-4">
        <div class="min-h-5 min-w-5 rounded-full text-xs bg-destructive">
          <div>{note.date.split("-")[2]}</div>
          <div>getShortMonthNameFromDate(note.date)</div>
        </div>
        <p class="truncate">{note.content}</p>
      </Card.Content>
    </Card.Root>
  {:else}
    <div>Empty</div>
  {/each}
</div>
