<!-- src/lib/components/TimelinePage/TimelineNote.svelte -->
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import type { NoteT } from "$lib/types";
  import { getShortMonthNameFromDate } from "$lib/utils";
  import Markdown from "../Common/Markdown.svelte";

  let { note }: { note: NoteT } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div data-component="TimelineNote" data-id={note.id} onclick={() => diaryStore.openNoteDialog(note.id)}>
  <Card.Root class="min-h-19 max-h-19 w-full p-2 cursor-pointer">
    <Card.Content class="flex-1 min-h-0 p-0 flex flex-row gap-2">
      <div class="min-h-15 min-w-15 rounded-full bg-muted flex flex-col items-center justify-center">
        <div class="text-[0.5rem] leading-tight">{note.dateTime.getFullYear()}</div>
        <div class="text-lg leading-tight">{note.dateTime.getDate()}</div>
        <div class="text-xs leading-tight">{getShortMonthNameFromDate(note.dateTime)}</div>
      </div>
      <div class="flex-1 min-h-0 overflow-hidden">
        <div class="css-markdown-render whitespace-pre-wrap break-all">
          <Markdown text={note.content} />
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
