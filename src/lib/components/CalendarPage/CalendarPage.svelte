<script lang="ts">
  import Calendar from "$lib/components/CalendarPage/Calendar.svelte";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import { StickyNoteIcon } from "@lucide/svelte";
  import NoteDialog from "../Note/NoteDialog.svelte";
    import { getLocalTimeZone, today } from "@internationalized/date";

  let isNoteDialogOpen = $state(false);

  let note = $derived(diaryStore.noteMap.get(String(diaryStore.selectedDate)));
</script>

<NoteDialog bind:isOpen={isNoteDialogOpen} note={note} />

<div data-component="CalendarPage" class="flex-1 flex flex-col items-center gap-1">
  <div class="flex-1 w-full h-full"><Calendar /></div>
  <div class="flex-1 w-full p-5">
    {#if note}
      <Card.Root class="h-full">
        <Card.Header>
          <Card.Description>{note.date}</Card.Description>
        </Card.Header>
        <Card.Content class="h-full">
          <p class="truncate">{note.content}</p>
        </Card.Content>
        <Card.Footer class="gap-4">
          <Button class="flex-1" onclick={() => (isNoteDialogOpen = true)}>Edit</Button>
          <Button variant="destructive" class="flex-1">Delete</Button>
        </Card.Footer>
      </Card.Root>
    {:else}
      <Button class="w-full" onclick={() => (isNoteDialogOpen = true)}><StickyNoteIcon /><span>Add note</span></Button>
    {/if}
  </div>
</div>
