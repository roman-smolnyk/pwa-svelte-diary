<!-- src/lib/components/Calendar/CalendarPage.svelte -->
<script lang="ts">
  import Calendar from "$lib/components/CalendarPage/DiaryCalendar.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Empty from "$lib/components/ui/empty/index.js";
  import { handleNoteCreate } from "$lib/handlers";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import { PlusIcon } from "@lucide/svelte";
  import CalendarNote from "./CalendarNote.svelte";
  import NoteDialog from "../Common/NoteDialog.svelte";
  import type { NoteT } from "$lib/types";
  import { getLocalTimeZone, today } from "@internationalized/date";

  let isNoteDialogOpen$ = $state(false);
  let newNote$ = $state<NoteT | undefined>(undefined);

  async function addNote() {
    if (!diaryStore.selectedDate) return;
    const date = diaryStore.selectedDate.toString();
    if (date === today(getLocalTimeZone()).toString()) {
      newNote$ = await handleNoteCreate(new Date(), "");
    } else {
      newNote$ = await handleNoteCreate(new Date(`${date}T12:00:00`), "");
    }

    isNoteDialogOpen$ = true;
  }
</script>

{#if newNote$}
  <NoteDialog bind:isOpen={isNoteDialogOpen$} note={newNote$} />
{/if}

<div data-component="CalendarPage" class="flex-1 flex flex-col items-center gap-1 min-h-0">
  <div class="h-fit pt-4 w-full min-h-0">
    <Calendar bind:value={diaryStore.selectedDate} />
  </div>
  <div class="flex-1 min-h-0 w-full p-5 overflow-y-auto flex flex-col gap-4">
    {#each diaryStore.selectedDateNotes as note (note.id)}
      <CalendarNote {note} />
    {:else}
      <Empty.Root>
        <Empty.Header>
          <Empty.Title>No Notes</Empty.Title>
          <Empty.Description>No notes found</Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <Button onclick={addNote}>Add note</Button>
        </Empty.Content>
      </Empty.Root>
    {/each}
    <div class="min-h-10"></div>
  </div>
</div>

<div class="fixed bottom-20 right-6 z-50">
  <Button class="size-15 rounded-full shadow-lg flex items-center justify-center" onclick={addNote}>
    <PlusIcon class="size-6" />
  </Button>
</div>
