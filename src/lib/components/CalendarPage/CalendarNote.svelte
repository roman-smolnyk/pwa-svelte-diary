<!-- src/lib/components/Calendar/CalendarNote.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { handleNoteDelete } from "$lib/handlers";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import type { NoteT } from "$lib/types";
  import { formatCustomDate } from "$lib/utils";
  import SvelteMarkdown from "@humanspeak/svelte-markdown";
  import { EllipsisIcon } from "@lucide/svelte";
  import Markdown from "../Common/Markdown.svelte";

  let { note }: { note: NoteT } = $props();

  function editNote() {
    diaryStore.openNoteDialog(note.id);
  }
</script>

<div data-component="CalendarNote" class="w-full h-fit">
  <Card.Root class="w-full h-fit max-h-50 pt-2 min-h-0 cursor-pointer flex flex-col gap-0" onclick={editNote}>
    <Card.Header class="flex flex-row items-center justify-between">
      <Card.Description>{formatCustomDate(note.dateTime)}</Card.Description>

      <Drawer.Root>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          onclick={(e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
          }}
        >
          <Drawer.Trigger
            onclick={(e) => {
              // e.preventDefault();
              // e.stopImmediatePropagation();
            }}
          >
            {#snippet child({ props })}
              <Button {...props} variant="ghost" size="sm"><EllipsisIcon /></Button>
            {/snippet}
          </Drawer.Trigger>
        </div>

        <Drawer.Content onCloseAutoFocus={(e) => e.preventDefault()}>
          <Drawer.Header>
            <Drawer.Title>{formatCustomDate(note.dateTime)}</Drawer.Title>
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
      <Markdown text={note.content} />
    </Card.Content>
  </Card.Root>
</div>
