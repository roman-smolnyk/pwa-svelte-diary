<script lang="ts">
  import Calendar from "$lib/components/CalendarPage/DiaryCalendar.svelte";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import { StickyNoteIcon } from "@lucide/svelte";
  import NoteDialog from "../Note/NoteDialog.svelte";
  import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
  import { handleNoteCreate } from "$lib/handlers";

  let isNoteDialogOpen$ = $state(false);

  let note = $derived(diaryStore.noteMap.get(String(diaryStore.selectedDate)));
</script>

{#if note}
  <NoteDialog bind:isOpen={isNoteDialogOpen$} {note} />
{/if}

<div data-component="CalendarPage" class="flex-1 flex flex-col items-center gap-1 min-h-0">
  <div class="flex-1 pt-4 w-full h-full min-h-0">
    <Calendar bind:value={diaryStore.selectedDate} />
  </div>
  <div class="flex-1 w-full p-5 flex min-h-0">
    {#if note}
      <Card.Root class="flex-1 flex flex-col min-h-0">
        <Card.Header>
          <Card.Description>{note.date}</Card.Description>
        </Card.Header>
        <Card.Content class="flex-1 overflow-hidden min-h-0">
          <p class="whitespace-pre-wrap break-all">{note.content}</p>
        </Card.Content>
        <Card.Footer class="gap-4">
          <Button class="flex-1" onclick={() => (isNoteDialogOpen$ = true)}>Edit</Button>
          <Button variant="destructive" class="flex-1">Delete</Button>
        </Card.Footer>
      </Card.Root>
    {:else}
      <div class="w-full h-full flex items-end">
        <Button
          size="lg"
          class="w-full"
          onclick={async () => {
            if (!diaryStore.selectedDate) return;
            await handleNoteCreate(diaryStore.selectedDate.toString(), "");
            isNoteDialogOpen$ = true;
          }}
        >
          <StickyNoteIcon /><span>Add note</span>
        </Button>
      </div>
    {/if}
  </div>
</div>
