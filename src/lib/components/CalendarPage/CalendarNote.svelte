<!-- src/lib/components/Calendar/CalendarNote.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { handleNoteDelete } from "$lib/handlers";
  import type { NoteT } from "$lib/types";
  import SvelteMarkdown from "@humanspeak/svelte-markdown";
  import { EllipsisIcon } from "@lucide/svelte";
  import NoteDialog from "../Common/NoteDialog.svelte";
  import { formatCustomDate } from "$lib/utils";

  let { note }: { note: NoteT } = $props();

  let isNoteDialogOpen$ = $state(false);
  let source = $derived.by(() => {
    if (!note) return "";
    // let text = note.content.replace(/```[\s\S]*?```/g, (m) => m.replace(/\n/g, "\n ")).replace(/\$\$[\s\S]*?\$\$/g, (m) => m);
    const text = note.content.replace(/(?<=\n)(?![*-])\n/g, "<br/>");
    // if (text.endsWith("\n") || text.endsWith("\n ")) {
    //   text = `${text}<br>`;
    // }
    return text;
  });

  function editNote() {
    isNoteDialogOpen$ = true;
  }
</script>

<NoteDialog bind:isOpen={isNoteDialogOpen$} {note} />

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
      <div class="css-markdown-render whitespace-pre-wrap break-all">
        <SvelteMarkdown {source} />
      </div>
    </Card.Content>
  </Card.Root>
</div>
