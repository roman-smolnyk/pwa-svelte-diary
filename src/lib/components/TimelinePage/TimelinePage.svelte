<script lang="ts">
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { getShortMonthNameFromDate } from "$lib/utils";
</script>

<div data-component="TimelinePage" class="p-5 overflow-y-auto flex flex-col gap-4">
  {#each diaryStore.notes as note (note.id)}
    <Card.Root class="w-full">
      <Card.Content class="flex flex-row gap-4">
        <div class="min-h-16 min-w-16 rounded-full bg-muted flex flex-col items-center justify-center">
        <div class="text-[0.5rem]">{note.date.split("-")[0]}</div>
          <div class="text-xl">{note.date.split("-")[2]}</div>
          <div class="text-xs">{getShortMonthNameFromDate(note.date)}</div>
        </div>
        <p class="truncate">{note.content}</p>
      </Card.Content>
    </Card.Root>
  {:else}
    <div>Empty</div>
  {/each}
</div>
