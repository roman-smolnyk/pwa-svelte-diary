<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import type { NoteT } from "$lib/types";
  import CM6Editor from "../CM6/CM6Editor.svelte";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import { Button } from "$lib/components/ui/button";
  import type { EditorView } from "codemirror";
  import { handleNoteSave } from "$lib/handlers";

  let { isOpen: isOpen$ = $bindable(false), note }: { isOpen: boolean; note: NoteT | undefined } = $props();

  let editorView = $state<EditorView | undefined>(undefined);
  let text$ = $state("");

  let date = $derived(note?.date ?? String(diaryStore.selectedDate));

  $effect(() => {
    if (isOpen$) {
      text$ = note?.content ?? "";
    }
  });
</script>

<Dialog.Root bind:open={isOpen$}>
  <Dialog.Content
    class="max-sm:top-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:w-dvw max-sm:h-dvh max-sm:max-w-none max-sm:max-h-none max-sm:rounded-none flex flex-col"
  >
    <Dialog.Header>
      <Dialog.Title>{date}</Dialog.Title>
    </Dialog.Header>
    <div class="flex-1 min-h-0 bg-muted">
      <CM6Editor bind:view={editorView} id={note?.id} {date} text={text$} />
    </div>
    <Dialog.Footer class="shrink-0">
      <Dialog.Close>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Cancel</Button>
        {/snippet}</Dialog.Close
      >
      <Dialog.Close onclick={() => handleNoteSave($state.snapshot(note), $state.snapshot(date), editorView?.state.doc.toString())}>
        {#snippet child({ props })}
          <Button {...props}>Save</Button>
        {/snippet}</Dialog.Close
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
