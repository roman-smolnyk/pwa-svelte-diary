<script lang="ts">
  import Calendar from "$lib/components/CalendarPage/DiaryCalendar.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import { handleNoteCreate, handleNoteDelete } from "$lib/handlers";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import SvelteMarkdown from "@humanspeak/svelte-markdown";
  import { EllipsisIcon, PlusIcon, StickyNoteIcon } from "@lucide/svelte";
  import NoteDialog from "../Note/NoteDialog.svelte";
  import * as Empty from "$lib/components/ui/empty/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";

  let isNoteDialogOpen$ = $state(false);

  let note = $derived(diaryStore.noteMap.get(String(diaryStore.selectedDate)));

  let source = $derived.by(() => {
    if (!note) return "";
    // let text = note.content.replace(/```[\s\S]*?```/g, (m) => m.replace(/\n/g, "\n ")).replace(/\$\$[\s\S]*?\$\$/g, (m) => m);
    const text = note.content.replace(/(?<=\n)(?![*-])\n/g, "<br/>");
    // if (text.endsWith("\n") || text.endsWith("\n ")) {
    //   text = `${text}<br>`;
    // }
    return text;
  });

  async function addNote() {
    if (!diaryStore.selectedDate) return;
    await handleNoteCreate(diaryStore.selectedDate.toString(), "");
    isNoteDialogOpen$ = true;
  }
</script>

{#if note}
  <NoteDialog bind:isOpen={isNoteDialogOpen$} {note} />
{/if}

<div data-component="CalendarPage" class="flex-1 flex flex-col items-center gap-1 min-h-0">
  <div class="flex-1 pt-4 w-full h-full min-h-0">
    <Calendar bind:value={diaryStore.selectedDate} />
  </div>
  <div class="flex-1 min-h-0 w-full p-5 flex">
    {#if note}
      <Card.Root class="h-fit w-full max-h-50 pt-2 min-h-0 flex flex-col gap-0">
        <Card.Header class="flex flex-row items-center justify-between">
          <Card.Description>{note.date}</Card.Description>

          <Drawer.Root>
            <Drawer.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="ghost" size="sm"><EllipsisIcon /></Button>
              {/snippet}
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{note.date}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Footer>
                <Drawer.Close onclick={() => handleNoteDelete(note.id)}>
                  {#snippet child({ props })}
                    <Button {...props} variant="destructive">Delete</Button>
                  {/snippet}
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
        </Card.Header>
        <Card.Content class="flex-1 overflow-hidden">
          <div class="css-markdown-render whitespace-pre-wrap break-all">
            <SvelteMarkdown {source} />
          </div>
        </Card.Content>
      </Card.Root>
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
    {/if}
  </div>
</div>

<div class="fixed bottom-20 right-6 z-50">
  <Button class="size-15 rounded-full shadow-lg flex items-center justify-center" onclick={addNote}>
    <PlusIcon class="size-6" />
  </Button>
</div>
