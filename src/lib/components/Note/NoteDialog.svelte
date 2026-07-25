<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { handleNoteDelete, handleNoteUpdate } from "$lib/handlers";
  import { cm6Store } from "$lib/store/cm6Store.svelte";
  import type { NoteT } from "$lib/types";
  import { EditorSelection } from "@codemirror/state";
  import { ArrowLeft, RedoIcon, Trash2Icon, UndoIcon } from "@lucide/svelte";
  import CM6Editor from "../CM6/CM6Editor.svelte";

  let { isOpen: isOpen$ = $bindable(false), note }: { isOpen: boolean; note: NoteT } = $props();
</script>

{#key isOpen$}
  <Dialog.Root bind:open={isOpen$}>
    <Dialog.Content
      showCloseButton={false}
      class="p-0 top-0 left-0 translate-x-0 translate-y-0 w-dvw h-dvh max-w-none sm:max-w-none max-h-none rounded-none flex flex-col
             gap-0"
    >
      <Dialog.Header class="p-2 mt-2 flex flex-row justify-between gap-4">
        <div class="flex items-center gap-4">
          <Dialog.Close>
            {#snippet child({ props })}
              <Button {...props} variant="ghost" size="icon-lg" class="size-10"><ArrowLeft class="size-6" /></Button>
            {/snippet}
          </Dialog.Close>

          <div class="text-lg">{note.date}</div>
        </div>
      </Dialog.Header>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="p-4 flex-1 min-h-0">
        {#if note}
          <CM6Editor
            value={note.content}
            onValueChange={async (v) => {
              await handleNoteUpdate(note.id, v);
            }}
          />
          <div
            class="size-full"
            onclick={(e) => {
              if (!cm6Store.editorView) return;
              e.preventDefault();
              cm6Store.editorView.dispatch({
                selection: EditorSelection.cursor(cm6Store.editorView.state.doc.length),
              });
              cm6Store.editorView.focus();
            }}
          ></div>
        {/if}
      </div>
      <Dialog.Footer class="shrink-0 m-0 p-4 pt-2 flex flex-row justify-end">
        <Dialog.Close onclick={() => handleNoteDelete(note.id)} class="mr-2">
          {#snippet child({ props })}
            <Button {...props} variant="ghost" size="lg"><Trash2Icon class="text-destructive" /></Button>
          {/snippet}
        </Dialog.Close>

        <Button variant="ghost" size="lg" onclick={cm6Store.undo} disabled={!cm6Store.canUndo} class=""><UndoIcon /></Button>
        <Button variant="ghost" size="lg" onclick={cm6Store.redo} disabled={!cm6Store.canRedo} class=""><RedoIcon /></Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/key}
