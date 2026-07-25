<!-- src/lib/components/TimelinePage/TimelineNote.svelte -->
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import type { NoteT } from "$lib/types";
  import { getShortMonthNameFromDate } from "$lib/utils";
  import SvelteMarkdown from "@humanspeak/svelte-markdown";
  import * as Empty from "$lib/components/ui/empty/index.js";

  let { note }: { note: NoteT } = $props();
</script>

<Card.Root data-component="TimelineNote" data-id={note.id} class="min-h-20 w-full p-2">
  <Card.Content class="flex-1 min-h-0 p-0 flex flex-row gap-4">
    <div class="min-h-16 min-w-16 rounded-full bg-muted flex flex-col items-center justify-center">
      <div class="text-[0.5rem]">{note.date.split("-")[0]}</div>
      <div class="text-xl">{note.date.split("-")[2]}</div>
      <div class="text-xs">{getShortMonthNameFromDate(note.date)}</div>
    </div>
    <div class="flex-1 min-h-0 overflow-hidden">
      <div class="css-markdown-render whitespace-pre-wrap break-all">
        <SvelteMarkdown source={note.content} />
      </div>
    </div>
  </Card.Content>
</Card.Root>
