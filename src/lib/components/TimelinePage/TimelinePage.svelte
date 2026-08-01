<!-- src/lib/components/TimelinePage/TimelinePage.svelte -->
<script lang="ts">
  import * as Empty from "$lib/components/ui/empty/index.js";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import { onMount } from "svelte";
  import TimelineNote from "./TimelineNote.svelte";

  onMount(() => {
    const note = diaryStore.selectedDateNotes[0] ? diaryStore.selectedDateNotes[0] : diaryStore.notes[diaryStore.notes.length - 1];
    if (!note) return;

    setTimeout(() => {
      const element = document.querySelector(`[data-component="TimelineNote"][data-id="${note.id}"]`);
      if (element) {
        console.debug("TimelinePage:scrollIntoView", element);
        element.scrollIntoView({ behavior: "instant" });
      }
    }, 250);
  });
</script>

<div data-component="TimelinePage" class="min-h-0 p-5 overflow-y-auto flex flex-col gap-4">
  {#each diaryStore.notes as note (note.id)}
    <TimelineNote {note} />
  {:else}
    <Empty.Root>
      <Empty.Header>
        <Empty.Title>No Notes</Empty.Title>
        <Empty.Description>No notes found</Empty.Description>
      </Empty.Header>
    </Empty.Root>
  {/each}
</div>
