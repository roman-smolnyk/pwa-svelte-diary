<!-- src/lib/components/TimelinePage/TimelineNote.svelte -->
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import type { NoteT } from "$lib/types";
  import { getShortMonthNameFromDate } from "$lib/utils";
  import SvelteMarkdown from "@humanspeak/svelte-markdown";
  import * as Empty from "$lib/components/ui/empty/index.js";
  import NoteDialog from "../Common/NoteDialog.svelte";

  let { note }: { note: NoteT } = $props();

  let isNoteDialogOpen$ = $state(false);
</script>

<NoteDialog bind:isOpen={isNoteDialogOpen$} {note} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div data-component="TimelineNote" data-id={note.id} onclick={() => (isNoteDialogOpen$ = true)}>
  <Card.Root class="min-h-20 w-full p-2 cursor-pointer">
    <Card.Content class="flex-1 min-h-0 p-0 flex flex-row gap-4">
      <div class="min-h-16 min-w-16 rounded-full bg-muted flex flex-col items-center justify-center">
        <div class="text-[0.5rem]">{note.dateTime.getFullYear()}</div>
        <div class="text-xl">{note.dateTime.getDate()}</div>
        <div class="text-xs">{getShortMonthNameFromDate(note.dateTime)}</div>
      </div>
      <div class="flex-1 min-h-0 overflow-hidden">
        <div class="css-markdown-render whitespace-pre-wrap break-all">
          <SvelteMarkdown source={note.content} />
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
